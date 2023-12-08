let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);




const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let buttons = Array.from(document.getElementsByClassName('voteChoice'));
const reflections = Array.from(document.getElementsByClassName("reflectionResult"));
const contexts = Array.from(document.getElementsByClassName("voteContext"));
/* const images = Array.from(document.getElementsByClassName("rapidVoteImg"));
let imgIndex = 0; //put this back in if you need to do images */

let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button

// Function to send a vote to the database -- using FLUID VOTE API
function vote(oldButtonIndex, buttonIndex, pageIndex) {
  fetch('/api/fluid-vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ oldButtonIndex: oldButtonIndex, buttonIndex: buttonIndex, pageIndex: pageIndex })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Count update received:', data);
      updateChartWithData(data);
      getCounts();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to get updated counts from the server 
function getCounts() {
  let requestPayload = JSON.stringify({ pageIndex: pageIndex });

  try {
    setInterval(function () {
      fetch('./api/serverlesscounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestPayload
      })
        .then(response => {
          if (!response.ok) {
            console.log('Response not OK');
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          updateChartWithData(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }, 2000); // every 2 seconds
  } catch (error) {
    console.error(error);
  }
}
//if want to display counts prior to first vote, add function call here

/* the results display script */
let resultsChart = document.getElementsByClassName("resultsChart")[0].getContext('2d');

// Global Options
Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 18;
Chart.defaults.font.color = '#777';

let labels = Array.from(document.getElementsByClassName("voteChoice"));

let labelA, labelB, labelC, labelD, labelE, labelF, labelG;

function updateChartLabels() {
  let labelData = labels.map(label => label.innerHTML);
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
let oldButtonIndex = -1;
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    let oldButtonIndex = buttons.findIndex(button => button.classList.contains('highlight-button'));
    vote(oldButtonIndex, i, pageIndex);
    // disable all buttons and highlight the selected button
    buttons.forEach((button, index) => {
      button.disabled = true;
      button.classList.remove('highlight-button');
      if (index === i) {
        button.classList.add('highlight-button');
      }
    });
    getCounts();
  })
};

let allLabels = [labelA, labelB, labelC, labelD, labelE, labelF, labelG];
let displayedLabels = allLabels.filter(label => label !== "");

let firstChart = new Chart(resultsChart, {
  type: 'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data: {
    labels: displayedLabels,
    datasets: [{
      label: 'Votes',
      data: displayedCounts,
      backgroundColor: 'lightgrey',
      backgroundColor: [
        'rgba(254, 156, 10, 0.8)', //fe9c0a, yellow orange
        'rgba(252, 82, 4, 0.8)', //fc5204, fire orange
        'rgba(179, 60, 134, 0.8)', //b33c86, purple
        'rgba(54, 31, 173, 0.8)', //190e4f, dark blue
        'rgba(126, 128, 77, 0.8)', //7e804d, olive gree
        'rgba(243, 116, 174, 0.8)', //f374ae, pink
        'rgba(255, 249, 79, 0.8)', //fff94f, yellow
        'rgba(45, 125, 210, 0.8)', //2d7dd2 steel blue
        'rgba(45, 125, 210, 0.8)' //97cc04 yellow green
      ],
      borderWidth: 2,
      borderColor: '#000',
      hoverBorderWidth: 5,
      hoverBorderColor: '#000'
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Your Results',
      fontSize: 25
    },
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontColor: '#000'
      }
    },
    layout: {
      padding: {
        left: 100,
        right: 100,
        top: 0,
        bottom: 200,
      }
    },
    tooltips: {
      enabled: false
    }
  }
});

// Function to update the chart with new data
function updateChartWithData(data) {
  firstChart.data.datasets[0].data = data;
  firstChart.update();
}

/* adding some bits here about switching the header */
let header1 = document.querySelectorAll(".voteQuestionContainer>h1")[0];
let header2 = document.querySelectorAll(".voteQuestionContainer>h1")[1];



function showContexts(index) {
  if (index < 0) {
    index = 0}
  let intervalId = setInterval(() => {
    console.log(`showContexts called with ${index}`);
    if (index < contexts.length) {
      contexts[index].style.display = "block";
      index++;
      if (header1.style.display = "block") {
        header1.style.display = "none";
        header2.style.display = "block";
      }
      setTimeout(buttons.forEach((button, index) => {
        button.disabled = false;
      }), 50000);
    }
    else if (index = contexts.length) {
      showReflection();
    }
    else {
      clearInterval(intervalId);
    }
  }, 10000);
}

function switchImg() {
  if (imgIndex + 1 >= images.length) {
    return;
  }
  images[imgIndex].style.display = "none";
  images[imgIndex + 1].style.display = "block";
  imgIndex++;
}

function showReflection() {
  if (reflections) {
    setTimeout(() => {
      reflections.forEach(reflection => {
        reflection.style.display = "block";
      });
      chartBoxes.forEach(chartBox => {
        chartBox.style.display = "none";
      })
      timerBox.style.opacity = "1";
    }, 5000) //adjust reflection time here
  }
}

function showContextsBasedOnRemainingTime() {
  const totalSeconds = (window.remainingTime / 1000);
  console.log(`incoming time: ${totalSeconds}`);
  let remainingTime; 
  if (totalSeconds < 120) {
  console.log(`less than 2 mins remain`);
  contexts.forEach(context => {
    context.style.display = "block";
    })
  buttons.forEach(button => {
    button.disabled = true;
  })
    showReflection();
  } else {
  remainingTime = totalSeconds - 120;
  console.log(`time until reflection: ${remainingTime}`);
  let topIndex = Math.floor(remainingTime / 10);
  let index = 5-topIndex;
  console.log(`index: ${index}`);

  for (let i = 0; i <= index && i < contexts.length; i++) {
    contexts[i].style.display = "block";
    if (header1.style.display = "block") {
      header1.style.display = "none";
      header2.style.display = "block";
    }
    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
  index++;
  showContexts(index);
}}

function triggerLoad() {
  if (typeof window.remainingTime !== 'undefined') {
    showContextsBasedOnRemainingTime();
  } else {
    console.log(`didn't call check time; remainingTime: ${window.remainingTime}`);
    /* this line just for testing!!! */
    /* window.remainingTime = 3 * 60 * 1000; */
    /* remember to take that out after testing!!! */
    setTimeout(triggerLoad, 500);
  }
}
triggerLoad();