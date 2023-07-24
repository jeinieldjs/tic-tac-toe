let gameBoard = document.getElementById('gameboard');
let infoDisplay = document.getElementById('infoboard');
let startingCells = ['', '', '', '', '', '', '', '', ''];
let turn = 'O';
let moveTracker = [];
infoDisplay.textContent = 'O goes first';
let gameEnds = false;

function createBoard() {
  startingCells.forEach((cell, index) => {
    const indivCell = document.createElement('div');
    indivCell.classList.add('square');
    indivCell.id = index;
    indivCell.addEventListener('click', takeTurn);
    gameBoard.append(indivCell);
  });
}

function checkForDraw() {
  const allSquares = document.querySelectorAll('.square');
  return Array.from(allSquares).every(square => square.firstChild);
}

function takeTurn(e) {
    if (gameEnds || e.target.firstChild || getWinner()) return;
  
    const gameDisplay = document.createElement('div');
    gameDisplay.classList.add(turn);
    e.target.append(gameDisplay);
  
    if (checkForDraw() && !getWinner()) {
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
    getWinner();
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
    return winner;
  }

  return null;
}

function takeTurn(e) {
  if (gameEnds || e.target.firstChild || getWinner()) return;

  const gameDisplay = document.createElement('div');
  gameDisplay.classList.add(turn);
  e.target.append(gameDisplay);

  // Update the move tracker with the current move
  const move = turn + ' placed on cell ' + e.target.id;
  moveTracker.push(move);

  if (checkForDraw() && !getWinner()) {
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
  getWinner();

  const winner = getWinner();
  if (winner) {
    infoDisplay.textContent = winner + ' wins!';
    gameEnds = true;
    removeClickListeners();
    moveTracker.push(winner + ' wins!');
  } else {
    infoDisplay.textContent = turn + "'s turn now.";
    moveTracker.push(turn + ' placed on cell ' + e.target.id);
  }

  e.target.removeEventListener('click', takeTurn);
  // Show the move tracker after the turn
  showMoveTracker();
}

function showMoveTracker() {
  const moveTrackerElement = document.getElementById('moveTracker');
  moveTrackerElement.textContent = 'Move Tracker:\n';
  moveTracker.forEach((move, index) => {
    moveTrackerElement.textContent += (index + 1) + '. ' + move + '\n';
  });
} 


function removeClickListeners() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach(square => square.removeEventListener('click', takeTurn));
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
   moveTracker = [];
  showMoveTracker();
}

createBoard();
