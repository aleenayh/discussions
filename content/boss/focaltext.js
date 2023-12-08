const textContainers = Array.from(document.getElementsByClassName("textContainerWrapper"));
const textContainer = textContainers[0];

const strings = Array.from(document.querySelectorAll(".slidesets p"));
let stringsIndex = 0;
let transitionCount = 1;
let fadeRunning = false;
strings.forEach(string => { string.style.opacity = "0" });

const progressBar = document.getElementById("progressBar");
const elementCounterContainer = document.querySelector(".elementCounter");
const replayButton = document.getElementById("replayButton");
const imagePosition = document.getElementById("imagePosition");
/* helper declarations */
let helper = document.getElementById("helper");
let helperTalk = document.getElementById("helperTalk");
let helperTalkCloseButton = document.getElementById("closeBubble");
let bonusQuestions = Array.from(document.querySelectorAll("#helperTalk>p"));
let tooltip = Array.from(document.getElementsByClassName("tooltip"))[0];
let clickedOnce = false;

async function fadeInText(string) {
  return new Promise((resolve) => {
    let opacity = 0;
    string.style.opacity = opacity;
    const interval = setInterval(() => {
      string.style.opacity = opacity;
      if (opacity < 1) {
        opacity += 0.01;
        string.style.opacity = opacity;
      } else {
        clearInterval(interval);
        resolve();
      }
    },15);
  }
  )
}
async function fadeOutText() {
  return new Promise((resolve) => {
    let opacity = 1;
    if (textContainer.childElementCount) {
      Array.from(textContainer.children).forEach(child => {
        child.style.opacity = opacity;
        const interval = setInterval(() => {
          child.style.opacity = opacity;
          if (opacity < 1) {
            opacity += 0.01;
            child.style.opacity = opacity;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, 10);
      }
      )
    }
    else {
      resolve();
    }
  })
}
async function newText() {
  let topText = strings[stringsIndex];
  stringsIndex++;
  let MidText = strings[stringsIndex];
  stringsIndex++;
  let LowText = strings[stringsIndex];
  textContainer.appendChild(topText);
  textContainer.appendChild(MidText);
  textContainer.appendChild(LowText);


  if ((imagePosition)&&(imagePosition.childElementCount)) {
    textContainer.classList.add("withImg");
    fadeImage();
  }


  await fadeInText(topText);
  await fadeInText(MidText);
  await fadeInText(LowText);

  stringsIndex++;
  transitionCount++;
}
function advanceProgress() {
  let adjustedArrayLength = Math.round(strings.length/3);
  let adjustedIndex = transitionCount;
  let progress = (adjustedIndex / adjustedArrayLength) * 100;
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
  elementCounterContainer.innerHTML = `${adjustedIndex} of ${adjustedArrayLength}`;
  if ((progress === 100)&&(helper)) {
    setTimeout(function() {
    helper.style.opacity = "1";
    helper.addEventListener("click", showHelperQ);
    
    
    const displayedElement = document.querySelector('.displayed');
if (displayedElement) {
  displayedElement.style.opacity = '0.5';
}
  }, 20000);
  }
}
function fadeImage() {
  const images = document.querySelectorAll('.slideImg');
  let currentIndex; 
  for (let i = 0; i < images.length; i++) {
    if (images[i].classList.contains('displayed')) {
      currentIndex = i;
      break; // Found the current index, exit loop
    }
  }
  let newIndex;
  console.log(`currentIndex img: ${currentIndex} of ${images.length}`);
  if (currentIndex >= images.length-1) {
    newIndex = 0;
  } else {
  newIndex = currentIndex + 1;
  }
  if (newIndex > images.length) {
    return;
  }
images[currentIndex].classList.remove("displayed");
images[newIndex].classList.add("displayed");
}

async function transitionText() {
  if (tooltip) {
    hideTooltip();
  }
  if (fadeRunning === true) {
    console.log(`stopped, race condition`);
    return;
  }
  if (stringsIndex >= strings.length) {
    console.log(`reached end of array`);
    return;
  }
  fadeRunning = true;

  await fadeOutText();
  if (textContainer.childElementCount) {
    while (textContainer.firstChild) {
      textContainer.removeChild(textContainer.firstChild);
    }
  }
  advanceProgress();
  await newText();
  fadeRunning = false;
}


/* helper coding goes here */
function showHelperQ() {
  if (helperTalk.style.display === "flex") {
    return;
  }
  helperTalk.style.display = "flex";
  let random = Math.floor(Math.random() * bonusQuestions.length);
  bonusQuestions[random].style.display = "block";
}

function closeHelperQ() {
  helperTalk.style.display = "none";
  bonusQuestions.forEach(question => {
    question.style.display = "none"
  })
}
if (helperTalkCloseButton) {
  helperTalkCloseButton.addEventListener("click", closeHelperQ);
}

function showHelperIntro() {
  helperTalk.style.display = "flex";
  helperTalkCloseButton.style.opacity = "0";
}
function closeHelperIntro() {
  introHelperText.style.display = "none";
  helperTalk.style.display = "none";
  bonusQuestions.forEach(question => {
    question.style.display = "none"
  })
  helperTalkCloseButton.style.opacity = "1";
}

/* tooltip if no clicks */
function showTooltip() {
  if ((strings.length>3)&(!clickedOnce)) {
    tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    setTimeout( () => {
      tooltip.textContent = "Click anywhere to advance text!";
    }, 350);
    const slideBaseContainer = document.getElementById("slideBaseContainer");
    slideBaseContainer.appendChild(tooltip);
    setTimeout(jumpTooltip,2000);
  }
}
function jumpTooltip() {
  let yOffset = 10; 
  const bounce = () => {
    if (window.getComputedStyle(tooltip).opacity != '0') {
      tooltip.style.transform = `translateY(-${yOffset}px)`;
      setTimeout(() => {
        tooltip.style.transform = '';
      }, 200);
      setTimeout(bounce, 2000);
    }
  };
  bounce();
}

function hideTooltip() {
  tooltip.style.opacity = 0;
}

/* pageLoad functions */ 

document.addEventListener('DOMContentLoaded', (event) => {
  transitionText(),
setTimeout(showTooltip,30000)
 })
document.addEventListener('click', () => {
transitionText(), clickedOnce = true; 
});
