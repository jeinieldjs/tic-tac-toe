let gameBoard = document.getElementById('gameboard');
let infoDisplay = document.getElementById('infoboard');
let startingCells = ['', '', '', '', '', '', '', '', ''];
let turn = 'X'; 
infoDisplay.textContent = 'X goes first'; 
let gameEnds = false;
let moveHistory = [];
let currentMoveIndex = -1;
let playerXScore = 0;
let playerOScore = 0;


let controlContainer = document.getElementById('controls');
let prevButton = document.createElement('button');
prevButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
let nextButton = document.createElement('button');
nextButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
controlContainer.appendChild(prevButton);
controlContainer.appendChild(nextButton);
prevButton.setAttribute('class', 'control-buttons');
nextButton.setAttribute('class', 'control-buttons');
controlContainer.style.visibility = 'hidden';

let resetButton = document.createElement('button');
resetButton.textContent = 'RESET';
resetButton.setAttribute('id', 'reset-button');
resetButton.addEventListener('click', resetGame);
document.body.appendChild(resetButton);

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
    gameBoard.classList.add('blink-white');
    controlContainer.style.visibility = 'visible';
    removeClickListeners();
  } else {
    turn = turn === 'O' ? 'X' : 'O'; 
    infoDisplay.textContent = turn + "'s turn now.";
  }

  const winner = getWinner(); // Get the winner after each turn

  if (winner) {
    infoDisplay.textContent = winner + ' wins!';
    gameEnds = true;
    gameBoard.classList.remove('blink-orange');
    gameBoard.classList.remove('blink-yellow');
    gameBoard.classList.add(winner === 'O' ? 'blink-orange' : 'blink-yellow'); 
    controlContainer.style.visibility = 'visible';
    removeClickListeners();

    // Update the scores here
    if (winner === 'O') {
      playerOScore++;
    } else {
      playerXScore++;
    }
    updateScore();
  }

  e.target.removeEventListener('click', takeTurn);
  const position = parseInt(e.target.id);
  moveHistory.push(position);
  currentMoveIndex = moveHistory.length - 1;
  updateButtons();
}

function updateScore() {
  const playerXScoreDisplay = document.getElementById('playerX-score');
  const playerOScoreDisplay = document.getElementById('playerO-score');
  playerXScoreDisplay.textContent = `Player X: ${playerXScore}`;
  playerOScoreDisplay.textContent = `Player O: ${playerOScore}`;
}

function resetScore() {
  playerXScore = 0;
  playerOScore = 0;
  updateScore();
}

function getWinner() {
  const allSquares = document.querySelectorAll('.square');
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  let winner = null;

  for (const array of winningCombinations) {
    const crossWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('X'));
    if (crossWins) {
      winner = 'X';
      break;
    }

    const circleWins = array.every(cell => allSquares[cell].firstChild?.classList.contains('O'));
    if (circleWins) {
      winner = 'O';
      break;
    }
  }

  if (winner) {
    infoDisplay.textContent = winner + ' wins!';
    gameEnds = true;
    gameBoard.classList.remove('blink-orange');
    gameBoard.classList.remove('blink-yellow');
    gameBoard.classList.add(winner === 'O' ? 'blink-orange' : 'blink-yellow'); 
    controlContainer.style.visibility = 'visible';
    removeClickListeners();
  }

  return winner; // Return the winner, not gameEnds
}

function removeClickListeners() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach(square => square.removeEventListener('click', takeTurn));
}

function clearBoard() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach(square => square.textContent = '');
}

function updateButtons() {
  prevButton.disabled = currentMoveIndex <= -1;
  nextButton.disabled = currentMoveIndex >= moveHistory.length - 1;
}

function applyMoveFromHistory() {
  clearBoard();
  const allSquares = document.querySelectorAll('.square');
  moveHistory.slice(0, currentMoveIndex + 1 ).forEach((position, index) => {
    const player = index % 2 === 0 ? 'X' : 'O';
    const gameDisplay = document.createElement('div');
    gameDisplay.classList.add(player);
    allSquares[position].appendChild(gameDisplay);
  });
  turn = currentMoveIndex % 2 === 0 ? 'X' : 'O'; 
  if (currentMoveIndex === moveHistory.length - 1) {
    infoDisplay.textContent = getWinner() ? `${turn} wins!` : "It's a draw!";
  } else {
    infoDisplay.textContent = `Move ${currentMoveIndex + 1}/${moveHistory.length} - ${turn}'s turn.`;
  }
  getWinner();
  updateButtons();
}

function showPreviousMove() {
  if (currentMoveIndex >= 1) {
    currentMoveIndex--;
    applyMoveFromHistory();
    gameBoard.classList.remove('blink-orange');
    gameBoard.classList.remove('blink-yellow');
    gameBoard.classList.remove('blink-white');
  }
}

function showNextMove() {
  if (currentMoveIndex < moveHistory.length - 1) {
    currentMoveIndex++;
    applyMoveFromHistory();
    gameBoard.classList.remove('blink-orange');
    gameBoard.classList.remove('blink-yellow');
    gameBoard.classList.remove('blink-white');
  }
}

function resetGame() {
  controlContainer.style.visibility = 'hidden';
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach(square => square.textContent = '');
  turn = 'X'; 
  infoDisplay.textContent = 'X goes first'; 
  gameEnds = false;
  allSquares.forEach(square => square.addEventListener('click', takeTurn));
  moveHistory = [];
  currentMoveIndex = -1;
  gameBoard.classList.remove('blink-orange');
  gameBoard.classList.remove('blink-yellow');
  gameBoard.classList.remove('blink-white');
}

prevButton.onclick = showPreviousMove;
nextButton.onclick = showNextMove;

createBoard();