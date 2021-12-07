import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '16,1,2,0,4,2,7,1,2,14'
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
  const inputAsNumbers = arrToNumberArr(input.split(','))
  let minFuel = Number.MAX_VALUE
  inputAsNumbers.forEach((x) => {
    const fuel = inputAsNumbers.reduce((acc, y) => {
      log({ y, acc }, debug)

      acc += Math.abs(x - y)
      return acc
    }, 0)
    log({ x, fuel }, debug)
    if (fuel < minFuel) {
      minFuel = fuel
    }
  })
  const solution = minFuel
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
  const inputAsNumbers = arrToNumberArr(input.split(','))
  let minFuel = Number.MAX_VALUE
  let max = Math.max(...inputAsNumbers)
  const potentialPositions =  Array.from(Array(max).keys())
  log({ potentialPositions }, debug)
  Array.from(Array(max).keys()).forEach((x) => {
    const fuel = inputAsNumbers.reduce((acc, y) => {
      log({ y, acc }, debug)
      const n = Math.abs(x - y)
      // the formula i couldn't remember from basic math:
      // googled "sum consecutive numbers" to find it
      // https://www.wikihow.com/Sum-the-Integers-from-1-to-N
      const summedFuel = (n * (n + 1)) / 2
      acc += summedFuel
      return acc
    }, 0)
    log({ x, fuel }, debug)
    if (fuel < minFuel) {
      minFuel = fuel
    }
  })
  const solution = minFuel
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
