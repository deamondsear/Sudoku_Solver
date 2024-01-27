'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
    let solver = new SudokuSolver();

    app.route('/api/check').post((req, res) => {
        if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
            res.json({ error: 'Required field(s) missing' });
            return;
        }
        if (solver.validate(req.body.puzzle) !== true) {
            res.json(solver.validate(req.body.puzzle));
            return;
        }

        const dictionary = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            E: 4,
            F: 5,
            G: 6,
            H: 7,
            I: 8,
        };
        const { puzzle, coordinate, value } = req.body;
        res.body = {};
        res.body.valid = true;
        res.body.conflict = [];

        if (!/^[A-I]{1}[1-9]{1}$/.test(coordinate)) {
            res.json({ error: 'Invalid coordinate' });
            return;
        }
        if (!/^[1-9]{1}$/.test(value)) {
            res.json({ error: 'Invalid value' });
            return;
        }
        const row = dictionary[coordinate[0]];
        const column = coordinate[1] - 1;
        const grid = solver.parsePuzzle(puzzle);
        if (solver.solve(req.body.puzzle)[row * 9 + column] == value) {
            res.json({ valid: res.body.valid });
            return;
        }
        if (!solver.checkRowPlacement(grid, row, column, value)) {
            res.body.conflict.push('row');
        }
        if (!solver.checkColPlacement(grid, row, column, value)) {
            res.body.conflict.push('column');
        }
        if (!solver.checkRegionPlacement(grid, row, column, value)) {
            res.body.conflict.push('region');
        }
        if (res.body.conflict.length === 0) {
            res.json({ valid: res.body.valid });
        } else {
            res.json({ valid: false, conflict: res.body.conflict });
        }
    });

    app.route('/api/solve').post((req, res) => {
        if (!req.body.puzzle) {
            res.json({ error: 'Required field missing' });
            return;
        }
        if (solver.validate(req.body.puzzle) !== true) {
            // Validate return true or object with error
            res.json(solver.validate(req.body.puzzle));
            return;
        }
        if (!solver.solve(req.body.puzzle)) {
            res.json({ error: 'Puzzle cannot be solved' });
            return;
        }
        res.json({ solution: solver.solve(req.body.puzzle) });
    });
};
