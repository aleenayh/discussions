const explainers = Array.from(document.querySelectorAll(".instructSide p"));
const coverImg = document.getElementById("textBoxCoverImg");
const submitButton = document.getElementById("submitEndorsement");



function pageLoad() {
    explainers.forEach((explainer, index) => {
        const delay = index * 3000; // 3000 milliseconds (3 seconds) delay for each item

        // Set opacity to 1 with delay
        setTimeout(() => {
            explainer.style.opacity = 1;
        }, delay);
    });
    setTimeout( () => {coverImg.style.opacity = "0"},60000);
    setTimeout( () => {coverImg.style.display="none"}, 65000);
}
pageLoad();


function startEndorsement() {
    const spinningWheel = document.querySelector('.spinningWheel');

    spinningWheel.style.opacity = 1;

    const input = document.getElementById('endorsementField').value;
    submit(input);
    /* can try this out again soon but right now it's not happening~ */
    // Simulate a time-consuming process 
    setTimeout(() => {
        spinningWheel.style.opacity = 0;
        window.location.href = 'goodbyes.html';
    }, 10000); // Adjust the timeout duration according to your actual process time
}
function submit(msg) {
    fetch("/api/endorsements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({msg}),
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




submitButton.addEventListener("click", startEndorsement)
