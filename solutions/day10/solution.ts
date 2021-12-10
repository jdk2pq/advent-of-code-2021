import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '[({(<(())[]>[[{[]{<()<>>\n' +
    '[(()[<>])]({[<{<<[]>>(\n' +
    '{([(<{}[<>[]}>{[]{[(<()>\n' +
    '(((({<>}<{<{<>}{[]{[]{}\n' +
    '[[<[([]))<([[{}[[()]]]\n' +
    '[{[{({}]{}}([{[{{{}}([]\n' +
    '{<[[]]>}<{[{[{[]{()[[[]\n' +
    '[<(<(<(<{}))><([]([]()\n' +
    '<{([([[(<>()){}]>(<<{{\n' +
    '<{([{{}}[<[[[<>{}]]]>[]]'
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
  const illegalCharacters: Array<string> = []
  inputAsArray.forEach(line => {
    const split = line.split('')
    const counts: { [key: string]: number } = {}
    split.forEach(char => {
      if (counts[char]) {
        counts[char]++
      } else {
        counts[char] = 1
      }
    })
    log({ counts, line }, debug)
    // probably not a good way to do this
    // let charToCompare = ''
    // let char = ''
    //   let idx = 0
    //   while (!charToCompare) {
    //     char = split[idx]
    //     let count = counts[char]
    //     let compareCharCount = counts[char]
    //     let theRest = false
    //     if (char === '{') {
    //       charToCompare = '}'
    //       compareCharCount = counts[charToCompare]
    //       const otherCounts =
    //         (counts['['] ?? 0) +
    //         (counts['<'] ?? 0) +
    //         (counts['('] ?? 0) +
    //         (counts[')'] ?? 0) +
    //         (counts['>'] ?? 0) +
    //         (counts[']'] ?? 0)
    //       log({ otherCounts }, debug)
    //       theRest = otherCounts % 2 === 0
    //     } else if (char === '(') {
    //       charToCompare = ')'
    //       compareCharCount = counts[charToCompare]
    //       const otherCounts =
    //         (counts['['] ?? 0) +
    //         (counts['<'] ?? 0) +
    //         (counts['{'] ?? 0) +
    //         (counts['}'] ?? 0) +
    //         (counts['>'] ?? 0) +
    //         (counts[']'] ?? 0)
    //       log({ otherCounts }, debug)
    //       theRest = otherCounts % 2 === 0
    //     } else if (char === '[') {
    //       charToCompare = ']'
    //       compareCharCount = counts[charToCompare]
    //       const otherCounts =
    //         (counts['('] ?? 0) +
    //         (counts['<'] ?? 0) +
    //         (counts['{'] ?? 0) +
    //         (counts['}'] ?? 0) +
    //         (counts['>'] ?? 0) +
    //         (counts[')'] ?? 0)
    //       log({ otherCounts }, debug)
    //       theRest = otherCounts % 2 === 0
    //     } else if (char === '<') {
    //       charToCompare = '>'
    //       compareCharCount = counts[charToCompare]
    //       const otherCounts =
    //         (counts['('] ?? 0) +
    //         (counts['['] ?? 0) +
    //         (counts['{'] ?? 0) +
    //         (counts['}'] ?? 0) +
    //         (counts[']'] ?? 0) +
    //         (counts[')'] ?? 0)
    //       log({ otherCounts }, debug)
    //       theRest = otherCounts % 2 === 0
    //     }
    //     if (count !== compareCharCount && !theRest) {
    //       log({ missingCharacter: charToCompare, line }, debug)
    //       illegalCharacters.push(charToCompare)
    //     }
    //     idx++
    //   }
    // })

    const queue: Array<string> = []
    for (let i = 0; i < split.length; i++) {
      const char = split[i]
      if (char === '{' || char === '(' || char === '[' || char === '<') {
        queue.push(char)
      }
      if (char === '}' || char === ')' || char === ']' || char === '>') {
        log({ queue, i }, debug)
        const last = queue.pop()
        if (
          (char === '}' && last !== '{') ||
          (char === ')' && last !== '(') ||
          (char === ']' && last !== '[') ||
          (char === '>' && last !== '<')
        ) {
          log({ found: char, line }, debug)
          illegalCharacters.push(char)
          break
        }
      }
    }
  })
  log({ illegalCharacters }, debug)
  const solution = illegalCharacters.reduce((acc, char) => {
    if (char === ')') {
      acc += 3
    } else if (char === ']') {
      acc += 57
    } else if (char === '}') {
      acc += 1197
    } else if (char === '>') {
      acc += 25137
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
  const additionalCharacters: Array<string> = []
  inputAsArray.forEach(line => {
    const lineChars: string[] = []
    const split = line.split('')
    const counts: { [key: string]: number } = {}
    split.forEach(char => {
      if (counts[char]) {
        counts[char]++
      } else {
        counts[char] = 1
      }
    })
    // log({ counts, line }, debug)
    const queue: Array<string> = []
    let ignore = false
    for (let i = 0; i < split.length; i++) {
      const char = split[i]
      if (char === '{' || char === '(' || char === '[' || char === '<') {
        queue.push(char)
      }
      if (char === '}' || char === ')' || char === ']' || char === '>') {
        const last = queue.pop()
        if (
          (char === '}' && last !== '{') ||
          (char === ')' && last !== '(') ||
          (char === ']' && last !== '[') ||
          (char === '>' && last !== '<')
        ) {
          ignore = true
          break
        }
      }
    }
    if (!ignore) {
      log({ queue }, debug)
      // initially forgot to reverse this, cost me some time and debuggiing
      queue.reverse().forEach(char => {
        let expectedChar = ''
        if (char === '{') {
          expectedChar = '}'
        } else if (char === '(') {
          expectedChar = ')'
        } else if (char === '[') {
          expectedChar = ']'
        } else if (char === '<') {
          expectedChar = '>'
        }
        lineChars.push(expectedChar)
      })
    }
    if (lineChars.length > 0) {
      log({ add: lineChars.join('') }, debug)
      additionalCharacters.push(lineChars.join(''))
    }
  })
  log({ additionalCharacters }, debug)
  const scores = sortNumbers(
    additionalCharacters.map(additional => {
      const split = additional.split('')
      let count = 0
      split.forEach(char => {
        count *= 5
        if (char === ')') {
          count += 1
        } else if (char === ']') {
          count += 2
        } else if (char === '}') {
          count += 3
        } else if (char === '>') {
          count += 4
        }
      })
      return count
    })
  )
  log({ scores }, debug)
  const solution = scores[Math.floor(scores.length / 2)]
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution.toString())
  console.timeEnd('part 2')
}
