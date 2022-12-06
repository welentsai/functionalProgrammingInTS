import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
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

result = pipe(
    [a, b, c, c],
    RA.sequence(O.Applicative)
)
console.log(result)