import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as IE from 'fp-ts/IOEither'
import { pipe } from 'fp-ts/function'

/**
 *  A Kleisli arrow is a function with the following signature
 *  (a: A) => F<B>
 *      where F is a type constructor.
 */

function parse(s: string): E.Either<Error, number> {
  const n = parseFloat(s)
  return isNaN(n)
    ? E.left(new Error(`cannot decode ${JSON.stringify(s)} to number`))
    : E.right(n)
}

const input: IE.IOEither<Error, string> = IE.right('123')

const result: E.Either<Error, number> = pipe(
  input,
  IE.chain(IE.fromEitherK(parse))
)()

console.log(result) // { _tag: 'Right', right: 123 }

const result2: E.Either<Error, number> = pipe(input, IE.chainEitherK(parse))()

console.log(result2) // { _tag: 'Right', right: 123 }

// from Option to Either

const inputO: O.Option<string> = O.some('123')

const result3: O.Option<number> = pipe(inputO, O.chainEitherK(parse))

console.log(result3) // { _tag: 'Some', value: 123 }

const inputOO: O.Option<string> = O.some('abc')
const result4: E.Either<Error, string> = pipe(
  inputOO,
  E.fromOption(() => new Error('Error'))
)
