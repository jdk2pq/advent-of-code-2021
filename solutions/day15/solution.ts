import { read } from 'promise-path'
import { arrToNumberArr, reportGenerator, sortNumbers } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput =
    '1163751742\n' +
    '1381373672\n' +
    '2136511328\n' +
    '3694931569\n' +
    '7463417111\n' +
    '1319128137\n' +
    '1359912421\n' +
    '3125421639\n' +
    '1293138521\n' +
    '2311944581'
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
  const graph = inputAsArray.map((line, lineIdx) => {
    const lineAsArray = line.split('')
    return lineAsArray.map((char, charIdx) => {
      const paths: Array<string> = []
      if (inputAsArray[lineIdx - 1] && inputAsArray[lineIdx - 1][charIdx]) {
        paths.push([lineIdx - 1, charIdx].join(','))
      }
      if (inputAsArray[lineIdx + 1] && inputAsArray[lineIdx + 1][charIdx]) {
        paths.push([lineIdx + 1, charIdx].join(','))
      }
      if (inputAsArray[lineIdx] && inputAsArray[lineIdx][charIdx + 1]) {
        paths.push([lineIdx, charIdx + 1].join(','))
      }
      if (inputAsArray[lineIdx] && inputAsArray[lineIdx][charIdx - 1]) {
        paths.push([lineIdx, charIdx - 1].join(','))
      }
      return {
        weight: Number(char),
        node: [lineIdx, charIdx].join(','),
        paths,
        distance: charIdx === 0 && lineIdx === 0 ? 0 : Number.MAX_SAFE_INTEGER
      }
    })
  })
  if (debug) {
    graph.forEach(line => {
      line.forEach(node => {
        console.log({ node, paths: node.paths })
      })
    })
  }
  const shortestPath: any[] = []
  const queue = ['0,0']
  const alreadyVisited = {}
  const findMinNode = (): any => {
    let minNode = ''
    let minDistance = Number.MAX_SAFE_INTEGER
    queue.forEach(node => {
      if (alreadyVisited[node]) {
        return
      }
      const nodeAsArray = node.split(',')
      const nodeIdx = Number(nodeAsArray[0])
      const nodeCharIdx = Number(nodeAsArray[1])
      const nodeDistance = graph[nodeIdx][nodeCharIdx].distance
      if (nodeDistance < minDistance) {
        minNode = node
        minDistance = nodeDistance
      }
    })
    return minNode
  }
  while (shortestPath.length !== graph.length * graph[0].length) {
    const [i, j] = findMinNode().split(',').map(Number)
    if (alreadyVisited[`${i},${j}`]) {
      continue
    }
    alreadyVisited[`${i},${j}`] = true
    const node = graph[i][j]
    if (node.distance === Number.MAX_SAFE_INTEGER) {
      console.log('uhhh')
      break
    }
    node.paths.forEach(path => {
      const [lineIdx, charIdx] = path.split(',').map(Number)
      const newDistance = node.distance + graph[lineIdx][charIdx].weight
      if (newDistance < graph[lineIdx][charIdx].distance) {
        graph[lineIdx][charIdx].distance = newDistance
      }
      if (
        !alreadyVisited[`${lineIdx},${charIdx}`] &&
        !queue.includes(`${lineIdx},${charIdx}`)
      ) {
        queue.push(`${lineIdx},${charIdx}`)
      }
    })
    shortestPath.push(node.node)
  }

  const runDjikstrasAlgorithm = (graph: any[][], start: string) => {
    const distances = {}
    const visited = {}
    const queue = [start]
    while (queue.length) {
      const node = queue.shift() as string
      if (visited[node]) {
        continue
      }
      visited[node] = true
      const [lineIdx, charIdx] = node.split(',').map(Number)
      const nodeObj = graph[lineIdx][charIdx]
      nodeObj.paths.forEach(path => {
        const [lineIdx, charIdx] = path.split(',').map(Number)
        const newDistance = nodeObj.distance + graph[lineIdx][charIdx].weight
        if (newDistance < graph[lineIdx][charIdx].distance) {
          graph[lineIdx][charIdx].distance = newDistance
        }
      })
      nodeObj.paths.forEach(path => {
        const [lineIdx, charIdx] = path.split(',').map(Number)
        queue.push(path)
      })
    }
    return distances
  }

  // const distances = runDjikstrasAlgorithm(graph, '0,0')
  // console.log({ distances })

  if (debug) {
    graph.forEach(line => {
      line.forEach(node => {
        console.log({ node, paths: node.paths })
      })
    })
  }
  const solution = graph[graph.length - 1][graph[0].length - 1].distance
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
  const solution = 'UNSOLVED'
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 2')
}
