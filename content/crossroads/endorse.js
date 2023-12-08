const explainers = Array.from(document.querySelectorAll("#instructSide p"));
const coverImg = document.getElementById("textBoxCoverImg");
const submitSide = document.getElementById("submitSide");
const submitButton = document.getElementById("submitEndorsement");



function pageLoad() {
    console.log(`triggered pageload`);
    explainers.forEach((explainer, index) => {
        console.log(`turning on ${index} explainer`);
        const delay = index * 3000; // 3000 milliseconds (3 seconds) delay for each item

        setTimeout(() => {
            explainer.style.opacity = 1;
        }, delay);
    });
    setTimeout( () => {
        coverImg.style.opacity = "0";
        submitSide.style.opacity = "1";
    },60000);
    setTimeout( () => {coverImg.style.display="none"}, 65000);
}
pageLoad();


function startEndorsement() {
    const spinningWheel = document.querySelector('.spinningWheel');

    // Toggle the 'show' class to display/hide the spinning wheel
    spinningWheel.style.opacity = 1;

    // Simulate a time-consuming process (you can replace this with your actual function)
    setTimeout(() => {
        spinningWheel.style.opacity = 0;
        window.location.href = 'goodbyes.html';
    }, 3000); // Adjust the timeout duration according to your actual process time
}
submitButton.addEventListener("click", startEndorsement)
