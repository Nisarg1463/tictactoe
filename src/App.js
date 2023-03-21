import { useState, React } from 'react'
import './App.css'

function App() {
  return <Game />
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [changeHistory, setchangeHistory] = useState([Array(2).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [descending, setDescending] = useState(false)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history.at(currentMove)

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setchangeHistory([...changeHistory, [Math.floor(i / 3) + 1, (i % 3) + 1]])
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    if (descending) {
      move = history.length - 1 - move
    }
    if (move === history.length - 1) {
      description = 'You are at move #' + move
    } else if (move > 0) {
      description =
        'Go to move #' +
        move +
        '(' +
        changeHistory[move][0] +
        ',' +
        changeHistory[move][1] +
        ')'
    } else {
      description = 'Go to game start'
    }
    return (
      <li key={move} className="history">
        {move === history.length - 1 ? (
          description
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <b className="descending">Descending:</b>
          <input
            type="checkbox"
            id="switch"
            className="checkbox toggle"
            onChange={() => setDescending(!descending)}
          />
          <label htmlFor="switch" className="toggle"></label>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  let draw = true
  for (let i of squares) {
    if (!i) {
      draw = false
    }
  }

  const cells = calculateWinner(squares)
  let winner
  if (cells) {
    winner = squares[cells[0]]
  }
  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else if (draw) {
    status = 'Match draw'
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  function clickHandler(i) {
    if (squares[i] || calculateWinner(squares)) return
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares, i)
  }

  let board = []
  for (let i = 0; i < 3; i++) {
    let row = []
    for (let j = 0; j < 3; j++) {
      row = [
        ...row,
        <Square
          value={squares[i * 3 + j]}
          onSquareClick={() => clickHandler(i * 3 + j)}
          helpedWinning={cells ? cells.includes(i * 3 + j) : false}
        />,
      ]
    }
    board = [...board, BoardRow(row)]
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  )
}

function BoardRow(squares) {
  return <div className="board-row">{squares}</div>
}

function Square({ value, onSquareClick, helpedWinning = false }) {
  let classname = 'square'
  if (helpedWinning) classname = classname + ' highlight'
  console.log(classname)
  console.log(value)
  return (
    <button className={classname} onClick={onSquareClick}>
      {value}
    </button>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return lines[i]
    }
  }

  return null
}

export default App
