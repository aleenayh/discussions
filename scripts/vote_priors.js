//a vote state used for end of session reflection that includes a callback to a previous vote
//eg Halftime reflection vs. current question

let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
let priorIndex = url.searchParams.get("prior");
priorIndex = Number(priorIndex);
console.log(`fetched index: ${pageIndex}`);
if (priorIndex) {console.log(`fetched prior index: ${priorIndex}`)};

const containers = Array.from(document.getElementsByClassName("container"));
let containerIndex; //separate containerIndex from pageIndex - lazy coding coming back to haunt me
if (containers.length <= 1) {
  containerIndex = 0;
} else {
  containerIndex = pageIndex
}

function chooseScenario() {
    containers[containerIndex].style.display = "flex";
}
chooseScenario();

const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let buttons = Array.from(
  containers[containerIndex].getElementsByClassName("voteChoice"));

const reflections = Array.from(
  document.getElementsByClassName("reflectionResult")
);

let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button
let priorCounts = [0, 0, 0, 0, 0, 0, 0];

// Function to send a vote to the database ---- change fetch location if we're using postgres or kv!
function vote(buttonIndex, pageIndex, indexSum = 0) {
  fetch("/api/serverlessvote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buttonIndex: buttonIndex,
      pageIndex: pageIndex,
      indexSum: indexSum,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Count update received:", data);
      updateChartWithData(firstChart, data);
      getCounts();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
// Function to get updated counts from the server -- change this if going between postgres and kv also
function getCounts() {
  let requestPayload = JSON.stringify({ pageIndex: pageIndex });

  try {
    setInterval(function () {
      fetch("./api/serverlesscounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestPayload,
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response not OK");
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          updateChartWithData(firstChart, data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 1000); // every 1 seconds
  } catch (error) {
    console.error(error);
  }
}

function getPriorCounts() {
  let requestPayload = JSON.stringify({ pageIndex: priorIndex });

  try {
    fetch("./api/serverlesscounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestPayload,
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Response not OK");
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        updateChartWithData(oldChart, data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error(error);
  }
}
if (priorIndex) {
  getPriorCounts();
}

/* the results display script */
let resultsChart = containers[containerIndex]
  .getElementsByClassName("resultsChart")[0]
  .getContext("2d");
let priorResultsChart; 
if (priorIndex) {
  priorResultsChart = containers[containerIndex]
  .getElementsByClassName("priorResultsChart")[0]
  .getContext("2d");
}

// Global Options
Chart.defaults.font.family = "Roboto";
Chart.defaults.font.size = 18;
Chart.defaults.font.color = "#777";

let labels = Array.from(
  containers[containerIndex].getElementsByClassName("voteChoice")
);

let labelA, labelB, labelC, labelD, labelE, labelF, labelG;

function updateChartLabels() {
  let labelData = labels.map((label) => label.innerHTML);
  // Set your label variables
  labelA = labelData.length > 0 ? labelData[0] : "";
  labelB = labelData.length > 1 ? labelData[1] : "";
  labelC = labelData.length > 2 ? labelData[2] : "";
  labelD = labelData.length > 3 ? labelData[3] : "";
  labelE = labelData.length > 4 ? labelData[4] : "";
  labelF = labelData.length > 5 ? labelData[5] : "";
  labelG = labelData.length > 6 ? labelData[6] : "";
}
updateChartLabels();

// Assign event listeners for existing buttons only
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", () => {
    vote(i, pageIndex);
    chartBoxes.forEach((chartBox) => {
      chartBox.style.opacity = 1; //show the chart
    });
    // Add tasks to disable all buttons and highlight the selected button
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === i) {
        button.classList.add("highlight-button");
      }
      setTimeout(() => {
        reflections.forEach((reflection) => {
          reflection.style.display = "inline-block"; // start reflection fade
        });
      }, 10000); //after 10 seconds
    });
  });
}

let allLabels = [labelA, labelB, labelC, labelD, labelE, labelF, labelG];
let displayedLabels = allLabels.filter((label) => label !== "");

let oldChart;
if (priorIndex) {
oldChart = new Chart(priorResultsChart, {
  type: "pie", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: displayedLabels,
    datasets: [
      {
        label: "Votes",
        data: priorCounts,
        backgroundColor: "lightgrey",
        backgroundColor: [
          "rgba(254, 156, 10, 0.8)", //fe9c0a, yellow orange
          "rgba(252, 82, 4, 0.8)", //fc5204, fire orange
          "rgba(179, 60, 134, 0.8)", //b33c86, purple
          "rgba(54, 31, 173, 0.8)", //190e4f, dark blue
          "rgba(126, 128, 77, 0.8)", //7e804d, olive gree
          "rgba(243, 116, 174, 0.8)", //f374ae, pink
          "rgba(255, 249, 79, 0.8)", //fff94f, yellow
          "rgba(45, 125, 210, 0.8)", //2d7dd2 steel blue
          "rgba(45, 125, 210, 0.8)", //97cc04 yellow green
        ],
        borderWidth: 2,
        borderColor: "#000",
        hoverBorderWidth: 5,
        hoverBorderColor: "#000",
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Your Results",
      fontSize: 25,
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        fontColor: "#000",
      },
    },
    layout: {
      padding: {
        left: 100,
        right: 100,
        top: 0,
        bottom: 300,
      },
    },
    tooltips: {
      enabled: false,
    },
  },
});
}

let firstChart = new Chart(resultsChart, {
  type: "pie", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: displayedLabels,
    datasets: [
      {
        label: "Votes",
        data: displayedCounts,
        backgroundColor: "lightgrey",
        backgroundColor: [
          "rgba(254, 156, 10, 0.8)", //fe9c0a, yellow orange
          "rgba(252, 82, 4, 0.8)", //fc5204, fire orange
          "rgba(179, 60, 134, 0.8)", //b33c86, purple
          "rgba(54, 31, 173, 0.8)", //190e4f, dark blue
          "rgba(126, 128, 77, 0.8)", //7e804d, olive gree
          "rgba(243, 116, 174, 0.8)", //f374ae, pink
          "rgba(255, 249, 79, 0.8)", //fff94f, yellow
          "rgba(45, 125, 210, 0.8)", //2d7dd2 steel blue
          "rgba(45, 125, 210, 0.8)", //97cc04 yellow green
        ],
        borderWidth: 2,
        borderColor: "#000",
        hoverBorderWidth: 5,
        hoverBorderColor: "#000",
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Your Results",
      fontSize: 25,
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        fontColor: "#000",
      },
    },
    layout: {
      padding: {
        left: 100,
        right: 100,
        top: 0,
        bottom: 200,
      },
    },
    tooltips: {
      enabled: false,
    },
  },
});

// Function to update the chart with new data
function updateChartWithData(chart, data) {
  chart.data.datasets[0].data = data;
  chart.update();
}
