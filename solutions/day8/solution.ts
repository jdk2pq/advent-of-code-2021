import { read } from 'promise-path'
import { reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'
  const testInput2 =
    'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | ' +
    'fdgacbe cefdb cefbgd gcbe\n' +
    'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | ' +
    'fcgedb cgb dgebacf gc\n' +
    'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | ' +
    'cg cg fdcagb cbg\n' +
    'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | ' +
    'efabcd cedba gadfec cb\n' +
    'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | ' +
    'gecf egdcabf bgf bfgea\n' +
    'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | ' +
    'gebdcfa ecba ca fadegcb\n' +
    'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | ' +
    'cefg dcbef fcge gbcadfe\n' +
    'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ' +
    'ed bcgafe cdgba cbgef\n' +
    'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | ' +
    'gbdfcae bgc cg cgb\n' +
    'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | ' +
    'fgae cfgab fg bagce'
  const testInputAsArray = testInput2.split('\n')

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
  const outputValues = inputAsArray.map(line => line.split(' | ')[1])
  const solution = outputValues.reduce((acc, output) => {
    const split = output.split(' ')
    acc += split.filter(
      digit =>
        digit.length === 2 ||
        digit.length === 3 ||
        digit.length === 4 ||
        digit.length === 7
    ).length
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

  const determineInitialNumber = val => {
    let number = -1
    if (val.length === 2) {
      number = 1
    } else if (val.length === 4) {
      number = 4
    } else if (val.length === 3) {
      number = 7
    } else if (val.length === 7) {
      number = 8
    }
    return {
      val,
      number
    }
  }
  const values = inputAsArray.map(line => {
    const [signal, output] = line.split(' | ')
    return {
      signal: signal.split(' ').map(determineInitialNumber),
      output: output.split(' ').map(determineInitialNumber)
    }
  })
  if (debug) {
    values.forEach(line => {
      console.log(line.signal)
      console.log()
      console.log(line.output)
      console.log()
    })
  }

  let hasUnsetNumbers = true

  // known
  // 1 -> 2 segments
  // 4 -> 4 segments
  // 7 -> 3 segments
  // 8 -> 7 segments
  // 3 -> 5 segments
  // - must include both segments from 1

  // 5 segments
  // 2 -> 5 segments
  // - must include 1 unique segment from 8
  // 5 -> 5 segments
  // - must include 1 segment from 1

  // 6 segments
  // 0 -> 6 segments
  // - only 3 segments from 4, both segments from 1
  // 6 -> 6 segments
  // - only 3 segments from 4, only 1 segment from 1
  // 9 -> 6 segments
  // - whatever's left?
  let idx = 0
  while (hasUnsetNumbers && idx < 10000) {
    values.forEach(line => {
      const vals = line.signal
        .map(v => v.val)
        .concat(line.output.map(v => v.val))
      const numbers = line.signal
        .map(v => v.number)
        .concat(line.output.map(v => v.number))
      if (!numbers.includes(3)) {
        const one = vals.find(v => v.length === 2)
        line.signal.forEach(v => {
          const split = v.val.split('')
          const oneSplit = one.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            oneSplit.every(char => split.includes(char))
          ) {
            v.number = 3
          }
        })
        line.output.forEach(v => {
          const split = v.val.split('')
          const oneSplit = one.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            oneSplit.every(char => split.includes(char))
          ) {
            v.number = 3
          }
        })
      }

      if (!numbers.includes(5)) {
        const four = vals.find(v => v.length === 4)
        line.signal.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            fourSplit.filter(char => split.includes(char)).length === 3
          ) {
            v.number = 5
          }
        })
        line.output.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            fourSplit.filter(char => split.includes(char)).length === 3
          ) {
            v.number = 5
          }
        })
      }

      if (!numbers.includes(2)) {
        const four = vals.find(v => v.length === 4)
        line.signal.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            fourSplit.filter(char => split.includes(char)).length === 2
          ) {
            v.number = 2
          }
        })
        line.output.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 5 &&
            fourSplit.filter(char => split.includes(char)).length === 2
          ) {
            v.number = 2
          }
        })
      }

      if (!numbers.includes(9)) {
        const four = vals.find(v => v.length === 4)
        line.signal.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 6 &&
            fourSplit.every(char => split.includes(char))
          ) {
            v.number = 9
          }
        })
        line.output.forEach(v => {
          const split = v.val.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 6 &&
            fourSplit.every(char => split.includes(char))
          ) {
            v.number = 9
          }
        })
      }

      if (!numbers.includes(0)) {
        const one = vals.find(v => v.length === 2)
        const four = vals.find(v => v.length === 4)
        line.signal.forEach(v => {
          const split = v.val.split('')
          const oneSplit = one.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 6 &&
            oneSplit.every(char => split.includes(char)) &&
            fourSplit.filter(char => split.includes(char).length === 3)
          ) {
            v.number = 0
          }
        })
        line.output.forEach(v => {
          const split = v.val.split('')
          const oneSplit = one.split('')
          const fourSplit = four.split('')
          if (
            v.number === -1 &&
            v.val.length === 6 &&
            oneSplit.every(char => split.includes(char)) &&
            fourSplit.filter(char => split.includes(char).length === 3)
          ) {
            v.number = 0
          }
        })
      }

      if (!numbers.includes(6)) {
        line.signal.forEach(v => {
          if (v.number === -1 && v.val.length === 6) {
            v.number = 6
          }
        })
        line.output.forEach(v => {
          if (v.number === -1 && v.val.length === 6) {
            v.number = 6
          }
        })
      }
    })

    hasUnsetNumbers = values
      .map(line => {
        return line.signal
          .map(v => v.number)
          .concat(line.output.map(v => v.number))
      })
      .flat()
      .some(v => v === -1)
    idx++
  }
  console.log({ idx })

  if (debug) {
    console.log('final answer')
    values.forEach(line => {
      console.log(line.output)
      console.log()
    })
  }

  const solution = values.reduce((acc, line) => {
    acc += Number(line.output.map(v => v.number).join(''))
    return acc
  }, 0)
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
