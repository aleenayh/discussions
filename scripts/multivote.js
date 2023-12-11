//multiple votes on the same page, students vote sequentially based on timer
//vote results display as stacked bar chart on page



let rows = Array.from(document.getElementsByClassName("voteRow"));
let rowsIndex = 1;

let buttons = Array.from(document.getElementsByClassName('voteChoice'));
let lives = Array.from(document.getElementsByClassName("live"));
let stopCounts = false;

// Function to send a vote to the database ---- change fetch location if we're using postgres or kv!
function vote(buttonIndex, pageIndex) {
  stopCounts = false;
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
      updateBars(data, pageIndex);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to get updated counts from the server
function getCounts(rowsIndex) {
  let requestPayload = JSON.stringify({ pageIndex: rowsIndex });
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
          updateBars(data, rowsIndex);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
    console.error(error);
  }
}

function updateBars(data, r) {
  let totalVotes = data[0] + data[1];
  let activeRow = r;
  let resultTrad = rows[activeRow].getElementsByClassName("tradVote")[0];
  let resultProg = rows[activeRow].getElementsByClassName("progVote")[0];
  resultTrad.style.opacity = "1";
  resultProg.style.opacity = "1";

  let percentageTrad = Math.round((data[0] / totalVotes) * 100);
  let percentageProg = Math.round((data[1] / totalVotes) * 100);
  let barProg = 100 - percentageTrad.toFixed(0);
  
  resultTrad.style.width = `${percentageTrad.toFixed(0)}%`;
  resultProg.style.width = `${barProg}%`;

  resultTrad.innerHTML = `${percentageTrad.toFixed(0)}%`;
  resultProg.innerHTML = `${percentageProg.toFixed(0)}%`;
  return;
}


// Assign event listeners for existing buttons only
for (let i = 0; i < rows.length; i++) {
  let activeRowButtons = Array.from(rows[i].getElementsByClassName('voteChoice'));
  activeRowButtons.forEach((button, buttonIndex) => {
    button.addEventListener('click', () => {
      vote(buttonIndex, pageIndex);
      // Add tasks to disable all buttons and highlight the selected button
      activeRowButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === buttonIndex) {
          button.classList.add('highlight-button');
        }
      });
    })
  });
}

let intervalId = null;
function getCountsPeriodically(row) {
  // Clear any existing intervals
  if (intervalId !== null) {
    clearInterval(intervalId);
    console.log(`cleared interval`);
  }
  // Start a new interval
  intervalId = setInterval(() => {
    getCounts(row);
  }, 2000);  // Adjust interval duration as needed
}

function highlightRow(i) {
  stopCounts = true;
  rows.forEach(row => {
    row.classList.remove("activeVote")
  });
  rows[i].classList.add("activeVote");
  buttons.forEach(button => {
    button.disabled = true;
  });
  
  lives.forEach(live => {
    live.style.opacity = 0});
  let activeLive = Array.from(rows[i].getElementsByClassName("live"));
  activeLive.forEach(live => { live.style.opacity = 1; }
  );
  let results = Array.from(rows[i].getElementsByClassName("voteResultContainer"));
  results.forEach(result => {result.style.opacity = 1});
  getCountsPeriodically(i);
  let activeRowButtons = Array.from(rows[i].getElementsByClassName('voteChoice'));
  activeRowButtons.forEach(button => {
    button.disabled = false;
  });
  pageIndex = rowsIndex;
}
highlightRow(1);

/* all of these are just nested functions to get the time flowing correctly */
let timeCheckInterval = 1;
function checkTime() {
  let progress = 300000 - window.remainingTime;
  let target = 0;

  if (progress > 60000) {
    rowsIndex = 2;
    highlightRow(rowsIndex);
    getCounts(rowsIndex-1);
  }
  if (progress > 120000) {
    rowsIndex = 3;
    highlightRow(rowsIndex);
    getCounts(rowsIndex-1);
  }
  if (progress > 180000) {
    rowsIndex = 4;
    highlightRow(rowsIndex);
    getCounts(rowsIndex-1);
  }
  if (progress > 240000) {
    rowsIndex = 5;
    highlightRow(rowsIndex);
    getCounts(rowsIndex-1);
  }
  if (rowsIndex === 1) {target = 60000}
  if (rowsIndex === 2) {target = 120000}
  if (rowsIndex === 3) {target = 180000}
  if (rowsIndex === 4) {target = 240000}
  if (rowsIndex === 5) {target = 300000}
  timeCheckInterval = target - progress;
}

function recursiveCheck() {
  checkTime(); 
  setTimeout(recursiveCheck, timeCheckInterval);
}

function triggerCheckTimeWhenReady() {
  if (typeof window.remainingTime !== 'undefined') {
    recursiveCheck();
  } else {
    console.log(`didn't call check time; remainingTime: ${window.remainingTime}`);
    setTimeout(triggerCheckTimeWhenReady, 500);
  }
}
triggerCheckTimeWhenReady();