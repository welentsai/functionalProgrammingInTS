import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

const a = O.of('a')
const b = O.of('b')
const c = O.of('c')
const d = O.none

// sequence example

const ary = [O.of('a'), O.of('b'), O.of('c')]

let result = RA.sequence(O.Applicative)([a, b, c])
console.log(result)

result = RA.sequence(O.Applicative)([a, b, c, d])
console.log(result)

result = pipe([a, b, c, c], RA.sequence(O.Applicative))
console.log(result)

// traverse example

const parseInteger = (s: string): E.Either<string, number> => {
  const n = parseInt(s, 10)
  return isNaN(n) ? E.left(`${s} is not a number`) : E.right(n)
}

console.log(parseInteger('1'))
console.log(parseInteger('2'))
console.log(parseInteger('3'))

const E1 = E.of('1')
const E2 = E.of('2')
const E3 = E.of('3')

const result2 = RA.traverse(E.Applicative)(parseInteger)(['1', '2', '3'])
console.log(result2)
