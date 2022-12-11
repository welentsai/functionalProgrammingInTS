/**

In fp-ts a synchronous effectful computation is represented by the IO type, which is basically a thunk, 

interface IO<A> {
  (): A
}

Note that IO represents a computation that never fails
 */

import * as O from 'fp-ts/Option'
import { io } from 'fp-ts/IO'

interface IO<A> {
    (): A
}

const getItem = (key: string): IO<O.Option<string>> => () =>
    O.fromNullable(localStorage.getItem(key))

const setItem = (key: string, value: string): IO<void> => () =>
    localStorage.setItem(key, value)


const now: IO<number> = () => new Date().getTime()

console.log(now())

const log = (s: unknown): IO<void> => () => console.log(s)

log("123")()

const random: IO<number> = () => Math.random()

const program: IO<void> = io.chain(random, log)
// Note that nothing happens until you call program().

program()