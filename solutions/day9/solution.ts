import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '2199943210\n' +
    '3987894921\n' +
    '9856789892\n' +
    '8767896789\n' +
    '9899965678'
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
  const inputAsNumbers = inputAsArray.map(line =>
    arrToNumberArr(line.split(''))
  )
  const lowPoints: Array<number> = []
  for (let i = 0; i < inputAsNumbers.length; i++) {
    for (let j = 0; j < inputAsNumbers[0].length; j++) {
      const adjacent: Array<number> = []
      const top = inputAsNumbers[i - 1] ? inputAsNumbers[i - 1][j] : undefined
      if (top !== undefined) {
        adjacent.push(top)
      }
      const down = inputAsNumbers[i + 1] ? inputAsNumbers[i + 1][j] : undefined
      if (down !== undefined) {
        adjacent.push(down)
      }
      const right = inputAsNumbers[i] ? inputAsNumbers[i][j + 1] : undefined
      if (right !== undefined) {
        adjacent.push(right)
      }
      const left = inputAsNumbers[i] ? inputAsNumbers[i][j - 1] : undefined
      if (left !== undefined) {
        adjacent.push(left)
      }
      if (
        adjacent.every(num => {
          return num > inputAsNumbers[i][j]
        })
      ) {
        lowPoints.push(inputAsNumbers[i][j])
      }
    }
  }
  const solution = lowPoints.reduce((acc, num) => {
    acc += num + 1
    return acc
  }, 0)
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
  const inputAsNumbers = inputAsArray.map(line =>
    arrToNumberArr(line.split(''))
  )
  const lowPoints: Array<{ i: number; j: number; num: number }> = []
  for (let i = 0; i < inputAsNumbers.length; i++) {
    for (let j = 0; j < inputAsNumbers[0].length; j++) {
      const adjacent: Array<number> = []
      const top = inputAsNumbers[i - 1] ? inputAsNumbers[i - 1][j] : undefined
      if (top !== undefined) {
        adjacent.push(top)
      }
      const down = inputAsNumbers[i + 1] ? inputAsNumbers[i + 1][j] : undefined
      if (down !== undefined) {
        adjacent.push(down)
      }
      const right = inputAsNumbers[i] ? inputAsNumbers[i][j + 1] : undefined
      if (right !== undefined) {
        adjacent.push(right)
      }
      const left = inputAsNumbers[i] ? inputAsNumbers[i][j - 1] : undefined
      if (left !== undefined) {
        adjacent.push(left)
      }
      if (
        adjacent.every(num => {
          return num > inputAsNumbers[i][j]
        })
      ) {
        lowPoints.push({ i, j, num: inputAsNumbers[i][j] })
      }
    }
  }

  // i did get some help here from Github Copilot :)
  const findBasinSize = (x: number, y: number) => {
    if (inputAsNumbers[x][y] === 9) {
      return 1
    }
    inputAsNumbers[x][y] = 9
    let basinSize = 1
    if (inputAsNumbers[x - 1] && inputAsNumbers[x - 1][y] !== 9) {
      basinSize += findBasinSize(x - 1, y)
    }
    if (inputAsNumbers[x + 1] && inputAsNumbers[x + 1][y] !== 9) {
      basinSize += findBasinSize(x + 1, y)
    }
    if (
      inputAsNumbers[x][y - 1] !== undefined &&
      inputAsNumbers[x][y - 1] !== 9
    ) {
      basinSize += findBasinSize(x, y - 1)
    }
    if (
      inputAsNumbers[x][y + 1] !== undefined &&
      inputAsNumbers[x][y + 1] !== 9
    ) {
      basinSize += findBasinSize(x, y + 1)
    }
    return basinSize
  }

  const basinSizes = sortNumbers(
    lowPoints.map(num => findBasinSize(num.i, num.j))
  ).reverse()
  log({ basinSizes }, debug)
  const solutions = basinSizes.slice(0, 3)
  log({ solutions }, debug)

  const solution = solutions.reduce((acc, num) => {
    acc *= num
    return acc
  }, 1)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
