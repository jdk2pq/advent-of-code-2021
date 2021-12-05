import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput = '00100\n' +
    '11110\n' +
    '10110\n' +
    '10111\n' +
    '10101\n' +
    '01111\n' +
    '00111\n' +
    '11100\n' +
    '10000\n' +
    '11001\n' +
    '00010\n' +
    '01010'
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
  let gammaRate = ''
  let epsilonRate = ''
  Array.from(inputAsArray[0]).forEach((char, idx) => {
    const position = inputAsArray.map((binaryValue) => binaryValue[idx])
    const zeroes = position.filter((val) => val === '0').length
    const ones = position.filter((val) => val === '1').length
    if (debug) {
      console.log({ gammaRate, epsilonRate })
    }
    gammaRate = `${gammaRate}${Math.max(zeroes, ones) === zeroes ? '0' : '1'}`
    epsilonRate = `${epsilonRate}${Math.min(zeroes, ones) === zeroes ? '0' : '1'}`
  })
  if (debug) {
    console.log({ gammaRate, epsilonRate })
  }
  const solution = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
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
  let workingArray = inputAsArray
  let oxygenArray = inputAsArray
  let co2Array = inputAsArray
  let idx = 0
  while (oxygenArray.length > 1 || co2Array.length > 1) {
    if (oxygenArray.length > 1) {
      const positionO = oxygenArray.map((binaryValue) => binaryValue[idx])
      const zeroesO = positionO.filter((val) => val === '0').length
      const onesO = positionO.filter((val) => val === '1').length
      if (zeroesO > onesO) {
        oxygenArray = oxygenArray.filter((val) => val[idx] === '0')
      } else {
        oxygenArray = oxygenArray.filter((val) => val[idx] === '1')
      }
    }
    
    if (co2Array.length > 1) {
      const positionCO2 = co2Array.map((binaryValue) => binaryValue[idx])
      const zeroesCO2 = positionCO2.filter((val) => val === '0').length
      const onesCO2 = positionCO2.filter((val) => val === '1').length
      if (zeroesCO2 < onesCO2 || zeroesCO2 === onesCO2) {
        co2Array = co2Array.filter((val) => val[idx] === '0')
      } else {
        co2Array = co2Array.filter((val) => val[idx] === '1')
      }
    }
    
    if (debug) {
      console.log({ oxygenArray, co2Array })
    }
    idx++;
  }
  let oxygenGeneratorRating = oxygenArray[0]
  let co2ScrubberRating = co2Array[0]
  if (debug) {
    console.log({ oxygenGeneratorRating, co2ScrubberRating })
  }
  
  const solution = parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
