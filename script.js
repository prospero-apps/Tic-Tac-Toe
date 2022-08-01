/* GAME*/
// mode (human vs human or human vs computer)
// select game mode
// create players
// player1
// player2
// player in control
// gameboard
// display controller
// round number
// check game over (3 in a row/column/diagonal and tie)
// start game
// start new round
// play again
// set winner
// switch control to the other player
// AI - let computer make first random move
// AI - implement minimax for computer

/* GAMEBOARD*/
// create array of squares
// clear (remove all markers and enable all squares)

/* DISPLAY CONTROLLER*/
// collect DOM elements
// render (after each marker is added)
// add marker to square
// display winner
// hide/unhide select players panel
// hide/unhide player settings panel
// hide/unhide winner panel

/* PLAYER*/
const player = (name, marker) => {
    // player name
    let playerName = name;
    const getName = () => playerName;
    const setName = (newName) => {
        playerName = newName;
    }

    // player marker
    const getMarker = () => marker;

    // selected squares (just positions 0-8)
    let selectedSquares = [];

    // mark square
    const selectSquare = (square) => {
        if(!square.isTaken){
            selectedSquares.push(square.getPosition());
        }        
    }

    // player score
    let score = 0;
    const getScore = () => score;

    // winner status
    let isWinner = false;

    // winning square positions in rows, columns and diagonals
    const winningSituations = [
        // rows
        [0, 1, 2], [3, 4, 5], [6, 7 ,8],
        // columns
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        //diagonals
        [0, 4, 8], [2, 4, 6]
    ];

    // win round and score
    const win = () => {
        score++;
        isWinner = true;
    }

    const checkWin = () => {       
        for(let i = 0; i < winningSituations.length; i++) {
            if(selectedSquares.includes(winningSituations[0]) &&
               selectedSquares.includes(winningSituations[1]) &&
               selectedSquares.includes(winningSituations[2])) {
                win();
               }
        }
    }    

    // clear player data
    const reset = () => {
        score = 0;
        isWinner = false;
        selectedSquares = [];
    }    

    return {getName, setName, getMarker, selectSquare, getScore, checkWin, reset};
}

/* SQUARE*/
const square = (position) => {
    let content = ''; // X or O
    let taken = false;

    // check if taken
    const isTaken = () => taken;

    // check position (index in the array of squares)
    const getPosition = () => position;

    // mark X or O
    const mark = (xo) => {
        content = xo;
        taken = true;
    }

    // remove marker
    const clear = () => {
        content = '';
        taken = false;
    }    

    return {getPosition, isTaken, mark, clear};
}
