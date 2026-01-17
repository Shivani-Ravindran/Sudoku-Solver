function createGrid(gridElement, editable = false) {
    gridElement.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        const input = document.createElement("input");
        input.maxLength = 1;
        input.disabled = !editable;
        if (editable) {
            input.addEventListener("input", function () {
                if (this.value > 9) this.value = 9;
                if (this.value < 1 || this.value === "0") this.value = "";
            });
        }
        gridElement.appendChild(input);
    }
}

function clearGrid() {
    stopSolving = true;   
    createGrid(document.getElementById("input-grid"), true);
    createGrid(document.getElementById("naive-grid"));
    createGrid(document.getElementById("best-grid"));
    createGrid(document.getElementById("ga-grid"));

    document.getElementById("message").innerText = "";
}


let stopSolving = false;
const easyBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],

  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],

  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];


createGrid(document.getElementById("input-grid"), true);
setBoardToGrid(document.getElementById("input-grid"), easyBoard);
createGrid(document.getElementById("naive-grid"));
createGrid(document.getElementById("best-grid"));
createGrid(document.getElementById("ga-grid"));


document.querySelector(".solveBtn").addEventListener("click", () => {
    stopSolving = false;
    const inputGrid = document.getElementById("input-grid");

    const baseBoard = getBoardFromGrid(inputGrid);

    document.querySelector(".bfs-msg").innerHTML = "&nbsp;";
    document.querySelector(".dfs-msg").innerHTML = "&nbsp;";
    document.querySelector(".ga-msg").innerHTML = "&nbsp;";

    solveSudokuNaive(
        baseBoard.map(r => [...r]),
        document.getElementById("naive-grid")
    );

    solveSudokuBestFirst(
        baseBoard.map(r => [...r]),
        document.getElementById("best-grid")
    );

    solveSudokuGA(
        baseBoard.map(r => [...r]),
        document.getElementById("ga-grid")
    );
});


function getBoardFromGrid(gridElement) {
    const cells = gridElement.querySelectorAll("input");
    let board = [];

    for (let i = 0; i < 9; i++) {
        board.push([]);
        for (let j = 0; j < 9; j++) {
            let val = cells[i * 9 + j].value;
            board[i][j] = val === "" ? 0 : parseInt(val);
        }
    }
    return board;
}

function setBoardToGrid(gridElement, board) {
    const cells = gridElement.querySelectorAll("input");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells[i * 9 + j].value = board[i][j] || "";
        }
    }
}



function isValid(board,num,i,j){
    for(let col=0;col<9;col++){
        if(num === board[i][col]){
            return false;
        }
    }
    for(let row=0;row<9;row++){
        if(num === board[row][j]){
            return false;
        }
    }
    let boxRow = Math.floor(i / 3) * 3;
    let boxCol = Math.floor(j / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Naive DFS
async function solveSudokuNaive(board, grid){
    if (stopSolving) return false;
    let ij = find0(board);
    if (!ij) {
        document.querySelector(".dfs-msg").innerHTML = "Solved";
        return true; 
    }
    for(let num=1;num<=9;num++){
        if(isValid(board,num,ij[0],ij[1])){
            board[ij[0]][ij[1]] = num;
            setBoardToGrid(grid,board);

            await sleep(1);

            if(await solveSudokuNaive(board,grid)) return true; 
            board[ij[0]][ij[1]] = 0;
            setBoardToGrid(grid,board);

        }
    }
    return false;
}

function find0(board){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(board[i][j] === 0){
                return [i,j];
            }
        }
    }
}

//Best-First 
async function solveSudokuBestFirst(board,grid){
    if (stopSolving) return false;
    let ij = findBestCell(board);
    if (!ij) {
        document.querySelector(".bfs-msg").innerHTML = "Solved";
        return true; 
    }
    for(let num=1;num<=9;num++){
        if(isValid(board,num,ij[0],ij[1])){
            board[ij[0]][ij[1]] = num;
            setBoardToGrid(grid,board);

            await sleep(1);

            if(await solveSudokuBestFirst(board,grid)) return true; 
            board[ij[0]][ij[1]] = 0;
            setBoardToGrid(grid,board);
        }
    }
    return false;
}

function findBestCell(board){
    let min = 10;
    let ij = null;
    for (let i=0;i<9;i++){
        for (let j=0;j<9;j++){
            if(board[i][j] !== 0) continue; 
            let count = 0;
            for(let num=1; num<=9; num++){
                if(isValid(board,num,i,j)) count++;
            }
            if(count < min){
                min = count;
                ij = [i,j];
            }
        }
    }
    return ij;
}


//Genetic Algorithms
async function solveSudokuGA(board,grid){
    if (stopSolving) return false;
    const populationSize = 50;
    const mutationRate = 0.1;
    const maxGenerations = 1000;

    let population = [];
    for (let i = 0; i < populationSize; i++) {
        population.push(generateRandomBoard(board));
    }

    for (let gen = 0; gen < maxGenerations; gen++) {
        for (let i = 0; i < populationSize; i++) { // Check if any board is solved
            if (isBoardSolved(population[i])) {
                setBoardToGrid(grid,population[i]);
                document.querySelector(".ga-msg").innerHTML = "Solved";
                return population[i];
            }
        }
        let parents = selectParents(population); //Selection

        population.sort((a, b) => fitness(a) - fitness(b));
        let newPopulation = [population[0], population[1]];

        while (newPopulation.length < populationSize) { //Reproduction by crossover and mutation
            let [p1, p2] = pickTwo(parents);
            let child = crossover(p1, p2, board);
            child = mutate(child, mutationRate, board);
            newPopulation.push(child);
        }

        newPopulation.sort((a, b) => fitness(a) - fitness(b));
        population = newPopulation;
        setBoardToGrid(grid,population[0]); // best in the generation
        await sleep(5);
    }
    document.querySelector(".ga-msg").innerHTML = "Past number of generations. Likely not solved";
}

function fitness(board) {
    let score = 0;
    // Row conflicts
    for (let r = 0; r < 9; r++) {
        let seen = new Set();
        for (let c = 0; c < 9; c++) {
            let val = board[r][c];
            if (val === 0) continue;
            if (seen.has(val)) score++;
            else seen.add(val);
        }
    }
    // Column conflicts
    for (let c = 0; c < 9; c++) {
        let seen = new Set();
        for (let r = 0; r < 9; r++) {
            let val = board[r][c];
            if (val === 0) continue;
            if (seen.has(val)) score++;
            else seen.add(val);
        }
    }
    // Box conflicts
    for (let br = 0; br < 9; br += 3) {
        for (let bc = 0; bc < 9; bc += 3) {
            let seen = new Set();
            for (let r = br; r < br + 3; r++) {
                for (let c = bc; c < bc + 3; c++) {
                    let val = board[r][c];
                    if (val === 0) continue;
                    if (seen.has(val)) score++;
                    else seen.add(val);
                }
            }
        }
    }

    return score;
}

function isBoardSolved(board) {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if (!isValid(board, board[i][j], i, j)) return false;
    return true;
}


function generateRandomBoard(originalBoard) {
    let board = originalBoard.map(row => [...row]);

    for (let i = 0; i < 9; i++) {
        let used = new Set();
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) used.add(board[i][j]);
        }

        let nums = [];
        for (let n = 1; n <= 9; n++) {
            if (!used.has(n)) nums.push(n);
        }

        nums.sort(() => Math.random() - 0.5);

        let idx = 0;
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                board[i][j] = nums[idx++];
            }
        }
    }
    return board;
}


function selectParents(population){
    let boardWithFitness = population.map((board, i) => {
        return { board: board, score: fitness(board) };
    });
    boardWithFitness.sort((a, b) => a.score - b.score);

    let numParents = Math.floor(population.length / 2);
    let parents = boardWithFitness.slice(0, numParents).map(obj => obj.board);

    return parents;
}

function pickTwo(parents){
    let i = Math.floor(Math.random() * parents.length);
    let j = Math.floor(Math.random() * parents.length);
    while (i === j) j = Math.floor(Math.random() * parents.length);
    return [parents[i], parents[j]];
}

function crossover(p1, p2, fixed) {
    let child = [];
    for (let i = 0; i < 9; i++) {
        child.push(
            Math.random() < 0.5
                ? [...p1[i]]
                : [...p2[i]]
        );
    }
    return child;
}


function mutate(board, mutationRate, fixed) {
    let newBoard = board.map(row => [...row]);

    for (let i = 0; i < 9; i++) {
        if (Math.random() < mutationRate) {
            // Swap two non-fixed numbers in the row
            let freeCells = [];
            for (let j = 0; j < 9; j++) if (fixed[i][j] === 0) freeCells.push(j);

            if (freeCells.length >= 2) {
                // Pick two cells with highest conflicts to swap
                freeCells.sort((a, b) => countConflicts(newBoard, i, b) - countConflicts(newBoard, i, a));
                let a = freeCells[0];
                let b = freeCells[1];
                [newBoard[i][a], newBoard[i][b]] = [newBoard[i][b], newBoard[i][a]];
            }
        }
    }

    // Also mutate within 3x3 boxes
    for (let br = 0; br < 9; br += 3) {
        for (let bc = 0; bc < 9; bc += 3) {
            if (Math.random() < mutationRate) {
                let freeCells = [];
                for (let r = br; r < br + 3; r++) {
                    for (let c = bc; c < bc + 3; c++) {
                        if (fixed[r][c] === 0) freeCells.push([r, c]);
                    }
                }

                if (freeCells.length >= 2) {
                    let [r1, c1] = freeCells[Math.floor(Math.random() * freeCells.length)];
                    let [r2, c2] = freeCells[Math.floor(Math.random() * freeCells.length)];
                    [newBoard[r1][c1], newBoard[r2][c2]] = [newBoard[r2][c2], newBoard[r1][c1]];
                }
            }
        }
    }

    return newBoard;
}

function countConflicts(board, row, col) {
    let val = board[row][col];
    if (val === 0) return 0;
    let conflicts = 0;

    // Row & column
    for (let i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === val) conflicts++;
        if (i !== row && board[i][col] === val) conflicts++;
    }

    // Box
    let br = Math.floor(row / 3) * 3;
    let bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
            if ((r !== row || c !== col) && board[r][c] === val) conflicts++;
        }
    }

    return conflicts;
}
