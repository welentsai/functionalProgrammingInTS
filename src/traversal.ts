
import * as Console from 'fp-ts/Console'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

/**
 * Traversal - It performs the same thing sequence but lets us transform the intermediate value.
 */
const taskLog = T.fromIOK(Console.log)


const getPartIds = (): TE.TaskEither<Error, string[]> => {
    return TE.right(['1', '2', '3'])
}

const getPart = (id: string): TE.TaskEither<Error, string> => {
    return TE.right(`this is #${id}`)
}

const result: TE.TaskEither<Error, string[]> = pipe(
    getPartIds(),
    TE.chain(A.traverse(TE.Monad)(getPart)),
)



const main: T.Task<void> = pipe(
    result,
    TE.fold(
        e => taskLog(`error: ${e}`),
        arr => taskLog(`${arr}`)
    )
)

main()