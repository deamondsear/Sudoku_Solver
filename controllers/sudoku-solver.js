class SudokuSolver {
    validate(puzzleString) {
        if (!puzzleString) {
            return { error: 'Required field missing' };
        }
        if (puzzleString.length !== 81) {
            return { error: 'Expected puzzle to be 81 characters long' };
        }
        if (/[^1-9.]/g.test(puzzleString)) {
            return { error: 'Invalid characters in puzzle' };
        }
        return true;
    }

    parsePuzzle(puzzleString) {
        const SUDOKU_SIZE = 9;
        const EMPTY_CELL_SYMBOL = '.';
        return Array.from({ length: SUDOKU_SIZE }, (_, rowIndex) =>
            puzzleString
                .slice(rowIndex * SUDOKU_SIZE, (rowIndex + 1) * SUDOKU_SIZE)
                .split('')
                .map((char) =>
                    char === EMPTY_CELL_SYMBOL ? 0 : parseInt(char)
                )
        );
    }

    checkRowPlacement(puzzleString, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (puzzleString[row][i] == value) {
                // For the parseInt in parsePuzzle purpose using == instead of ===
                return false;
            }
        }
        return true;
    }

    checkColPlacement(puzzleString, row, column, value) {
        for (let i = 0; i < 9; i++) {
            if (puzzleString[i][column] == value) {
                return false;
            }
        }
        return true;
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        const boxSize = Math.sqrt(9);
        const boxRowStart = Math.floor(row / boxSize) * boxSize;
        const boxColStart = Math.floor(column / boxSize) * boxSize;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (puzzleString[boxRowStart + i][boxColStart + j] == value) {
                    return false;
                }
            }
        }
        return true;
    }

    solve(puzzleString) {
        const grid = this.parsePuzzle(puzzleString);
        const solve = (grid) => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (
                                this.checkColPlacement(grid, row, col, num) &&
                                this.checkRowPlacement(grid, row, col, num) &&
                                this.checkRegionPlacement(grid, row, col, num)
                            ) {
                                grid[row][col] = num;
                                if (solve(grid)) {
                                    return true;
                                }
                                grid[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };
        if (!solve(grid)) {
            return false;
        }
        return grid.flat().join('');
    }
}

module.exports = SudokuSolver;
