import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function";

const double = (n: number): number => n * 2

const functional = (as: ReadonlyArray<number>): string => {
    const head = <A>(as: ReadonlyArray<A>): E.Either<string, A> =>
        as.length === 0 ? E.left('empty array') : E.right(as[0])

    const inverse = (n: number): E.Either<string, number> =>
        (n === 0 ? E.left('cannot divide by zero') : E.right(1 / n))

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