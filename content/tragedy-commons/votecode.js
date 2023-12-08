let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);



const containers = Array.from(document.getElementsByClassName("container"));

function chooseScenario() {
  if(pageIndex < containers.length) { // Check if index is within the range of the array
    containers[pageIndex].style.display ="block";

    console.log(`scenario switched to index: ${pageIndex}`)
  } else {
    console.log(`Index out of range. Length of containers: ${containers.length}, Given index: ${pageIndex}`);
  }
}
chooseScenario();

const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let buttons = Array.from(containers[pageIndex].getElementsByClassName('voteChoice'));
const reflections = Array.from(document.getElementsByClassName("reflectionResult"));


let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button

// Function to send a vote to the database
function vote(buttonIndex, pageIndex) {
  fetch('/api/serverlessvote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ buttonIndex: buttonIndex, pageIndex: pageIndex })
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
      setInterval(function() {
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
      }, 1000); // every 1 seconds
  } catch(error) {
      console.error(error);
  }
}

/* the results display script */
let resultsChart = containers[pageIndex].getElementsByClassName("resultsChart")[0].getContext('2d');

// Global Options
Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 18;
Chart.defaults.font.color = '#777';

let labels = Array.from(containers[pageIndex].getElementsByClassName("voteChoice"));

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
for(let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    vote(i, pageIndex);
    chartBoxes.forEach(chartBox => {
      chartBox.style.opacity = 1; //show the chart
    });
    // Add tasks to disable all buttons and highlight the selected button
      buttons.forEach((button, index) => {
    button.disabled = true;
    if(index === i) {
      button.classList.add('highlight-button');
    }
    reflections.forEach(reflection => {
      reflection.style.display = "block"; //start reflection fade
    });
  });
})};

let allLabels = [labelA, labelB, labelC, labelD, labelE, labelF, labelG];
let displayedLabels = allLabels.filter(label => label !== "");

let firstChart = new Chart(resultsChart, {
  type:'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data:{
    labels:displayedLabels,
    datasets:[{
      label:'Votes',
      data:displayedCounts,
      //backgroundColor:'green',
      backgroundColor:[
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderWidth:2,
      borderColor:'#000',
      hoverBorderWidth:5,
      hoverBorderColor:'#000'
    }]
  },
  options:{
    title:{
      display:true,
      text:'Your Results',
      fontSize:25
    },
    legend:{
      display:true,
      position:'right',
      labels:{
        fontColor:'#000'
      }
    },
    layout:{
      padding:{
        left:100,
        right:100,
        top:0,
        bottom:200,
      }
    },
    tooltips:{
      enabled:false
    }
  }
});

// Function to update the chart with new data
function updateChartWithData(data) {
  firstChart.data.datasets[0].data = data;
  firstChart.update();
}