import { read } from 'promise-path'
import { log, reportGenerator } from '../../util'

const report = reportGenerator(__filename)

export async function run(day: string) {
  const input = (await read(`solutions/${day}/input.txt`, 'utf8')).trim()

  const testInput1 = 'D2FE28'
  const testInput2 = '38006F45291200'
  const testInput3 = 'EE00D40C823060'
  const testInput4 = '8A004A801A8002F478'
  const testInput5 = '620080001611562C8802118E34'
  const testInput6 = 'C0015000016115A2E0802F182340'
  const testInput7 = 'A0016C880162017C3686B18A3D4780'

  const testInput8 = 'C200B40A82'
  const testInput9 = '04005AC33890'
  const testInput10 = '880086C3E88112'
  const testInput11 = 'CE00C43D881120'
  const testInput12 = 'D8005AC2A8F0'
  const testInput13 = 'F600BC2D8F'
  const testInput14 = '9C005AC2F8F0'
  const testInput15 = '9C0141080250320F1802104A08'

  // unused
  const testInputAsArray = testInput1.split('\n')

  const inputAsArray = input.split('\n')

  // await solveForFirstStar(testInput1, testInputAsArray, true, false)
  // await solveForFirstStar(testInput2, testInputAsArray, true, false)
  // await solveForFirstStar(testInput3, testInputAsArray, true, false)
  // await solveForFirstStar(testInput4, testInputAsArray, true, false)
  // await solveForFirstStar(testInput5, testInputAsArray, true, false)
  // await solveForFirstStar(testInput6, testInputAsArray, true, false)
  // await solveForFirstStar(testInput7, testInputAsArray, true, false)
  // await solveForFirstStar(input, inputAsArray, false, false)
  // await solveForSecondStar(testInput8, testInputAsArray, true, true)
  // await solveForSecondStar(testInput9, testInputAsArray, true, true)
  // await solveForSecondStar(testInput10, testInputAsArray, true, true)
  // await solveForSecondStar(testInput11, testInputAsArray, true, true)
  // await solveForSecondStar(testInput12, testInputAsArray, true, true)
  // await solveForSecondStar(testInput13, testInputAsArray, true, true)
  // await solveForSecondStar(testInput14, testInputAsArray, true, true)
  // await solveForSecondStar(testInput15, testInputAsArray, true, true)
  await solveForSecondStar(input, inputAsArray, false, false)
}

const hexToBit = (hex: string) => {
  const bit = parseInt(hex, 16).toString(2)
  return '0'.repeat(4 - bit.length) + bit
}

async function solveForFirstStar(
  input: string,
  inputAsArray: Array<any>,
  test: boolean,
  debug: boolean
) {
  console.time('part 1')

  let versionSum = 0
  let currentBit = ''
  const queue: string[] = []
  const operate = () => {
    log('\nstart of operate', debug)
    const currentVersion = parseInt(currentBit.slice(0, 3), 2)
    const currentTypeId = parseInt(currentBit.slice(3, 6), 2)
    log({ currentBit, currentVersion, currentTypeId }, debug)
    if (currentTypeId === 4) {
      log(" - it's a literal value", debug)
      let groups = currentBit.slice(6).match(/.{1,5}/g) as string[]
      log({ groups }, debug)
      if (groups.some(group => group.startsWith('0') && group.length === 5)) {
        const slicePoint = groups.findIndex(
          group => group.startsWith('0') && group.length === 5
        )
        const literalValueGroups = groups.slice(0, slicePoint + 1)
        versionSum += currentVersion
        const value = parseInt(
          literalValueGroups
            .filter(g => g.length === 5)
            .reduce((acc, cur) => acc + cur.slice(1), ''),
          2
        )
        log({ literalValue: value }, debug)

        let currentBitSlicePoint = 6 + literalValueGroups.length * 5
        while (
          currentBitSlicePoint % 4 !== 0 &&
          groups[slicePoint + 1] &&
          groups[slicePoint + 1].length !== 5 &&
          !groups[slicePoint + 1].includes('1')
        ) {
          currentBitSlicePoint++
        }
        const newBit = currentBit.slice(currentBitSlicePoint)
        log(
          {
            currentBit,
            currentBitLength: currentBit.length,
            currentBitSlicePoint,
            newBit
          },
          debug
        )
        currentBit = newBit
      }
    } else {
      log(" - it's an operator value", debug)
      const lengthTypeId = currentBit[6]
      if (lengthTypeId === '0') {
        const lengthOfSubpackets = currentBit.slice(7, 22)
        if (lengthOfSubpackets.length !== 15) {
          return
        } else {
          const length = parseInt(lengthOfSubpackets, 2)
          log({ length }, debug)
          const packets = currentBit.slice(22, 22 + length)
          if (currentBit.slice(22 + length).length !== 0) {
            queue.push(currentBit.slice(22 + length))
          }
          log(
            {
              currentBit,
              packets
            },
            debug
          )
          currentBit = packets
          versionSum += currentVersion
        }
      } else {
        const lengthOfSubpackets = currentBit.slice(7, 18)
        currentBit = currentBit.slice(18)
        const length = parseInt(lengthOfSubpackets, 2)
        log(
          {
            lengthOfSubpackets: length,
            currentBit,
            slice: currentBit.slice(18)
          },
          debug
        )
        versionSum += currentVersion
      }
    }
  }
  let previousBit = ''
  currentBit = input.split('').reduce((acc, char) => {
    // previousBit = currentBit
    acc += hexToBit(char)
    return acc
  }, '')
  while (
    (previousBit !== currentBit && currentBit.length > 6) ||
    queue.length > 0
  ) {
    previousBit = currentBit
    operate()
    log({ queue }, debug)
    if (currentBit.length <= 6 && queue.length > 0) {
      currentBit = queue.shift() as string
    }
  }

  const solution = versionSum.toString()
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

  let currentBit = ''
  const queue: string[] = []
  const statement: { type: string; value: number; length?: number }[] = []
  const operate = () => {
    log('\nstart of operate', debug)
    const currentVersion = parseInt(currentBit.slice(0, 3), 2)
    const currentTypeId = parseInt(currentBit.slice(3, 6), 2)
    log({ currentBit, currentVersion, currentTypeId }, debug)
    if (currentTypeId === 4) {
      log(" - it's a literal value", debug)
      let groups = currentBit.slice(6).match(/.{1,5}/g) as string[]
      log({ groups }, debug)
      if (groups.some(group => group.startsWith('0') && group.length === 5)) {
        const slicePoint = groups.findIndex(
          group => group.startsWith('0') && group.length === 5
        )
        const literalValueGroups = groups.slice(0, slicePoint + 1)
        const value = parseInt(
          literalValueGroups
            .filter(g => g.length === 5)
            .reduce((acc, cur) => acc + cur.slice(1), ''),
          2
        )
        log({ literalValue: value }, debug)

        let currentBitSlicePoint = 6 + literalValueGroups.length * 5
        while (
          currentBitSlicePoint % 4 !== 0 &&
          groups[slicePoint + 1] &&
          groups[slicePoint + 1].length !== 5 &&
          !groups[slicePoint + 1].includes('1')
        ) {
          currentBitSlicePoint++
        }
        const newBit = currentBit.slice(currentBitSlicePoint)
        log(
          {
            currentBit,
            currentBitLength: currentBit.length,
            currentBitSlicePoint,
            newBit
          },
          debug
        )
        currentBit = newBit
        statement.push({ type: 'literal', value })
      }
    } else {
      log(" - it's an operator value", debug)
      const lengthTypeId = currentBit[6]
      if (lengthTypeId === '0') {
        const lengthOfSubpackets = currentBit.slice(7, 22)
        const length = parseInt(lengthOfSubpackets, 2)
        log({ length }, debug)
        statement.push({ type: 'typeId', value: currentTypeId })

        const packets = currentBit.slice(22, 22 + length)
        if (currentBit.slice(22 + length).length !== 0) {
          queue.push(currentBit.slice(22 + length))
        }
        log(
          {
            currentBit,
            packets
          },
          debug
        )
        currentBit = packets
      } else {
        const lengthOfSubpackets = currentBit.slice(7, 18)
        currentBit = currentBit.slice(18)
        const length = parseInt(lengthOfSubpackets, 2)
        statement.push({ type: 'typeId', value: currentTypeId, length })
        log(
          {
            lengthOfSubpackets: length,
            currentBit,
            slice: currentBit.slice(18)
          },
          debug
        )
      }
    }
  }
  let previousBit = ''
  currentBit = input.split('').reduce((acc, char) => {
    acc += hexToBit(char)
    return acc
  }, '')
  while (
    (previousBit !== currentBit && currentBit.length > 6) ||
    queue.length > 0
  ) {
    previousBit = currentBit
    operate()
    log({ queue }, debug)
    if (currentBit.length <= 6 && queue.length > 0) {
      currentBit = queue.shift() as string
    }
  }

  console.log({ statement })
  const solution = statement
    .reduce((acc, value) => {
      return acc
    }, 0)
    .toString()
  report(`Solution 2${test ? ' (for test input)' : ''}:`, solution)
  console.timeEnd('part 2')
}
