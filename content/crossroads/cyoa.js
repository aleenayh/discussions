const choices = Array.from(document.getElementsByClassName("voteChoice"));
const fundsBox = document.getElementById("funds");
const costs = [50, 55, 25, 75, 45, 25, 15];
const risks = [0.48, 0.3, 0.27,0.72, 0.48, 0.2, 0.32];
const submitButton = document.getElementById("lockIn");
const results = Array.from(document.querySelectorAll(".hqResults>p"));
let numberClicked = 0;
let funds = 100;
const spinningWheel = Array.from(document.getElementsByClassName("spinningWheel"));

function clickChoice(i) {
  if (choices[i].classList.contains("highlight-button")) {
    choices[i].classList.remove("highlight-button");
    funds += costs[i];
    fundsBox.innerHTML = funds;
    numberClicked--;
    return;
  } else if (numberClicked >= 2) {
    shakeButton(i);
    return;
  } else if (costs[i] > funds) {
    shakeButton(i);
    return;
  } else {
    choices[i].classList.add("highlight-button");
    funds -= costs[i];
    fundsBox.innerHTML = funds;
    numberClicked++;
  }
}
choices.forEach((choice, index) => {
  choice.addEventListener("click", () => {
    clickChoice(index);
  });
});

function shakeButton(i) {
  choices[i].classList.add("shake");
  setTimeout(() => {
    choices[i].classList.remove("shake");
  }, 500);
}
function evaluate() {
  let riskSum = 0;
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (choice.classList.contains("highlight-button")) {
        console.log(`added ${risks[i]} to ${riskSum}`);
        riskSum += risks[i];
    }
  }
  const randomNumber = Math.random();
  const playerWins = riskSum > randomNumber;
  console.log(`${randomNumber} roll compared to ${riskSum} - player wins ${playerWins}`)
  return playerWins;
}
function submit() {
    if (numberClicked <= 1) {
        submitButton.classList.add("shake");
        setTimeout(() => {
            submitButton.classList.remove("shake");
          }, 500);
          return;
    }
    const playerWins = evaluate();
    spinningWheel[0].style.opacity = "1";
    submitButton.style.display = "none";
    choices.forEach(choice => {choice.disabled = true;})
    setTimeout( () => {
        spinningWheel[0].style.opacity = "0";   
    if (playerWins) {
        results[0].style.display = "block";
    } else {
        results[1].style.display = "block";
    }},
    5000)
}
submitButton.addEventListener("click", submit);