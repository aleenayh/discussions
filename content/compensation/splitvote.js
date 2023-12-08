//define pageIndex by container - TO DO


const containers = Array.from(document.getElementsByClassName("container"));
let voteA = containers[0];
let voteB = containers[1];

const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let buttonsA = Array.from(voteA.getElementsByClassName('voteChoice'));
let buttonsB = Array.from(voteB.getElementsByClassName('voteChoice'));
const reflections = Array.from(document.getElementsByClassName("reflectionResult"));
const resultBoxes = Array.from(document.querySelectorAll(".dualVote .voteResultContainer"))
const reflectionDual = document.getElementById("dualVoteReflection");

let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button

function vote(buttonIndex, pageIndex, indexSum = 0) {
  fetch('/api/serverlessvote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ buttonIndex: buttonIndex, pageIndex: pageIndex, indexSum: indexSum })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
// Function to get updated counts from the server -- change this if going between postgres and kv also
function getCounts(pageIndex) {
  let requestPayload = JSON.stringify({ pageIndex: pageIndex });
  try {
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
            updateChartWithData(data, pageIndex);
          })
          .catch(error => {
              console.error('Error:', error);
          });
      } catch(error) {
      console.error(error);
  }
}

/* the results display script */
let resultsAChart = containers[0].getElementsByClassName("resultsChart")[0].getContext('2d');
let resultsBChart = containers[1].getElementsByClassName("resultsChart")[0].getContext('2d');

// Global Options
Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 18;
Chart.defaults.font.color = '#777';

/* take out all the responsive label business for now 
let labelsA = Array.from(containers[0].getElementsByClassName("voteChoice"));
let labelsB = Array.from(containers[1].getElementsByClassName("voteChoice"));

let labelA, labelB, labelC, labelD, labelE, labelF, labelG, labelH;

function updateChartLabels() {
let labelAData = labelsA.map(label => label.innerHTML);
  labelA = labelAData.length > 0 ? labelAData[0] : "";
  labelB = labelAData.length > 1 ? labelAData[1] : "";
  labelC = labelAData.length > 2 ? labelAData[2] : "";
  labelD = labelAData.length > 3 ? labelAData[3] : "";
let labelBData = labelsB.map(label => label.innerHTML);
  labelE = labelBData.length > 4 ? labelBData[4] : "";
  labelF = labelBData.length > 5 ? labelBData[5] : "";
  labelG = labelBData.length > 6 ? labelBData[6] : "";
  labelH = labelBData.length > 7 ? labelBData[7] : "";
}
updateChartLabels();
*/

// Assign event listeners for existing buttons only
for(let i = 0; i < buttonsA.length; i++) {
  buttonsA[i].addEventListener('click', () => {
    vote(i, 0);
    // Add tasks to disable all buttons and highlight the selected button
      buttonsA.forEach((button, index) => {
    button.disabled = true;
    if(index === i) {
      button.classList.add('highlight-button');
    }
  });
})};
for(let i = 0; i < buttonsB.length; i++) {
  buttonsB[i].addEventListener('click', () => {
    vote(i, 5);
    // Add tasks to disable all buttons and highlight the selected button
      buttonsB.forEach((button, index) => {
    button.disabled = true;
    if(index === i) {
      button.classList.add('highlight-button');
    }
  });
})};

/* taking out responsive label bits for now
let firstLabels = [labelA, labelB, labelC, labelD];
let secondLabels = [labelE, labelF, labelG, labelH];
let displayedALabels = firstLabels.filter(label => label !== "");
let displayedBLabels = secondLabels.filter(label => label !== "");
*/

let firstChart = new Chart(resultsAChart, {
  type:'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data:{
    labels:[
      "Speak",
      "Listen",
      "Encourage",
      "Question"
    ],
    datasets:[{
      label:'Votes',
      data: displayedCounts,
      backgroundColor:[
        'rgba(254, 156, 10, 0.8)', //fe9c0a, yellow orange
        'rgba(252, 82, 4, 0.8)', //fc5204, fire orange
        'rgba(179, 60, 134, 0.8)', //b33c86, purple
        'rgba(54, 31, 173, 0.8)', //190e4f, dark blue
      ],
      borderWidth:2,
      borderColor:'#000',
      hoverBorderWidth:5,
      hoverBorderColor:'#000'
    }]
  },
  options: {
    plugins: {
      legend: {
          display: true,
          position: 'bottom',
          labels: {
              color: 'grey',
              fontSize:'60%',
          }
        }
      },
    responsive:'true',
  },

});
let secondChart = new Chart(resultsBChart, {
  type:'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data:{
    labels:[
      "Yes",
      "Some",
      "No"
    ],
    datasets:[{
      label:'Votes',
      data:displayedCounts,
      backgroundColor:'lightgrey',
      backgroundColor:[
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
      borderWidth:2,
      borderColor:'#000',
      hoverBorderWidth:5,
      hoverBorderColor:'#000'
    }]
  },
  options: {
    plugins: {
      legend: {
          display: true,
          position: 'bottom',
          labels: {
              color: 'grey',
              fontSize:'60%',
          }
        }
      },
    responsive:'true',
  },
});

function showResults() {
  getCounts(5);
  getCounts(0);
  resultBoxes.forEach(box => {
    box.style.opacity="1";
    box.style.zIndex="2";
  })
  chartBoxes.forEach(chart => {
    chart.style.opacity ="1";
  })
  //show the result boxes
  buttonsA.forEach(button => {
    button.style.opacity = "0";
  })
  buttonsB.forEach(button => {
    button.style.opacity = "0";
  })
  //hide the vote boxes
  setTimeout(function() {reflectionDual.style.opacity ="1";
}, 5000);
}

// Function to update the chart with new data
function updateChartWithData(data, pageIndex) {
  if (pageIndex === 0) {
  firstChart.data.datasets[0].data = data;
  firstChart.update();
  }
  if (pageIndex === 5) {
    secondChart.data.datasets[0].data = data;
    secondChart.update(); 
  }
}

let voteTime = 45000;
function countdownToVoteEnd() {
  let remainingTime = (window.remainingTime - voteTime);
  const intervalId = setInterval(function() {
  remainingTime -= 1000;
  if (remainingTime <= 0) {
    showResults();
    clearInterval(intervalId);
  }},1000)
}


function triggerLoad() {
  if (typeof window.remainingTime !== 'undefined') {
    countdownToVoteEnd();
  } else {
    console.log(`didn't call check time; remainingTime: ${window.remainingTime}`);
    /* this line just for testing!!! */
    /* window.remainingTime = 3 * 60 * 1000; */
    /* remember to take that out after testing!!! */
    setTimeout(triggerLoad, 500);
  }
}
triggerLoad();