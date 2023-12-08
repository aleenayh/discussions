let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);

let resultTime = 45000;

const colors = ["#fc3604", "#fc5204", "#fd7707", "#fe9c0a", "#fec50a"];
const classNameToButtonIndex = {
  firstDrag: 0,
  secondDrag: 1,
  thirdDrag: 2,
  fourthDrag: 3,
  fifthDrag: 4,
};

var list = document.getElementById("spectrum");
var positions = [];
var spectrum = Sortable.create(list, {
  sort: true,
  direction: "horizontal",
  draggable: ".voteChoice",
  ghostClass: "ghostSort",
  chosenClass: "chosenSort",
  onUpdate: function (/**Event*/ evt) {
    positions = [].slice.call(list.children);
    positions.forEach(function (elem, index) {
      const color =
        colors[Math.floor(index / (positions.length / colors.length))];
      elem.style.borderColor = color;
    });
  },
});

let resultsIcons = Array.from(
  document.querySelectorAll("#spectrumResultsReturnHere .voteChoice")
);
const resultsBox = document.getElementById("spectrumResultsReturnHere");
const contextBox = document.getElementById("contextBlock");
const reflectionBox = document.getElementById("reflectionQuestion");
const cyoaResults = Array.from(document.getElementsByClassName("cyoaResult"));
const instructionBox = document.querySelector(".spectrumVote .instructionText");
const fakeTimer = document.getElementById("fakeTimer");

let minIdxValue = Infinity;
let minIdxButtonIndex;

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
      vote(pageIndex, buttonIndex, indexSum);
      votedIndices.add(buttonIndex); // Add the current button index to the set of voted indices
    }
  });
  setTimeout(getCounts,1000);
  resultsBox.style.display = "block";
  contextBox.style.display = "none";
  list.style.opacity = "0";
  instructionBox.style.opacity = "0";
  if (cyoaResults) {
    setTimeout(function () {
      reflectionBox.style.display = "block";
      cyoaResults[minIdxButtonIndex].style.display = "block";
      console.log(`buttonIndex: ${minIdxButtonIndex}`);
    }, 10000);
  } else {
    setTimeout(function () {
      reflectionBox.style.display = "block";
    }, 10000);
  }
}

function slideResults({ counts, sums }) { /*slide results into position based on averages - has overlap sometimes */
  resultsIcons.forEach((elem) => {
    const className = elem.className.split(" ")[1];
    buttonIndex = classNameToButtonIndex[className] || 0;
    const idx = sums[buttonIndex] / counts[buttonIndex];

    // Check if this idx is the smallest we've encountered - needed for cyoa results
    if (idx < minIdxValue) {
      minIdxValue = idx;
      minIdxButtonIndex = buttonIndex;
    }

    let xOffset = (idx / 5) * 85;
    elem.style.transform = `translate(${xOffset}vw)`;
  });
}

function stepResults({ counts, sums }) { /*assign results to a position based on average result - distinct steps, no overlaps */
const xOffsets = [
  0,
  18,
  35,
  53,
  70
]  
let idxValues = [];
resultsIcons.forEach((elem) => {
    const className = elem.className.split(" ")[1];
    buttonIndex = classNameToButtonIndex[className] || 0;
    const idx = sums[buttonIndex] / counts[buttonIndex];

idxValues.push( {buttonIndex, idx});
});
console.log(`idxValues: ${idxValues}`);

// Sort button indices based on idx values
idxValues.sort((a, b) => a.idx - b.idx);

minIdxButtonIndex = idxValues[0].buttonIndex; 
let secondLast = idxValues[1].buttonIndex; 
console.log(`stored x buttonIndexes as: ${minIdxButtonIndex}; ${secondLast}`);

idxValues.forEach((item, index) => {
  const { buttonIndex } = item;
  const xOffset = xOffsets[index];
  resultsIcons
    .find((elem) => classNameToButtonIndex[elem.className.split(" ")[1]] === buttonIndex)
    .style.transform = `translate(${xOffset}vw)`;
});
setTimeout(function() {
resultsIcons[minIdxButtonIndex].classList.add("xed");
resultsIcons[secondLast].classList.add("xed");
},5000);
}

function vote(pageIndex, buttonIndex, indexSum = 0) {
  fetch("/api/serverlessvote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      buttonIndex: buttonIndex,
      pageIndex: pageIndex,
      indexSum: indexSum,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function getCounts() {
  let requestPayload = JSON.stringify({ pageIndex: pageIndex });

  try {
fetch("./api/serverlesscounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestPayload,
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Response not OK");
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          stepResults(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  } catch (error) {
    console.error(error);
  }
}

function countdownToVoteEnd() {
  let remainingTime = window.remainingTime - resultTime;
  console.log(
    `remainingTime: ${remainingTime}; totalTime ${window.remainingTime} - resultTime ${resultTime}`
  );
  const intervalId = setInterval(function () {
    remainingTime -= 1000;
    if (remainingTime <= 0) {
      lockInPositions();
      fakeTimer.style.display = "none";
      clearInterval(intervalId);
    } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60)
        .toString()
        .padStart(2, "0");
      fakeTimer.innerHTML = `${minutes}:${seconds}`;
    }
  }, 1000);
}

function triggerLoad() {
  if (typeof window.remainingTime !== "undefined") {
    countdownToVoteEnd();
  } else {
    console.log(
      `didn't call check time; remainingTime: ${window.remainingTime}`
    );
    /* this line just for testing!!! */
    /*window.remainingTime = 1 * 60 * 1000;
    console.error(
      `SPOOFED TIME CHECK! COMMENT THIS LINE OUT AT END OF DRAGVOTE.JS TO RETURN TO NORMAL OPS`
    );
    /* remember to take that out after testing!!! */
    setTimeout(triggerLoad, 500);
  }
}
triggerLoad();
