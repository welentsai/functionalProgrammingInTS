import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/Task'
import * as Console from 'fp-ts/Console'

/**

interface Task<A> {
  (): Promise<A>
}

Task<A> represents an asynchronous computation that yields a value of type A and never fails
If you want to represent an asynchronous computation that may fail, please see TaskEither
 */

const foo = 'asdf' // string

const bar = T.of(foo)
bar().then((res) => console.log(res))

console.log('-')

// A Task is simply a function that returns a Promise
// Promise.resolve(foo) is the same as new Promise(resolve => resolve(foo))
const fdsa: T.Task<string> = () => Promise.resolve('hello')
fdsa().then((res) => console.log('fdsa promise -> then ->', res))
console.log('call fdsa() -', fdsa())

const waitAndGet = async () => {
  return await fdsa()
}

console.log('waitAndGet', waitAndGet())

const getHello = () => Promise.resolve('hello')
const addAtEnd =
  (b: string) =>
  (a: string): string =>
    a + b

const getHello2 = T.of('Hello')

const getHelloAndAddWorld = pipe(getHello, T.map(addAtEnd(' world')))

// same as
const getHelloAndAddWorld_2 = T.map(addAtEnd(' world'))(getHello2)

const logHelloAndWorld = pipe(
  getHello,
  T.map(addAtEnd(' world')),
  T.chainIOK(Console.log)
)

const logHelloAndWorld_2: T.Task<void> = pipe(
  getHelloAndAddWorld_2,
  T.chainIOK(Console.log)
)

logHelloAndWorld()
logHelloAndWorld_2()
