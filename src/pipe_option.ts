import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'


const add = (x: number) => (y: number) => x + y

const data = undefined

const result = pipe(
    O.fromNullable(data),
    O.map(x => x + 1),
    O.chain(x => O.of(x + 2))
)

console.log(result)