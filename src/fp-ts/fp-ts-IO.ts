/**

In fp-ts a synchronous effectful computation is represented by the IO type, which is basically a thunk, 

interface IO<A> {
  (): A
}

Note that IO represents a computation that never fails
 */

import * as O from 'fp-ts/Option'
import { io } from 'fp-ts/lib'

// interface IO<A> {
//   (): A
// }

const getItem =
  (key: string): io.IO<O.Option<string>> =>
  () =>
    O.fromNullable(localStorage.getItem(key))

const setItem =
  (key: string, value: string): io.IO<void> =>
  () =>
    localStorage.setItem(key, value)

const now: io.IO<number> = () => new Date().getTime()

console.log('IO<number> ->', now())

const log =
  (s: unknown): io.IO<void> =>
  () =>
    console.log(s)

log('123')()

const random: io.IO<number> = () => Math.random()

const program: io.IO<void> = io.chain(log)(random)
// Note that nothing happens until you call program().

program()
