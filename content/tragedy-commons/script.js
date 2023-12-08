let episodeTitle = "The Tragedy of the Commons";
let increments = [0, 2, 3, 7, 8, 10, 14, 15, 17, 18, 19, 22, 23, 24, 25, 27, 28, 29, 30, 33]; // minute values of all transition times, in order (don't change pre-session value here, just tell TST when to open the link)
let elements = [
  {
    fileName: 'icebreaker.html'
  },
  {
    fileName: 'slides.html',
    arrayIndex: 0
  },
  {
    fileName: 'slides.html',
    arrayIndex: 1
  },
  {
    fileName: 'vote.html',
    arrayIndex: 0
  },
  {
    fileName: 'slides.html',
    arrayIndex: 2
  },
  {
    fileName: 'interactive.html',
    arrayIndex: 0
  },
  {
    fileName: 'vote.html',
    arrayIndex: 1
  },
  {
    fileName: 'slides.html',
    arrayIndex: 3
  },
  {
    fileName: 'slides2.html',
    arrayIndex: 0
  },
  {
    fileName: 'slides2.html',
    arrayIndex: 1
  },
  {
    fileName: 'interactive.html',
    arrayIndex: 1
  },
  {
    fileName: 'vote.html',
    arrayIndex: 2
  },
  {
    fileName: 'slides2.html',
    arrayIndex: 2
  },
  {
    fileName: 'slides2.html',
    arrayIndex: 3
  },
  {
    fileName: 'interactive.html',
    arrayIndex: 2
  },
  {
    fileName: 'vote.html',
    arrayIndex: 3
  },
  {
    fileName: 'slides2.html',
    arrayIndex: 4
  },
  {
    fileName: 'vote.html',
    arrayIndex: 4
  },
  {
    fileName: 'goodbyes.html'
  },
  {
    fileName: 'icebreaker.html'
  }
]; //this is where you specify the flow between different states

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
  const userOffsetInMinutes = userOffset * -1; // Convert to positive minutes

  // Check if the offset is not a whole number of hours
  if (userOffsetInMinutes % 60 !== 0) {
    if ((userOffsetInMinutes !== 30)||(userOffsetInMinutes !== -30)) {
      serverTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
      console.log(`45 or 15 min offset detected`);
    } else {
      serverTime = new Date(currentTime.getTime() + userOffsetInMinutes * 60 * 1000);
    }
    console.log(`Applied offset for timezone: time set at ${serverTime}`);
    return serverTime;
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
let transitionTime = new Date();
let transitions = [];

increments.forEach(el => {
  transitionTime.setMinutes(el.minutes);
  transitionTime.setSeconds(el.seconds);
  transitions.push(new Date(transitionTime));
});

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
        const serverTimeMillis = serverTime.getTime(); // Get the timestamp of serverTime
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
    resetIndex(); /* commented this out to see if it helps troubleshoot the kids who get looped through to icebreakers */ 
    console.log(`resetIndex called [except commented out so not called], element index : ${elementsIndex}`);
  }
  else {
    console.log(`handleTransitions aborted: elementsIndex delta: ${elements.length}-${elementsIndex}`);
  }
};

/* currently no way to call resetIndex */
function resetIndex() {
  transitionIndex = 0;
  elementsIndex = 0;
  adjustIndex();
}

let timerBox = document.querySelector(".timer");
let remainingTime = -1;
let currentMinutes = serverTime.getMinutes();
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
      remainingTime = targetTransition - serverTime;
    }
  }
    remainingTime -= 1000;
    window.remainingTime = remainingTime; /* this line is for late-loading into pages-in-progress*/
    if (remainingTime <= 0) {
      console.log('timer at zero');
      timerBox.innerHTML = `0:00`;
      /* handleTransitions(); /*comment out this line for copy checks!!!                    */
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
  applyOffset(currentTime, userOffset);
  serverTime = new Date(currentTime);

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







/*the things below are for testing purposes only */
const buttonForceGame = document.getElementById("toGame");
const buttonForceSlides = document.getElementById("toSlides");
const buttonForceVote = document.getElementById("toVote");

if (buttonForceGame) {
  buttonForceGame.addEventListener("click", function () {
    window.location.href = 'interactive.html?index=0';
  });
}

if (buttonForceSlides) {
  buttonForceSlides.addEventListener("click", function () {
    window.location.href = 'slides.html?index=0';
  });
}

if (buttonForceVote) {
  buttonForceVote.addEventListener("click", function () {
    window.location.href = 'vote.html?index=0';
  })
};
