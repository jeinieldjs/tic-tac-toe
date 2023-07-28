let gameBoard = document.getElementById('gameboard');
let infoDisplay = document.getElementById('infoboard');
let startingCells = ['', '', '', '', '', '', '', '', ''];
let turn = 'O';
infoDisplay.textContent = 'O goes first';
let gameEnds = false;
let playerXScore = 0; // scoreboard
let playerOScore = 0; // scoreboard
let gameStates = [];
let currentStateIndex = 0; // Keep track of the current state index

function saveGameState() {
  const currentState = Array.from(document.querySelectorAll('.square')).map(square => square.firstChild?.classList.value || '');
  gameStates = gameStates.slice(0, currentStateIndex + 1); // Truncate the array to remove future states
  gameStates.push(currentState);
  currentStateIndex = gameStates.length - 1;
}

function navigateHistory(action) {
    if (action === 'prev') {
      if (currentStateIndex > 0) {
        currentStateIndex--;
        updateGameBoard(gameStates[currentStateIndex]);
        addClickListeners(); // Re-add click listeners after going back
      }
    } else if (action === 'next') {
      if (currentStateIndex < gameStates.length - 1) {
        currentStateIndex++;
        updateGameBoard(gameStates[currentStateIndex]);
        removeClickListeners(); // Remove click listeners when going forward
      }
    }
  }

function addClickListeners() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.addEventListener('click', takeTurn));
  }

function updateGameBoard(state) {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square, index) => {
      square.textContent = '';
      if (state[index] === 'O' || state[index] === 'X') {
        const gameDisplay = document.createElement('div');
        gameDisplay.classList.add(state[index]);
        square.append(gameDisplay);
      }
    });
  }


function createBoard() {
    startingCells.forEach((cell, index) => {
      const indivCell = document.createElement('div');
      indivCell.classList.add('square');
      indivCell.id = index;
      indivCell.addEventListener('click', takeTurn);
      gameBoard.append(indivCell);
    });
  
    // Initialize the history log
    updateHistoryLog();
  }


function checkForDraw() {
    const allSquares = document.querySelectorAll('.square');
    return Array.from(allSquares).every(square => square.firstChild);
  }

  
function updateScoreboard() { // added
    const playerXScoreElement = document.getElementById('player-x-score'); // added
    const playerOScoreElement = document.getElementById('player-o-score'); // added
    playerXScoreElement.textContent = `Player X: ${playerXScore}`; // added 
    playerOScoreElement.textContent = `Player O: ${playerOScore}`; // added
  }


function takeTurn(e) {
    if (gameEnds || e.target.firstChild || getWinner()) return;
  
    const cellIndex = e.target.id;
    const currentPlayer = turn === 'O' ? 'Player O' : 'Player X';
  
    const gameDisplay = document.createElement('div');
    gameDisplay.classList.add(turn);
    e.target.append(gameDisplay);
    saveGameState();
  
    if (currentStateIndex === 0) {
      // Add the initial state to gameStates at move 1
      const initialGameState = Array.from(document.querySelectorAll('.square')).map(square => square.firstChild?.classList.value || '');
      gameStates.push(initialGameState);
    }
  
    if (getWinner()) { // Check for the winner after updating the turn
      if (turn === 'X') {
        playerXScore++;
      } else if (turn === 'O') {
        playerOScore++;
      }
      updateScoreboard();
      return; // Return early after updating the scoreboard
    }
  
    if (checkForDraw()) {
      infoDisplay.textContent = "It's a draw!";
      gameEnds = true;
      removeClickListeners();
      return;
    }
  
    if (turn === 'O') {
      turn = 'X';
    } else {
      turn = 'O';
    }
    infoDisplay.textContent = turn + "'s turn now.";
  
    e.target.removeEventListener('click', takeTurn);
  
    // Add the move to the history log
    const historyLog = document.getElementById('history');
    const moveNumber = currentStateIndex;
    const moveText = `${currentPlayer} moves to cell ${cellIndex}`;
    const moveLog = document.createElement('p');
    moveLog.textContent = `Move ${moveNumber}: ${moveText}`;
    historyLog.appendChild(moveLog);
  }

function getWinner() {
    const allSquares = document.querySelectorAll('.square');
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
  
    let winner = null;
  
    for (const array of winningCombinations) {
      const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('O'));
      if (circleWins) {
        winner = 'O';
        break;
      }
  
      const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('X'));
      if (crossWins) {
        winner = 'X';
        break;
      }
    }
  
    if (winner) {
      infoDisplay.textContent = winner + ' wins!';
      return true;
    }
  
    return false;
  }
  
function removeClickListeners() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.removeEventListener('click', takeTurn));
  }
  
function updateHistoryLog() {
    const historyLog = document.getElementById('history');
    historyLog.innerHTML = '';
  
    gameStates.forEach((state, index) => {
      const moveNumber = index + 1;
      const moveText = state.join('');
      const moveLog = document.createElement('p');
      moveLog.textContent = `Move ${moveNumber}: ${moveText}`;
      historyLog.appendChild(moveLog);
    });
  }

const resetButton = document.createElement('button');
resetButton.textContent = 'RESET';
resetButton.setAttribute('id', 'reset-button')
resetButton.addEventListener('click', resetGame);
document.body.appendChild(resetButton);

function resetGame() {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => square.textContent = '');
    turn = 'O';
    infoDisplay.textContent = 'O goes first';
    gameEnds = false;
    allSquares.forEach(square => square.addEventListener('click', takeTurn));
  
    // Clear the history log
    const historyLog = document.getElementById('history');
    historyLog.innerHTML = '';
  
    // Clear all the game states and reset the current state index
    gameStates = [];
    currentStateIndex = 0;
  
    // Add the initial state to gameStates at move 1
    const initialGameState = Array.from(document.querySelectorAll('.square')).map(square => square.firstChild?.classList.value || '');
    gameStates.push(initialGameState);
  }

createBoard();


const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => navigateHistory('prev'));
nextButton.addEventListener('click', () => navigateHistory('next'));
