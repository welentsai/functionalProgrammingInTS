/**
 * Task
 *  - Every asynchronous operation in modern Typescript is done using a Promise object
 *  - A task is a function that returns a promise which is expected to never be rejected
 *
 * Either
 *  - An Either is a type that represents a synchronous operation that can succeed or fail.
 */

import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { pipe, flow } from 'fp-ts/lib/function'

// Build from a predicate
const isEven = (num: number) => num % 2 === 0

// Build an async function
const asyncIsEven = async (n: number) => {
  if (!isEven(n)) {
    throw new Error(`${n} is odd`)
  }

  return n
}

// wrap up async function to taskEither
const isEvenTE = (n: number) => TE.tryCatch(() => asyncIsEven(n), E.toError)

// Biz flow
const getResult = flow(
  isEvenTE,
  TE.match(
    (e: Error) => e.message,
    (a) => `${a} is even`
  )
)

// the edge of context boundary
getResult(4)().then((res) => console.log(res))
