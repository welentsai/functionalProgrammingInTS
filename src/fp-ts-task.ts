import * as T from 'fp-ts/Task'

/**

interface Task<A> {
  (): Promise<A>
}

Task<A> represents an asynchronous computation that yields a value of type A and never fails
If you want to represent an asynchronous computation that may fail, please see TaskEither
 */

const foo = 'asdf' // string

const bar = T.of(foo)

// bar is same as fdsa
const fdsa: T.Task<string> = () => Promise.resolve(foo)


bar().then(
    res => console.log(res)
)

console.log('-')