import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as M from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'

const parseInteger = (s: string): O.Option<number> => {
    const n = parseInt(s, 10)
    return isNaN(n) ? O.none : O.some(n)
}

console.log(parseInteger('10')) // { _tag: 'Some', value: 10 }
console.log(parseInteger('a')) // { _tag: 'None' }

const getSum: (numbers: ReadonlyArray<number>) => number = M.concatAll(
    N.MonoidSum
)

const solution1 = (input: ReadonlyArray<string>): O.Option<readonly number[]> => {
    // const parsing: readonly O.Option<number>[]
    const parsing = pipe(input, RA.map(parseInteger))
    // const numbers: O.Option<readonly number[]>
    const numbers = pipe(parsing, RA.sequence(O.Applicative))
    // const sum: O.Option<number>
    return numbers
}

console.log(solution1(['1', '2', '3']))

// map, sequence
const solution1_1 = (input: ReadonlyArray<string>): O.Option<readonly number[]> =>
    pipe(
        input,
        RA.map(parseInteger),
        RA.sequence(O.Applicative)
    )
console.log("map and sequence --> ", solution1_1(['1', '2', '3']))

const solustion2 = (input: ReadonlyArray<string>): O.Option<readonly number[]> =>
    pipe(
        input,
        RA.traverse(O.Applicative)(parseInteger)
    )

console.log("traverse -->   ", solustion2(['1', '2', '3']))


// skip bad ones 
const solution3 = (input: ReadonlyArray<string>): O.Option<readonly number[]> => {
    return pipe(
        input,
        RA.filterMap(parseInteger),
        O.fromNullable
    )
}

console.log('skip bad ones-->', solution3(['1', '2', 'a']))