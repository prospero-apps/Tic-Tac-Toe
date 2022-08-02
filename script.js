/* PLAYER*/
const player = (name, marker, genericName) => {
    // PLAYER NAME
    const getName = () => name;
    const getGenericName = () => genericName;
    const setName = (newName) => {
        name = newName;
    }

    // PLAYER MARKER
    const getMarker = () => marker;

    // SELECTED SQUARES (just their positions 0-8)
    let selectedSquares = [];
    
    const selectSquare = (square) => {
        selectedSquares.push(square.getPosition());      
    }
  
    let countSelected = () => selectedSquares.length;

    // PLAYER SCORE
    let score = 0;
    const getScore = () => score;

    // WINNER STATUS
    let isWinner = false;
    const getIsWinner = () => isWinner;   

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

    // check if player should win and win if so
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

    // PLAYER RESET   
    const reset = (resetScore=true) => {
        if(resetScore){
            score = 0;
        }
        
        isWinner = false;
        selectedSquares = [];
        setName(genericName);
    }    

    return {
        getName, 
        getGenericName, 
        setName, 
        getMarker, 
        selectSquare, 
        countSelected, 
        getScore, 
        getIsWinner, 
        checkWin, 
        reset
    };
}

/* SQUARE*/
const square = (position) => {
    // SQUARE CONTENT
    let content = ''; // X or O

    // SQUARE TAKEN?
    let taken = false;     
    const checkTaken = () => taken;

    // mark X or O
    const mark = () => {
        taken = true;
    }
  
    // SQUARE POSITION (index in the array of squares)
    const getPosition = () => position;    

    // SQUARE RESET
    const clear = () => {
        content = '';
        taken = false;
    }    

    return {
        getPosition, 
        checkTaken, 
        mark, 
        clear
    };
}

/* GAMEBOARD*/
const gameboard = (() => {
    // GAMEBOARD SQUARES
    let squares = [];
    const getSquares = () => squares;

    // create array of squares
    const setGameboard = () => {
        for(let i = 0; i < 9; i++) {
            squares.push(square(i));
        }
    }    

    // clear squares
    const clearGameboard = () => {
        for(let square of squares) {
            square.clear();
        }
    }

    // disable gameboard so that players no longer can add markers
    const disableGameboard = () => {
        for(let square of squares) {
            square.mark();
        }
    }
    
    // is the gameboard full?
    const allSquaresTaken = () => {
        let test = squares.every(isTaken);

        function isTaken(square) {
            return square.checkTaken();
        }

        return test;
    }

    return {
        getSquares, 
        setGameboard, 
        clearGameboard, 
        disableGameboard, 
        allSquaresTaken
    };
})();

/* DISPLAY CONTROLLER*/
const displayController = (() => {
    // DOM elements
    // panels
    const selectPanel = document.getElementById('select');
    const settingsPanel = document.getElementById('player-settings');
    const player1Panel = document.getElementById('player1panel');
    const player2Panel = document.getElementById('player2panel'); 
    const gameboardPanel = document.getElementById('main');
    const winnerPanel = document.getElementById('winner');

    // Select Panel
    const hvhButton = document.getElementById('hvh');
    const hvcButton = document.getElementById('hvc');

    // Player Settings Panel
    const settingsText = document.getElementById('settings-text');
    const player1Input = document.getElementById('p1-name');
    const player2Input = document.getElementById('p2-name');
    const player2NameText = document.querySelector('#player2area label');
    const startButton = document.getElementById('start-game');

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
    const newGameButton = document.getElementById('new-game');

    // hiding and showing panels
    const hidePanel = (panel) => {
        // remember original display style
        panel.setAttribute('data-originalDisplay', panel.style.display);
        panel.style.display = 'none';
    }

    const showPanel = (panel) => {
        panel.style.display = panel.getAttribute('data-originalDisplay');
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
        settingsText,
        player1Input, 
        player2Input,
        player2NameText,
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
        showPanel
    };
})();


/* GAME*/
const game = (() => {  
    // initialize program by hiding all panels except the game mode select panel
    const go = () => {
        dc.hidePanel(dc.settingsPanel);
        dc.hidePanel(dc.player1Panel);
        dc.hidePanel(dc.player2Panel);
        dc.hidePanel(dc.gameboardPanel);
        dc.hidePanel(dc.winnerPanel);        
    }

    // GAME MODE - human vs human or human vs computer
    let gameMode = 'hvh';
    const setGameMode = (mode) => {
        gameMode = mode;
    }
  
    // THE PLAYERS
    const player1 = player('Player 1', 'X', 'Player 1');
    const player2 = player('Player 2', 'O', 'Player 2'); 
    let activePlayer = player1; // the player whose turn it is

    // players take turns
    const switchPlayer = () => {
        if(activePlayer === player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }
     
    const setPlayers = () => {
        let name1 = dc.player1Input.value === '' ? player1.getGenericName() : dc.player1Input.value; 
        let name2;

        if (gameMode === 'hvh') {
            name2 = dc.player2Input.value === '' ? player2.getGenericName() : dc.player2Input.value; 
        } else {
            name2 = 'Computer';                        
        }        
        
        player1.setName(name1);
        player2.setName(name2);
        dc.player1Label.textContent = player1.getName();
        dc.player2Label.textContent = player2.getName();
        dc.player1Score.textContent = player1.getScore(); 
        dc.player2Score.textContent = player2.getScore(); 

        activePlayer = player1;
    }       

    // START GAME, NEW GAME, NEXT ROUND   
    // start game
    const startGame = () => {
        gameboard.setGameboard();  
        setPlayers();
        dc.hidePanel(dc.settingsPanel);
        dc.showPanel(dc.player1Panel);
        dc.showPanel(dc.player2Panel);
        dc.showPanel(dc.gameboardPanel);
    }

    // new game
    const newGame = () => {
        gameboard.clearGameboard();
        clearSquares();
        player1.reset();
        player2.reset();        
        setPlayers();
        activePlayer = player1;
        
        // clear inputs
        dc.player1Input.value = '';
        dc.player2Input.value = '';

        dc.hidePanel(dc.winnerPanel);
        dc.hidePanel(dc.player1Panel);
        dc.hidePanel(dc.player2Panel);
        dc.hidePanel(dc.gameboardPanel);
        dc.showPanel(dc.selectPanel);
    }

    // next round
    const nextRound = () => {
        gameboard.clearGameboard();
        clearSquares();
        player1.reset(false);
        player2.reset(false);  
        activePlayer = player1;
        dc.hidePanel(dc.winnerPanel);
    }
    
    // HELPER FUNCTIONS
    
    // return a random empty square for the computer to put its marker there
    const randomSquare = () => {
        let emptySquares = Array.from(dc.squareFields).filter(checkEmpty);

        function checkEmpty(square) {
            return square.textContent === '';
        }           
        
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    // clear all markers and enable the squares
    const clearSquares = () => {
        for(const square of dc.squareFields) {
            square.textContent = '';
            square.removeAttribute('disabled');
        }
    }
    
    // no more markers allowed
    const disableGameboard = () => {
        gameboard.disableGameboard();

        for(const square of dc.squareFields) {
            square.setAttribute('disabled', '');
        }
    }

    // show winner info
    const showWinner = (winner) => {
        disableGameboard();

        // show winner panel
        dc.showPanel(dc.winnerPanel);

        // set winner text
        dc.winnerLabel.textContent = `The winner is ${winner.getName()}.`;
    }

    // show tie info
    const tie = () => {
        disableGameboard();

        // show winner panel
        dc.showPanel(dc.winnerPanel);

        // set winner text
        dc.winnerLabel.textContent = "There's a tie.";
    }
    
    // DOM MANIPULATION
    const dc = displayController;

    // --- event listeners --- //
    
    // Select Panel
    dc.hvhButton.addEventListener('click', () => {
        setGameMode('hvh');
        dc.settingsText.textContent = "Enter the players' names"
        dc.player2Input.style.visibility = 'visible'; 
        dc.hidePanel(dc.selectPanel);
        dc.showPanel(dc.settingsPanel);
    })

    dc.hvcButton.addEventListener('click', () => {
        setGameMode('hvc');
        dc.settingsText.textContent = "Enter Player 1's name"
        dc.player2NameText.textContent = 'Computer';
        dc.player2Input.style.visibility = 'hidden'; 
        dc.hidePanel(dc.selectPanel);
        dc.showPanel(dc.settingsPanel);
    })

    // Player Settings Panel
    dc.startButton.addEventListener('click', startGame);
  
    // Gameboard    
    for(const square of dc.squareFields) {
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
                            dc.player1Score.textContent = activePlayer.getScore();
                        } else {
                            dc.player2Score.textContent = activePlayer.getScore();
                        }
                        showWinner(activePlayer);
                    } else if(gameboard.allSquaresTaken()) {
                        tie();
                    }
                }                
                switchPlayer();
                if(gameMode === 'hvc' && !gameboard.allSquaresTaken() && activePlayer === player2){
                    randomSquare().click();
                }
            }            
        })
    }

    // Winner Panel
    dc.newGameButton.addEventListener('click', newGame);
    dc.newRoundButton.addEventListener('click', nextRound);
    
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

game.go();