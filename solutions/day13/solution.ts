import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '6,10\n' +
    '0,14\n' +
    '9,10\n' +
    '0,3\n' +
    '10,4\n' +
    '4,11\n' +
    '6,0\n' +
    '6,12\n' +
    '4,1\n' +
    '0,13\n' +
    '10,12\n' +
    '3,4\n' +
    '3,0\n' +
    '8,4\n' +
    '1,10\n' +
    '2,14\n' +
    '8,10\n' +
    '9,0\n' +
    '\n' +
    'fold along y=7\n' +
    'fold along x=5'
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
  const matrix: Array<Array<boolean>> = []
  const [points, folds] = input.split('\n\n')
  const pointsAsArray = points.split('\n')
  const maxX = pointsAsArray.reduce((acc, curr) => {
    const [x, y] = curr.split(',').map(Number)
    return Math.max(acc, x)
  }, 0)
  const foldsAsArray = folds.split('\n')
  pointsAsArray.forEach(point => {
    const [x, y] = point.split(',').map(Number)
    matrix[y] = matrix[y] || []
    matrix[y][x] = true
  })
  let visibleDots = 0
  const fold = foldsAsArray[0]
  // foldsAsArray.forEach(fold => {
  visibleDots = 0
  const split = fold.split(' ')
  const [direction, position] = split[split.length - 1].split('=')
  const positionAsNumber = Number(position)
  console.log({ direction, positionAsNumber })
  if (direction === 'y') {
    console.log('fold along y')
    for (let i = 1; i <= positionAsNumber; i++) {
      matrix[positionAsNumber - i] = matrix[positionAsNumber - i] || []
      for (let j = 0; j <= maxX; j++) {
        if (matrix[positionAsNumber + i] && matrix[positionAsNumber + i][j]) {
          log({ i: positionAsNumber - i, j }, debug)
          matrix[positionAsNumber - i][j] = true
          matrix[positionAsNumber + i][j] = false
        }
      }
    }
  } else {
    log('fold along x', debug)
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 1; j <= positionAsNumber; j++) {
        matrix[i] = matrix[i] || []
        if (matrix[i][positionAsNumber + j]) {
          log({ i: i, j: positionAsNumber - j }, debug)
          matrix[i][positionAsNumber - j] = true
          matrix[i][positionAsNumber + j] = false
        }
      }
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    let print = ''
    for (let j = 0; j <= maxX; j++) {
      if (matrix[i] && matrix[i][j]) {
        visibleDots++
        print += '#'
      } else {
        print += '.'
      }
    }
    if (debug) {
      console.log(print)
    }
  }
  if (debug) {
    console.log('\n')
  }
  // }
  const solution = visibleDots
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
  const matrix: Array<Array<boolean>> = []
  const [points, folds] = input.split('\n\n')
  const pointsAsArray = points.split('\n')
  const maxX = pointsAsArray.reduce((acc, curr) => {
    const [x, y] = curr.split(',').map(Number)
    return Math.max(acc, x)
  }, 0)
  const foldsAsArray = folds.split('\n')
  pointsAsArray.forEach(point => {
    const [x, y] = point.split(',').map(Number)
    matrix[y] = matrix[y] || []
    matrix[y][x] = true
  })
  let visibleDots = 0
  foldsAsArray.forEach(fold => {
    visibleDots = 0
    const split = fold.split(' ')
    const [direction, position] = split[split.length - 1].split('=')
    const positionAsNumber = Number(position)
    log({ direction, positionAsNumber }, debug)
    if (direction === 'y') {
      log('fold along y', debug)
      for (let i = 1; i <= positionAsNumber; i++) {
        matrix[positionAsNumber - i] = matrix[positionAsNumber - i] || []
        for (let j = 0; j <= maxX; j++) {
          if (matrix[positionAsNumber + i] && matrix[positionAsNumber + i][j]) {
            log({ i: positionAsNumber - i, j }, debug)
            matrix[positionAsNumber - i][j] = true
            matrix[positionAsNumber + i][j] = false
          }
        }
      }
    } else {
      log('fold along x', debug)
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 1; j <= positionAsNumber; j++) {
          matrix[i] = matrix[i] || []
          if (matrix[i][positionAsNumber + j]) {
            log({ i: i, j: positionAsNumber - j }, debug)
            matrix[i][positionAsNumber - j] = true
            matrix[i][positionAsNumber + j] = false
          }
        }
      }
    }
  })
  for (let i = 0; i < matrix.length; i++) {
    let print = ''
    for (let j = 0; j <= maxX; j++) {
      if (
        matrix[i] &&
        matrix[i].includes(true) &&
        // this was the trick to get it printing correctly
        matrix[i].slice(j).includes(true)
      ) {
        if (matrix[i] && matrix[i][j]) {
          visibleDots++
          print += '#'
        } else {
          print += '.'
        }
      }
    }
    if (print) {
      console.log(print)
    }
  }
  console.timeEnd('part 2')
}
