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

//index search
let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);

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

    /* Promise.all(fadeOutPromises).then(results => {
      // Log the results of each fadeOutText function
      results.forEach((result, index) => {
        console.log(`fadeOutText ${index}: ${result}`);
      }); //////////////////  additional troubleshooting console logs for promises */

    pIndex++;
    fadeInText(pArray[pIndex], textTopPosition);
    pIndex++;
    if ((pIndex === pArray.length) && (helper)) {
      helper.addEventListener("click", showHelperQ);
      helper.classList.add("softglow");
    }
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
    /* end the force transition stuff */
  }

  else if (textTopPosition.childElementCount === 0) {
    await fadeInText(p, textTopPosition);
    pIndex++;
    if ((pIndex === pArray.length) && (helper)) {
      helper.addEventListener("click", showHelperQ);
      helper.classList.add("softglow");
    }
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textMidPosition.childElementCount === 0) {
    await fadeInText(p, textMidPosition);
    pIndex++;
    if ((pIndex === pArray.length) && (helper)) {
      helper.addEventListener("click", showHelperQ);
      helper.classList.add("softglow");
    }
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  } else if (textLowPosition.childElementCount === 0) {
    await fadeInText(p, textLowPosition);
    pIndex++;
    if ((pIndex === pArray.length) && (helper)) {
      helper.addEventListener("click", showHelperQ);
      helper.classList.add("softglow");
    }
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
    pIndex++;
    if ((pIndex === pArray.length) && (helper)) {
      helper.addEventListener("click", showHelperQ);
      helper.classList.add("softglow");
    }
    advanceProgressBar();
    advanceCounter();
    resizeFont();
    fadeIsRunning = false;
    return;
  }
}


/* the refactored version 
async function decidePosition(p) {
  let pInputValue = pArray.indexOf(p);
if (fadeIsRunning) {
  console.log('decidePosition stopped - race condition');
  return;
}
if (pInputValue === -1) {
  console.log('decidePosition stopped - reached end of array');
  return;
}

fadeIsRunning = true;

if (!p.textContent.trim()) {
  pIndex++;
  console.log(`p contained only white space; force page transition`);
  newPage(pArray[pIndex]);
  return;
}
  let targetElement = [textTopPosition, textMidPosition, textLowPosition].find(el => el.childElementCount === 0);

  if (targetElement) {
    await fadeInAdvanceAndResize(p, targetElement);
  } else {
    newPage(p);
}
fadeIsRunning = false;
}
async function newPage(p) {
  if (imgArray.length > 0) {
    fadeImage();
  }

  const fadePromises = [
    textTopPosition.childElementCount !== 0 ? fadeOutText(textTopPosition.firstElementChild, textTopPosition) : null,
    textMidPosition.childElementCount !== 0 ? fadeOutText(textMidPosition.firstElementChild, textMidPosition) : null,
    textLowPosition.childElementCount !== 0 ? fadeOutText(textLowPosition.firstElementChild, textLowPosition) : null
  ];

  await Promise.all(fadePromises.filter(Boolean));

  fadeInAdvanceAndResize(p, textTopPosition);
  fadeIsRunning = false;
}



async function fadeInAdvanceAndResize(p, element) {
  await fadeInText(p, element);
  pIndex++;
  advanceProgressBar();
  advanceCounter();
  resizeFont();
  if (pIndex === pArray.length) {
    helper.addEventListener("click", showHelperQ);
    helper.classList.add("softglow");
  }
}
end the refactured version */

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
  }
}
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
  advanceProgressBar();
  advanceCounter();
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
let pIndex = 0;
//define image array
let imgArray = Array.from(document.querySelectorAll(".slideImg"));


//code to start us off on load
window.onload = function () {
  decidePosition(pArray[pIndex]);
  if (imgArray.length > 0) { fadeImage() };
  document.addEventListener("click", function () { decidePosition(pArray[pIndex]) });
  if (pageIndex === 1) {
    showHelperIntro();
    setTimeout(closeHelperIntro, 8000);
  }
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

