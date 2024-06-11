const currentPlaceElement = document.getElementById('current-place');
const userInput = document.getElementById('user-input');
const submitButton = document.getElementById('submit-button');
const messageElement = document.getElementById('message');
const timerElement = document.getElementById('timer');

let places = [];
let timer;
let timerInterval;

async function fetchPlaces() {
    const response = await fetch('places.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.places; // Adjusted according to the JSON structure you provided earlier
}

function getRandomPlace() {
    return places[Math.floor(Math.random() * places.length)];
}

function isValidPlace(place) {
    return places.some(p => p.toLowerCase() === place.toLowerCase());
}

function getNextPlaceStartingWith(letter) {
    for (let place of places) {
        if (place[0].toLowerCase() === letter.toLowerCase()) {
            return place;
        }
    }
    return null;
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 30;
    timerElement.textContent = timer;
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            messageElement.textContent = 'Time\'s up! You didn\'t enter a valid place in time.';
            userInput.disabled = true;
        }
    }, 1000);
}

async function initializeGame() {
    try {
        places = await fetchPlaces();
        let currentPlace = getRandomPlace();
        currentPlaceElement.textContent = currentPlace;
        startTimer();

        submitButton.addEventListener('click', () => {
            const userPlace = userInput.value.trim();
            if (isValidPlace(userPlace)) {
                const lastLetter = userPlace.slice(-1).toLowerCase(); // Updated to use userPlace's last letter
                const nextPlace = getNextPlaceStartingWith(lastLetter);
                if (nextPlace) {
                    currentPlace = nextPlace;
                    currentPlaceElement.textContent = currentPlace;
                    userInput.value = '';
                    messageElement.textContent = '';
                    startTimer(); // Reset the timer
                } else {
                    messageElement.textContent = 'No place found starting with "' + lastLetter.toUpperCase() + '".';
                }
            } else {
                messageElement.textContent = '"' + userPlace + '" is not a city in India.';
            }
        });
    } catch (error) {
        console.error('Error fetching places:', error);
        messageElement.textContent = 'Error fetching places. Please try again later.';
    }
}

// Initialize the game
initializeGame();
