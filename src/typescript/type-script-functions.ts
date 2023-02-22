import { flow } from 'fp-ts/lib/function'

// Named function
function add(x: number, y: number) {
  return x + y
}

console.log(add(12, 12))

// Anonymous function
const myAdd = function (x: number, y: number) {
  return x + y
}

console.log('myAdd', myAdd(1, 2))

// add types to anonymous function
const myAdd2 = function (x: number, y: number): number {
  return x + y
}

const myAdd22 = (x: number, y: number): number => {
  return x + y
}

console.log('add22', myAdd22(1, 3))

// write the full type of the function
const myAdd3: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y
}

const myAdd3_1: (x: number, y: number) => number = (x, y) => {
  return x + y
}

console.log('myAdd3->', myAdd3(1, 2))
console.log('myAdd3_1->', myAdd3_1(1, 2))

/***
 * Inferring the types
 */

// 等號(=)後面接的就是 anonymous function
const myAdd4 = function (x: number, y: number): number {
  return x + y
}

// myAdd has the full function type
// 等號(=)後面接的就是 anonymous function
// 冒號(:)後面是 type
const myAdd5: (baseValue: number) => number = function (x) {
  return x + 5
}

const myAdd5_1: (baseValue: number) => number = (x) => x + 5

const myAdd6 = (x: number, y: number) => {
  return x + y
}
