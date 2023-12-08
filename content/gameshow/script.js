let episodeTitle = "Squad Goals";
let increments = [
   {minutes: 0, seconds: 0}, 
   {minutes: 2, seconds: 0}, 
   {minutes: 2, seconds: 45},
   {minutes: 3, seconds: 0}, 
   {minutes: 4, seconds: 0}, 
   {minutes: 5, seconds: 0}, 
   {minutes: 6, seconds: 0}, 
   {minutes: 7, seconds: 0}, 
   {minutes: 8, seconds: 0}, 
   {minutes: 9, seconds: 0}, 
   {minutes: 10, seconds: 0}, 
   {minutes: 11, seconds: 0},
   {minutes: 12, seconds: 45},
   {minutes: 13, seconds: 0}, 
   {minutes: 15, seconds: 0}, 
   {minutes: 16, seconds: 0}, 
   {minutes: 18, seconds: 0}, 
   {minutes: 19, seconds: 0}, 
   {minutes: 21, seconds: 0}, 
   {minutes: 22, seconds: 0}, 
   {minutes: 24, seconds: 0},  
   {minutes: 25, seconds: 0}, 
   {minutes: 27, seconds: 0}, 
   {minutes: 28, seconds: 0}, 
   {minutes: 33, seconds: 0}, 
   {minutes: 35, seconds: 0}, 
] 
let elements = [
  {
    fileName: 'icebreaker.html',
  },
  {
    fileName: 'slides.html',
  },
  {
    fileName: 'slides1.html',
  },
  {
    fileName: 'round1.html',
  },
  {
    fileName: 'round2.html',
  },
  {
    fileName: 'round3.html',
  },
  {
    fileName: 'round4.html',
  },
  {
    fileName: 'round5.html',
  },
  {
    fileName: 'round6.html',
  },
  {
    fileName: 'round7.html',
  },
  {
    fileName: 'starvote.html',
    arrayIndex:0
  },
  {
    fileName: 'slides2.html',
  },
  {
    fileName: 'slides3.html',
  },
  {
    fileName: 'scen1.html',
  },
  {
    fileName: 'starvote.html',
    arrayIndex:1
  },
  {
    fileName: 'scen2.html',
  },
  {
    fileName: 'starvote.html',
    arrayIndex:2
  },
  {
    fileName: 'scen3.html',
  },
  {
    fileName: 'starvote.html',
    arrayIndex:3
  },
  {
    fileName: 'scen4.html',
  },
  {
    fileName: 'starvote.html',
    arrayIndex:4
  },
  {
    fileName: 'reflection.html'
  },
  {
    fileName: 'record.html'
  },
  {
    fileName: 'goodbyes.html'
  },
  {
    fileName: 'goodbyes.html'
  }
]; //this is where you specify the flow between different states
let elementsIndex = 0; 

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
        resolve(); 
      } else {
        let index = 0;
        const serverTimeMillis = serverTime.getTime(); // Get the timestamp of serverDate
        while (index < transitions.length && serverTimeMillis > transitions[index].getTime()) {
          index++;
        }
        transitionIndex = index;
        elementsIndex = index;
        resolve();
      }
    });
  } catch (error) {
    console.error('Error in adjustIndex:', error);
  }
}

function handleTransitions() {
  console.log(`handleTransitions called: ${remainingTime} remaining Time value`);
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

function debounce(func, delay) {
  let timer;
  return function() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log(`debounce of ${delay} applied to handleTransitions function`);
          func.apply(this, arguments);
      }, delay);
  };
}

const debouncedHandleTransitions = debounce(handleTransitions, 1000);

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
      try {
        debouncedHandleTransitions(); // comment this line out for copy checks to turn transitions off
      } catch (error) {
        console.error("An error occurred while invoking debouncedHandleTransitions:", error);
      }
      } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60).toString().padStart(2, "0");
      timerBox.innerHTML = `${minutes}:${seconds}`;
    }
    setTimeout(countdown, 1000); // update the countdown every second
  }


async function loadPage() {
  const currentTime = await getServerTime();
  const userOffset = currentTime.getTimezoneOffset();
  serverTime = await applyOffset(currentTime, userOffset);
  setIncrements();
  currentMinutes = serverTime.getMinutes();
  await adjustIndex()
    .then(() => {
      if (window.location.href.includes('index.html')) {
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

/* console.error(`ERROR: HANDLE TRANSITIONS IS COMMENTED OUT FOR COPY CHECKS.`)
console.error(`TELL ALEENA TO TURN TRANSITIONS ON.`) */