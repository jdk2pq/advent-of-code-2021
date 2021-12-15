import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'NNCB\n' +
    '\n' +
    'CH -> B\n' +
    'HH -> N\n' +
    'CB -> H\n' +
    'NH -> C\n' +
    'HB -> C\n' +
    'HC -> B\n' +
    'HN -> C\n' +
    'NN -> C\n' +
    'BH -> H\n' +
    'NC -> B\n' +
    'NB -> B\n' +
    'BN -> B\n' +
    'BB -> N\n' +
    'BC -> B\n' +
    'CC -> N\n' +
    'CN -> C'
  const testInputAsArray = testInput.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

// solved for the first star in a dumb brute force way :)
// realized i had to do something smarter for star 2
async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')
  let step = 0
  let [template, rules] = input.split('\n\n')
  const rulesAsArray = rules.split('\n').map(r => r.split(' -> '))
  if (debug) {
    const counts: { [key: string]: number } = template
      .split('')
      .reduce((acc, char) => {
        acc[char] = acc[char] ? acc[char] + 1 : 1
        return acc
      }, {})
    log({ counts }, debug)
  }
  while (step < 10) {
    let newTemplate = template.split('').map(c => {
      return {
        char: c,
        original: true,
        rulePair: ''
      }
    })
    rulesAsArray.forEach(rulePair => {
      if (template.includes(rulePair[0])) {
        const split = rulePair[0].split('')
        let templateIndex = newTemplate.findIndex(
          (t, idx) =>
            t.char === split[0] &&
            t.original &&
            ((newTemplate[idx + 1] &&
              newTemplate[idx + 1].char === split[1] &&
              newTemplate[idx + 1].original) ||
              (newTemplate[idx + 1] &&
                newTemplate[idx + 2] &&
                !newTemplate[idx + 1].original &&
                newTemplate[idx + 2].char === split[1] &&
                newTemplate[idx + 2].original))
        )
        log({ templateIndex, rulePair: rulePair[0] }, debug)

        while (templateIndex > -1) {
          newTemplate.splice(templateIndex + 1, 0, {
            char: rulePair[1],
            original: false,
            rulePair: rulePair[0]
          })
          templateIndex = newTemplate.findIndex(
            (t, idx) =>
              t.char === split[0] &&
              t.original &&
              ((newTemplate[idx + 1] &&
                newTemplate[idx + 1].char === split[1] &&
                newTemplate[idx + 1].original) ||
                (newTemplate[idx + 1] &&
                  newTemplate[idx + 2] &&
                  newTemplate[idx + 1].rulePair !== rulePair[0] &&
                  !newTemplate[idx + 1].original &&
                  newTemplate[idx + 2].char === split[1] &&
                  newTemplate[idx + 2].original))
          )
        }
      }
    })
    log({ template, newTemplate }, debug)
    step++
    template = newTemplate.map(t => t.char).join('')
    if (debug) {
      const counts: { [key: string]: number } = template
        .split('')
        .reduce((acc, char) => {
          acc[char] = acc[char] ? acc[char] + 1 : 1
          return acc
        }, {})
      log({ counts }, debug)
    }
  }
  log({ finalTemplate: template }, debug)
  const counts: { [key: string]: number } = template
    .split('')
    .reduce((acc, char) => {
      acc[char] = acc[char] ? acc[char] + 1 : 1
      return acc
    }, {})
  log({ counts }, debug)
  const max = Math.max(...Object.values(counts))
  const min = Math.min(...Object.values(counts))
  const solution = max - min
  log({ max, min, counts }, debug)
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
  let step = 0
  let [template, rules] = input.split('\n\n')
  const rulesAsArray = rules.split('\n').map(r => r.split(' -> '))
  let doubleLetterCounts: { [key: string]: number } = {}
  let singleLetterCounts: { [key: string]: number } = {}
  template.split('').forEach(char => {
    if (!singleLetterCounts[char]) {
      singleLetterCounts[char] = 0
    }
    singleLetterCounts[char]++
  })
  log({ singleLetterCounts }, debug)
  rulesAsArray.forEach(([from, insert]) => {
    if (!doubleLetterCounts[from]) {
      doubleLetterCounts[from] = 0
    }
    // i originally had this:
    // if (template.includes(from)) {
    //   doubleLetterCounts[from]++
    // }
    // which took me SO LONG to figure out that I was wrong (it worked perfectly fine for the test
    // input but not for my day's input).
    // it only counted a SINGLE INSTANCE of the letters together
    // what i needed to do was this:
    template.split('').forEach((char, idx) => {
      if (char === from[0] && template[idx + 1] === from[1]) {
        doubleLetterCounts[from]++
      }
    })
  })
  while (step < 40) {
    const newCounts = {}
    rulesAsArray.forEach(([from, insert]) => {
      if (doubleLetterCounts[from] > 0) {
        const [first, second] = from.split('')
        if (!newCounts[`${first}${insert}`]) {
          newCounts[`${first}${insert}`] = 0
        }
        newCounts[`${first}${insert}`] += doubleLetterCounts[from]
        if (!newCounts[`${insert}${second}`]) {
          newCounts[`${insert}${second}`] = 0
        }
        newCounts[`${insert}${second}`] += doubleLetterCounts[from]
        if (!singleLetterCounts[insert]) {
          singleLetterCounts[insert] = 0
        }
        singleLetterCounts[insert] += doubleLetterCounts[from]
      }
    })
    log({ singleLetterCounts }, debug)
    doubleLetterCounts = newCounts
    step++
  }
  log({ singleLetterCounts }, debug)
  const maxSingleLetterCount = Math.max(...Object.values(singleLetterCounts))
  const minSingleLetterCount = Math.min(...Object.values(singleLetterCounts))
  const solution = maxSingleLetterCount - minSingleLetterCount
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
