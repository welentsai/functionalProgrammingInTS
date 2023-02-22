import * as assert from 'assert'
import * as E from 'fp-ts/Either'
import { pipe, flow } from 'fp-ts/function'
import * as M from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'

const double = (n: number): number => n * 2

const functional = (as: ReadonlyArray<number>): string => {
  const head = <A>(as: ReadonlyArray<A>): E.Either<string, A> =>
    as.length === 0 ? E.left('empty array') : E.right(as[0])

  const inverse = (n: number): E.Either<string, number> =>
    n === 0 ? E.left('cannot divide by zero') : E.right(1 / n)

  return pipe(
    as,
    head,
    E.map(double),
    E.chain(inverse),
    E.match(
      (err) => `Error is ${err}`, // onLeft handler
      (head) => `Result is ${head}` // onRight handler
    )
  )
}

const result = functional([1, 2, 3]) // 0.5
//const result = functional([]) // Error is empty array
//const result = functional([0]) // Error is cannot divide by zero
console.log(result)

const parseInteger = (s: string): E.Either<string, number> => {
  const n = parseInt(s, 10)
  return isNaN(n) ? E.left(`${s} is not a number`) : E.right(n)
}

const getSum: (numbers: ReadonlyArray<number>) => number = M.concatAll(
  N.MonoidSum
)

const solution = (input: ReadonlyArray<string>): E.Either<string, number> => {
  // const parsing: readonly E.Either<string, number>[]
  const parsing = pipe(input, RA.map(parseInteger))
  // const numbers: Either<string, readonly number[]>
  const numbers = pipe(parsing, RA.sequence(E.Applicative))
  // const sum: E.Either<string, number>
  const sum = pipe(numbers, E.map(getSum))
  return sum
}

const solution2 = (input: ReadonlyArray<string>): E.Either<string, number> => {
  return pipe(
    input,
    RA.map(parseInteger),
    RA.sequence(E.Applicative),
    E.map(getSum)
  )
}

// map + sequence = traverse
const solution3 = (input: ReadonlyArray<string>): E.Either<string, number> => {
  return pipe(input, RA.traverse(E.Applicative)(parseInteger), E.map(getSum))
}

assert.deepStrictEqual(solution(['1', '2', '3']), E.right(6))
assert.deepStrictEqual(solution2(['1', '2', '3']), E.right(6))
assert.deepStrictEqual(solution3(['1', '2', '3']), E.right(6))

// you get only the first error
assert.deepStrictEqual(solution3(['1', 'a', 'b']), E.left('a is not a number'))

// !!重要!! => 拿到所有的 errors, 用 E.mapLeft(RA.of) 裝在RA容器中
// If you want to get all errors
const solution4 = (
  input: ReadonlyArray<string>
): E.Either<ReadonlyArray<string>, number> => {
  return pipe(
    input,
    RA.traverse(E.getApplicativeValidation(RA.getSemigroup<string>()))((s) =>
      pipe(s, parseInteger, E.mapLeft(RA.of))
    ),
    E.map(getSum)
  )
}

assert.deepStrictEqual(solution4(['1', '2', '3']), E.right(6))
assert.deepStrictEqual(
  solution4(['1', 'a', '3']),
  E.left(['a is not a number'])
)
assert.deepStrictEqual(
  solution4(['1', 'a', 'b']),
  E.left(['a is not a number', 'b is not a number'])
)

console.log('solution4', solution4(['1', 'a', 'b']))
console.log('solution4', solution4(['1', '2', '3']))

//  if you just want to skip bad inputs but keep adding good ones

const parseIntegerO = (s: string): O.Option<number> => {
  const n = parseInt(s, 10)
  return isNaN(n) ? O.none : O.some(n)
}

const solution5 = (input: ReadonlyArray<string>): number => {
  return pipe(input, RA.filterMap(parseIntegerO), getSum)
}

assert.deepStrictEqual(solution5(['1', '2', '3']), 6)
assert.deepStrictEqual(solution5(['1', 'a', '3']), 4)

//  since input is repeated you can get rid of pipe and use flow
const solution6: (input: ReadonlyArray<string>) => number = flow(
  RA.filterMap(parseIntegerO),
  getSum
)

console.log('solution6->', solution6(['1', '2', '3'])) // olution6-> 6
