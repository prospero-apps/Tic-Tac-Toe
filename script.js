/* PLAYER*/
const player = (name, marker, genericName) => {
    // player name
    const getName = () => name;
    const getGenericName = () => genericName;
    const setName = (newName) => {
        name = newName;
    }

    // player marker
    const getMarker = () => marker;

    // selected squares (just their positions 0-8)
    let selectedSquares = [];
    
    const selectSquare = (square) => {
        selectedSquares.push(square.getPosition());      
    }

    const clearSelected = () => {
        selectedSquares = [];
    }

    let countSelected = () => selectedSquares.length;

    // player score
    let score = 0;
    const getScore = () => score;

    // winner status
    let isWinner = false;
    const getIsWinner = () => isWinner;

    const clearIsWinner = () => {
        isWinner = false;
    }

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
            if(selectedSquares.includes(winningSituations[i][0]) &&
               selectedSquares.includes(winningSituations[i][1]) &&
               selectedSquares.includes(winningSituations[i][2])) {
                win();
                break;
               }
        }
    }    

    // clear player data
    const reset = () => {
        score = 0;
        isWinner = false;
        selectedSquares = [];
        setName(genericName);
    }    

    return {getName, getGenericName, setName, getMarker, selectSquare, countSelected, clearSelected, getScore, getIsWinner, clearIsWinner, checkWin, reset};
}

/* SQUARE*/
const square = (position) => {
    let content = ''; // X or O
    let taken = false;
    
    // check if taken
    const checkTaken = () => taken;
  
    // check position (index in the array of squares)
    const getPosition = () => position;

    // mark X or O
    const mark = () => {
        taken = true;
    }

    // remove marker
    const clear = () => {
        content = '';
        taken = false;
    }    

    return {getPosition, checkTaken, mark, clear};
}

/* GAMEBOARD*/
const gameboard = (() => {
    let squares = [];
    const getSquares = () => squares;

    const setGameboard = () => {
        // create array of squares
        for(let i = 0; i < 9; i++) {
            squares.push(square(i));
        }
    }    

    const clearGameboard = () => {
        for(let square of squares) {
            square.clear();
        }
    }

    const disableGameboard = () => {
        for(let square of squares) {
            square.mark();
        }
    }

    // const allSquaresTaken = () => {
    //     squares.every((square) => square.checkTaken());
    // }

    const allSquaresTaken = () => {
        let test = squares.every(isTaken);

        function isTaken(square) {
            return square.checkTaken();
        }

        return test;

        // squares.every((square) => square.checkTaken());
    }

    return {getSquares, setGameboard, clearGameboard, disableGameboard, allSquaresTaken};
})();

/* GAME*/
const game = (() => {
    const go = () => {

    }

    // human vs human or human vs computer
    let gameMode = 'hvh';
    const setGameMode = (mode) => {
        gameMode = mode;
    }

    // the players
    const player1 = player('Player 1', 'X', 'Player 1');
    const player2 = player('Player 2', 'O', 'Player 2'); 
    let activePlayer = player1;   

    const switchPlayer = () => {
        if(activePlayer === player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }

    const startGame = () => {
        gameboard.setGameboard();  
        setPlayers();
    }

    const setPlayers = () => {
        let name1 = player1Input.value === '' ? player1.getGenericName() : player1Input.value;   
        let name2 = player2Input.value === '' ? player2.getGenericName() : player2Input.value; 
        
        player1.setName(name1);
        player2.setName(name2);
        player1Label.textContent = player1.getName();
        player2Label.textContent = player2.getName();
        player1Score.textContent = player1.getScore(); 
        player2Score.textContent = player2.getScore(); 

        activePlayer = player1;
    }
    
    




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
        setGameMode('hvh');
    })

    const hvcButton = document.getElementById('hvc');
    hvcButton.addEventListener('click', () => {
        setGameMode('hvc');
    })

    // Player Settings Panel
    const player1Input = document.getElementById('p1-name');
    const player2Input = document.getElementById('p2-name');
    const startButton = document.getElementById('start-game');
    startButton.addEventListener('click', startGame);

    // Player Areas
    const player1Label = document.getElementById('p1-label');
    const player1Score = document.getElementById('p1-score');
    const player2Label = document.getElementById('p2-label');
    const player2Score = document.getElementById('p2-score');

    // Gameboard
    const gb = document.getElementById('main');
    const squareFields = document.querySelectorAll('.square');
    for(const square of squareFields) {
        square.addEventListener('click', (e) => {
            let currentSquare = gameboard.getSquares()[square.dataset.index];
            
            if(!currentSquare.checkTaken()){                
                currentSquare.mark();
                e.target.textContent = activePlayer.getMarker();
                activePlayer.selectSquare(currentSquare);
                let selected = activePlayer.countSelected();
                if(selected > 2) {
                    activePlayer.checkWin();
                    if(activePlayer.getIsWinner()) {
                        if(activePlayer === player1) {
                            player1Score.textContent = activePlayer.getScore();
                        } else {
                            player2Score.textContent = activePlayer.getScore();
                        }
                        showWinner(activePlayer);
                    } else if(gameboard.allSquaresTaken()) {
                        tie();
                    }
                }                
                switchPlayer();
            }            
        })
    }

    const clearSquares = () => {
        for(const square of squareFields) {
            square.textContent = '';
            square.removeAttribute('disabled');
        }
    }

    const nextRound = () => {
        gameboard.clearGameboard();
        clearSquares();
        player1.clearSelected();
        player2.clearSelected();
        player1.clearIsWinner();
        player2.clearIsWinner();
    }
    
    const newGame = () => {
        gameboard.clearGameboard();
        clearSquares();
        player1.reset();
        player2.reset();        
        setPlayers();
    }

    
    
    // Winner Panel
    const winnerLabel = document.getElementById('winner-text');
    const newRoundButton = document.getElementById('new-round');
    newRoundButton.addEventListener('click', nextRound);
    const newGameButton = document.getElementById('new-game');
    newGameButton.addEventListener('click', newGame);

    const disableGameboard = () => {
        // disable gameboard 
        gameboard.disableGameboard();

        for(const square of squareFields) {
            square.setAttribute('disabled', '');
        }
    }

    const showWinner = (winner) => {
        disableGameboard();

        // set winner text
        winnerLabel.textContent = `The winner is ${winner.getName()}.`;
    }

    const tie = () => {
        disableGameboard();
        // set winner text
        winnerLabel.textContent = "There's a tie.";
    }

    

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
        setGameMode,
        player1,
        player2,
        activePlayer,
        switchPlayer,
        startGame,
        nextRound,
        newGame, 
        go
    };
})();


// AI - let computer make first random move
// AI - implement minimax for computer



/* DISPLAY CONTROLLER*/
// const displayController = (() => {
//     // DOM elements
//     // panels
//     const selectPanel = document.getElementById('select');
//     const settingsPanel = document.getElementById('player-settings');
//     const player1Panel = document.getElementById('player1area');
//     const player2Panel = document.getElementById('player2area'); 
//     const gameboardPanel = document.getElementById('main');
//     const winnerPanel = document.getElementById('winner');

//     // Select Panel
//     const hvhButton = document.getElementById('hvh');
//     hvhButton.addEventListener('click', () => {
//         game.setGameMode('hvh');
//     })

//     const hvcButton = document.getElementById('hvc');
//     hvcButton.addEventListener('click', () => {
//         game.setGameMode('hvc');
//     })

//     // Player Settings Panel
//     const player1Input = document.getElementById('p1-name');
//     const player2Input = document.getElementById('p2-name');
//     const startButton = document.getElementById('start-game');
//     startButton.addEventListener('click', game.startGame);

//     // Player Areas
//     const player1Label = document.getElementById('p1-label');
//     const player1Score = document.getElementById('p1-score');
//     const player2Label = document.getElementById('p2-label');
//     const player2Score = document.getElementById('p2-score');

//     // Gameboard
//     const gb = document.getElementById('main');
//     const squareFields = document.querySelectorAll('.square');
//     for(const square of squareFields) {
//         square.addEventListener('click', (e) => {
//             if(!e.target.isTaken){
//                 e.target.mark();
//                 e.target.textContent = game.activePlayer.getMarker();
//                 game.activePlayer.selectSquare(e.target);
//                 game.switchPlayer();
//             }            
//         })
//     }
    
//     // Winner Panel
//     const winnerLabel = document.getElementById('winner-text');
//     const newRoundButton = document.getElementById('new-round');
//     newRoundButton.addEventListener('click', game.newRound);
//     const newGameButton = document.getElementById('new-round');
//     newGameButton.addEventListener('click', game.newGame);

//     // hiding and showing panels
//     const hidePanel = (panel) => {
//         panel.style.display = 'none';
//     }

//     const showPanel = (panel) => {
//         panel.style.display = 'block';
//     }

//     const addMarker = (square, marker) => {
//         square.textContent = marker;
//     }

//     const clearMarker = (square) => {
//         square.textContent = '';
//     }

//     const clearGb = () => {
//         for(const square of squareFields) {
//             clearMarker(square);
//         }
//     }

//     const updateScores = (player1, player2) => {
//         player1Score.textContent = player1.score;
//         player2Score.textContent = player2.score;
//     }

//     const updatePlayerNames = (player1, player2) => {
//         player1Label.textContent = player1.name;
//         player2Label.textContent = player2.name;
//     }

//     return {
//         selectPanel,
//         settingsPanel,
//         player1Panel,
//         player2Panel,
//         gameboardPanel,
//         winnerPanel,
//         hvhButton,
//         hvcButton,
//         player1Input, 
//         player2Input,
//         startButton,
//         player1Label,
//         player1Score, 
//         player2Label, 
//         player2Score,
//         gb,
//         squareFields,
//         winnerLabel,
//         newRoundButton,
//         newGameButton,
//         hidePanel,
//         showPanel,
//         addMarker,
//         clearGb,
//         updateScores,
//         updatePlayerNames
//     };
// })();



// start game
game.go();
