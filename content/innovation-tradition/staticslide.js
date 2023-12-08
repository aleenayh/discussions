let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);

const slides = Array.from(document.getElementsByClassName("slidesets"));

let textTopPosition = slides[pageIndex].querySelector(".textOne");
let textMidPosition = slides[pageIndex].querySelector(".textTwo");
let textLowPosition = slides[pageIndex].querySelector(".textThree");
const allslides = [textTopPosition, textMidPosition, textLowPosition];
let textTop = textTopPosition.innerHTML;
let textMid = textMidPosition.innerHTML;
let textLow = textLowPosition.innerHTML;


function chooseScenario() {
  if(pageIndex < slides.length) { // Check if index is within the range of the array
    slides[pageIndex].style.display ="flex";

    console.log(`scenario switched to index: ${pageIndex}`)
  } else {
    console.log(`Index out of range. Length of slides: ${slides.length}, Given index: ${pageIndex}`);
  }
}



async function fadeInText(box) {
    return new Promise((resolve) => {
      let opacity = 0;
      box.style.opacity = opacity;
      const interval = setInterval(() => {
        box.style.opacity = opacity;
        if (opacity < 1) {
          opacity += 0.01;
          box.style.opacity = opacity;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    }
    )
  }

document.addEventListener('DOMContentLoaded', (event) => {
    pageLoad();
});

async function pageLoad() {
  chooseScenario();
  await fadeInText(textTopPosition);
  await fadeInText(textMidPosition);
  await fadeInText(textLowPosition);
  fadeInText
}

function resizeFont() {
    allslides.forEach(container => {
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