let episodeTitle = "The Prisoner's Dilemma";
let increments = [0, 2, 3, 4, 12, 14, 15, 18, 19, 22, 23, 27, 28, 29, 30, 33, 35]; // minute values of all transition times, in order (don't change pre-session value here, just tell TST when to open the link)
let elements = [
  {
    fileName: 'icebreaker.html'
  },
  {
    fileName: 'slides.html',
  },
  {
    fileName: 'slides2.html',
  },
  {
    fileName: 'interactive.html',
  },
  {
    fileName: 'slides3.html',
  },
  {
    fileName: 'halftime.html',
  },
  {
    fileName: 'slides4.html',
  },
  {
    fileName: 'vote.html',
    arrayIndex: 0
  },
  {
    fileName: 'slides5.html',
  },
  {
    fileName: 'vote.html',
    arrayIndex: 1
  },
  {
    fileName: 'slides6.html',
  },
  {
    fileName: 'vote.html',
    arrayIndex: 2
  },
  {
    fileName: 'slides7.html',
  },
  {
    fileName: 'vote.html',
    arrayIndex: 3
  },
  {
    fileName: 'goodbyes.html'
  },
  {
    fileName: 'goodbyes.html'
  }
]; //this is where you specify the flow between different states

let elementsIndex = 0; 


let sessionNameSet = false;
function updateSessionName() {
  const episodeTitleBlock = document.getElementById("episodeTitle");
  if ((episodeTitleBlock) && (!sessionNameSet)) {
    episodeTitleBlock.innerHTML = episodeTitle;
  }
  sessionNameSet = true;
}

//calculating the transition times
let serverTime = new Date(); 
let transitionTime = new Date();
let transitions = [];
async function getServerTime() {
  try {
      const response = await fetch('/api/getTime');
      const data = await response.json();
      console.log(`fetched server time`);
      return data.currentTime;
  } catch(error) {
      console.log('Failed to fetch server time:', error);
      return new Date();
  }
}

// Call the function and store the server time
getServerTime().then((currentTime) => {
serverTime = new Date(currentTime);
console.log(`time set at ${serverTime}`);
});

increments.forEach(el => {
    transitionTime.setMinutes(el);
    transitionTime.setSeconds(0);
    transitions.push(new Date(transitionTime));
  });
//if you need to check a transition put a console log statement here

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

let transitionIndex = 0;
function adjustIndex() {
  return new Promise((resolve) => {
    if (serverTime.getMinutes() > 35) {
      transitionIndex = 0;
      elementsIndex = 0;
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
}


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
      targetTransition.setMinutes(increments[1]);
      targetTransition.setSeconds(0);
      remainingTime = targetTransition - serverTime;
    } else {
      const targetTransition = transitions[transitionIndex];
      remainingTime = targetTransition - serverTime;
    }
  }
    remainingTime -= 1000;
    if (remainingTime <= 0) {
      console.log('timer at zero');
      timerBox.innerHTML = `0:00`;
      handleTransitions(); /*comment out this line for copy checks!!!                    */
    } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60).toString().padStart(2, "0");
      timerBox.innerHTML = `${minutes}:${seconds}`;
    }
    setTimeout(countdown, 1000); // update the countdown every second
  }


async function loadPage() {
  await getServerTime();
  await adjustIndex()
    .then(() => {
      if (window.location.href.includes('index.html')) {
        if (elementsIndex > 0) {
        elementsIndex--;
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
