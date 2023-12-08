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
}



async function transitionText() {
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

document.addEventListener('DOMContentLoaded', (event) => {
  transitionText() })
document.addEventListener('click',
transitionText);