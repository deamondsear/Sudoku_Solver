const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle:'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
    .end((err, res) => {
      assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
    })
  })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .end((err, res) => {
      assert.deepEqual(res.body, { error: 'Required field missing' })
    })
  })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/solve')
    .send({puzzle:'1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
    .end((err, res) => {
      assert.deepEqual(res.body, { error: "Invalid characters in puzzle" })
    })
  })

  test('Solve a puzzle with incorrect length: POST request to /api/solve', () => {
  chai
  .request(server)
  .keepOpen()
  .post('/api/solve')
  .send({puzzle:'15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
  .end((err, res) => {
    assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" })
  })
  })

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', () => {
  chai
  .request(server)
  .keepOpen()
  .post('/api/solve')
  .send({puzzle:'115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
  .end((err, res) => {
    assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
  })
  })

  test('Check a puzzle placement with all fields: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '7'})
    .end((err, res) => {
      assert.deepEqual(res.body, {valid: true})
    })
  })

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '1'})
    .end((err, res) => {
      assert.deepEqual(res.body.conflict, ['row'])
    })
  })

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '1'})
    .end((err, res) => {
      assert.deepEqual(res.body.conflict, ['row', 'column'])
    })
  })

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '9'})
    .end((err, res) => {
      assert.deepEqual(res.body.conflict, ['row', 'column', 'region'])
    })
  })

  test('Check a puzzle placement with missing required fields: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '', coordinate: 'A2', value: '9'})
    .end((err, res) => {
      assert.deepEqual(res.body, {error: 'Required field(s) missing'})
    })
  })

  test('Check a puzzle placement with invalid characters: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: 'a.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '9'})
    .end((err, res) => {
      assert.deepEqual(res.body, { error: "Invalid characters in puzzle" })
    })
  })

  test('Check a puzzle placement with incorrect length: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '9'})
    .end((err, res) => {
      assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" })
    })
  })

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'Q2', value: '9'})
    .end((err, res) => {
      assert.deepEqual(res.body, {error: "Invalid coordinate"})
    })
  })

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', () => {
    chai
    .request(server)
    .keepOpen()
    .post('/api/check')
    .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: 's'})
    .end((err, res) => {
      assert.deepEqual(res.body, {error: "Invalid value" })
    })
  })
});

