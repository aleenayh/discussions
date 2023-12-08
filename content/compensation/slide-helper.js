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
let helper = document.getElementById("helper");
let helperTalk = document.getElementById("helperTalk");
let helperTalkCloseButton = document.getElementById("closeBubble");
let bonusQuestions = Array.from(document.querySelectorAll("#helperTalk>p"));
let introHelperText = document.getElementById("introHelperText");
let smallVoteBox = document.getElementById("smallVote");

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

        resolve(`fade complete`);
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
  if (!p.textContent.trim()) {
    console.log(`detected p only white space - force transition`)
    /* stuff for the force transition */
    if (imgArray.length > 0) {
      fadeImage();
    }
    const fadeOutPromises = [
      (() => {
        if (textTopPosition.firstElementChild) {
          return fadeOutText(textTopPosition.firstElementChild, textTopPosition);
        } else {
          return Promise.resolve('no fade needed');
        }
      })(),
      (() => {
        if (textMidPosition.firstElementChild) {
          return fadeOutText(textMidPosition.firstElementChild, textMidPosition);
        } else {
          return Promise.resolve('no fade needed');
        }
      })(),
      (() => {
        if (textLowPosition.firstElementChild) {
          return fadeOutText(textLowPosition.firstElementChild, textLowPosition);
        } else {
          return Promise.resolve('no fade needed');
        }
      })()
    ];

    await Promise.all(fadeOutPromises);

    pIndex++;
    fadeInText(pArray[pIndex], textTopPosition);
    pIndex++;
    advanceProgress();
    resizeFont();
    fadeIsRunning = false;
    return;
    /* end the force transition stuff */
  }

  else if (textTopPosition.childElementCount === 0) {
    await fadeInText(p, textTopPosition);
    pIndex++;
    advanceProgress();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textMidPosition.childElementCount === 0) {
    await fadeInText(p, textMidPosition);
    pIndex++;
    advanceProgress();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textLowPosition.childElementCount === 0) {
    await fadeInText(p, textLowPosition);
    pIndex++;
    advanceProgress();
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
    pIndex++;
    advanceProgress();
    resizeFont();
    fadeIsRunning = false;
    return;
  }
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
  const newImageIndex = oldImageIndex + 1;
  const newImage = imgArray[newImageIndex];
  if (newImageIndex >= imgArray.length) {
    resetImage();
    return;
  } else { //the function as it already existed
    const intervalFadeOut = setInterval(() => {
      if (opacity > 0) {
        opacity -= 0.01;
        oldImage.style.opacity = opacity;
      } else {
        clearInterval(intervalFadeOut);
        imagePosition.removeChild(oldImage);
        newImage.style.opacity = 0;
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
  }
}

function advanceProgress() {
  let adjustedArrayLength = pArray.length - countBlanks;
  let blanksSoFar = pArray.slice(0, pIndex).filter(p => !p.textContent.trim()).length;
  let pDisplay = pIndex - blanksSoFar;
  let progress = (pDisplay / adjustedArrayLength) * 100;
  progressBar.style.width = progress + '%';
  elementCounterContainer.innerHTML = `${pDisplay} of ${adjustedArrayLength}`;
  if (pIndex === pArray.length) {
  if (smallVoteBox) {
    smallVoteBox.style.display = "flex";
    console.log(`changed smallVote to flex`);
  }
  if (helper) {
    setTimeout(function() {
    helper.style.opacity = "1";
    helper.addEventListener("click", showHelperQ);
    imagePosition.firstChild.style.opacity = "0.5";
  }, 20000);
  }
}
}

function resizeFont() {
  allContainers.forEach(container => {
    if (!container.classList.contains("flexText")) {
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
  }});
}


async function replaySlides() {
  if (imgArray.length > 0) {
    fadeImage();
  }
  await Promise.all([
    (textTopPosition.firstElementChild ? fadeOutText(textTopPosition.firstElementChild, textTopPosition) : Promise.resolve()),
    (textMidPosition.firstElementChild ? fadeOutText(textMidPosition.firstElementChild, textMidPosition) : Promise.resolve()),
    (textLowPosition.firstElementChild ? fadeOutText(textLowPosition.firstElementChild, textLowPosition) : Promise.resolve())
  ])
  fadeInText(pArray[0], textTopPosition);
  pIndex = 1;
  advanceProgress();
  resizeFont();
  fadeIsRunning = false;
  if (helper) {
    closeHelperQ();
    helper.removeEventListener("click", showHelperQ);
    helper.classList.remove("softglow");
  }
}
if (replayButton) {
  replayButton.addEventListener("click", function () { replaySlides() });
}

//define text array
let pArray = Array.from(document.querySelectorAll(".slidesets p"));
let countBlanks = pArray.filter(p => !p.textContent.trim()).length;
let pIndex = 0;

//define image array
let imgArray = Array.from(document.querySelectorAll(".slideImg"));

//code to start us off on load
window.onload = function () {
  decidePosition(pArray[pIndex]);
  if (imgArray.length > 0) { fadeImage() };
  document.addEventListener("click", function () { decidePosition(pArray[pIndex]) });
  /* if (pageIndex) {
    if (pageIndex === 1) {
    showHelperIntro();
    setTimeout(closeHelperIntro, 8000);
  }
} */ //put this back in if you need a tooltip to pop up on pageLoad but only for certain pages 
};

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

