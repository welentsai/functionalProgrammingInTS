import * as Ap from 'fp-ts/Apply'
import * as RA from 'fp-ts/ReadonlyArray'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as string from 'fp-ts/string'
import * as S from 'fp-ts/Semigroup'
import * as M from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'
import assert from 'assert'

const parseString = (u: unknown): E.Either<string, string> =>
  typeof u === 'string' ? E.right(u) : E.left('not a string')

const parseNumber = (u: unknown): E.Either<string, number> =>
  typeof u === 'number' ? E.right(u) : E.left('not a number')

const getSum: (numbers: ReadonlyArray<number>) => number = M.concatAll(
  N.MonoidSum
)

const S1: S.Semigroup<string> = pipe(string.Semigroup, S.intercalate('+'))
console.log(S1.concat('a', 'b'))

const customApplicative = E.getApplicativeValidation(
  pipe(string.Semigroup, S.intercalate(', '))
)

const apS = Ap.apS(customApplicative)

const parsePersonAll = (
  input: Record<string, unknown>
): E.Either<string, Person> =>
  pipe(
    E.Do,
    apS('name', parseString(input.name)),
    apS('age', parseNumber(input.age))
  )

assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
assert.deepStrictEqual(
  parsePersonAll({ name: 'abc', age: 56 }),
  E.right({ name: 'abc', age: 56 })
)

const S2 = RA.getSemigroup<string>()

console.log(S2.concat(['a', 'b'], ['c', 'd']))

const Applicative2 = E.getApplicativeValidation(RA.getSemigroup<string>())

const solution = (
  input: ReadonlyArray<string>
): E.Either<ReadonlyArray<string>, number> => {
  return pipe(
    input,
    RA.traverse(Applicative2)((s) => pipe(s, parseNumber, E.mapLeft(RA.of))),
    E.map(getSum)
  )
}

const praseNum: (s: unknown) => E.Either<ReadonlyArray<string>, number> = (s) =>
  pipe(s, parseNumber, E.mapLeft(RA.of))

const traverse = RA.traverse(Applicative2)(praseNum)

console.log('traverse', traverse([1, 2, 3]))
console.log('traverse', traverse([1, 2, '3', '4']))

interface CreditCard {
  number: string
  expiry: string
  cvv: string
}

const v1 = (s: string): E.Either<ReadonlyArray<string>, string> => {
  return s !== 'invalid' ? E.right(s) : E.left(RA.of('invalid number'))
}

const v2 = (s: string): E.Either<ReadonlyArray<string>, string> => {
  return s !== 'invalid' ? E.right(s) : E.left(RA.of('invalid expiry'))
}

const v3 = (s: string): E.Either<ReadonlyArray<string>, string> => {
  return s !== 'invalid' ? E.right(s) : E.left(RA.of('invalid cvv'))
}

const validation = E.getApplicativeValidation(RA.getSemigroup<string>())

const validateStruct = Ap.sequenceS(validation)

const card: CreditCard = {
  number: 'invalid',
  expiry: '2022-01-31',
  cvv: 'invalid'
}

const fromPipe = pipe(
  validateStruct({
    number: v1(card.number),
    expiry: v2(card.expiry),
    cvv: v3(card.cvv)
  }),
  E.map((validProperties) => validProperties) // can do something more ...
)

console.log('fromPipe', fromPipe)
