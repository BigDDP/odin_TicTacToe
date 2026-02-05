const init = (() => {
    const playerElement = document.getElementById("player");
    const allCells = document.querySelectorAll(".cell");
    const form = document.querySelector("form");
    const restartBtn = document.getElementById("restartBtn");
    const board = document.querySelector(".board");

    restartBtn.addEventListener("click", () => {
        if (
            gameBoard.state.properties === undefined 
            || gameBoard.state.properties === null
        ) return;
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

const controlDOM = (() => {
    const setStatus = (text) => {
        init.playerElement.textContent = text;
    };

    const showGameUI = () => {
        init.board.style.display = "grid";
        init.restartBtn.style.display = "block";
        init.form.style.display = "none";
        init.playerElement.style.display = "block";
    };

    const clearBoardUI = () => {
        init.allCells.forEach((cell) => (cell.textContent = ""));
    };

    const getProps = () => gameBoard.state.properties;

    // --- public UI API ---
    const formSubmit = (player1) => {
        showGameUI();
        setStatus(`${player1.name}: ${player1.marker}`);
    };

    const updateBoard = (cell, marker) => {
        cell.textContent = marker;
    };

    const setMark = (nextPlayer) => {
        setStatus(`${nextPlayer.name}: ${nextPlayer.marker}`);
    };

    const win = (player) => {
        setStatus(`${player.name} is the Winner!`);
    };

    const tie = () => {
        setStatus(`Game is a Tie! Click 'Restart' to play again!`);
    };

    const reset = () => {
        // UI-only reset
        clearBoardUI();

        // Update status only if props exist
        const props = getProps();
        if (!props) {
        setStatus("");
        init.playerElement.style.display = "none";
        return;
        }

        setStatus(`${props.p1.name}: ${props.p1.marker}`);
        init.playerElement.style.display = "block";
    };

    return {
        formSubmit,
        updateBoard,
        setMark,
        win,
        tie,
        reset,
    };
})();

const gameController = (() => {
    function playerObject(value, marker, name) {
        return {
            value: value,
            marker: marker,
            name: name
        }
    }

    init.allCells.forEach((cell) => {
        cell.addEventListener("click", () => {
            let board = gameBoard.state.board;
            let props = gameBoard.state.properties;

            if (!props) return;
            if (props.gameOver === true) return;
            if (board[cell.id-1].value !== "") return;

            board[cell.id-1].value = props.currentPlayer.marker;

            controlDOM.updateBoard(cell, props.currentPlayer.marker);

            if (winCheck.winner(props.currentPlayer.marker)) return;

            if (winCheck.tie()) return;

            gameBoard.setMark(props.currentPlayer);
        });
    });

    return {playerObject}
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

    function controller(player1, player2) {
        return {
            currentPlayer: player1,
            gameOver: false,
            p1: player1,
            p2: player2
        };
    };

    init.form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fd = new FormData(e.target);

        let player1 = gameController.playerObject("Player 1", "O", fd.get("player1"));
        let player2 = gameController.playerObject("Player 2", "X", fd.get("player2"));

        state.properties = controller(player1, player2);

        controlDOM.formSubmit(player1);
    });

    const setMark = (player) => {
        let nextPlayer = player.marker === "O" ? state.properties.p2 : state.properties.p1;

        state.properties.currentPlayer = nextPlayer;

        controlDOM.setMark(nextPlayer);
    };

    const reset = () => {
        state.board = state.board.map(v => ({ ...v, value: ""}));
        state.properties.gameOver = false;
        state.properties.currentPlayer = state.properties.p1;
        controlDOM.reset();
    };

    return { state, setMark, reset };
})();

const winCheck = (function() {
    const winCondition = [
        [1,2,3], [4,5,6], [7,8,9], [1,4,7],
        [2,5,8], [3,6,9], [1,5,9], [3,5,7]
    ];

    const winner = (marker) => {

        let props = gameBoard.state.properties;

        let win = false;
        const playerValues = gameBoard.state.board
            .filter(item => item.value === marker)
            .map(cell => cell.id);

        for (const arr of winCondition) {
            if (arr.every(n => playerValues.includes(n))) {

                const winnerPlayer = marker === props.p1.marker ? props.p1 : props.p2;
                controlDOM.win(winnerPlayer);

                props.gameOver = true;

                return true;
            }
        };

        return false;
    }

    const tie = () => {
        let board = gameBoard.state.board
        let props = gameBoard.state.properties;

        let filledCells = board.filter(item => item.value !== "");

        if (filledCells.length === 9) {
            controlDOM.tie();
            props.gameOver = true;
            
            return true;
        }

        return false;
    }

    return {winner, tie}
})();