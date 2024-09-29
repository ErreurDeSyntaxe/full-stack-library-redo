'use strict';

class Player {
  constructor(number, token, tokenSVG) {
    this.number = number;
    this.token = token;
    this.tokenSVG = tokenSVG;
  }
}

class Game {
  constructor() {
    this.playArea = document.querySelector('.play-area');
    // prettier-ignore
    this.board =
      [' ', ' ', ' ',
       ' ', ' ', ' ',
       ' ', ' ', ' '];
    this.player1 = new Player(
      0,
      'X',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>'
    );
    this.player2 = new Player(
      1,
      'O',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path></svg>'
    );
    this.activePlayerP = document.querySelectorAll('.turns-player');

    // sets up the board, the initial values of a new game and event listeners
    this.populateBoard();
    this.init();
    this.addEventHandlers();
    // this.simulateGame(); // not needed anymore since the UI implementation
  }
  // initializes a new game
  init() {
    this.gameOngoing = true;
    this.round1to9 = 1;
    this.currentPlayer = this.player1;
    this.activePlayerP[0].classList.add('turn-active');
    this.activePlayerP[1].classList.remove('turn-active');
    this.clearBoard();
    this.printBoard();
  }
  // delegates event listening. clicks result in playing tokens
  addEventHandlers() {
    this.playArea.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.gameOngoing) {
        this.offerRematch();
        return;
      }
      this.playToken(e.target.dataset.id);
    });
  }
  // opens a modal window to offer a new game
  offerRematch() {
    console.log('open modal window');
  }
  // resets board to inital value
  clearBoard() {
    this.board.forEach((square, index) => {
      this.board[index] = ' ';
      document.querySelector(`.square-${index}`).innerHTML = ' ';
    });
  }
  // prints the board to the console for pre-UI development
  printBoard() {
    const board = `
    ${this.board[0]} | ${this.board[1]} | ${this.board[2]} 
   -----------
    ${this.board[3]} | ${this.board[4]} | ${this.board[5]}
   -----------
    ${this.board[6]} | ${this.board[7]} | ${this.board[8]}`;
    // console.log(board);
    this.displayBoard();
  }
  // creates divs in the play area (called only once)
  populateBoard() {
    this.board.forEach((square, index) => {
      const squareDiv = document.createElement('div');
      squareDiv.classList.add('square', `square-${index}`);
      squareDiv.textContent = ' ';
      squareDiv.setAttribute('data-id', `${index}`);
      this.playArea.appendChild(squareDiv);
    });
  }
  // displays the X's and O's on the UI
  displayBoard() {
    this.board.forEach((square, index) => {
      let currentSVG;
      if (square === 'X') currentSVG = this.player1.tokenSVG;
      if (square === 'O') currentSVG = this.player2.tokenSVG;
      if (square === ' ') return;
      document.querySelector(`.square-${index}`).innerHTML = currentSVG;
    });
  }
  // alternates player each time a token is successfully placed
  switchPlayer() {
    this.currentPlayer = this.currentPlayer.number
      ? this.player1
      : this.player2;
    this.round1to9++;
    this.activePlayerP[0].classList.toggle('turn-active');
    this.activePlayerP[1].classList.toggle('turn-active');
  }
  // declare a winner and stop the game
  declareOutcome(verdict = undefined) {
    const declaration = verdict
      ? 'The game is a draw!'
      : `Player ${this.currentPlayer.number + 1} wins!`;
    console.log(declaration);
    this.gameOngoing = false;
    this.offerRematch();
  }
  checkWin() {
    // left column
    if (
      this.board[0] === this.board[3] &&
      this.board[3] === this.board[6] &&
      this.board[6] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // center column
    if (
      this.board[1] === this.board[4] &&
      this.board[4] === this.board[7] &&
      this.board[7] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // right column
    if (
      this.board[2] === this.board[5] &&
      this.board[5] === this.board[8] &&
      this.board[8] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // top row
    if (
      this.board[0] === this.board[1] &&
      this.board[1] === this.board[2] &&
      this.board[2] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // center row
    if (
      this.board[3] === this.board[4] &&
      this.board[4] === this.board[5] &&
      this.board[5] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // bottom row
    if (
      this.board[6] === this.board[7] &&
      this.board[7] === this.board[8] &&
      this.board[8] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // \ diagonal
    if (
      this.board[0] === this.board[4] &&
      this.board[4] === this.board[8] &&
      this.board[8] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // / diagonal
    if (
      this.board[6] === this.board[4] &&
      this.board[4] === this.board[2] &&
      this.board[6] !== ' '
    ) {
      this.declareOutcome();
      return;
    }
    // check for a draw after the nineth round is played
    if (this.round1to9 === 9 && this.gameOngoing) {
      this.declareOutcome('draw');
    }
    this.switchPlayer();
  }
  // checks if position is free then marks it X or O
  playToken(position) {
    if (!this.gameOngoing) return;
    if (this.board[position] !== ' ') {
      console.log(`Square ${position} is occupied. Try again.`);
      return false; // token unsuccessfully played
    }
    // return typeof this.board[position];
    this.board[position] = `${this.currentPlayer.token}`;
    this.printBoard();
    this.checkWin();
    return true; // token successfully played
  }
  // simulate gameplay
  simulateGame() {
    // X wins (player 1)
    // if (this.playToken(0)) this.checkWin();
    // if (this.playToken(4)) this.checkWin();
    // if (this.playToken(1)) this.checkWin();
    // if (this.playToken(8)) this.checkWin();
    // if (this.playToken(2)) this.checkWin();
    // O wins (player 2)
    // if (this.playToken(2)) this.checkWin();
    // if (this.playToken(1)) this.checkWin();
    // if (this.playToken(8)) this.checkWin();
    // if (this.playToken(0)) this.checkWin();
    // if (this.playToken(3)) this.checkWin();
    // if (this.playToken(4)) this.checkWin();
    // if (this.playToken(6)) this.checkWin();
    // if (this.playToken(7)) this.checkWin();
    // draw
    // if (this.playToken(0)) this.checkWin();
    // if (this.playToken(4)) this.checkWin();
    // if (this.playToken(5)) this.checkWin();
    // if (this.playToken(1)) this.checkWin();
    // if (this.playToken(7)) this.checkWin();
    // if (this.playToken(8)) this.checkWin();
    // if (this.playToken(2)) this.checkWin();
    // if (this.playToken(6)) this.checkWin();
    // if (this.playToken(3)) this.checkWin();
  }
}

const game = new Game();
