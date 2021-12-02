import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '199\n' +
    '200\n' +
    '208\n' +
    '210\n' +
    '200\n' +
    '207\n' +
    '240\n' +
    '269\n' +
    '260\n' +
    '263'
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
  const inputAsNumber = arrToNumberArr(inputAsArray)
  const solution = inputAsNumber.reduce((acc, currentValue, idx) => {
    if (currentValue > inputAsNumber[idx - 1]) {
      acc++
    }
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
  const inputAsNumber = arrToNumberArr(inputAsArray)
  const solution = inputAsNumber.reduce((acc, currentValue, idx) => {
    if (inputAsNumber[idx -1 ] && inputAsNumber[idx] && inputAsNumber[idx + 1] && inputAsNumber[idx + 2]) {
      const currSlidingWindow = inputAsNumber[idx] + inputAsNumber[idx + 1] + inputAsNumber[idx + 2]
      const previousSlidingWindow = inputAsNumber[idx - 1] + inputAsNumber[idx] + inputAsNumber[idx + 1]
      if (currSlidingWindow > previousSlidingWindow) {
        acc++
      }
    }
    return acc
  }, 0)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
