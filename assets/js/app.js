let pattern = [];
let scorePlayer = 0;
let scoreAI = 0;
let playerChoice = 0;
let aiChoice = 0;
let gameCount = 0;
let winningMessage = '';
let winningStreak = 0;
let maxWinningStreak = 0;
let losingStreak = 0;
let maxLosingStreak = 0;

const gameArea = document.createElement('div');
gameArea.id = 'game-area';

const headerOne = document.createElement('h1');
headerOne.innerText = 'Javascript AI Rock Paper Scissors';
gameArea.append(headerOne);

const scoreBoard = document.createElement('div');
scoreBoard.id = 'score-board';

const scoreBoardPlayerP = document.createElement('p');
scoreBoardPlayerP.innerText = 'Player';
scoreBoard.append(scoreBoardPlayerP);

const playerScore = document.createElement('span');
playerScore.id = 'player-score';
playerScore.className = 'score';
playerScore.innerText = 0;
scoreBoardPlayerP.append(playerScore);

const scoreBoardAiP = document.createElement('p');
scoreBoardAiP.innerText = 'Computer';
scoreBoard.append(scoreBoardAiP);

const aiScore = document.createElement('span');
aiScore.id = 'ai-score';
aiScore.className = 'score';
aiScore.innerText = 0;
scoreBoardAiP.append(aiScore);

gameArea.append(scoreBoard);

const streakBoard = document.createElement('div');
streakBoard.id = 'streak-board';
const streakLabel = document.createElement('p');
streakLabel.innerText = 'Winning Streak';
streakBoard.append(streakLabel);

const streakCounter = document.createElement('span');
streakCounter.id = 'streak-counter';
streakCounter.className = 'score';
streakCounter.innerText = 0;
streakBoard.append(streakCounter);

const losingStreakBoard = document.createElement('div');
losingStreakBoard.id = 'losing-streak-board';
const losingStreakLabel = document.createElement('p');
losingStreakLabel.innerText = 'Losing Streak';
losingStreakBoard.append(losingStreakLabel);

const losingStreakCounter = document.createElement('span');
losingStreakCounter.id = 'losing-streak-counter';
losingStreakCounter.className = 'score';
losingStreakCounter.innerText = 0;
losingStreakBoard.append(losingStreakCounter);

gameArea.append(streakBoard, losingStreakBoard);

const playerBtnArea = document.createElement('div');
playerBtnArea.id = 'player-btn-area';
playerBtnArea.className = 'btn-area';

const playerBtnAreaHeader = document.createElement('span');
playerBtnAreaHeader.className = 'btn-header';
playerBtnAreaHeader.innerText = 'Player';
playerBtnArea.append(playerBtnAreaHeader);

const rockButton = createButton('rock', 'icon-hand-grab-o', 1);
const paperButton = createButton('paper', 'icon-hand-paper-o', 2);
const scissorsButton = createButton('scissors', 'icon-hand-scissors-o', 3);

playerBtnArea.append(rockButton, paperButton, scissorsButton);
gameArea.append(playerBtnArea);

const aiBtnArea = document.createElement('div');
aiBtnArea.id = 'ai-btn-area';
aiBtnArea.className = 'btn-area';

const aiBtnAreaHeader = document.createElement('span');
aiBtnAreaHeader.className = 'btn-header';
aiBtnAreaHeader.innerText = 'Computer';
aiBtnArea.append(aiBtnAreaHeader);

const aiRockButton = createButton('ai-rock', 'icon-hand-grab-o', 1);
const aiPaperButton = createButton('ai-paper', 'icon-hand-paper-o', 2);
const aiScissorsButton = createButton('ai-scissors', 'icon-hand-scissors-o', 3);

aiBtnArea.append(aiRockButton, aiPaperButton, aiScissorsButton);
gameArea.append(aiBtnArea);

const notification = document.createElement('div');
notification.id = 'notification';
gameArea.append(notification);

document.body.append(gameArea);

const darkModeButton = document.createElement('button');
darkModeButton.id = 'dark-mode-button';
darkModeButton.innerText = 'Toggle Dark Mode';
document.body.append(darkModeButton);

setBtnEvents();

darkModeButton.addEventListener('click', toggleDarkMode);

function createButton(id, iconClass, dataId) {
    const button = document.createElement('button');
    button.id = `${id}-button`;
    button.className = 'btn';
    button.setAttribute('data-id', dataId);

    const buttonSpan = document.createElement('span');
    buttonSpan.className = iconClass;
    button.append(buttonSpan);

    return button;
}

function setBtnEvents() {
    rockButton.addEventListener('click', playerInput);
    paperButton.addEventListener('click', playerInput);
    scissorsButton.addEventListener('click', playerInput);
}

function removeBtnEvents() {
    rockButton.removeEventListener('click', playerInput);
    paperButton.removeEventListener('click', playerInput);
    scissorsButton.removeEventListener('click', playerInput);
}

function playerInput() {
    removeBtnEvents();
    let choice = this.getAttribute('data-id');
    this.className = 'btn-active';
    playerChoice = parseInt(choice);
    playAudio(choice);
    gameCount++;
    setTimeout(aiPrediction, 2000);
    setTimeout(checkWin, 3000);
}

function playAudio(choice) {
    let audio;
    switch (choice) {
        case '1':
            audio = new Audio('Rock.mp3');
            break;
        case '2':
            audio = new Audio('Paper.mp3');
            break;
        case '3':
            audio = new Audio('Scissors.mp3');
            break;
    }
    if (audio) {
        audio.play().catch(error => console.error('Audio playback failed:', error));
    }
}

function prepareData() {
    if (pattern.length < 1) {
        for (let i = 0; i < 10; i++) {
            pattern.push(Math.floor(Math.random() * 3) + 1);
        }
    }
}

function updatePattern() {
    if (gameCount !== 0) {
        pattern.shift();
        pattern.push(playerChoice);
    }
}

function aiPrediction() {
    prepareData();
    const net = new brain.recurrent.LSTMTimeStep();
    net.train([pattern], { iterations: 100, log: false });
    const predicted = net.run(pattern);
    const roundedPredicted = Math.round(predicted);
    aiChoice = (1 <= roundedPredicted && roundedPredicted <= 3) ? (roundedPredicted % 3) + 1 : 1;
    document.getElementById('ai-' + stringOf(aiChoice) + '-button').className = 'btn-active';
    playAudio(aiChoice.toString());
    updatePattern();
}

function checkWin() {
    if (playerChoice === aiChoice) {
        winningMessage = 'Draw';
        resetStreaks();
    } else if (
        (playerChoice === 1 && aiChoice === 3) ||
        (playerChoice === 3 && aiChoice === 2) ||
        (playerChoice === 2 && aiChoice === 1)
    ) {
        winningMessage = 'You win';
        scorePlayer++;
        updateStreak(true);
        playerBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-win';
        aiBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-lose';
    } else {
        winningMessage = 'Computer wins';
        scoreAI++;
        updateStreak(false);
        aiBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-win';
        playerBtnArea.getElementsByClassName('btn-active')[0].className = 'btn-lose';
    }

    notification.innerText = winningMessage;
    playerScore.innerText = scorePlayer;
    aiScore.innerText = scoreAI;
    streakCounter.innerText = winningStreak;
    losingStreakCounter.innerText = losingStreak;

    setTimeout(function () {
        notification.innerText = '';
        if (winningMessage !== 'Draw') {
            document.getElementsByClassName('btn-win')[0].className = 'btn';
            document.getElementsByClassName('btn-lose')[0].className = 'btn';
        } else {
            document.getElementsByClassName('btn-active')[0].className = 'btn';
            document.getElementsByClassName('btn-active')[0].className = 'btn';
        }
        setBtnEvents();
    }, 1000);
}

function updateStreak(won) {
    if (won) {
        winningStreak++;
        losingStreak = 0;
        if (winningStreak > maxWinningStreak) {
            maxWinningStreak = winningStreak;
        }
    } else {
        losingStreak++;
        winningStreak = 0;
        if (losingStreak > maxLosingStreak) {
            maxLosingStreak = losingStreak;
        }
    }
}

function resetStreaks() {
    winningStreak = 0;
    losingStreak = 0;
}

function stringOf(integer) {
    return (integer === 1) ? 'rock' : ((integer === 2) ? 'paper' : ((integer === 3) ? 'scissors' : ''));
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
