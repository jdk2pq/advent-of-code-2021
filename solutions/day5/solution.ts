import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '0,9 -> 5,9\n' +
    '8,0 -> 0,8\n' +
    '9,4 -> 3,4\n' +
    '2,2 -> 2,1\n' +
    '7,0 -> 7,4\n' +
    '6,4 -> 2,0\n' +
    '0,9 -> 2,9\n' +
    '3,4 -> 1,4\n' +
    '0,0 -> 8,8\n' +
    '5,5 -> 8,2'
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
  const matrix: Array<Array<number>> = []
  inputAsArray.forEach(line => {
    const [firstCoordinate, secondCoordinate] = line.split(' -> ')
    const [x1, y1] = firstCoordinate.split(',').map(val => Number(val))
    const [x2, y2] = secondCoordinate.split(',').map(val => Number(val))
    if (x1 === x2) {
      const minY = Math.min(y1, y2)
      const maxY = Math.max(y1, y2)
      log({ minY, maxY }, debug)
      for (let y = minY; y <= maxY; y++) {
        if (!matrix[x1]) {
          matrix[x1] = []
          matrix[x1][y] = 0
        }
        if (!matrix[x1][y]) {
          matrix[x1][y] = 1
        } else {
          matrix[x1][y] += 1
        }
      }
    }
    if (y1 === y2) {
      const minX = Math.min(x1, x2)
      const maxX = Math.max(x1, x2)
      log({ minX, maxX }, debug)
      for (let x = minX; x <= maxX; x++) {
        if (!matrix[x]) {
          matrix[x] = []
          matrix[x][y1] = 0
        }
        if (!matrix[x][y1]) {
          matrix[x][y1] = 1
        } else {
          matrix[x][y1] += 1
        }
      }
    }
  })
  log({ matrix: matrix.flat() }, debug)

  const solution = matrix.flat().filter(val => val >= 2).length
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
  const matrix: Array<Array<number>> = []
  inputAsArray.forEach(line => {
    const [firstCoordinate, secondCoordinate] = line.split(' -> ')
    const [x1, y1] = firstCoordinate.split(',').map(val => Number(val))
    const [x2, y2] = secondCoordinate.split(',').map(val => Number(val))
    if (x1 === x2) {
      const minY = Math.min(y1, y2)
      const maxY = Math.max(y1, y2)
      log({ minY, maxY }, debug)
      for (let y = minY; y <= maxY; y++) {
        if (!matrix[x1]) {
          matrix[x1] = []
          matrix[x1][y] = 0
        }
        if (!matrix[x1][y]) {
          matrix[x1][y] = 1
        } else {
          matrix[x1][y] += 1
        }
      }
    } else if (y1 === y2) {
      const minX = Math.min(x1, x2)
      const maxX = Math.max(x1, x2)
      log({ minX, maxX }, debug)
      for (let x = minX; x <= maxX; x++) {
        if (!matrix[x]) {
          matrix[x] = []
          matrix[x][y1] = 0
        }
        if (!matrix[x][y1]) {
          matrix[x][y1] = 1
        } else {
          matrix[x][y1] += 1
        }
      }
    } else {
      let workingX = x1
      let workingY = y1
      while (workingX !== x2 && workingY !== y2) {
        if (!matrix[workingX]) {
          matrix[workingX] = []
          matrix[workingX][workingY] = 0
        }
        if (!matrix[workingX][workingY]) {
          matrix[workingX][workingY] = 1
        } else {
          matrix[workingX][workingY] += 1
        }
        workingX = x1 > x2 ? workingX - 1 : workingX + 1
        workingY = y1 > y2 ? workingY - 1 : workingY + 1
      }
      
      // fill in final coordinate
      if (!matrix[x2]) {
        matrix[x2] = []
        matrix[x2][y2] = 0
      }
      if (!matrix[x2][y2]) {
        matrix[x2][y2] = 1
      } else {
        matrix[x2][y2] += 1
      }
    }
  })
  log({ matrix: matrix.flat() }, debug)

  const solution = matrix.flat().filter(val => val >= 2).length
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
