import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { Do } from 'fp-ts-contrib/lib/Do'
import { pipe } from 'fp-ts/function'

type A = 'A'
type B = 'B'
type C = 'C'
type D = 'D'

const fa = (): T.Task<A> => {
  return T.of('A')
}

const fb = (a: string): T.Task<B> => {
  return T.of(`B`)
}

// In order to call fc we need to have access to the return values of fa and fb
const fc = (ab: { a: string; b: string }): T.Task<C> => {
  return T.of(`C`)
}

// const fd = (abc: { a: string; b: string; c: string }) => TE.TaskEither<D, Error>
const fd = (abc: {
  a: string
  b: string
  c: string
}): TE.TaskEither<Error, D> => {
  return TE.of(`D`)
}

const log = (x: string) => {
  console.log(x)
  return () => x
}

// The Do notation is similar to sequenceT and sequenceS in the sense that you need to provide it an instance.
// Difference between Do and Sequence :
//      The sequences require the instance to be of the Apply type (ap + map)
//      while Do requires a Monad type (ap + map + chain + of).
const result = Do(T.Monad)
  .bind('a', fa()) // task
  .bindL('b', ({ a } /* context */) => fb(a)) // lazy task
  .bindL('c', fc) // lazy task
  .return(({ c }) => c) // Task<"C">

result().then((res) => console.log('result', res))

// 方法二: The fp-ts TaskEither Built-In Do Notation

const result2 = Do(TE.Monad)
  .bind('a', TE.fromTask(fa()))
  .bindL('b', ({ a }) => TE.fromTask(fb(a)))
  .doL(({ b }) => pipe(log(b), T.fromIO, TE.fromTask))
  .bindL('c', ({ a, b }) => TE.fromTask(fc({ a, b })))
  .return(({ c }) => c)

console.log(result2())

result2().then((res) => console.log('result2->', res))

// 方法三: The fp-ts Task Built-In Do Notation
// the advantage of this approach is the ease of switching between different categories of monads
const result3 = pipe(
  T.bindTo('a')(fa()),
  T.bind('b', ({ a }) => fb(a)),
  T.chainFirst(({ b }) => pipe(log(b), T.fromIO)), // chainFirst is the equivalent of doL
  T.bind('c', ({ a, b }) => fc({ a, b })),
  TE.fromTask,
  TE.bind('d', ({ a, b, c }) => fd({ a, b, c })),
  TE.map(({ d }) => d)
)

console.log('result3', result3())

result3().then((res) => console.log('result3->', res))
