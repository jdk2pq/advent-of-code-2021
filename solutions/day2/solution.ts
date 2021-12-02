import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = 'forward 5\n' +
    'down 5\n' +
    'forward 8\n' +
    'up 3\n' +
    'down 8\n' +
    'forward 2\n'
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
  let horizontal = 0
  let depth = 0
  inputAsArray.forEach((command) => {
    if (command.startsWith('forward')) {
      horizontal += Number(command.replace('forward ', ''))
    } else if (command.startsWith('down')) {
      depth += Number(command.replace('down ', ''))
    } else {
      depth -= Number(command.replace('up ', ''))
    }
  })
  const solution = horizontal * depth
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
  let horizontal = 0
  let depth = 0
  let aim = 0
  inputAsArray.forEach((command) => {
    if (command.startsWith('forward')) {
      let add = Number(command.replace('forward ', ''))
      horizontal += add
      depth += aim * add
    } else if (command.startsWith('down')) {
      aim += Number(command.replace('down ', ''))
    } else {
      aim -= Number(command.replace('up ', ''))
    }
  })
  const solution = horizontal * depth
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
