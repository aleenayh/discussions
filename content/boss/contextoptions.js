const options = Array.from(document.getElementsByClassName("option"));
const topHeader = document.getElementById("contextHeader");
const topText = document.querySelectorAll(".optionsHeader>p");
const explainerSpace = document.getElementById("transientText");
const progressBar = document.getElementById("progressBar");
const elementCounterContainer = document.querySelector(".elementCounter");

function showOptions() {
    options.forEach((option, index) => {
      setTimeout(() => {
        option.style.opacity = 1;
        const text = option.querySelector("p");
        text.classList.add('intro');
        setTimeout(() => 
        {text.classList.remove('intro')}, 6000);
        advanceProgress(index);
      }, 8000 * index);
    })
  }

  function advanceProgress(index) {
    let adjustedArrayLength = options.length;
    let pDisplay = index + 1;
    let progress = (pDisplay / adjustedArrayLength) * 100;
    progressBar.style.width = progress + '%';
    elementCounterContainer.innerHTML = `${pDisplay} of ${adjustedArrayLength}`;
  }


function loadAllElements() {
   topHeader.style.opacity = 1;
   setTimeout(
    () => {
        if (topText.length <= 1) {
        topText[0].style.opacity = 1;
        }
        else {
            topText[0].style.opacity = 1;
            setTimeout(
                () => {topText[1].style.opacity = 1}, 1000);
        }
    },
    1000); 
    setTimeout(
        showOptions, 3000);
}

loadAllElements();