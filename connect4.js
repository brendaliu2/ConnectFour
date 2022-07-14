"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // board = new Array(HEIGHT).fill(new Array(WIDTH).fill(null));
  for(let y = 0; y < HEIGHT; y++){
    board.push(Array.from({length:WIDTH}).fill(null));
  }
  console.log(board); //test to see if board worked
}

/** makeHtmlBoard: make HTML table and row of column tops. and adds x coordinate to each column headers */

const htmlBoard = document.getElementById('board');

function makeHtmlBoard() {

  const top = document.createElement("tr"); //creates table row
  top.setAttribute("id", "column-top"); //sets table row id to "column-top"
  top.addEventListener("click", handleClick); //adds an event listener to the new row


  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td"); //creates columns
    headCell.setAttribute("id", x); //gives column headers x coordinate as id
    top.append(headCell); // adds column headers to table row
  }
  htmlBoard.append(top); //adds new row to table

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {

      const cell = document.createElement('td');

      cell.setAttribute('id',`${y}-${x}`);
      // you'll use this later, so make sure you use y-x
      row.append(cell);
    }

    htmlBoard.append(row);

  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 5
  let tempY = HEIGHT - 1;
  while (tempY >= 0){
    if(!board[tempY][x]){
      return tempY;
    }
    tempY--;
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let playedPiece = document.createElement("div")
  if (currPlayer === 1) {
    playedPiece.classList.add("p1", "piece");
  } else if (currPlayer === 2) {
    playedPiece.classList.add("p2", "piece");
  }
  const tile = document.getElementById(`${y}-${x}`);
  tile.append(playedPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg)
  }, 500);

}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  placeInTable(y, x);
    board[y][x] = currPlayer;


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(x => x.includes(null)) === false) {
    console.log();
    return endGame("It's a tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2: currPlayer = 1;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    for (let i = 0; i < cells.length; i++){
      let cell = cells[i];

      if (cell[0] < 0 || cell[0] >= HEIGHT || cell[1] < 0 || cell[1] >= WIDTH){
        return false;
      }
      let firstCell = cells[0];
      let firstVal = board[firstCell[0]][firstCell[1]];
      let nextVal = board[cell[0]][cell[1]];
      if(firstVal !== nextVal || firstVal === null || nextVal === null){
        return false;
      }


    }
    return true;

   }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y,x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y,x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDR = [[y,x], [y + 1, x - 1], [y + 2,x - 2], [y + 3,x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
