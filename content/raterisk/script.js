let episodeTitle = "Weighing the Risks";
let increments = [
   {minutes: 0, seconds: 0}, 
   {minutes: 2, seconds: 0}, 
   {minutes: 3, seconds: 0}, 
   {minutes: 4, seconds: 0}, 
   {minutes: 4, seconds: 30}, 
   {minutes: 5, seconds: 30}, 
   {minutes: 8, seconds: 30},
   {minutes: 9, seconds: 0}, 
   {minutes: 10, seconds: 0}, 
   {minutes: 13, seconds: 0}, 
   {minutes: 13, seconds: 30}, 
   {minutes: 14, seconds: 30}, 
   {minutes: 17, seconds: 30}, 
   {minutes: 18, seconds: 30}, 
   {minutes: 19, seconds: 30}, 
   {minutes: 20, seconds: 30}, 
   {minutes: 23, seconds: 30}, 
   {minutes: 24, seconds: 0}, 
   {minutes: 25, seconds: 0}, 
   {minutes: 28, seconds: 0}, 
   {minutes: 33, seconds: 0}, 
   {minutes: 35, seconds: 0}, 
] 
let elements = [
  {
    fileName: 'icebreaker.html',
  },
  {
    fileName: 'intro.html',
  },
  { 
    fileName: 'slides.html'
  },
  {
    fileName: 'slides1.html',
  },
  {
    fileName: 'options1.html',
  },
  {
    fileName: 'rank1.html',
    arrayIndex: 'x'
  },
  {
    fileName: 'slides2.html',
  },
  {
    fileName: 'options2.html',
  },
  {
    fileName: 'rank2.html',
    arrayIndex: 'x'
  },
  {
    fileName: 'slides3.html',
  },
  {
    fileName: 'options3.html',
  },
  {
    fileName: 'rank3.html',
    arrayIndex: 'x'
  },
  { 
    fileName: 'halftime.html',
  },
  {
    fileName: 'slides4.html',
  },
  {
    fileName: 'options4.html',
  },
  {
    fileName: 'spectrum4.html',
    arrayIndex: 4
  },
  {
    fileName: 'slides5.html',
  },
  {
    fileName: 'options5.html',
  },
  {
    fileName: 'spectrum5.html',
    arrayIndex: 5
  },
  { 
    fileName: 'reflect.html',
  },
  {
    fileName: 'goodbyes.html'
  }
]; //this is where you specify the flow between different states
let elementsIndex = 0; 
let transitionsOn = true;

/* functions related to fetching and storing server time */
let serverTime = new Date(); 
async function getServerTime() {
  try {
      const response = await fetch('/api/getTime');
      const data = await response.json();
      console.log(`fetched server time`);
      const currentTime = new Date(data.currentTime);
      return currentTime;
  } catch(error) {
      console.log('Failed to fetch server time:', error);
      return new Date();
  }
}

async function applyOffset(currentTime) {
  if (currentTime instanceof Date) {
  const userOffset = currentTime.getTimezoneOffset();
  const userOffsetInMinutes = Math.abs(userOffset % 60); 

  // Check if the offset is not a whole number of hours
  if (userOffsetInMinutes !== 0) {
    if (userOffsetInMinutes === 30) {
      serverTime = new Date(currentTime.getTime() + userOffsetInMinutes * 60 * 1000);
      console.log(`Applied 30m offset for timezone: time set at ${serverTime}`);
      return serverTime;
    } else if (userOffsetInMinutes === 45) {
      serverTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
      console.log(`45 min offset detected; added 15 to set ${serverTime}`);
      return serverTime;
    } else if (userOffsetInMinutes === 15) {
      serverTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
      console.log(`15 min offset detected; subtracted 15 to set ${serverTime}`);
    return serverTime;
    } else {
      console.error(`could not read userOffsetInMinutes: ${userOffsetInMinutes}`);
    }
  } else {
    serverTime = currentTime;
    console.log(`No offset applied: time set at ${serverTime}`);
    return serverTime;
  }
} else {
  console.error('currentTime is not date object');
}
} 

/* functions related to session name */ 
let sessionNameSet = false;
function updateSessionName() {
  const episodeTitleBlock = document.getElementById("episodeTitle");
  if ((episodeTitleBlock) && (!sessionNameSet)) {
    episodeTitleBlock.innerHTML = episodeTitle;
  }
  sessionNameSet = true;
}

//calculating the transition times
let transitions = [];
function setIncrements() {
  increments.forEach(el => {
  let transitionTime = new Date(serverTime); /*investigate this, it doesn't seem like it should work */
  transitionTime.setMinutes(el.minutes);
  transitionTime.setSeconds(el.seconds);
  transitions.push(transitionTime);
});
}


//adjustIndex based on time 
let transitionIndex = 0;
async function adjustIndex() {
  try {
    return new Promise((resolve) => {
      if (serverTime.getMinutes() > 35) {
        transitionIndex = 1;
        elementsIndex = 1;
        console.log(`Adjusted transition index: ${transitionIndex}; elements index: ${elementsIndex}`);
        console.log(`value of next transition: ${transitions[transitionIndex]}`);
        resolve(); 
      } else {
        let index = 0;
        const serverTimeMillis = serverTime.getTime(); // Get the timestamp of serverDate
        while (index < transitions.length && serverTimeMillis > transitions[index].getTime()) {
          index++;
        }
        transitionIndex = index;
        elementsIndex = index;
        console.log(`Adjusted transition index: ${transitionIndex}; elements index: ${elementsIndex}`);
        console.log(`value of next transition: ${transitions[transitionIndex]}`);
        resolve();
      }
    });
  } catch (error) {
    console.error('Error in adjustIndex:', error);
  }
}

function handleTransitions() {
  console.log(`element index: ${elementsIndex}; length: ${elements.length}`);
  if (elementsIndex < elements.length) {
    let nextElement = elements[elementsIndex];
    if (nextElement.hasOwnProperty('arrayIndex')) {
      window.location.href = nextElement.fileName + '?index=' + nextElement.arrayIndex;
      console.log(`transitioned to ${nextElement.fileName}`);
    } else {
      window.location.href = nextElement.fileName;
      console.log(`transitioned to ${nextElement.fileName}`);
    }
  } else if (elementsIndex >= elements.length) {
    resetIndex(); 
    console.log(`resetIndex called, element index : ${elementsIndex}`);
  }
  else {
    console.log(`handleTransitions aborted: elementsIndex delta: ${elements.length}-${elementsIndex}`);
  }
};

function resetIndex() {
  transitionIndex = 0;
  elementsIndex = 0;
  adjustIndex();
}

let timerBox = document.querySelector(".timer");
let remainingTime = -1;
let currentMinutes = 0;
function countdown() {
  if (remainingTime == -1) {
    if ((currentMinutes >= 33) && (currentMinutes <= 35)) {
      timerBox.innerHTML = `0:00`;
      return;
    }
    if ((currentMinutes >= 35) && (currentMinutes <= 59)) { 
      const targetTransition = new Date();
      targetTransition.setHours(serverTime.getHours() + 1);
      targetTransition.setMinutes(increments[1].minutes);
      targetTransition.setSeconds(increments[1].seconds);
      remainingTime = targetTransition - serverTime;
    } else {
      const targetTransition = transitions[transitionIndex];
      console.log(`target transitions set at ${targetTransition}; index ${transitionIndex};`)
      remainingTime = targetTransition - serverTime;
    }
  }
    remainingTime -= 1000;
    window.remainingTime = remainingTime; /* this line is for late-loading into pages-in-progress*/
    if (remainingTime <= 5000) {
      timerBox.style.color = 'red';
    } else {
      timerBox.style.color = ''; // reset to default color
    }
    if (remainingTime <= 0) {
      console.log('timer at zero');
      timerBox.innerHTML = `0:00`;
      if (transitionsOn) {
      handleTransitions(); }
    } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60).toString().padStart(2, "0");
      timerBox.innerHTML = `${minutes}:${seconds}`;
    }
    setTimeout(countdown, 1000); // update the countdown every second
  }


/* 
transitionsOn = false;
console.error(`ALEENA HAS TRANSITIONS TURNED OFF.`);
console.error(`IF YOU'RE SEEING THIS IN A SESSION TELL ALEENA TO TURN TRANSITIONS ON!`);
/* */

async function loadPage() {
  const currentTime = await getServerTime();
  const userOffset = currentTime.getTimezoneOffset();
  serverTime = await applyOffset(currentTime, userOffset);
  setIncrements();
  currentMinutes = serverTime.getMinutes();
  await adjustIndex()
    .then(() => {
      if (window.location.href.includes('admin.html')) {
        launchAdmin();
        return;
      } else if (window.location.href.includes('index.html')) {
        if (elementsIndex > 0) {
        elementsIndex--;
        console.log(`decreased elementsIndex by one, new: ${elementsIndex}`);
        }
        handleTransitions();
      } else {
        if (timerBox) {
        countdown();
      }
      }
    }
    );
    setTimeout(updateSessionName, 100);
};
loadPage();



/* everything below will only be applicable if the admin page is loaded */
if (window.location.href.includes('admin.html')) {
  window.onerror = handleConsoleErrors;
}
function launchAdmin() {
  updateSessionName();
  updateSessionLink();
  generateTable();
}

const baseURL = window.location.origin + "/";
function updateSessionLink() {
  const indexLink = baseURL+ 'index.html'
  const indexLinkHolder = document.getElementById("indexLink");
  const link = document.createElement('a');
    link.href = indexLink;
    link.textContent = link.href;
  indexLinkHolder.appendChild(link);
}

function generateTable() {
  const table = document.createElement('table');

  // Create the header row
  const headerRow = table.insertRow();
  let headers = ['Timeline', 'Page Name', 'Direct URL'];
  for (let i = 0; i < headers.length; i++) {
    const headerCell = document.createElement('th');
    headerCell.textContent = headers[i];
    headerRow.appendChild(headerCell);
  }

  //generate URL list
  let urls = [];
  elements.forEach((nextElement) => {
    if (nextElement.hasOwnProperty('arrayIndex')) {
      urls.push(baseURL + nextElement.fileName + '?index=' + nextElement.arrayIndex);
    } else {
      urls.push(baseURL + nextElement.fileName);
    }
  });


  // Add the data rows
  for (let i = 0; i < elements.length; i++) {
    const row = table.insertRow();
    
    const incrementCell = row.insertCell();
    // Assume the index variable is defined as i in the loop
  const previousIncrement = increments[i];
  const currentIncrement = increments[i+1];
  const formatTime = ({minutes, seconds}) => `HH:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  incrementCell.textContent = `${formatTime(previousIncrement)} - ${formatTime(currentIncrement)}`;
    
    const elementCell = row.insertCell();
    elementCell.textContent = elements[i].fileName.split('.')[0];
    
    const urlCell = row.insertCell();
    const link = document.createElement('a');
    link.href = urls[i];
    link.textContent = link.href;
    urlCell.appendChild(link);
  }
  // Append the table to the body or any other container
  const tableContainer = document.getElementById("adminTableHolder");
  adminTableHolder.appendChild(table);
}


function handleConsoleErrors(message, source, lineno, colno, error) {
  console.log('triggered error handling');
    console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
    console.error(`Error details:`, error);
  



  // Create a new div element to display the error
  var errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<p><strong>Error:</strong> ${message} at ${source}:${lineno}:${colno}</p>`;

  // Append the error message to the console log box
  var consoleLogBox = document.getElementById('consoleLogBox');
  consoleLogBox.appendChild(errorDiv);
}
const consoleClearButton = document.getElementById("consoleClearButton")
function clearConsoleLogs() {
  var consoleLogBox = document.getElementById('consoleLogBox');
  consoleLogBox.innerHTML = ''; // Clear the content of the console log box
}
if (consoleClearButton) {
  consoleClearButton.addEventListener('click', clearConsoleLogs);
}

let indices = [];
function clearVotes(indices) {
  fetch("/api/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pageIndex: indices,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function clearChecked() {
  const checkboxes = document.querySelectorAll('#manualVoteAdmin input[type="checkbox"]');
  indices = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      indices.push(index); 
    }
  });
  clearVotes(indices);
}
const buttonResetAll = document.getElementById("resetAllVotes");
const buttonResetManual = document.getElementById("resetSelectedVotes");
if (buttonResetAll) {
  buttonResetAll.addEventListener('click', () => {
    indices = [0,1,2,3,4,5,6,7,8,9,10,11,];
    clearVotes(indices);
  });
  buttonResetManual.addEventListener('click', clearChecked);
}