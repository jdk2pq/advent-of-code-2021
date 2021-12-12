import { read } from 'promise-path'
import { arrToNumberArr, log, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    'start-A\n' +
    'start-b\n' +
    'A-c\n' +
    'A-b\n' +
    'b-d\n' +
    'A-end\n' +
    'b-end'
  const testInput2 =
    'dc-end\n' +
    'HN-start\n' +
    'start-kj\n' +
    'dc-start\n' +
    'dc-HN\n' +
    'LN-dc\n' +
    'HN-end\n' +
    'kj-sa\n' +
    'kj-HN\n' +
    'kj-dc\n'
  const testInput3 =
    'fs-end\n' +
    'he-DX\n' +
    'fs-he\n' +
    'start-DX\n' +
    'pj-DX\n' +
    'end-zg\n' +
    'zg-sl\n' +
    'zg-pj\n' +
    'pj-he\n' +
    'RW-he\n' +
    'fs-DX\n' +
    'pj-RW\n' +
    'zg-RW\n' +
    'start-pj\n' +
    'he-WI\n' +
    'zg-he\n' +
    'pj-fs\n' +
    'start-RW\n'
  const testInputAsArray = testInput.split('\n')
  const testInput2AsArray = testInput2.split('\n')
  const testInput3AsArray = testInput3.split('\n')

  const inputAsArray = input.split('\n')

  await solveForFirstStar(testInput, testInputAsArray, true, true)
  await solveForFirstStar(testInput2, testInputAsArray, true, true)
  await solveForFirstStar(testInput3, testInputAsArray, true, true)
  await solveForFirstStar(input, inputAsArray, false, false)
  await solveForSecondStar(testInput, testInputAsArray, true, true)
  await solveForSecondStar(testInput2, testInput2AsArray, true, true)
  await solveForSecondStar(testInput3, testInput3AsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')

  const buildGraph = () => {
    const ret = {}
    const lines = input.split('\n')
    lines.forEach(line => {
      const [from, to] = line.split('-')
      if (!ret[from]) {
        ret[from] = []
      }
      ret[from].push(to)
      if (to !== 'end') {
        if (!ret[to]) {
          ret[to] = []
        }
        ret[to].push(from)
      }
    })
    return ret
  }
  const graph = buildGraph()
  // log({ graph }, debug)
  const findAllPaths = () => {
    const paths: string[] = []
    const findPaths = (node, path) => {
      if (node === 'end') {
        paths.push(path)
        return
      }
      graph[node].forEach(child => {
        if (
          (child.toLowerCase() === child && path.indexOf(child) === -1) ||
          child.toUpperCase() === child
        ) {
          // log({ path }, debug)
          findPaths(child, [...path, child])
        }
      })
    }
    findPaths('start', ['start'])
    return paths
  }
  const solution = findAllPaths()
  // log({ solution }, debug)
  report(
    `Solution 1${test ? ' (for test input)' : ''}:`,
    solution.length.toString()
  )
  console.timeEnd('part 1')
}

async function solveForSecondStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 2')

  const buildGraph = () => {
    const ret = {}
    const lines = input.split('\n')
    lines.forEach(line => {
      const [from, to] = line.split('-')
      if (!ret[from]) {
        ret[from] = []
      }
      ret[from].push(to)
      if (to !== 'end') {
        if (!ret[to]) {
          ret[to] = []
        }
        ret[to].push(from)
      }
    })
    return ret
  }
  const graph = buildGraph()
  // log({ graph }, debug)
  const findAllPaths = () => {
    const paths: Array<{ path: string[]; visitedSmallTwice: boolean }> = []
    const findPaths = (
      node,
      path: { path: string[]; visitedSmallTwice: boolean }
    ) => {
      if (node === 'end') {
        // log({ path: path.path }, debug)
        paths.push(path)
        return
      }
      graph[node].forEach(child => {
        if (child !== 'start') {
          if (
            (child.toLowerCase() === child &&
              path.path.indexOf(child) === -1) ||
            child.toUpperCase() === child
          ) {
            findPaths(child, {
              path: [...path.path, child],
              visitedSmallTwice: path.visitedSmallTwice
            })
          } else if (
            child.toLowerCase() === child &&
            path.path.filter(p => p === child).length === 1 &&
            !path.visitedSmallTwice
          ) {
            findPaths(child, {
              path: [...path.path, child],
              visitedSmallTwice: true
            })
          }
        }
      })
    }
    findPaths('start', { path: ['start'], visitedSmallTwice: false })
    return paths
  }
  const solution = findAllPaths()
  report(
    `Solution 2${test ? ' (for test input)' : ''}:`,
    solution.length.toString()
  )
  console.timeEnd('part 2')
}
