const containers = Array.from(document.querySelectorAll('.container'));
let url = new URL(window.location.href);
let index;
try {
    index = url.searchParams.get("index");
} catch (error) {
    index = 0;
}
console.log(`fetched index: ${index}`);

function chooseScenario() {
  if(index < containers.length) { // Check if index is within the range of the array
    containers[index].style.display ="block"; // Ensure that the elements are hidden initially
    console.log(`scenario switched to index: ${index}`)
  } else {
    console.log(`Index out of range. Length of containers: ${containers.length}, Given index: ${index}`);
  }
}
chooseScenario();

//definitions for arrays
const closeButton = document.querySelectorAll(".closeBubble");
const speechBubbles = Array.from(document.getElementsByClassName("speechBubble"));
let firstQuestionAnswers = [];
let secondQuestionAnswers = [];
let thirdQuestionAnswers = [];
let firstQuestionButton = null;
let secondQuestionButton = null;
let thirdQuestionButton = null;
if(containers[index]){
  firstQuestionAnswers = Array.from(containers[index].getElementsByClassName("qa1"));
  secondQuestionAnswers = Array.from(containers[index].getElementsByClassName("qa2"));
  thirdQuestionAnswers = Array.from(containers[index].getElementsByClassName("qa3"));
  firstQuestionButton = containers[index].querySelector(".q1");
  secondQuestionButton = containers[index].querySelector(".q2");
  thirdQuestionButton = containers[index].querySelector(".q3");
}


function closeBubble(event) {
  event.target.parentNode.style.opacity = "0";
}
closeButton.forEach(function(button) {
  button.addEventListener("click", closeBubble);
});

function resetBubbles() {
  speechBubbles.forEach(function(bubble) {
    bubble.style.opacity = "1";
    bubble.style.display = "block";
  })
}


function firstAnswers() {
  firstQuestionAnswers.forEach(function(answer) {
    answer.style.display = "block";
  });
  secondQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  thirdQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  resetBubbles();
}
function secondAnswers() {
  secondQuestionAnswers.forEach(function(answer) {
    answer.style.display = "block";
  });
  firstQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  thirdQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  resetBubbles();
}
function thirdAnswers() {
  thirdQuestionAnswers.forEach(function(answer) {
    answer.style.display = "block";
  });
  firstQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  secondQuestionAnswers.forEach(function(answer) {
    answer.style.display = "none";
  });
  resetBubbles();
}
if(firstQuestionButton){
  firstQuestionButton.addEventListener("click", firstAnswers);
}
if(secondQuestionButton){
  secondQuestionButton.addEventListener("click", secondAnswers);
}
if(thirdQuestionButton){
  thirdQuestionButton.addEventListener("click", thirdAnswers);
}

