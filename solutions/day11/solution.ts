import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

// part 1 took a while, and i got stuck because i didn't realize i was re-flashing already flashed
// octopi because they were already pushed into the queue

// part 2 i figured out in seconds by just changing the while condition
export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '5483143223\n' +
    '2745854711\n' +
    '5264556173\n' +
    '6141336146\n' +
    '6357385478\n' +
    '4167524645\n' +
    '2176841721\n' +
    '6882881134\n' +
    '4846848554\n' +
    '5283751526'
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
  const octopi = inputAsArray.map(line => {
    return line.split('').map(num => {
      return {
        flashed: false,
        num: Number(num)
      }
    })
  })
  log({ octopus: octopi[0] }, debug)
  let step = 0

  let toFlash: Array<{ i: number; j: number }> = []

  let flashed = 0

  const increaseNeighbours = () => {
    while (toFlash.length > 0) {
      const { i, j } = toFlash.pop() as { i: number; j: number }
      if (!octopi[i][j].flashed) {
        log({ i, j }, debug)
        octopi[i][j].flashed = true
        octopi[i][j].num = 0
        flashed += 1
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j] !== undefined &&
          !octopi[i - 1][j].flashed
        ) {
          octopi[i - 1][j].num += 1
          if (octopi[i - 1][j].num > 9) {
            toFlash.push({ i: i - 1, j: j })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j] !== undefined &&
          !octopi[i + 1][j].flashed
        ) {
          octopi[i + 1][j].num += 1
          if (octopi[i + 1][j].num > 9) {
            toFlash.push({ i: i + 1, j: j })
          }
        }
        if (octopi[i][j - 1] !== undefined && !octopi[i][j - 1].flashed) {
          octopi[i][j - 1].num += 1
          if (octopi[i][j - 1].num > 9) {
            toFlash.push({ i: i, j: j - 1 })
          }
        }
        if (octopi[i][j + 1] !== undefined && !octopi[i][j + 1].flashed) {
          octopi[i][j + 1].num += 1
          if (octopi[i][j + 1].num > 9) {
            toFlash.push({ i: i, j: j + 1 })
          }
        }
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j - 1] !== undefined &&
          !octopi[i - 1][j - 1].flashed
        ) {
          octopi[i - 1][j - 1].num += 1
          if (octopi[i - 1][j - 1].num > 9) {
            toFlash.push({ i: i - 1, j: j - 1 })
          }
        }
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j + 1] !== undefined &&
          !octopi[i - 1][j + 1].flashed
        ) {
          octopi[i - 1][j + 1].num += 1
          if (octopi[i - 1][j + 1].num > 9) {
            toFlash.push({ i: i - 1, j: j + 1 })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j + 1] !== undefined &&
          !octopi[i + 1][j + 1].flashed
        ) {
          octopi[i + 1][j + 1].num += 1
          if (octopi[i + 1][j + 1].num > 9) {
            toFlash.push({ i: i + 1, j: j + 1 })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j - 1] !== undefined &&
          !octopi[i + 1][j - 1].flashed
        ) {
          octopi[i + 1][j - 1].num += 1
          if (octopi[i + 1][j - 1].num > 9) {
            toFlash.push({ i: i + 1, j: j - 1 })
          }
        }
      }
    }
  }
  while (step < 100) {
    octopi.forEach(line => {
      line.forEach(octopus => (octopus.flashed = false))
    })
    if (debug) {
      console.log({ step })
      octopi.forEach(line => {
        console.log(line.map(v => v.num).join(''))
      })
    }
    for (let i = 0; i < octopi.length; i++) {
      const line = octopi[i]
      for (let j = 0; j < line.length; j++) {
        const octopus = line[j]
        if (!octopus.flashed) {
          octopus.num += 1
        }
        if (octopus.num > 9 && !octopus.flashed) {
          toFlash.push({ i, j })
          increaseNeighbours()
        }
      }
    }
    step++
  }
  const solution = flashed.toString()
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  const octopi = inputAsArray.map(line => {
    return line.split('').map(num => {
      return {
        flashed: false,
        num: Number(num)
      }
    })
  })
  log({ octopus: octopi[0] }, debug)
  let step = 0

  let toFlash: Array<{ i: number; j: number }> = []

  let flashed = 0

  const increaseNeighbours = () => {
    while (toFlash.length > 0) {
      const { i, j } = toFlash.pop() as { i: number; j: number }
      if (!octopi[i][j].flashed) {
        log({ i, j }, debug)
        octopi[i][j].flashed = true
        octopi[i][j].num = 0
        flashed += 1
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j] !== undefined &&
          !octopi[i - 1][j].flashed
        ) {
          octopi[i - 1][j].num += 1
          if (octopi[i - 1][j].num > 9) {
            toFlash.push({ i: i - 1, j: j })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j] !== undefined &&
          !octopi[i + 1][j].flashed
        ) {
          octopi[i + 1][j].num += 1
          if (octopi[i + 1][j].num > 9) {
            toFlash.push({ i: i + 1, j: j })
          }
        }
        if (octopi[i][j - 1] !== undefined && !octopi[i][j - 1].flashed) {
          octopi[i][j - 1].num += 1
          if (octopi[i][j - 1].num > 9) {
            toFlash.push({ i: i, j: j - 1 })
          }
        }
        if (octopi[i][j + 1] !== undefined && !octopi[i][j + 1].flashed) {
          octopi[i][j + 1].num += 1
          if (octopi[i][j + 1].num > 9) {
            toFlash.push({ i: i, j: j + 1 })
          }
        }
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j - 1] !== undefined &&
          !octopi[i - 1][j - 1].flashed
        ) {
          octopi[i - 1][j - 1].num += 1
          if (octopi[i - 1][j - 1].num > 9) {
            toFlash.push({ i: i - 1, j: j - 1 })
          }
        }
        if (
          octopi[i - 1] !== undefined &&
          octopi[i - 1][j + 1] !== undefined &&
          !octopi[i - 1][j + 1].flashed
        ) {
          octopi[i - 1][j + 1].num += 1
          if (octopi[i - 1][j + 1].num > 9) {
            toFlash.push({ i: i - 1, j: j + 1 })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j + 1] !== undefined &&
          !octopi[i + 1][j + 1].flashed
        ) {
          octopi[i + 1][j + 1].num += 1
          if (octopi[i + 1][j + 1].num > 9) {
            toFlash.push({ i: i + 1, j: j + 1 })
          }
        }
        if (
          octopi[i + 1] !== undefined &&
          octopi[i + 1][j - 1] !== undefined &&
          !octopi[i + 1][j - 1].flashed
        ) {
          octopi[i + 1][j - 1].num += 1
          if (octopi[i + 1][j - 1].num > 9) {
            toFlash.push({ i: i + 1, j: j - 1 })
          }
        }
      }
    }
  }
  while (!octopi.every(line => line.every(octopus => octopus.flashed))) {
    octopi.forEach(line => {
      line.forEach(octopus => (octopus.flashed = false))
    })
    if (debug) {
      console.log({ step })
      octopi.forEach(line => {
        console.log(line.map(v => v.num).join(''))
      })
    }
    for (let i = 0; i < octopi.length; i++) {
      const line = octopi[i]
      for (let j = 0; j < line.length; j++) {
        const octopus = line[j]
        if (!octopus.flashed) {
          octopus.num += 1
        }
        if (octopus.num > 9 && !octopus.flashed) {
          toFlash.push({ i, j })
          increaseNeighbours()
        }
      }
    }
    step++
  }
  const solution = step.toString()
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 2')
}
