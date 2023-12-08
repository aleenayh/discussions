const options = Array.from(document.getElementsByClassName("option"));
const pins = Array.from(document.getElementsByClassName("pin"));
const textInputs = Array.from(document.querySelectorAll(".inputWrapper>textarea"));
const contexts = Array.from(document.querySelectorAll(".optionContext"));
const topHeader = document.getElementById("contextHeader");
const topText = document.querySelector(".optionsHeader>p");
const explainerSpace = document.getElementById("transientText");
const explainers = Array.from(document.querySelectorAll("#transientText>p"));
const progressBar = document.getElementById("progressBar");
const elementCounterContainer = document.querySelector(".elementCounter");

function showOptions() {
  let timeoutDuration = 8000;
  if (contexts.length === 0) {
    timeoutDuration = 2000;
  }
  options.forEach((option, index) => {
    setTimeout(() => {
      option.style.opacity = "1";

      if (contexts[index]) {
        contexts[index].style.opacity = "1";
        setTimeout(() => {
          contexts[index].style.opacity = "";
        }, 6000);
      }

      advanceProgress(index);
    }, timeoutDuration * index);

    if (textInputs.length > 0) {
      setTimeout(() => {
        const instruction = document.querySelector("p.instruction");
        if (instruction) {instruction.style.opacity = "1";}
        textInputs.forEach((input) => {
          input.style.opacity = "1";
        });
      }, timeoutDuration * (textInputs.length));
    }
  });
}

function advanceProgress(index) {
  let adjustedArrayLength = options.length;
  let pDisplay = index + 1;
  let progress = (pDisplay / adjustedArrayLength) * 100;
  progressBar.style.width = progress + "%";
  elementCounterContainer.innerHTML = `${pDisplay} of ${adjustedArrayLength}`;
}

function rotateExplainers(i) {
  explainers.forEach(explainer => {explainer.style.display = "none"});
  explainers[i].style.display = "block";
  i++;
  setTimeout( () => {rotateExplainers(i)}, 45000);
}

function fadeInPins() {
  pins.forEach((pin, index) => {
    setTimeout(() => {
      pin.style.opacity = 1;
      const title = pin.querySelector("h");
      title.style.opacity = "1";
      title.style.color = "#fc5204";
      title.style.fontSize = "100%";
      setTimeout(() => {
        title.style.color = "";
        title.style.fontSize = "";
      }, 2000);
    }, 3000 * index);
  });
}
function clickPin(i) {
  pins.forEach((pin) => {
    const title = pin.querySelector("h");
    const detail = pin.querySelector("p");
    title.style.color = "";
    title.style.fontSize = "80%";
    detail.style.opacity = "0";
  });
  const title = pins[i].querySelector("h");
  const detail = pins[i].querySelector("p");
  title.style.color = "#fc5204";
  title.style.fontSize = "100%";
  detail.style.opacity = "1";
}
pins.forEach((pin, index) => {
  pin.addEventListener("click", () => {
    clickPin(index);
  });
});

if (textInputs) {
  textInputs.forEach((input, i) => {
    input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const box = options[i].querySelector(".studentNotes");
        const newP = document.createElement("p");
        const clearButton = document.createElement("button");
        clearButton.classList.add("clearNote");
        clearButton.setAttribute("onclick", "eraseNote(this)"); // Attach onclick attribute
        clearButton.textContent = 'x';
        newP.textContent = input.value;
        newP.appendChild(clearButton);
        box.appendChild(newP);
        box.style.opacity = "1";
        input.value = "";
      }
    });
  });
}
function eraseNote(button) {
  const parentP = button.closest('p');
  const studentNotes = button.closest('.studentNotes');

  // Set the display property to 'none'
  if (parentP) {
    parentP.remove();
  };
  //check if all ps gone
  if (studentNotes && studentNotes.children.length === 0) {
    studentNotes.style.opacity = "0";
  }

}

function loadAllElements() {
  topHeader.style.opacity = 1;
  setTimeout(() => {
    if (topText) {
      topText.style.opacity = 1;
    }
  }, 1000);
  if (options) {
    setTimeout(showOptions, 3000);
  }
  if (pins) {
    fadeInPins();
  }
    if (explainers.length > 0) {
    setTimeout( () => {rotateExplainers(0)}, 62000)
    }
}

loadAllElements();
