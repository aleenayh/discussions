let url = new URL(window.location.href);
let pageIndex = url.searchParams.get("index");
pageIndex = Number(pageIndex);
console.log(`fetched index: ${pageIndex}`);

let buttons = Array.from(document.getElementsByClassName('voteChoice'));

function vote(oldButtonIndex, buttonIndex, pageIndex) {
    fetch('/api/fluid-vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldButtonIndex: oldButtonIndex, buttonIndex: buttonIndex, pageIndex: pageIndex })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Count update received:', data);
            updateBars(data);
            getCounts();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getCounts() {
    let requestPayload = JSON.stringify({ pageIndex: pageIndex });
    try {
        setInterval(function () {
            fetch('./api/serverlesscounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestPayload
        })
            .then(response => {
                if (!response.ok) {
                    console.log('Response not OK');
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                updateBars(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }, 2000); //every 2 seconds
    } catch (error) {
        console.error(error);
    }
}

function updateBars(data) {
    let totalVotes = data[0] + data[1];

    let resultLeft = document.getElementById("leftVote");
    let resultRight = document.getElementById("rightVote");
    resultLeft.style.opacity = "1";
    resultRight.style.opacity = "1";

    let percentageLeft = (data[0] / totalVotes) * 100;
    let percentageRight = (data[1] / totalVotes) * 100;
    let barRight = 100 - percentageLeft.toFixed(0);

    resultLeft.style.width = `${percentageLeft.toFixed(0)}%`;
    resultRight.style.width = `${barRight}%`;
    console.log(`result width adjusted: ${resultLeft.style.width} / ${resultRight.style.width}`)

    resultLeft.innerHTML = `${percentageLeft.toFixed(0)}%`;
    resultRight.innerHTML = `${percentageRight.toFixed(0)}%`;
    return;
}

let oldButtonIndex = -1;
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        let oldButtonIndex = buttons.findIndex(button => button.classList.contains('highlight-button'));
        vote(oldButtonIndex, i, pageIndex);
        // disable all buttons and highlight the selected button
        buttons.forEach((button, index) => {
            button.classList.remove('highlight-button');
            button.disabled = false;
            if (index === i) {
                button.disabled = true;
                button.classList.add('highlight-button');
            }
        });
    })
};