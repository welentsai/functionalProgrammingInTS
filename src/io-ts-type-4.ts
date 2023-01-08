import * as t from 'io-ts'
import { withMessage } from 'io-ts-types'
import { PathReporter } from 'io-ts/PathReporter'

interface NonEmptyString50Brand {
  readonly NonEmptyString50: unique symbol
}

const NonEmptyString50 = t.brand(
  t.string,
  (s: string): s is t.Branded<string, NonEmptyString50Brand> =>
    s.length > 0 && s.length <= 50,
  'NonEmptyString50'
)

type NonEmptyString502 = t.TypeOf<typeof NonEmptyString50>

console.log(PathReporter.report(NonEmptyString50.decode(42)))
console.log(PathReporter.report(NonEmptyString50.decode('abc')))
console.log(NonEmptyString50.decode('abc'))