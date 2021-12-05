import { read } from 'promise-path'
import { log, reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1\n' +
    '\n' +
    '22 13 17 11  0\n' +
    ' 8  2 23  4 24\n' +
    '21  9 14 16  7\n' +
    ' 6 10  3 18  5\n' +
    ' 1 12 20 15 19\n' +
    '\n' +
    ' 3 15  0  2 22\n' +
    ' 9 18 13 17  5\n' +
    '19  8  7 25 23\n' +
    '20 11 10 24  4\n' +
    '14 21 16 12  6\n' +
    '\n' +
    '14 21 17 24  4\n' +
    '10 16 15  9 19\n' +
    '18  8 23 26 20\n' +
    '22 11 13  6  5\n' +
    ' 2  0 12  3  7'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  const bingoNumbers = inputAsArray[0].split(',').map(val => Number(val))
  const bingoBoards = input
    .split('\n\n')
    .slice(1)
    .map(bingoBoard => {
      return bingoBoard.split('\n').map(line =>
        line
          .split(' ')
          .filter(val => !!val)
          .map(val => {
            return {
              number: Number(val),
              marked: bingoNumbers.slice(0, 5).includes(Number(val))
            }
          })
      )
    })
  log({ bingoNumbers, bingoBoards }, debug)
  let idx = 5
  let bingoWinner

  while (bingoNumbers[idx] !== undefined && bingoWinner === undefined) {
    const bingoNumber = bingoNumbers[idx]
    log({ bingoNumber, idx }, debug)
    for (const matrix of bingoBoards) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          matrix[i][j].marked = matrix[i][j].marked
            ? true
            : matrix[i][j].number === bingoNumber
        }
      }
      if (debug) {
        matrix.forEach(line => {
          console.log(line.map(val => `${val.number}${val.marked ? '*' : ''}`))
        })
      }
      bingoWinner = matrix.find(line => {
        const allMarked = line.every(val => val.marked)
        if (allMarked) {
          log(
            {
              allMarkedRow: line.map(val => val.number),
              bingoNumber: bingoNumber
            },
            debug
          )
        }
        return allMarked
      })
        ? matrix
        : undefined
      if (bingoWinner) {
        break
      }
      for (let i = 0; i < 5; i++) {
        const column: Array<{ number: number; marked: boolean }> = []
        for (let j = 0; j < 5; j++) {
          column.push(matrix[j][i])
        }
        const allMarked = column.every(val => val.marked)

        if (allMarked) {
          log({ allMarkedColumn: column.map(val => val.number) }, debug)
        }
        bingoWinner = allMarked ? matrix : undefined
        if (bingoWinner) {
          break
        }
      }
      log('\n', debug)
      if (bingoWinner) {
        break
      }
    }
    if (bingoWinner) {
      break
    }
    idx++
  }

  if (debug) {
    console.log({ bingoWinner })
    bingoWinner.forEach(line => {
      console.log(line.map(val => val.number))
    })
  }

  const unmarkedValues = bingoWinner
    .flat()
    .filter(val => !val.marked)
    .reduce((acc, val) => {
      acc += val.number
      return acc
    }, 0)
  const lastBingoNumber = bingoNumbers[idx]

  log({ unmarkedValues, lastBingoNumber }, debug)

  const solution = unmarkedValues * lastBingoNumber
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  const bingoNumbers = inputAsArray[0].split(',').map(val => Number(val))
  const bingoBoards = input
    .split('\n\n')
    .slice(1)
    .map(bingoBoard => {
      return bingoBoard.split('\n').map(line =>
        line
          .split(' ')
          .filter(val => !!val)
          .map(val => {
            return {
              number: Number(val),
              marked: bingoNumbers.slice(0, 5).includes(Number(val))
            }
          })
      )
    })
  if (debug) {
    console.log({ bingoNumbers, bingoBoards })
  }
  let idx = 5
  let bingoWinners: any[] = []

  while (
    bingoNumbers[idx] !== undefined &&
    bingoWinners.length !== bingoBoards.length
  ) {
    const bingoNumber = bingoNumbers[idx]
    if (debug) {
      console.log({ bingoNumber, idx })
    }
    for (let boardIdx = 0; boardIdx < bingoBoards.length; boardIdx++) {
      const matrix = bingoBoards[boardIdx]
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          matrix[i][j].marked = matrix[i][j].marked
            ? true
            : matrix[i][j].number === bingoNumber
        }
      }
      if (debug) {
        matrix.forEach(line => {
          console.log(line.map(val => `${val.number}${val.marked ? '*' : ''}`))
        })
      }
      const bingoWinner = matrix.find(line => {
        const allMarked = line.every(val => val.marked)
        if (allMarked && debug) {
          console.log({
            allMarkedRow: line.map(val => val.number),
            bingoNumber: bingoNumber
          })
        }
        return allMarked
      })
      if (bingoWinner && !bingoWinners.includes(boardIdx)) {
        bingoWinners.push(boardIdx)
      }
      for (let i = 0; i < 5; i++) {
        const column: Array<{ number: number; marked: boolean }> = []
        for (let j = 0; j < 5; j++) {
          column.push(matrix[j][i])
        }
        const allMarked = column.every(val => val.marked)

        if (allMarked && debug) {
          console.log({ allMarkedColumn: column.map(val => val.number) })
        }
        if (!bingoWinners.includes(boardIdx) && allMarked) {
          bingoWinners.push(boardIdx)
        }
      }
      if (debug) {
        console.log('\n')
      }
    }
    idx++
  }

  if (debug) {
    console.log({ bingoWinners })
  }

  const lastBingoWinner = bingoBoards[bingoWinners[bingoWinners.length - 1]]

  if (debug) {
    console.log({ lastBingoWinner })
    lastBingoWinner.forEach(line => {
      console.log(line.map(val => val.number))
    })
  }

  const unmarkedValues = lastBingoWinner
    .flat()
    .filter(val => !val.marked)
    .reduce((acc, val) => {
      acc += val.number
      return acc
    }, 0)
  const lastBingoNumber = bingoNumbers[idx - 1]

  if (debug) {
    console.log({ unmarkedValues, lastBingoNumber })
  }

  const solution = unmarkedValues * lastBingoNumber
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
