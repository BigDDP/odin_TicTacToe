const init = (() => {
    const playerElement = document.getElementById("player");
    const allCells = document.querySelectorAll(".cell");
    const form = document.querySelector("form");
    const restartBtn = document.getElementById("restartBtn");
    const board = document.querySelector(".board");

    const winCondition = [
        [1,2,3], [4,5,6], [7,8,9], [1,4,7],
        [2,5,8], [3,6,9], [1,5,9], [3,5,7]
    ];

    const state = {
        player1: undefined,
        player2: undefined,
        currentPlayer: "O",
        gameOver: false,
        gameBoard: [
            {id: 1, value: ""},{id: 2, value: ""},{id: 3, value: ""},
            {id: 4, value: ""},{id: 5, value: ""},{id: 6, value: ""},
            {id: 7, value: ""},{id: 8, value: ""},{id: 9, value: ""}
        ]
    };

    const reset = () => {
        state.gameOver = false;
        state.currentPlayer = "O";
        state.gameBoard = state.gameBoard.map(v => ({ ...v, value: ""}));
        allCells.forEach(cell => (cell.textContent= ""));
        playerElement.textContent = state.player1 + ": O";
    };

    return {
        playerElement, 
        allCells, 
        winCondition, 
        board,
        restartBtn,
        form,
        state,
        reset
    };
})();


init.allCells.forEach((cell) => {
    cell.addEventListener("click", () => {
        gameObj(cell);
    });
});

init.restartBtn.addEventListener("click", () => {
    init.reset();
})

const formCheck = (() => {
    init.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        init.state.player1 = formData.get("player1");
        init.state.player2 = formData.get("player2");

        init.board.style.display = "grid";
        init.restartBtn.style.display = "block";
        init.form.style.display = "none";

        init.playerElement.textContent = `${init.state.player1}: ${init.state.currentPlayer}`;
        init.playerElement.style.display = "block";
    });
})();

const gameObj = function(cell) {
            
    if (init.state.gameOver === true) return;
    if (init.state.gameBoard[cell.id-1].value !== "") return;

    init.state.gameBoard[cell.id-1].value = init.state.currentPlayer;

    cell.textContent = init.state.currentPlayer;
    
    if (winCheck.winner(init.state.currentPlayer)) return;

    playerObj(init.state.currentPlayer);

    return ;
};

function playerObj(player) {
    
    let nextPlayer = player === "O" ? [init.state.player2, "X"] : [init.state.player1, "O"];

    init.state.currentPlayer = nextPlayer[1]
    init.playerElement.textContent = `${nextPlayer[0]}: ${nextPlayer[1]}`      

    return;
};

const winCheck = (function() {
    const winner = (player) => {

        let win = false;
        const playerValues = init.state.gameBoard
            .filter(item => item.value === player)
            .map(cell => cell.id);

        for (const arr of init.winCondition) {
            if (arr.every(n => playerValues.includes(n))) {

                init.playerElement.textContent = 
                    `${player === "O" 
                        ? init.state.player1 
                        : init.state.player2 } is the Winner!`;
                win = true;
                init.state.gameOver = win;

                break;
            }
        }

        return win;
    }

    return {winner}
})();