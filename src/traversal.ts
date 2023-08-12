import * as Console from 'fp-ts/Console'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import * as string from 'fp-ts/string'
import * as S from 'fp-ts/Semigroup'

/**
 * Traversal - It performs the same thing sequence but lets us transform the intermediate value.
 */
const taskLog = T.fromIOK(Console.log)

const getPartIds = (): TE.TaskEither<string, string[]> => {
  return TE.right(['1', '2', '3'])
}

const getPart = (id: string): TE.TaskEither<string, string> => {
  // if(id === '2') {
  return TE.right(`this is #${id}`)
  // }
  // return TE.left(`Error: this is #${id}`)
}

const Applicative = TE.getApplicativeTaskValidation(
  T.ApplyPar,
  pipe(string.Semigroup, S.intercalate(', '))
)

const result: TE.TaskEither<string, string[]> = pipe(
  getPartIds(),
  TE.chain(A.traverse(Applicative)(getPart))
)

const main: T.Task<void> = pipe(
  result,
  TE.fold(
    (e) => taskLog(`error: ${e}`),
    (arr) => taskLog(`${arr}`)
  )
)

main()
