import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'
import { cloneDeep } from 'lodash';

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '3,4,3,1,2'
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
  const inputAsNumbers = arrToNumberArr(input.split(','));
  let idx = 0
  let workingArr = inputAsNumbers
  while (idx < 80) {
    const newArr: number[] = cloneDeep(workingArr)
    workingArr.forEach((val, idx) => {
      if (val === 0) {
        newArr.push(8)
        newArr[idx] = 6
      } else {
        newArr[idx] = newArr[idx] - 1
      }
    })
    workingArr = newArr
    idx++;
  }
  const solution = workingArr.length
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
  const inputAsNumbers = arrToNumberArr(input.split(','));
  let idx = 0
  let workingArr = inputAsNumbers
  let counts: number[] = []
  
  // wow i'm dumb. this hint from the subreddit was what clued me into this solution:
  // https://www.reddit.com/r/adventofcode/comments/r9zze3/do_lanternfish_have_no_natural_predators/hnfeuln/
  workingArr.forEach((val, idx) => {
    counts[val] = counts[val] ? counts[val] + 1 : 1
  })
  log({ counts }, debug)
  while (idx < 256) {
    const newArr: number[] = []
    log({ counts }, debug)
    counts.forEach((count, val) => {
      if (val === 0 && count) {
        newArr[8] = count
        newArr[6] = newArr[6] ? newArr[6] + count : count
      } else if (count) {
        newArr[val - 1] = newArr[val - 1] ? newArr[6] + count : count
      }
    })
    counts = newArr;
    idx++
  }
  const solution = counts.reduce((acc, val) => {
    acc += val;
    return acc
  }, 0)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
