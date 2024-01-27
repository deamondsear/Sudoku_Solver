const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    assert.equal(
      solver.validate(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      ),
      true,
    );
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    assert.deepEqual(
      solver.validate(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a",
      ),
      { error: "Invalid characters in puzzle" },
    );
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.deepEqual(solver.validate("1.5..2.84..63.12.7.2."), {
      error: "Expected puzzle to be 81 characters long",
    });
  });

  test("Logic handles a valid row placement", () => {
    assert.equal(
      solver.checkRowPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        0,
        1,
        3,
      ),
      true,
    );
  });

  test("Logic handles an invalid row placement", () => {
    assert.equal(
      solver.checkRowPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        0,
        1,
        1,
      ),
      false,
    );
  });

  test("Logic handles a valid column placement", () => {
    assert.equal(
      solver.checkColPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        0,
        1,
        3,
      ),
      true,
    );
  });

  test("Logic handles an invalid column placement", () => {
    assert.equal(
      solver.checkColPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        1,
        1,
        2,
      ),
      false,
    );
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    assert.equal(
      solver.checkRegionPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        0,
        1,
        3,
      ),
      true,
    );
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    assert.equal(
      solver.checkRegionPlacement(
        solver.parsePuzzle(
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        ),
        0,
        1,
        2,
      ),
      false,
    );
  });

  test("Valid puzzle strings pass the solver", () => {
    assert.equal(
      typeof solver.solve(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      ),
      "string",
    );
  });

  test("Invalid puzzle strings fail the solver", () => {
    assert.deepEqual(
      solver.solve(
        "145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      ),
      false,
    );
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.equal(
      solver.solve(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      ),
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
    );
  });
});
