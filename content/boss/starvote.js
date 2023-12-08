let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);



/* decide if the containers are sharing a page or not - probably yes? */
const containers = Array.from(document.getElementsByClassName("container"));

function chooseScenario() {
  if (containers.length <= 1) {
    containers[0].style.display ="flex";
    return;
  }
  if(pageIndex < containers.length) { // Check if index is within the range of the array
    containers[pageIndex].style.display ="flex";

    console.log(`scenario switched to index: ${pageIndex}`)
  } else {
    console.log(`Index out of range. Length of containers: ${containers.length}, Given index: ${pageIndex}`);
  }
}
chooseScenario();


const chartBoxes = Array.from(document.getElementsByClassName("chartBox"));
let stars = Array.from(containers[pageIndex].querySelectorAll('.star'));
let explainers = Array.from(containers[pageIndex].querySelectorAll('.explainer'))
const reflection = document.getElementById("reflectionResult");

let selectedId = 0;

function createMouseEnterHandler(index) {
  return function() {
    resetStarColors();
    for (let i = 0; i <= index; i++) {
      stars[i].classList.add('hovered');
    }
    explainers[index].style.display = "flex";
  }
}

function createMouseLeaveHandler() {
  return function() {
    for (let i = 0; i < stars.length; i++) {
      if (selectedId >= stars[i].id) {
        stars[i].classList.add('selected');
      }
      stars[i].classList.remove('hovered');
    }
  explainers.forEach(explainer => {
    explainer.style.display="none" })
}}

function createClickHandler(star, index) {
  return function() {
    selectedId = star.id;
    buttonIndex = parseInt(selectedId) -1;
    vote(buttonIndex, pageIndex);
    resetStarColors();
    for (let i = 0; i < selectedId; i++) {
      stars[i].classList.add('selected');
    }
    explainers[index].style.display = "flex";
    setTimeout(function() {
        reflection.style.opacity ="1"
      }, 5000)
  }
}

function resetStarColors() {
  stars.forEach(star => {
    star.classList.remove('hovered');
    star.classList.remove('selected');
  });
  explainers.forEach(explainer => {
    explainer.style.display ="none";
  })
}


let displayedCounts = [0, 0, 0, 0, 0, 0, 0]; // counts for each button

// Function to send a vote to the database
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
  .then(data => {
    console.log('Count update received:', data);
    updateChartWithData(data);
    getCounts();
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

/* the results display script */
let resultsChart = containers[pageIndex].getElementsByClassName("resultsChart")[0].getContext('2d');

// Global Options
Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 18;
Chart.defaults.font.color = '#777';
Chart.defaults.scale.ticks.display = false;

const starLabels = [
  `★`,
  `★★`,
  `★★★`,
  `★★★★`,
  `★★★★★`
]

let firstChart = new Chart(resultsChart, {
  type:'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
  data:{
    labels: starLabels,
    datasets:[{
      label:"Votes",
      data: displayedCounts,
      backgroundColor:[
        'rgba(252, 82, 4, 0.8)', //fc5204, fire orange
        'rgba(254, 156, 10, 0.8)', //fe9c0a, yellow orange
        'rgba(255, 249, 79, 0.8)', //fff94f, yellow
        'rgba(243, 116, 174, 0.8)', //f374ae, pink
        'rgba(179, 60, 134, 0.8)', //b33c86, purple
      ],
      borderWidth:5,
      borderColor:'#000',
      hoverBorderWidth:2,
      hoverBorderColor:'#000'
    }]
  },
  options:{
    plugins: {
      legend: {
          display: true,
          position: 'bottom',
          labels:{
            fontColor:[
              'rgba(252, 82, 4, 0.8)', //fc5204, fire orange
              'rgba(254, 156, 10, 0.8)', //fe9c0a, yellow orange
              'rgba(255, 249, 79, 0.8)', //fff94f, yellow
              'rgba(243, 116, 174, 0.8)', //f374ae, pink
              'rgba(179, 60, 134, 0.8)', //b33c86, purple
            ],
          }
       } },
    layout:{
      padding:{
        left:0,
        right:0,
        top:100,
        bottom:-200,
      }
    },
  }
});

// Function to update the chart with new data
function updateChartWithData(data) {
  console.log(`update called`);
  chartBoxes.forEach(box => {
    box.style.opacity="1";
  });
  stars.forEach(function (star, index) {
    star.removeEventListener('mouseenter', star.mouseEnterHandler);
    star.removeEventListener('mouseleave', star.mouseLeaveHandler);
    star.removeEventListener('click', star.clickHandler);
  });
  firstChart.data.datasets[0].data = data;
  firstChart.update();
}

let demoComplete = false;
//demo of each star hover text before letting students click
function starDemo(callback) {
  const demoOrder = [0, 2, 4]; // Indices of stars to demo

  function demoStep(index) {
    if (index < demoOrder.length) {
      const hoverHandler = createMouseEnterHandler(demoOrder[index]);
      hoverHandler(); // Trigger hover state

      setTimeout(() => {
        resetStarColors();
        explainers[demoOrder[index]].style.display = "none";
        demoStep(index + 1); // Move to the next step after 1.5 seconds
      }, 1500);
    } else {
      callback(); // Call the callback function when demo is complete
    }
  }

  demoStep(0); // Start the demo from the first star
}


function checkDemoCompletion() {
  if (demoComplete) {
    stars.forEach(function(star, index) {
      star.mouseEnterHandler = createMouseEnterHandler(index);
      star.mouseLeaveHandler = createMouseLeaveHandler();
      star.clickHandler = createClickHandler(star, index);
    
      star.addEventListener('mouseenter', star.mouseEnterHandler);
      star.addEventListener('mouseleave', star.mouseLeaveHandler);
      star.addEventListener('click', star.clickHandler);
    });
  } else {
    setTimeout(checkDemoCompletion, 100); // Check again in 0.1 second
  }
}


function pageLoad() {
  starDemo(() => {
      demoComplete = true; 
    })
  checkDemoCompletion();
}
setTimeout(pageLoad, 5000);