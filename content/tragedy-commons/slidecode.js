//pull params
let url = new URL(window.location.href);
let index = url.searchParams.get("index");
index = Number(index);
console.log(`fetched index: ${index}`);

//define slide containers
let textTopPosition = document.getElementById("textOne");
let textMidPosition = document.getElementById("textTwo");
let textLowPosition = document.getElementById("textThree");
let imagePosition = document.querySelector(".imagePosition");
let container = document.getElementById("container");
const progressBar = document.getElementById("progressBar");

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

function fadeInDirection(string, textBox) {
  if (pArray.length <= 3) {
    return;
  }  else {
  let opacity = 0;
    textExtraPosition.style.opacity = opacity;
    const interval = setInterval(() => {
      textExtraPosition.style.opacity = opacity;
      if (opacity < 1) {
        opacity += 0.01;
        textExtraPosition.style.opacity = opacity;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }}

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

/* not using TypeText function right now
function typeText(string) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < string.length) {
      console.log(string[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}
*/

/*not using SlideText function right now
function slideUp(toTop,toMid,toLow) {
  return new Promise((resolve) => {
    var destinationTop = 0;
    var destinationMid = 181;
    var destinationLow = 363;
    const increment = 1;
    let startToTop = 179;
    let startToMid = 363;
    let startToLow = 545;
    let positionToTop = 0;
    let positionToMid = 0;
    let positionToLow = 0;
    console.log("TOP: from "+positionToTop+" to "+destinationTop);
    console.log("MID: from "+positionToMid+" to "+destinationMid);
    console.log("LOW: from "+positionToLow+" to "+destinationLow);

    const intervalToTop = setInterval(() => {
      if (startToTop > destinationTop) {
        positionToTop += increment;
        toTop.style.transform = `translateY(-${positionToTop}px)`;
        startToTop -= increment;
      } else {
        clearInterval(intervalToTop);
        if (textTwoPosition.contains(toTop)) {
          textOnePosition.appendChild(toTop);
          toTop.style.transform = "none";
        }
      }
    }, 100);

        const intervalToMid = setInterval(() => {
      if (startToMid > destinationMid) {
        positionToMid += increment;
        toMid.style.transform = `translateY(-${positionToMid}px)`;
        startToMid -= increment;
      } else {
        clearInterval(intervalToMid);
        if (textThreePosition.contains(toMid)) {
          textTwoPosition.appendChild(toMid);
          toMid.style.transform = "none";
        }
      }
    }, 100);

        const intervalToLow = setInterval(() => {
      if (startToLow > destinationLow) {
        positionToLow += increment;
        toLow.style.transform = `translateY(-${positionToLow}px)`;
        startToLow -= increment;
      } else {
        clearInterval(intervalToLow);
        if (textFourPosition.contains(toLow)) {
          textThreePosition.appendChild(toLow);
          toLow.style.transform = "none";
        }
      }
          resolve();
    }, 100);
  });
}
*/

let fadeIsRunning = false;
async function decidePosition(p) {
  if (fadeIsRunning) {
    console.log('decidePosition stopped - race condition');
    return;
  }
  fadeIsRunning = true;
  if (textTopPosition.childElementCount === 0) {
    await fadeInText(p, textTopPosition);
    pIndex++;
    advanceProgressBar();
    if (pIndex === pArray.length) {
      pIndex = 0;
      imgIndex = 0;
    }
    if ((pIndex === 0)&&(imgArray.length >0)) {
      resetImage();
    }
    fadeIsRunning = false;
    return;
  } else if (textMidPosition.childElementCount === 0) {
    await fadeInText(p, textMidPosition);
    pIndex++;
    advanceProgressBar();
    if (pIndex === pArray.length) {
      pIndex = 0;
      imgIndex = 0;
    }
    if (pIndex === 0) {
      resetImage();
    }
    fadeIsRunning = false;
    return;
  } else if (textLowPosition.childElementCount === 0) {
    await fadeInText(p, textLowPosition);
    pIndex++;
    advanceProgressBar();
    if (pIndex === pArray.length) {
      pIndex = 0;
      imgIndex = 0;
    }
    if ((pIndex === 0)&&(imgArray.length >0)) {
      resetImage();
    }
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
    fadeIsRunning = false;
    return;
  }


function resetImage() {
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
  let opacity = 1;
  const oldImage = imagePosition.firstChild;
  const newImageIndex = imgArray.indexOf(oldImage) + 1;
  const newImage = imgArray[newImageIndex];


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
function advanceProgressBar() {
  let progress = (pIndex / pArray.length) * 100;
  progressBar.style.width = progress + '%';
}

//define text array
let pArray = Array.from(document.querySelectorAll("p"));
let pIndex = 0;
//define image array
let imgIndex = 0;
let imgArray = Array.from(document.querySelectorAll(".slidesets img"));


//code to start us off on load
window.onload = function () {
  decidePosition(pArray[pIndex]);
  if (imgArray.length > 0) {fadeImage()};
  document.addEventListener("click", function () { decidePosition(pArray[pIndex]) });
  container.style.display = "block";
};