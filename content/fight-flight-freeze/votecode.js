let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);




const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let buttons = Array.from(document.getElementsByClassName('voteChoice'));
const reflections = Array.from(document.getElementsByClassName("reflectionResult"));
const dummyTimer = document.getElementById("dummyTimer");
const paralysis = document.getElementById("paralysis");
const contexts = Array.from(document.getElementsByClassName("voteContext"));
const images = Array.from(document.getElementsByClassName("rapidVoteImg"));
let imgIndex = 0;

let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button

// Function to send a vote to the database ---- change fetch location if we're using postgres or kv!
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
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Function to get updated counts from the server -- change this if going between postgres and kv also
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
getCounts();

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
for(let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    vote(i, pageIndex);
    // Add tasks to disable all buttons and highlight the selected button
      buttons.forEach((button, index) => {
    button.disabled = true;
    if(index === i) {
      button.classList.add('highlight-button');
    }
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


let remainingScenarioTime = document.getElementById("scenarioFullTime").innerHTML;

let scenarioEndTime = document.getElementById("scenarioEndTime").innerHTML;
console.log(`scenarioEndTime = ${scenarioEndTime}`);


function countDummyTimer() {
  console.log(`remaining: ${remainingScenarioTime} counting to ${scenarioEndTime}`);
  if (remainingScenarioTime <= scenarioEndTime) {
    endDummyTimer();
    showAllContexts();
    checkForParalysis();
    dummyTimer.innerHTML = `Out of Time!`;
    showReflection();
    return;
  }
  remainingScenarioTime -= 1000;
  const minutes = Math.floor((remainingScenarioTime / 1000 / 60) % 60);
  const seconds = Math.floor((remainingScenarioTime / 1000) % 60).toString().padStart(2, "0");
  dummyTimer.innerHTML = `${minutes}:${seconds}`;
  setTimeout(countDummyTimer, 1000); // update the countdown every second
}


function endDummyTimer() {
  const originalColor = dummyTimer.style.color;
  
    let angle = 0, shakeAmount = 8, originalAngle = 0;
    dummyTimer.style.color = 'red';
    const shake = setInterval(() => {
      angle = (angle === originalAngle) ? shakeAmount : originalAngle;
      dummyTimer.style.transform = 'rotate(' + angle + 'deg)';
      if (shakeAmount === 0) {
        clearInterval(shake);
        dummyTimer.style.color = originalColor;
      } else {
        shakeAmount--;
      }
    }, 100);
}

function checkForParalysis() {
  buttons.forEach(button => {
      if (!button.disabled) {
        paralysis.style.display = "block";
      }
    });
  buttons.forEach(button => {
    button.disabled = true;
  })
  };

function showAllContexts() {
  contexts.forEach(context => {
    context.style.display = "block";
  });
}

function showContexts() {
    let index = 0;
    let intervalId = setInterval(() => {
      if (index < contexts.length) {
        contexts[index].style.display = "block";
        index++;
        if (images.length > 1) {
          switchImg();
          console.log(`called switchImg: index ${imgIndex} of ${images.length}`);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 15000);
  }

function switchImg() {
  if (imgIndex+1 >= images.length) {
    return;
  } 
  images[imgIndex].style.display = "none";
  images[imgIndex+1].style.display = "block";
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
  timerBox.style.opacity ="1";}, 10000) //adjust reflection time here
}}


  countDummyTimer();
  showContexts();

