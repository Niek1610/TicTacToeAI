let myBoard;
const myPlayer = "X"
const AI = "O"
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const aiMode = 'presets'; //minimax, presets

const winText = document.querySelector(".wins")
let wins = 0
const loseText = document.querySelector(".losses")
let losses = 0
const drawText = document.querySelector(".draws")
let draws = 0
const winPercentageText = document.querySelector(".percentage")

const cells = document.querySelectorAll('.cell');
startGame()

function startGame() {
    document.querySelector(".endgame .text").innerText = "TicTacToe"
    myBoard = Array.from(Array(9).keys())
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ""
        cells[i].style.removeProperty('background-color')
        cells[i].addEventListener("click", turnClick, false)
    }
}


function turnClick(square) {
    if (typeof myBoard[square.target.id] == 'number'){
        turn(square.target.id, myPlayer)
        if (!checkWin(myBoard, myPlayer)) { 
            if (!checkTie()) {
                switch (aiMode) {
                    case 'minimax':
                        turn(bestSpot(), AI);
                        break;
                    case 'presets':
                        turn(presets(), AI);
                }                
            }
        }
    }
}

function turn(squareId, player){
    myBoard[squareId] = player
    document.getElementById(squareId).innerText = player
    let gameWon = checkWin(myBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player}
            break
        }
    } 
    return gameWon;
}



function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == myPlayer ? "rgb(15, 224, 78)" : "rgb(248, 69, 69)";
    }
    for (let i = 0;  i < cells.length; i++){
        cells[i].removeEventListener("click", turnClick, false)
    }
    declareWinner(gameWon.player == myPlayer ? "Gewonnen!" : "Verloren")
}

const modeStats = {
    retarded: {
      wins: 0,
      losses: 0,
      draws: 0
    },
    heelmakkelijk: {
        wins: 0,
        losses: 0,
        draws: 0
      },
    makkelijk: {
      wins: 0,
      losses: 0,
      draws: 0
    },
    normaal: {
      wins: 0,
      losses: 0,
      draws: 0
    },
    moeilijk: {
      wins: 0,
      losses: 0,
      draws: 0
    },
    onmogelijk: {
      wins: 0,
      losses: 0,
      draws: 0
    }
  };
  

function declareWinner(who) {
    document.querySelector(".endgame").style.visibility = "visible"
    document.querySelector(".endgame .text").innerText = who

    if (who === "Gewonnen!") {
       
        switch (mode.innerHTML) {
            case "Retarded":
                modeStats.retarded.wins++;
                break;
            case "Heel makkelijk":
                modeStats.heelmakkelijk.wins++;
                break;
            case "Makkelijk":
                modeStats.makkelijk.wins++;
                break;
            case "Normaal":
                modeStats.normaal.wins++;
                break;
            case "Moeilijk":
                modeStats.moeilijk.wins++;
                break;
            case "Onmogelijk":
                modeStats.onmogelijk.wins++;
                break;
        }
    } else if (who === "Verloren") {
      
    
        switch (mode.innerHTML) {
            case "Retarded":
                modeStats.retarded.losses++;
                break;
            case "Heel makkelijk":
                modeStats.heelmakkelijk.losses++;
                break;
            case "Makkelijk":
                modeStats.makkelijk.losses++;
                break;
            case "Normaal":
                modeStats.normaal.losses++;
                break;
            case "Moeilijk":
                modeStats.moeilijk.losses++;
                break;
            case "Onmogelijk":
                modeStats.onmogelijk.losses++;
                break;
        }
    } else {

    
        switch (mode.innerHTML) {
            case "Retarded":
                modeStats.retarded.draws++;
                break;
            case "Heel makkelijk":
                modeStats.heelmakkelijk.draws++;
                break;
            case "Makkelijk":
                modeStats.makkelijk.draws++;
                break;
            case "Normaal":
                modeStats.normaal.draws++;
                break;
            case "Moeilijk":
                modeStats.moeilijk.draws++;
                break;
            case "Onmogelijk":
                modeStats.onmogelijk.draws++;
                break;
        }
    }
    
    let totalGames = wins + losses + draws;
   
    console.log(modeStats)
}

function emptySquares(){
    return myBoard.filter(s => typeof s == 'number')
}

function bestSpot(){
    return minimax(myBoard, AI).index;
}

function checkTie(){
    if (emptySquares().length == 0) {
     
        for(let i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "rgba(0, 162, 255, 0.501)"
            cells[i].style.transition = ".5s"
            cells[i].removeEventListener("click", turnClick, false)
        }
        declareWinner("Gelijk Spel!")
        return true
    }
    return false
}

function minimax(newBoard, player) {
    // Zoek naar alle lege cellen op het bord
    let aSpots = emptySquares(newBoard);

    // Controleer of de huidige speler gewonnen heeft
    if (checkWin(newBoard, player)) {
        // Geef 10 of -10 terug als huidige speler AI is of een echte speler
        return { score: player === AI ? 10 : -10 };
    } else if (aSpots.length === 0) {
        // Als er geen lege cellen meer zijn, is het spel gelijk en wordt er 0 teruggegeven
        return { score: 0 };
    }

    // Initialiseer een lege lijst om mogelijke zetten op te slaan
    let moves = [];

    // Doorloop alle lege cellen
    for (let i = 0; i < aSpots.length; i++) {
        // Sla de huidige zet op in een tijdelijk object
        let move = {};
        move.index = newBoard[aSpots[i]];
        newBoard[aSpots[i]] = player;

        // Controleer of de zet van de huidige speler tot winst heeft geleid
        if (checkWin(newBoard, player)) {
            // Geef 10 of -10 terug als huidige speler AI is of een echte speler
            move.score = player === AI ? 10 : -10;
        } else {
            // Als de zet niet tot winst heeft geleid, roep dan opnieuw de minimax-functie aan om dieper in de boom te zoeken
            let result = minimax(newBoard, player === AI ? myPlayer : AI);
            move.score = result.score;
        }

        // Sla de oorspronkelijke waarde van het bord weer op, om de andere zetten te evalueren
        newBoard[aSpots[i]] = move.index;
        // Voeg de evaluatie van deze zet toe aan de lijst met zetten
        moves.push(move);
    }

    // Initialiseer een variabele om de beste zet bij te houden
    let bestMove;
    // Als de huidige speler de AI is
    if (player === AI) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            // Zoek naar de zet met de hoogste score voor de AI
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else { // Als de huidige speler een echte speler is
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            // Zoek naar de zet met de laagste score voor de echte speler
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    // Geef de beste zet terug
    return moves[bestMove];
}
let slider = document.getElementById("myRange");
let probability;

slider.oninput = function() {
    probability = 1 - (slider.value / 100);

    if (slider.value == 1){
        mode.innerHTML = "Retarded";
    }
    else if (slider.value >= 0 && slider.value < 25){
        mode.innerHTML = "Heel makkelijk";
    }
    else if (slider.value >= 25 && slider.value < 50){
        mode.innerHTML = "Makkelijk";
    }
    else if (slider.value >= 50 && slider.value < 75){
        mode.innerHTML = "Normaal";
    }
    else if (slider.value >= 75 && slider.value < 100){
        mode.innerHTML = "Moeilijk";
    }
    else if (slider.value == 100){
        mode.innerHTML = "Onmogelijk";
    }
}

const mode = document.getElementById("mode")

let modeOption = document.getElementById("modeSelect")

modeOption.oninput = function() {
    const selectedMode = modeOption.value.toLowerCase();

    switch (selectedMode) {
        case "retarded":
            const retardedWins = modeStats.retarded.wins;
            const retardedTotalGames = retardedWins + modeStats.retarded.losses + modeStats.retarded.draws;
            const retardedWinPercentage = (retardedWins / retardedTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${retardedWins}`;
            loseText.innerHTML = `Losses: ${modeStats.retarded.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.retarded.draws}`;
            winPercentageText.innerHTML = `${retardedWinPercentage.toFixed(2)}%`;

            if (retardedWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        case "heel makkelijk":
            const heelMakkelijkWins = modeStats.heelmakkelijk.wins;
            const heelMakkelijkTotalGames = heelMakkelijkWins + modeStats.heelmakkelijk.losses + modeStats.heelmakkelijk.draws;
            const heelMakkelijkWinPercentage = (heelMakkelijkWins / heelMakkelijkTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${heelMakkelijkWins}`;
            loseText.innerHTML = `Losses: ${modeStats.heelmakkelijk.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.heelmakkelijk.draws}`;
            winPercentageText.innerHTML = `${heelMakkelijkWinPercentage.toFixed(2)}%`;

            if (heelMakkelijkWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        case "makkelijk":
            const makkelijkWins = modeStats.makkelijk.wins;
            const makkelijkTotalGames = makkelijkWins + modeStats.makkelijk.losses + modeStats.makkelijk.draws;
            const makkelijkWinPercentage = (makkelijkWins / makkelijkTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${makkelijkWins}`;
            loseText.innerHTML = `Losses: ${modeStats.makkelijk.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.makkelijk.draws}`;
            winPercentageText.innerHTML = `${makkelijkWinPercentage.toFixed(2)}%`;

            if (makkelijkWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        case "normaal":
            const normaalWins = modeStats.normaal.wins;
            const normaalTotalGames = normaalWins + modeStats.normaal.losses + modeStats.normaal.draws;
            const normaalWinPercentage = (normaalWins / normaalTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${normaalWins}`;
            loseText.innerHTML = `Losses: ${modeStats.normaal.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.normaal.draws}`;
            winPercentageText.innerHTML = `${normaalWinPercentage.toFixed(2)}%`;

            if (normaalWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        case "moeilijk":
            const moeilijkWins = modeStats.moeilijk.wins;
            const moeilijkTotalGames = moeilijkWins + modeStats.moeilijk.losses + modeStats.moeilijk.draws;
            const moeilijkWinPercentage = (moeilijkWins / moeilijkTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${moeilijkWins}`;
            loseText.innerHTML = `Losses: ${modeStats.moeilijk.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.moeilijk.draws}`;
            winPercentageText.innerHTML = `${moeilijkWinPercentage.toFixed(2)}%`;

            if (moeilijkWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        case "onmogelijk":
            const onmogelijkWins = modeStats.onmogelijk.wins;
            const onmogelijkTotalGames = onmogelijkWins + modeStats.onmogelijk.losses + modeStats.onmogelijk.draws;
            const onmogelijkWinPercentage = (onmogelijkWins / onmogelijkTotalGames) * 100 || 0;

            winText.innerHTML = `Wins: ${onmogelijkWins}`;
            loseText.innerHTML = `Losses: ${modeStats.onmogelijk.losses}`;
            drawText.innerHTML = `Draws: ${modeStats.onmogelijk.draws}`;
            winPercentageText.innerHTML = `${onmogelijkWinPercentage.toFixed(2)}%`;

            if (onmogelijkWinPercentage < 50) {
                winPercentageText.style.color = "red";
            } else {
                winPercentageText.style.color = "green";
            }
            break;

        default:
            // Handle cases where the selected mode does not match any of the above
            break;
    }
};


function presets() {
    const bestMove = minimax(myBoard, AI).index;
    const availableSpots = emptySquares();

    if (Math.random() < probability) {
      return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
    
    return bestMove;
  }


const statsBtn = document.getElementById("statsBtn")
const okBtn = document.getElementById("okBtn")

const popup = document.getElementById("popup")

statsBtn.addEventListener("click", () => {
    popup.style.display = "block"
})


okBtn.addEventListener("click", () => {
    popup.style.display = "none"
})