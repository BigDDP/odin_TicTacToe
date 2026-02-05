const init = (() => {
    const playerElement = document.getElementById("player");
    const allCells = document.querySelectorAll(".cell");
    const form = document.querySelector("form");
    const restartBtn = document.getElementById("restartBtn");
    const board = document.querySelector(".board");

    allCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            gameController(cell);
        });
    });

    restartBtn.addEventListener("click", () => {
        gameBoard.reset();
    });

    return {
        playerElement, 
        allCells, 
        form,
        restartBtn,
        board
    };
})();

const gameBoard = (() => {
    const state = {
        board: [
            {id: 1, value: ""},{id: 2, value: ""},{id: 3, value: ""},
            {id: 4, value: ""},{id: 5, value: ""},{id: 6, value: ""},
            {id: 7, value: ""},{id: 8, value: ""},{id: 9, value: ""}
        ],
        properties: null
    };

    init.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);

        let player1 = playerObject("Player 1", "O", fd.get("player1"));
        let player2 = playerObject("Player 2", "X", fd.get("player2"));

        state.properties = controller(player1, player2);

        init.board.style.display = "grid";
        init.restartBtn.style.display = "block";
        init.form.style.display = "none";

        init.playerElement.textContent = `${player1.name}: ${player1.marker}`;
        init.playerElement.style.display = "block";
    });

    const setMark = (player) => {
        let nextPlayer = player.marker === "O" ? state.properties.p2 : state.properties.p1;

        state.properties.currentPlayer = nextPlayer
        init.playerElement.textContent = `${nextPlayer.name}: ${nextPlayer.marker}`  
    };

    const reset = () => {
        state.board = state.board.map(v => ({ ...v, value: ""}));
        state.properties.gameOver = false;
        state.properties.currentPlayer = state.properties.p1;
        init.allCells.forEach(cell => (cell.textContent= ""));
        init.playerElement.textContent = 
            `${state.properties.p1.name}: ${state.properties.p1.marker}`;
    };

    return { state, setMark, reset };
})();

function playerObject(value, marker, name) {
    return {
        value: value,
        marker: marker,
        name: name
    }
}

function controller(player1, player2) {
    return {
        currentPlayer: player1,
        gameOver: false,
        p1: player1,
        p2: player2
    };
};

const gameController = (cell) => {
    let board = gameBoard.state.board;
    let props = gameBoard.state.properties;

    if (props.gameOver === true) return;
    if (board[cell.id-1].value !== "") return;

    board[cell.id-1].value = props.currentPlayer;

    cell.textContent = props.currentPlayer.marker;
    
    if (winCheck.winner(props.currentPlayer)) return;

    if (winCheck.tie()) return;

    gameBoard.setMark(props.currentPlayer);

};

const winCheck = (function() {
    const winCondition = [
        [1,2,3], [4,5,6], [7,8,9], [1,4,7],
        [2,5,8], [3,6,9], [1,5,9], [3,5,7]
    ];

    const winner = (player) => {

        let props = gameBoard.state.properties;

        let win = false;
        const playerValues = gameBoard.state.board
            .filter(item => item.value === player)
            .map(cell => cell.id);

        for (const arr of winCondition) {
            if (arr.every(n => playerValues.includes(n))) {

                init.playerElement.textContent = `${player.name } is the Winner!`;
                win = true;
                props.gameOver = win;

                break;
            }
        }

        return win;
    }

    const tie = () => {
        let board = gameBoard.state.board
        let props = gameBoard.state.properties;

        let filledCells = board.filter(item => item.value !== "");

        if (filledCells.length === 9) {
            init.playerElement.textContent = `Game is a Tie! Click 'Restart' to play again!`;
            props.gameOver = true;
            
            return true;
        }

        return false;
    }

    return {winner, tie}
})();