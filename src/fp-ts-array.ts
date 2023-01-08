import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import { max } from 'fp-ts/lib/ReadonlyNonEmptyArray'

function doSomething(arr1: Array<number>, arr2: Array<number>): number {
  const n = Math.min(arr1.length, arr2.length)
  let total = 0

  for (let i = 0; i < n; i++) {
    total += Math.max(arr1[i], arr2[i])
  }

  return total
}

function functionalizeSomething(
  arr1: Array<number>,
  arr2: Array<number>
): number {
  const zipped = A.zip(arr2)(arr1)
  console.log(zipped)
  const maxxed = A.map((pair: Array<number>) => Math.max(...pair))(zipped)
  console.log(maxxed)
  const total = A.reduce(0, (a: number, b: number) => a + b)(maxxed)
  return total
}

function composeSomething(arr1: Array<number>, arr2: Array<number>): number {
  return pipe(
    arr1,
    A.zip(arr2),
    A.map((pair) => Math.max(...pair)),
    A.reduce(0, (a, b) => a + b)
  )
}

console.log(functionalizeSomething([1, 2], [4, 5, 6]))
console.log(composeSomething([1, 2], [4, 5, 6]))
