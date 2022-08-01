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
const player = (name, marker);
// name
// score
// marker (X or O)
// takenSquares (array of all markers)
// isWinner
// put marker (only if square is not taken)


/* SQUARE*/
const square = (position) => {
    let content = ''; // X or O
    let taken = false;

    // check if taken
    const status = () => taken;

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

    return {getPosition, status, mark, clear};
}
