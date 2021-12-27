import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..##' +
    '#..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###' +
    '.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#.' +
    '.#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#.....' +
    '.#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#..' +
    '...####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.....' +
    '..##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#\n' +
    '\n' +
    '#..#.\n' +
    '#....\n' +
    '##..#\n' +
    '..#..\n' +
    '..###'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, false)
  await solveForSecondStar(input, inputAsArray, false, false)
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  const [imageEnhancementAlgorithm, image] = input.split('\n\n')
  const imageAsArray = image.split('\n').map(val => val.split(''))
  const imageEnhancementAlgorithmAsArray = imageEnhancementAlgorithm.split('')
  let defaultValue = '.'
  log({ defaultValue }, debug)
  let enhancedImage: Array<string[]> = []
  const run = imageArray => {
    enhancedImage = []
    const yBoost = imageArray.length
    const xBoost = imageArray[0].length
    log({ xBoost, yBoost }, debug)
    for (let y = yBoost; y <= imageArray.length + yBoost + 1; y++) {
      for (let x = xBoost; x <= imageArray.length + xBoost + 1; x++) {
        const i = y - yBoost - 1
        const j = x - xBoost - 1
        if (!enhancedImage[i + yBoost]) {
          enhancedImage[i + yBoost] = []
        }

        let binaryImageEnhancementIndex = ''
        const getLightOrDark = (y, x) => {
          if (imageArray[y] && imageArray[y][x]) {
            return imageArray[y][x]
          }
          log('no value at ' + y + ' ' + x, debug)
          return defaultValue
        }
        for (let iAdjustment = -1; iAdjustment <= 1; iAdjustment++) {
          for (let jAdjustment = -1; jAdjustment <= 1; jAdjustment++) {
            binaryImageEnhancementIndex +=
              getLightOrDark(i + iAdjustment, j + jAdjustment) === '#'
                ? '1'
                : '0'
          }
        }
        log({ binaryImageEnhancementIndex }, debug)
        const imageEnhancementIndex = parseInt(binaryImageEnhancementIndex, 2)
        enhancedImage[i + yBoost][j + xBoost] =
          imageEnhancementAlgorithmAsArray[imageEnhancementIndex]
      }
    }
    if (debug) {
      enhancedImage.forEach(row => {
        console.log(row.join(''))
      })
    }
  }
  run(imageAsArray)
  let newImage = ''
  enhancedImage.forEach(row => {
    newImage += row.join('') + '\n'
  })
  if (imageEnhancementAlgorithm[0] === '#') {
    defaultValue = '#'
  }
  run(newImage.split('\n').map(line => line.split('')))
  const solution = enhancedImage.reduce((acc, row) => {
    return (
      acc +
      row.reduce((acc, cell) => {
        return acc + (cell === '#' ? 1 : 0)
      }, 0)
    )
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
  const [imageEnhancementAlgorithm, image] = input.split('\n\n')
  const imageAsArray = image.split('\n').map(val => val.split(''))
  const imageEnhancementAlgorithmAsArray = imageEnhancementAlgorithm.split('')
  let defaultValue = '.'
  log({ defaultValue }, debug)
  let enhancedImage: Array<string[]> = []
  const run = imageArray => {
    enhancedImage = []
    const yBoost = imageArray.length
    const xBoost = imageArray[0].length
    log({ xBoost, yBoost }, debug)
    for (let y = yBoost; y <= imageArray.length + yBoost + 1; y++) {
      for (let x = xBoost; x <= imageArray.length + xBoost + 1; x++) {
        const i = y - yBoost - 1
        const j = x - xBoost - 1
        if (!enhancedImage[i + yBoost]) {
          enhancedImage[i + yBoost] = []
        }

        let binaryImageEnhancementIndex = ''
        const getLightOrDark = (y, x) => {
          if (imageArray[y] && imageArray[y][x]) {
            return imageArray[y][x]
          }
          log('no value at ' + y + ' ' + x, debug)
          return defaultValue
        }
        for (let iAdjustment = -1; iAdjustment <= 1; iAdjustment++) {
          for (let jAdjustment = -1; jAdjustment <= 1; jAdjustment++) {
            binaryImageEnhancementIndex +=
              getLightOrDark(i + iAdjustment, j + jAdjustment) === '#'
                ? '1'
                : '0'
          }
        }
        log({ binaryImageEnhancementIndex }, debug)
        const imageEnhancementIndex = parseInt(binaryImageEnhancementIndex, 2)
        enhancedImage[i + yBoost][j + xBoost] =
          imageEnhancementAlgorithmAsArray[imageEnhancementIndex]
      }
    }
    if (debug) {
      enhancedImage.forEach(row => {
        console.log(row.join(''))
      })
    }
  }

  let numberOfRuns = 0
  let operatingImage = imageAsArray
  while (numberOfRuns < 50) {
    run(operatingImage)
    let newImage = ''
    enhancedImage.forEach(row => {
      newImage += row.join('') + '\n'
    })
    operatingImage = newImage.split('\n').map(line => line.split(''))
    if (imageEnhancementAlgorithm[0] === '#') {
      if (defaultValue === '#') {
        defaultValue = '.'
      } else {
        defaultValue = '#'
      }
    }
    numberOfRuns++
  }

  const solution = enhancedImage.reduce((acc, row) => {
    return (
      acc +
      row.reduce((acc, cell) => {
        return acc + (cell === '#' ? 1 : 0)
      }, 0)
    )
  }, 0)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
