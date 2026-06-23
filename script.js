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
    document.querySelector(".bfs-msg").innerHTML = "&nbsp;";
    document.querySelector(".dfs-msg").innerHTML = "&nbsp;";
    document.querySelector(".ga-msg").innerHTML = "&nbsp;";
    createGrid(document.getElementById("input-grid"), true);
    createGrid(document.getElementById("naive-grid"));
    createGrid(document.getElementById("best-grid"));
    createGrid(document.getElementById("ga-grid"));

    document.getElementById("message").innerText = "";
}


let stopSolving = false;
const easyBoard = [
  [0, 2, 0, 0, 0, 0, 0, 0, 0],
  [9, 5, 0, 0, 0, 0, 0, 8, 0],
  [1, 0, 8, 2, 3, 6, 0, 0, 0],

  [0, 0, 7, 0, 0, 2, 6, 0, 0],
  [3, 0, 5, 8, 4, 0, 7, 0, 2],
  [0, 0, 1, 0, 0, 9, 5, 0, 0],

  [0, 0, 0, 9, 8, 7, 1, 0, 5],
  [0, 8, 0, 0, 0, 0, 0, 2, 3],
  [0, 0, 0, 0, 0, 0, 0, 4, 0]
];

const easyBoard_2 = [
  [0, 0, 5, 2, 4, 8, 0, 0, 0],
  [3, 0, 8, 0, 9, 0, 0, 0, 0],
  [4, 7, 0, 0, 0, 0, 0, 5, 0],

  [0, 0, 9, 0, 6, 0, 5, 0, 0],
  [0, 0, 7, 0, 5, 0, 3, 0, 0],
  [0, 0, 1, 7, 0, 3, 2, 0, 0],

  [5, 0, 0, 0, 0, 0, 0, 7, 6],
  [0, 0, 0, 0, 7, 0, 4, 9, 0],
  [0, 0, 0, 1, 2, 4, 8, 0, 0]
];

const easyBoard_3 = [
  [0, 3, 9, 0, 0, 0, 0, 0, 5],
  [5, 0, 0, 1, 3, 6, 0, 0, 0],
  [6, 2, 0, 0, 7, 0, 0, 0, 0],

  [7, 0, 0, 0, 4, 0, 0, 5, 0],
  [9, 0, 0, 0, 5, 0, 0, 2, 0],
  [8, 0, 0, 9, 0, 2, 0, 1, 0],

  [0, 0, 0, 0, 9, 0, 0, 3, 7],
  [0, 0, 0, 8, 1, 3, 0, 6, 0],
  [0, 5, 0, 0, 0, 0, 4, 0, 9]
];

const easyBoard_4 = [
  [1, 7, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 5, 8, 1, 2, 0, 0, 0],
  [6, 0, 2, 0, 3, 0, 0, 0, 0],

  [0, 0, 9, 7, 0, 6, 0, 0, 8],
  [0, 0, 3, 0, 4, 0, 0, 0, 5],
  [0, 0, 7, 0, 5, 0, 0, 0, 6],

  [0, 0, 0, 9, 8, 1, 0, 0, 2],
  [5, 0, 0, 0, 0, 0, 7, 4, 0],
  [0, 0, 0, 0, 7, 0, 3, 0, 1]
];

const easyBoard_5 = [
  [9, 6, 0, 0, 0, 0, 7, 0, 0],
  [0, 8, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 7, 2, 1, 8, 0, 0, 0],

  [2, 0, 6, 5, 0, 7, 0, 8, 4],
  [0, 0, 3, 0, 9, 0, 0, 0, 6],
  [0, 0, 4, 0, 8, 0, 0, 0, 1],

  [0, 0, 0, 7, 4, 9, 0, 6, 3],
  [0, 0, 0, 0, 0, 0, 5, 0, 0],
  [0, 7, 0, 0, 0, 0, 8, 2, 0]
];

const mediumBoard_1 = [
  [0, 0, 0, 0, 0, 1, 9, 0, 6],
  [6, 3, 0, 7, 8, 0, 0, 1, 0],
  [4, 2, 0, 0, 3, 0, 5, 0, 0],

  [1, 0, 0, 9, 0, 8, 3, 0, 0],
  [0, 0, 8, 0, 4, 2, 0, 0, 9],
  [0, 5, 2, 0, 0, 0, 4, 7, 0],

  [0, 0, 4, 3, 0, 0, 0, 2, 1],
  [7, 0, 5, 0, 0, 6, 0, 0, 0],
  [0, 6, 0, 8, 1, 0, 0, 9, 5]
];

const mediumBoard_2 = [
  [4, 0, 8, 0, 0, 3, 0, 0, 9],
  [9, 0, 2, 0, 1, 0, 0, 6, 0],
  [0, 0, 0, 5, 0, 8, 2, 3, 0],

  [5, 0, 4, 2, 0, 0, 0, 0, 1],
  [6, 0, 0, 0, 7, 0, 4, 0, 5],
  [0, 1, 0, 8, 5, 0, 0, 9, 0],

  [0, 9, 0, 7, 0, 0, 1, 0, 3],
  [0, 7, 3, 0, 4, 2, 0, 0, 0],
  [1, 0, 0, 0, 0, 6, 8, 0, 7]
];

const mediumBoard_3 = [
  [4, 9, 0, 0, 8, 0, 7, 0, 0],
  [0, 0, 0, 2, 0, 6, 5, 0, 4],
  [6, 3, 0, 0, 0, 5, 0, 9, 0],

  [3, 2, 0, 4, 0, 0, 0, 8, 0],
  [0, 0, 8, 6, 2, 0, 9, 0, 0],
  [0, 7, 0, 0, 1, 0, 0, 2, 3],

  [0, 0, 9, 1, 0, 0, 0, 5, 8],
  [0, 8, 0, 0, 0, 7, 0, 1, 6],
  [5, 0, 1, 0, 3, 4, 0, 0, 0]
];

const mediumBoard_4 = [
  [0, 0, 0, 0, 0, 1, 3, 0, 2],
  [4, 0, 3, 5, 6, 0, 0, 1, 0],
  [7, 0, 8, 4, 0, 0, 0, 0, 9],

  [0, 0, 1, 0, 2, 5, 0, 0, 4],
  [0, 5, 0, 8, 0, 7, 2, 0, 0],
  [9, 7, 0, 0, 0, 0, 0, 6, 8],

  [0, 9, 6, 0, 0, 3, 0, 0, 0],
  [3, 0, 0, 1, 5, 0, 9, 2, 0],
  [0, 8, 0, 0, 4, 0, 1, 7, 0]
];

const mediumBoard_5 = [
  [8, 9, 0, 4, 0, 2, 0, 0, 6],
  [0, 0, 0, 0, 6, 0, 3, 9, 0],
  [5, 1, 0, 8, 0, 0, 7, 0, 0],

  [0, 6, 0, 0, 4, 3, 8, 0, 0],
  [7, 0, 5, 0, 0, 0, 1, 0, 2],
  [0, 0, 4, 1, 5, 0, 0, 3, 0],

  [9, 0, 0, 6, 0, 4, 0, 7, 3],
  [0, 0, 1, 0, 0, 8, 0, 6, 5],
  [0, 2, 7, 0, 9, 0, 0, 0, 0]
];

const hardBoard_1 = [
  [8, 0, 0, 7, 0, 0, 0, 0, 9],
  [0, 0, 0, 0, 9, 0, 0, 0, 5],
  [0, 0, 0, 1, 0, 2, 0, 3, 0],

  [0, 0, 0, 9, 7, 0, 6, 5, 0],
  [0, 0, 6, 0, 1, 3, 7, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 4, 0, 0, 0, 0, 0, 1],
  [0, 0, 5, 0, 4, 0, 0, 9, 0],
  [2, 7, 0, 0, 0, 0, 0, 0, 0]
];

const hardBoard_2 = [
  [0, 0, 0, 0, 0, 0, 0, 7, 0],
  [0, 0, 0, 0, 0, 1, 9, 0, 2],
  [0, 6, 0, 0, 0, 0, 0, 8, 0],

  [3, 7, 0, 5, 0, 0, 0, 0, 0],
  [0, 0, 5, 7, 0, 3, 2, 0, 0],
  [8, 0, 0, 0, 0, 4, 0, 0, 0],

  [0, 5, 9, 0, 0, 0, 0, 0, 3],
  [4, 0, 0, 9, 0, 0, 5, 0, 0],
  [0, 0, 0, 1, 0, 7, 0, 0, 0]
];

const hardBoard_3 = [
  [0, 0, 0, 4, 0, 0, 6, 0, 0],
  [0, 0, 0, 0, 9, 3, 0, 5, 0],
  [2, 0, 0, 0, 7, 0, 4, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 9, 0, 5, 0, 0, 7],
  [0, 0, 0, 7, 4, 0, 0, 6, 1],

  [0, 6, 0, 8, 0, 0, 0, 4, 0],
  [0, 8, 0, 0, 0, 0, 9, 0, 0],
  [3, 0, 7, 0, 0, 0, 0, 0, 0]
];

const hardBoard_4 = [
  [0, 0, 0, 0, 0, 5, 9, 3, 0],
  [0, 0, 4, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 8],

  [7, 0, 8, 0, 2, 0, 0, 0, 0],
  [0, 2, 0, 0, 8, 7, 3, 0, 0],
  [1, 0, 0, 0, 0, 6, 0, 0, 0],

  [0, 9, 2, 0, 0, 0, 0, 7, 0],
  [0, 0, 0, 0, 5, 8, 0, 0, 0],
  [6, 0, 0, 0, 9, 0, 2, 0, 0]
];

const hardBoard_5 = [
  [0, 0, 1, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 5, 0, 0, 2, 9, 0],

  [8, 0, 4, 0, 0, 6, 0, 0, 0],
  [3, 0, 0, 7, 0, 0, 0, 0, 0],
  [0, 6, 0, 8, 0, 4, 9, 0, 0],

  [0, 2, 6, 0, 0, 0, 0, 8, 0],
  [7, 0, 0, 0, 0, 2, 6, 0, 0],
  [0, 0, 0, 4, 0, 5, 0, 0, 0]
];


let isBenchmarking = false;
let benchmarkChartInstance = null;


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

document.querySelector(".benchmarkBtn").addEventListener("click", () => {
    runBenchmark();
});

async function runBenchmark() {
    isBenchmarking = true;
    document.getElementById("benchmark-results").style.display = "block";
    document.getElementById("message").innerText = "Running benchmarks... this may take a few seconds.";
    if(benchmarkChartInstance) {
        benchmarkChartInstance.destroy();
    }
    
    // Give UI a moment to update
    await new Promise(r => setTimeout(r, 100));

    const puzzles = [
        { name: "Easy_1", board: easyBoard },
        { name: "Easy_2", board: easyBoard_2 },
        { name: "Easy_3", board: easyBoard_3 },
        { name: "Easy_4", board: easyBoard_4 },
        { name: "Easy_5", board: easyBoard_5 },
        { name: "Medium_1", board: mediumBoard_1 },
        { name: "Medium_2", board: mediumBoard_2 },
        { name: "Medium_3", board: mediumBoard_3 },
        { name: "Medium_4", board: mediumBoard_4 },
        { name: "Medium_5", board: mediumBoard_5 },
        { name: "Hard_1", board: hardBoard_1 },
        { name: "Hard_2", board: hardBoard_2 },
        { name: "Hard_3", board: hardBoard_3 },
        { name: "Hard_4", board: hardBoard_4 },
        { name: "Hard_5", board: hardBoard_5 },
    ];
    
    const algorithms = [
        { name: 'Naive DFS', func: solveSudokuNaive },
        { name: 'Best First', func: solveSudokuBestFirst },
        { name: 'Genetic Algorithm', func: solveSudokuGA }
    ];

    let results = {
        'Naive DFS': { times: [], success: 0, total: puzzles.length },
        'Best First': { times: [], success: 0, total: puzzles.length },
        'Genetic Algorithm': { times: [], success: 0, total: puzzles.length }
    };

    for (let p of puzzles) {
        for (let algo of algorithms) {
            let boardCopy = p.board.map(r => [...r]);
            stopSolving = false;
            
            let startTime = performance.now();
            let solved = await algo.func(boardCopy, null);
            let endTime = performance.now();
            
            let timeTaken = endTime - startTime;
            
            let isSolved = false;
            if (algo.name === 'Genetic Algorithm') {
                isSolved = solved && isBoardSolved(solved);
            } else {
                isSolved = solved;
            }

            if (isSolved) {
                results[algo.name].success++;
            }
            results[algo.name].times.push(timeTaken);
            
            // Allow UI/events to process briefly
            await new Promise(r => setTimeout(r, 10));
        }
    }

    isBenchmarking = false;
    document.getElementById("message").innerText = "Benchmarks complete.";
    renderBenchmarkResults(results);
}

function renderBenchmarkResults(results) {
    const labels = Object.keys(results);
    const avgTimes = labels.map(label => {
        const times = results[label].times;
        if (times.length === 0) return 0;
        const sum = times.reduce((a, b) => a + b, 0);
        return sum / times.length;
    });

    const statsContainer = document.getElementById("benchmark-stats");
    statsContainer.innerHTML = labels.map(label => {
        let successRate = Math.round((results[label].success / results[label].total) * 100);
        return `<p style="margin: 5px 0;"><strong>${label}:</strong> Success Rate: ${successRate}% (${results[label].success}/${results[label].total})</p>`;
    }).join("");

    const ctx = document.getElementById('benchmarkChart').getContext('2d');
    benchmarkChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Solve Time (ms)',
                data: avgTimes,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time in ms (Lower is better)'
                    }
                }
            }
        }
    });
}


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



function isValid(board, num, i, j) {
    // Check row (skipping current column)
    for (let col = 0; col < 9; col++) {
        if (col !== j && num === board[i][col]) {
            return false;
        }
    }
    // Check column (skipping current row)
    for (let row = 0; row < 9; row++) {
        if (row !== i && num === board[row][j]) {
            return false;
        }
    }
    // Check 3x3 box (skipping current cell)
    let boxRow = Math.floor(i / 3) * 3;
    let boxCol = Math.floor(j / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== i || c !== j) && board[r][c] === num) {
                return false;
            }
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
        if (!isBenchmarking) document.querySelector(".dfs-msg").innerHTML = "Solved";
        return true; 
    }
    for(let num=1;num<=9;num++){
        if(isValid(board,num,ij[0],ij[1])){
            board[ij[0]][ij[1]] = num;
            
            if (!isBenchmarking) {
                setBoardToGrid(grid,board);
                await sleep(1);
            }

            if(await solveSudokuNaive(board,grid)) return true; 
            board[ij[0]][ij[1]] = 0;
            if (!isBenchmarking) setBoardToGrid(grid,board);
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
        if (!isBenchmarking) document.querySelector(".bfs-msg").innerHTML = "Solved";
        return true; 
    }
    for(let num=1;num<=9;num++){
        if(isValid(board,num,ij[0],ij[1])){
            board[ij[0]][ij[1]] = num;
            if (!isBenchmarking) {
                setBoardToGrid(grid,board);
                await sleep(1);
            }

            if(await solveSudokuBestFirst(board,grid)) return true; 
            board[ij[0]][ij[1]] = 0;
            if (!isBenchmarking) setBoardToGrid(grid,board);
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
                if (!isBenchmarking) {
                    setBoardToGrid(grid,population[i]);
                    document.querySelector(".ga-msg").innerHTML = "Solved";
                }
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
        if (!isBenchmarking) {
            setBoardToGrid(grid,population[0]); // best in the generation
            await sleep(5);
        }
    }
    if (!isBenchmarking) document.querySelector(".ga-msg").innerHTML = "Past number of generations. Likely not solved";
    return population[0];
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
