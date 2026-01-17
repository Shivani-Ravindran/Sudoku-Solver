# Sudoku Solver

A web-based Sudoku solver that demonstrates three solving algorithms:

- **Naive DFS**: Tries all possibilities recursively until it finds a solution.
- **Best-First Search**: Chooses the empty cell with the fewest possible numbers first, improving efficiency.
- **Genetic Algorithm**: Generates a population of candidate boards, selects the best boards, performs crossover and mutation, and evolves the population until a valid solution is found.

## Features

- Input your own Sudoku puzzle or use preloaded board.
- Visualize how each algorithm solves the puzzle step by step.
- Stop solving at any time with the **Clear** button.
- Displays a message when a solution is found or if GA couldn’t solve within the maximum generations.

## Notes

- The GA might not always find a solution for very hard boards within a limited number of generations.
- You can adjust the GA parameters (`populationSize`, `mutationRate`, `maxGenerations`) in `script.js` to improve performance.

