const closeButtons = Array.from(document.querySelectorAll(".closeBubble"));
const bubbles = Array.from(document.querySelectorAll(".speechBubble"));
const characters = Array.from(document.querySelectorAll("div.character"));

closeButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
        bubbles[index].style.display = "none";
    })
});

characters.forEach((character, index) => {
    character.addEventListener("click", function () {
        console.log(`index read: ${index}`);
        bubbles[index].style.display = "block";
    });
});