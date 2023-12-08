
let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);

let resultTime = 30000;


const colors = ["#fc3604", "#fc5204", "#fd7707", "#fe9c0a", "#fec50a"];
const classNameToButtonIndex = {
  "firstDrag": 0,
  "secondDrag": 1,
  "thirdDrag": 2,
  "fourthDrag": 3,
  "fifthDrag": 4,
};

var list = document.getElementById("spectrum");
var positions = [];
var spectrum = Sortable.create(list, {
  sort: true,
  direction: 'horizontal',
  draggable: '.voteChoice',
  ghostClass: "ghostSort",
  chosenClass: "chosenSort",
  onUpdate: function (/**Event*/evt) {
    positions = [].slice.call(list.children);
    positions.forEach(function(elem, index) {
      const color = colors[Math.floor(index/(positions.length/colors.length))];
      elem.style.borderColor = color;
    });
  }
});

let resultsIcons = Array.from(document.querySelectorAll("#spectrumResultsReturnHere .voteChoice"));
const resultsBox = document.getElementById("spectrumResultsReturnHere");
const contextBox = document.getElementById("contextBlock");
const reflectionBox = document.getElementById("reflectionQuestion");
const instructionBox = document.querySelector(".spectrumVote .instructionText");
const fakeTimer = document.getElementById("fakeTimer");

function lockInPositions() {
  const classIndices = {};
  let indexSum = 0;
  let votedIndices = new Set(); // Create an empty set to keep track of voted button indices
  positions.forEach((elem, index) => {
    const className = elem.className.split(" ")[1]; // get class name (assumes it's always the second class)
    indexSum = index;
    buttonIndex = classNameToButtonIndex[className] || 0;
    // Check if the current button index has not been voted yet
    if (!votedIndices.has(buttonIndex)) {
      vote(pageIndex,buttonIndex,indexSum);
      votedIndices.add(buttonIndex); // Add the current button index to the set of voted indices
    }
  });
  if (!positions || !positions.length) {
    vote(pageIndex,0,2); //trigger fetch call even if student did not vote
  }

  let xOffsetValues = []; // Array to hold xOffset values
  resultsIcons.forEach(elem => {
    const className = elem.className.split(" ")[1];
    const idx = classIndices[className];
    let xOffset = (idx / 5) * 85;
    xOffsetValues.push({ elem, xOffset }); // Push element and xOffset value to the array
  });

  // Now, we sort xOffsetValues by xOffset
xOffsetValues.sort((a, b) => a.xOffset - b.xOffset);
  for(let i = 1; i < xOffsetValues.length; i++) { // Start from the second element
    if(Math.abs(xOffsetValues[i].xOffset - xOffsetValues[i-1].xOffset) <= 5) {
      xOffsetValues[i].xOffset += 4; // Add 4 for the current element
      console.log(`added 4 offset to ${xOffsetValues[i]}.elem`);
    }
  }
  xOffsetValues.forEach(({ elem, xOffset }) => {
    elem.style.transform = `translateX(${xOffset}vw)`; // Apply the possibly adjusted xOffset value
  });
  resultsBox.style.display="block";
  contextBox.style.display="none";
  list.style.opacity="0";
  instructionBox.style.opacity="0";
  setTimeout(function() {
    reflectionBox.style.display="block";
  }, 10000);
  

}

function showResults({counts, sums}) {
  resultsIcons.forEach(elem => {
    const className = elem.className.split(" ")[1];
    buttonIndex = classNameToButtonIndex[className] || 0;
    const idx = (sums[buttonIndex]/counts[buttonIndex]);
    let xOffset = (idx / 5) * 85;
    elem.style.transform = `translate(${xOffset}vw)`;
  });
}

function vote(pageIndex, buttonIndex, indexSum = 0) {
  fetch('/api/serverlessvote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ buttonIndex: buttonIndex, pageIndex: pageIndex, indexSum: indexSum })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Count update received:', data);
    showResults(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function countdownToVoteEnd() {
  let remainingTime = (window.remainingTime - resultTime);
  console.log(`remainingTime: ${remainingTime}; totalTime ${window.remainingTime} - resultTime ${resultTime}`)
  const intervalId = setInterval(function() {
  remainingTime -= 1000;
  if (remainingTime <= 0) {
    lockInPositions();
    fakeTimer.style.display="none";
    clearInterval(intervalId);
  } else {
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60).toString().padStart(2, "0");
      fakeTimer.innerHTML = `${minutes}:${seconds}`;
}},1000)
}




function triggerLoad() {
  if (typeof window.remainingTime !== 'undefined') {
    countdownToVoteEnd();
  } else {
    console.log(`didn't call check time; remainingTime: ${window.remainingTime}`);
    /* this line just for testing!!! */
    /* window.remainingTime = 1.5 * 60 * 1000; */
    /* remember to take that out after testing!!! */
    setTimeout(triggerLoad, 500);
  }
}
triggerLoad();