//define game components
const betrayButton = document.getElementById("betrayButton");
const cooperateButton = document.getElementById("cooperateButton");
const yourScoreContainer = document.getElementById("yourScore");
const opponentScoreContainer = document.getElementById("opponentScore");
const resultsContainer = document.getElementById("results");
const gameTimerBox = document.getElementById("gameTimer");
const timerTopResults = document.getElementById("resultsTimerTop");
const timerTopRound = document.getElementById("choiceTimerTop");
const allianceWindow = document.getElementById("allianceWindow");
const confirmAllianceButton = document.getElementById("confirmAlliance");
const denyAllianceButton = document.getElementById("denyAlliance");

//initial values
let yourBetrayal = false;
let opponentBetrayal = false;
let yourDelta = 0;
let opponentDelta = 0;
let yourScore = 0;
let opponentScore = 0;
let round = 0;
let targetTime = new Date().getTime() + 1 * 60 * 1000;
let resultsDone = false;
let opponentTrust = 0;
let alliance = false;

//define contexts and images
const contexts = document.getElementsByClassName("context");
const images = document.getElementsByClassName("contextImg");
const contextText = Array.from(contexts);
const contextImg = Array.from(images);


//result messages
const introMessage = `<b>In the last round...</b> `
const yourBetrayalMessage = `You blamed Jordan. `
const yourCoopMessage = `You didn't tell your parents anything.<br>`
const opponentBetrayalMessage = `Jordan said it was your fault.<br><br>`
const opponentCoopMessage = `Jordan didn't say a word to your parents.<br><br>`
const bothBetrayMessage = `Your parents were disappointed, both with the behavior and the finger-pointing. You were both grounded for three weeks.`
const bothCooperateMessage = `Your parents grounded you both for a week, trying to get the truth, but they eventually decided it must have been a mistake and forgave you both.`
const opponentBetrayedYouMessage = `You got in trouble not just for doing it, but for lying about it. You were grounded for five weeks, while Jordan wasn't punished at all.`
const youBetrayedOpponentMessage = `Your parents were disappointed in Jordan for the behavior and for not coming clean. Jordan was grounded for five weeks, while you weren't punished at all.`

function timer() {
  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    let timeRemain = targetTime - currentTime;

    if(timeRemain <= 0) {
      // Stop repeating if there's no time remaining
      clearInterval(intervalId);
      timeRemain = 0;
     if (resultsDone === true) {
      advanceRound();
      } else {
        advanceToResults();
      }
    }

    let minutes = Math.floor((timeRemain / (1000 * 60)) % 60);
    let seconds = Math.floor((timeRemain / 1000) % 60);

    // Adding leading zero to minutes and seconds if they less than 10
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    gameTimerBox.innerHTML = `${minutes}:${seconds}`;
  }, 1000);
}


function chooseBetray() {
  cooperateButton.classList.remove("clicked");
  betrayButton.classList.add("clicked");
  yourBetrayal = true;
}

function chooseCooperate() {
  betrayButton.classList.remove("clicked");
  cooperateButton.classList.add("clicked");
  yourBetrayal = false;
}

function opponentChoose() {
  const opponentRoll = Math.random();
  if (opponentTrust === 1) {
    opponentBetrayal = opponentRoll < 0.3;
    console.log(`roll: ${opponentRoll}, compare to 0.3, betrayal = ${opponentBetrayal}`);
  } else if (opponentTrust === -1) {
    opponentBetrayal = opponentRoll < 0.7;
    console.log(`roll: ${opponentRoll}, compare to 0.7, betrayal = ${opponentBetrayal}`);
  } else {
    opponentBetrayal = opponentRoll < 0.5;
    console.log(`roll: ${opponentRoll}, compare to 0.5, betrayal = ${opponentBetrayal}`);
}
}

function evaluateChoices() {
  if (yourBetrayal === true && opponentBetrayal === true) {
    yourDelta = 3;
    opponentDelta = 3;
    resultsContainer.style.opacity =0;
    resultsContainer.innerHTML = introMessage+yourBetrayalMessage+opponentBetrayalMessage+bothBetrayMessage;
    fadeIn(resultsContainer);
    if (opponentTrust === 1) {
      opponentTrust = 0;
    }
  } 
  if (yourBetrayal === false && opponentBetrayal === false) {
    yourDelta = 1;
    opponentDelta = 1;
    resultsContainer.style.opacity =0;
    resultsContainer.innerHTML = introMessage+yourCoopMessage+opponentCoopMessage+bothCooperateMessage;
    fadeIn(resultsContainer);
  } 
  if (yourBetrayal === true && opponentBetrayal === false) {
    yourDelta = 0;
    opponentDelta = 5;
    resultsContainer.style.opacity =0;
    resultsContainer.innerHTML = introMessage+yourBetrayalMessage+opponentCoopMessage+youBetrayedOpponentMessage;
    fadeIn(resultsContainer);
    if (opponentTrust === 1) {
      opponentTrust = -1;
    }
  } 
  if (yourBetrayal === false && opponentBetrayal === true) {
    yourDelta = 5;
    opponentDelta = 0;
    resultsContainer.style.opacity =0;
    resultsContainer.innerHTML = introMessage+yourCoopMessage+opponentBetrayalMessage+opponentBetrayedYouMessage;
    fadeIn(resultsContainer);
  } 
}

function updateScores() {
  yourScore += yourDelta;
  opponentScore += opponentDelta;
  yourScoreContainer.innerHTML = yourScore;
  opponentScoreContainer.innerHTML = opponentScore;
}

function advanceToResults() {
  opponentChoose();
  evaluateChoices();
  updateScores();
  cooperateButton.disabled = true;
  betrayButton.disabled = true;
  cooperateButton.classList.add("blocked");
  betrayButton.classList.add("blocked");
  targetTime = new Date().getTime() + .5 * 60 * 1000;
  timer();
  timerTopResults.style.display = "inline";
  timerTopRound.style.display = "none";
  resultsDone = true;
}

function advanceRound() {
  round++;
  perchanceAlliance();
  switchContext(round);
  cooperateButton.classList.remove("clicked");
  betrayButton.classList.remove("clicked");
  // enable buttons 
  cooperateButton.disabled = false;
  betrayButton.disabled = false;
  cooperateButton.classList.remove("blocked");
  betrayButton.classList.remove("blocked");
  targetTime = new Date().getTime() + 1.1 * 60 * 1000;
  resultsDone = false;
  timer();
  timerTopRound.style.display = "inline";
  timerTopResults.style.display = "none";
}

function perchanceAlliance() {
  if ((Math.random() < 0.4)&&(alliance === false)) {
    allianceWindow.style.display = "block";
    console.log("alliance triggered");
  }
}

function confirmAlliance() {
  allianceWindow.style.display = "none";
  opponentTrust = 1;
  alliance = true;
}
function denyAlliance() {
  allianceWindow.style.display = "none";
  opponentTrust = 0;
  alliance = true;
}
confirmAllianceButton.addEventListener("click",confirmAlliance);
denyAllianceButton.addEventListener("click",denyAlliance);
  
function switchContext(i) {
const oldContext = contextText[i-1];
const oldImage = contextImg[i-1];
const newContext = contextText[i];
const newImage = contextImg[i];
let opacity = 1; 


  const intervalFadeOut = setInterval(() => {
    if (opacity > 0) {
      opacity -= 0.01;
      oldContext.style.opacity = opacity;
      oldImage.style.opacity = opacity;
      newContext.style.opacity = 0;
      newImage.style.opacity = 0;
    } else {
      clearInterval(intervalFadeOut);
      oldContext.style.display ="none";
      oldImage.style.display = "none";
      newContext.style.display = "block";
      newImage.style.display = "block";
        contextText[0].style.display = "none";
        contextImg[0].style.display = "none";
      //these line for the late arrivals where the first context sticks around

      const intervalFadeIn = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.01;
          newImage.style.opacity = opacity;
          newContext.style.opacity = opacity;
        } else {
          clearInterval(intervalFadeIn);
        }
      }, 20);
    }
  }, 10);

}

betrayButton.addEventListener("click", chooseBetray);
cooperateButton.addEventListener("click", chooseCooperate);

function fadeOut(element) {
  let op = 1;  // initial opacity
  let timer = setInterval(function () {
    if (op <= 0.1){
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.1;
  }, 10);
}

function fadeIn(element) {
  let op = 0;  // initial opacity
  element.style.opacity = op;
  element.style.display = 'block';
  let timer = setInterval(() => {
      if (op >= 1) {
          clearInterval(timer);
      }
      element.style.opacity = op;
      op += 0.1;
  }, 100);
}

timer();

//just for building
/* let testButton = document.getElementById("test");
testButton.addEventListener("click", advanceRound);
*/

//pulling the remaining time from the html page and then parsing into a value we can check against in game transitions, for handling late arrivals
/* all of this effing stuff did not work, what the hell 
let timerData = document.querySelector(".timer").innerHTML;
let timeParts = timerData.split(":");
let remainingMinutes = parseInt(timeParts[0]);
let remainingSeconds = parseInt(timeParts[1]);
let entryTimeValue = `${remainingMinutes}.${remainingSeconds}`;
console.log(`minutes: ${remainingMinutes}, seconds: ${remainingSeconds}; value: ${entryTimeValue}`);
if (entryTimeValue < 6.54) {
  handleLateArrivals();
  console.log(`timer reads: ${entryTimeValue}; handling late arrival`);
} else {
  timer();
}



function handleLateArrivals() {
  if (entryTimeValue > 6.24) {
    round = 0;
    advanceToResults();
    console.log(`advanced to results 0`);
  } else {
    if (entryTimeValue > 5.18) {
    round = 1;
    switchContext(round);
    targetTime = new Date().getTime() + 1.1 * 60 * 1000;
    resultsDone = false;
    console.log(`advanced to round 1`);
    timer();
    timerTopRound.style.display = "inline";
    timerTopResults.style.display = "none";
  } else if (entryTimeValue > 4.48) {
    round = 1;
    switchContext(round);
    advanceToResults();
    console.log(`advanced to results 1`);
  } else if (entryTimeValue > 3.42) {
    round = 2;
    switchContext(round);
    targetTime = new Date().getTime() + 1.1 * 60 * 1000;
    resultsDone = false;
    console.log(`advanced to round 2`);
    timer();
    timerTopRound.style.display = "inline";
    timerTopResults.style.display = "none";
  } else if (entryTimeValue > 3.12) {
    round = 2;
    switchContext(round);
    advanceToResults();
    console.log(`advanced to results 2`);
  } else if (entryTimeValue > 2.06) {
    round = 3;
    switchContext(round);
    targetTime = new Date().getTime() + 1.1 * 60 * 1000;
    resultsDone = false;
    console.log(`advanced to round 3`);
    timer();
    timerTopRound.style.display = "inline";
    timerTopResults.style.display = "none";
  } else if (entryTimeValue > 1.36) {
    round = 3;
    switchContext(round);
    advanceToResults();
    console.log(`advanced to results 3`);
  } else if (entryTimeValue > 0.3) {
    round = 4;
    switchContext(round);
    targetTime = new Date().getTime() + 1.1 * 60 * 1000;
    resultsDone = false;
    console.log(`advanced to round 4`);
    timer();
    timerTopRound.style.display = "inline";
    timerTopResults.style.display = "none";
  } else if (entryTimeValue > 0) {
    round = 4;
    switchContext(round);
    advanceToResults();
    console.log(`advanced to results 4`);
  } 
}
}

*/