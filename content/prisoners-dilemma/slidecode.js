//define slide containers
let textTopPosition = document.getElementById("textOne");
let textMidPosition = document.getElementById("textTwo");
let textLowPosition = document.getElementById("textThree");
const allContainers = [textTopPosition, textMidPosition, textLowPosition];
let imagePosition = document.querySelector(".imagePosition");
let container = document.getElementById("slideBaseContainer");
const progressBar = document.getElementById("progressBar");
const elementCounterContainer = document.querySelector(".elementCounter");
const replayButton = document.getElementById("replayButton");

//utility items
let logo = document.getElementById("logo");
const padZero = (num) => {
  return num.toString().padStart(2, '0');
};

//transition functions
function fadeInText(string, textBox) {
  return new Promise((resolve) => {
    let opacity = 0;
    string.style.opacity = opacity;
    textBox.appendChild(string);
    const interval = setInterval(() => {
      string.style.opacity = opacity;
      if (opacity < 1) {
        opacity += 0.01;
        string.style.opacity = opacity;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 10);
  }
  )
}

function fadeOutText(string, textBox) {
  return new Promise((resolve) => {
    let opacity = 1;
    const interval = setInterval(() => {
      if (opacity > 0) {
        opacity -= 0.01;
        string.style.opacity = opacity;
      } else {
        clearInterval(interval);
        textBox.removeChild(string);

        resolve();
      }
    }, 15);
  });
}

let fadeIsRunning = false;
async function decidePosition(p) {
  let pInputValue = pArray.indexOf(p);
  if (fadeIsRunning) {
    console.log('decidePosition stopped - race condition');
    return;
  }
  if (pInputValue === -1) {
    console.log('reached end of array');
    return;
  }
  fadeIsRunning = true;
  if (textTopPosition.childElementCount === 0) {
    await fadeInText(p, textTopPosition);
    pIndex++;
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textMidPosition.childElementCount === 0) {
    await fadeInText(p, textMidPosition);
    pIndex++;
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textLowPosition.childElementCount === 0) {
    await fadeInText(p, textLowPosition);
    pIndex++;
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else {
    if (imgArray.length > 0) {
      fadeImage();
    }
    await Promise.all([
      fadeOutText(textTopPosition.firstElementChild, textTopPosition),
      fadeOutText(textMidPosition.firstElementChild, textMidPosition),
      fadeOutText(textLowPosition.firstElementChild, textLowPosition)
    ])
    fadeInText(p, textTopPosition);
  }
    pIndex++;
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  }

function resetImage() {
  if (imgArray.length <= 0) {
    return;
  }
  console.log(`called resetImage`);
  let opacity = 1;
  const oldImage = imagePosition.firstChild;
  const newImage = imgArray[0];

  const intervalFadeOut = setInterval(() => {
    if (opacity > 0) {
      opacity -= 0.01;
      oldImage.style.opacity = opacity;
    } else {
      clearInterval(intervalFadeOut);
      imagePosition.removeChild(oldImage);
      newImage.style.opacity = 0.0;
      imagePosition.appendChild(newImage);

      const intervalFadeIn = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.01;
          newImage.style.opacity = opacity;
        } else {
          clearInterval(intervalFadeIn);
        }
      }, 50);
    }
  }, 10);
}

function fadeImage() {
  if (imagePosition.childElementCount === 0) {
    return;
  }
  let opacity = 1;
  const oldImage = imagePosition.firstChild;
  const oldImageIndex = imgArray.indexOf(oldImage);
  const newImageIndex = imgArray.indexOf(oldImage) + 1;
  const newImage = imgArray[newImageIndex];
  console.log(`fading image - index from ${oldImageIndex} of ${imgArray.length} to ${newImageIndex}`);
  if (newImageIndex >= imgArray.length) {
    resetImage();
    return;
  } else {

  const intervalFadeOut = setInterval(() => {
    if (opacity > 0) {
      opacity -= 0.01;
      oldImage.style.opacity = opacity;
    } else {
      clearInterval(intervalFadeOut);
      imagePosition.removeChild(oldImage);
      newImage.style.opacity = 0.0;
      imagePosition.appendChild(newImage);

      const intervalFadeIn = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.01;
          newImage.style.opacity = opacity;
        } else {
          clearInterval(intervalFadeIn);
        }
      }, 20);
    }
  }, 10);
}}
function advanceProgressBar() {
  let progress = (pIndex / pArray.length) * 100;
  progressBar.style.width = progress + '%';
}
function advanceCounter() {
  elementCounterContainer.innerHTML = `${pIndex} of ${pArray.length}`;
}

function resizeFont() {
  allContainers.forEach(container => {
    const pElement = container.querySelector('p');
    if (pElement) {
      const containerHeight = container.clientHeight;
      const pHeight = pElement.clientHeight;

      if (pHeight > containerHeight) {
        const fontSize = parseFloat(window.getComputedStyle(pElement).fontSize);
        const newFontSize = (containerHeight / pHeight) * fontSize;
        pElement.style.fontSize = `${newFontSize}px`;
      }
    }
  });
}


function replaySlides() {
  pIndex = 0;
  decidePosition(pIndex);
  fadeImage();
}
if (replayButton) {
replayButton.addEventListener("click", function() {replaySlides()});
}

//define text array
let pArray = Array.from(document.querySelectorAll(".slidesets p"));
let pIndex = 0;
//define image array
let imgArray = Array.from(document.querySelectorAll(".slideImg"));


//code to start us off on load
window.onload = function () {
  decidePosition(pArray[pIndex]);
  if (imgArray.length > 0) {fadeImage()};
  document.addEventListener("click", function () { decidePosition(pArray[pIndex]) });
};