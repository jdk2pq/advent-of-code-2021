import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = 'target area: x=20..30, y=-10..-5'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

// i was really surprised this worked because i thought it'd be another specific algo-y problem
async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  const [x, y] = input.split('target area: ')[1].split(', ')
  const [xMin, xMax] = x.split('=')[1].split('..').map(Number)
  const [yMin, yMax] = y.split('=')[1].split('..').map(Number)
  let currX = 0
  let currY = 0
  let xVelocity = 0
  let yVelocity = 0
  let maxYPosition = 0
  let potentialMaxY = 0
  let bestX = 0
  let bestY = 0
  let potentialSolutions: Array<number[]> = []

  for (
    let startingXVelocity = 0;
    startingXVelocity <= xMax;
    startingXVelocity++
  ) {
    for (
      let startingYVelocity = 0;
      startingYVelocity <= Math.abs(yMin);
      startingYVelocity++
    ) {
      xVelocity = startingXVelocity
      yVelocity = startingYVelocity
      currX = 0
      currY = 0
      potentialMaxY = 0
      while (
        !(currX >= xMin && currX <= xMax && currY >= yMin && currY <= yMax) &&
        currX <= xMax &&
        currY >= yMin
      ) {
        currX += xVelocity
        currY += yVelocity
        potentialMaxY = Math.max(currY, potentialMaxY)

        if (xVelocity > 0) {
          xVelocity--
        } else if (xVelocity < 0) {
          xVelocity++
        }
        yVelocity--
      }
      if (currX >= xMin && currX <= xMax && currY >= yMin && currY <= yMax) {
        if (potentialMaxY > maxYPosition) {
          maxYPosition = potentialMaxY
          bestX = startingXVelocity
          bestY = startingYVelocity
        }
        potentialSolutions.push([startingXVelocity, startingYVelocity])
      }
    }
  }
  log({ currX, currY, maxYPosition, bestX, bestY, potentialSolutions }, debug)
  const solution = maxYPosition.toString()
  report(`Solution 1${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 1')
}

// almost the same function from before, but just outputting a different value
async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')
  const [x, y] = input.split('target area: ')[1].split(', ')
  const [xMin, xMax] = x.split('=')[1].split('..').map(Number)
  const [yMin, yMax] = y.split('=')[1].split('..').map(Number)
  let currX = 0
  let currY = 0
  let xVelocity = 0
  let yVelocity = 0
  let maxYPosition = 0
  let potentialMaxY = 0
  let bestX = 0
  let bestY = 0
  let potentialSolutions: Array<number[]> = []

  for (
    let startingXVelocity = 0;
    startingXVelocity <= xMax;
    startingXVelocity++
  ) {
    for (
      // probably should've had this set to yMin previously, but it worked fine for part 1!
      let startingYVelocity = yMin;
      startingYVelocity <= Math.abs(yMin);
      startingYVelocity++
    ) {
      xVelocity = startingXVelocity
      yVelocity = startingYVelocity
      currX = 0
      currY = 0
      potentialMaxY = 0
      while (
        !(currX >= xMin && currX <= xMax && currY >= yMin && currY <= yMax) &&
        currX <= xMax &&
        currY >= yMin
      ) {
        currX += xVelocity
        currY += yVelocity
        potentialMaxY = Math.max(currY, potentialMaxY)

        if (xVelocity > 0) {
          xVelocity--
        } else if (xVelocity < 0) {
          xVelocity++
        }
        yVelocity--
      }
      if (currX >= xMin && currX <= xMax && currY >= yMin && currY <= yMax) {
        if (potentialMaxY > maxYPosition) {
          maxYPosition = potentialMaxY
          bestX = startingXVelocity
          bestY = startingYVelocity
        }
        potentialSolutions.push([startingXVelocity, startingYVelocity])
      }
    }
  }
  log({ currX, currY, maxYPosition, bestX, bestY, potentialSolutions }, debug)
  const solution = potentialSolutions.length.toString()
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 2')
}
