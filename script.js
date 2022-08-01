/* GAME*/
const game = (() => {
    // display controller
    const dc = displayController;

    // human vs human or human vs computer
    let gameMode = 'hvh';
    const setGameMode = (mode) => {
        gameMode = mode;
    }

    // the players
    const player1 = player('Player 1', 'X');
    const player2 = player('Player 2', 'O'); 
    const activePlayer = player1;   

    const switchPlayer = () => {
        if(activePlayer === player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }

    const startGame = () => {
        gameboard.setGameboard();        
    }
    
    const newRound = () => {
        gameboard.clearGameboard();
        activePlayer = player1;
    }
    
    const newGame = () => {
        player1.reset();
        player2.reset();
        gameboard.clearGameboard();
        activePlayer = player1;
    }

    return {
        setGameMode,
        player1,
        player2,
        switchPlayer,
        startGame,
        newRound,
        newGame
    };
})();


// AI - let computer make first random move
// AI - implement minimax for computer

/* GAMEBOARD*/
const gameboard = (() => {
    const setGameboard = () => {
        // create array of squares
        const squares = [];
        for(let i = 0; i < 9; i++) {
            squares.push(square(i));
        }
    }    

    const clearGameboard = () => {
        for(let square of squares) {
            square.clear();
        }
    }

    return {setGameboard, clearGameboard};
})();

/* DISPLAY CONTROLLER*/
const displayController = (() => {
    // DOM elements
    // panels
    const selectPanel = document.getElementById('select');
    const settingsPanel = document.getElementById('player-settings');
    const player1Panel = document.getElementById('player1area');
    const player2Panel = document.getElementById('player2area'); 
    const gameboardPanel = document.getElementById('main');
    const winnerPanel = document.getElementById('winner');

    // Select Panel
    const hvhButton = document.getElementById('hvh');
    hvhButton.addEventListener('click', () => {
        game.setGameMode('hvh');
    })

    const hvcButton = document.getElementById('hvc');
    hvcButton.addEventListener('click', () => {
        game.setGameMode('hvc');
    })

    // Player Settings Panel
    const player1Input = document.getElementById('p1-name');
    const player2Input = document.getElementById('p2-name');
    const startButton = document.getElementById('start-game');
    startButton.addEventListener('click', game.startGame);

    // Player Areas
    const player1Label = document.getElementById('p1-label');
    const player1Score = document.getElementById('p1-score');
    const player2Label = document.getElementById('p2-label');
    const player2Score = document.getElementById('p2-score');

    // Gameboard
    const gb = document.getElementById('main');
    const squareFields = document.querySelectorAll('.square');
    
    // Winner Panel
    const winnerLabel = document.getElementById('winner-text');
    const newRoundButton = document.getElementById('new-round');
    newRoundButton.addEventListener('click', game.newRound);
    const newGameButton = document.getElementById('new-round');
    newGameButton.addEventListener('click', game.newGame);

    // hiding and showing panels
    const hidePanel = (panel) => {
        panel.style.display = 'none';
    }

    const showPanel = (panel) => {
        panel.style.display = 'block';
    }

    const addMarker = (square, marker) => {
        square.textContent = marker;
    }

    const clearMarker = (square) => {
        square.textContent = '';
    }

    const clearGb = () => {
        for(const square of squareFields) {
            clearMarker(square);
        }
    }

    const updateScores = (player1, player2) => {
        player1Score.textContent = player1.score;
        player2Score.textContent = player2.score;
    }

    const updatePlayerNames = (player1, player2) => {
        player1Label.textContent = player1.name;
        player2Label.textContent = player2.name;
    }

    return {
        selectPanel,
        settingsPanel,
        player1Panel,
        player2Panel,
        gameboardPanel,
        winnerPanel,
        hvhButton,
        hvcButton,
        player1Input, 
        player2Input,
        startButton,
        player1Label,
        player1Score, 
        player2Label, 
        player2Score,
        gb,
        squareFields,
        winnerLabel,
        newRoundButton,
        newGameButton,
        hidePanel,
        showPanel,
        addMarker,
        clearGb,
        updateScores,
        updatePlayerNames
    };
})();

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

    // retrieve content
    const getContent = () => content;

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

    return {getPosition, getContent, isTaken, mark, clear};
}
