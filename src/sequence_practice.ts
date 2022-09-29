import * as f from "fp-ts/function";
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import * as A from "fp-ts/Array";
import { sequenceT } from "fp-ts/Apply";
import { pipe } from "fp-ts/function";
import * as t from 'io-ts'
import axios, { AxiosResponse } from 'axios';


/**
 * And applicatives form the basis for sequences and traversals
 * An applicative has 3 methods: of, map, and ap.

/**
 * Apply
 * 
 * In many ways, it is like the reverse of map.  Rather than piping a value into a function, you pipe a function into a value
 * Currying is taking a function with multiple parameters and converting it into a higher order function
 * 
 * Ex. curry function
 * const writeC = (key: string) => (value: string) => (flush: boolean) => write(key, value, flush)
 * 
 * Call curry function like this: 
 * 方法一:
 * writeC('key')('value')(true)
 * 
 * 方法二:
 * To make this work, we will need to enforce the order of operations (just like in math), with more pipes!
 * pipe(true, pipe('value', pipe('key', writeC)))
 * 
 * Now the compiler understands because we force the right side to evaluate first
 * 
 * 方法三:
 * import { ap } from 'fp-ts/lib/Identity'
 * pipe(writeC, ap('key'), ap('value'), ap(true))
 * 
 * 另一個使用情境
 * Another use case for ap is when you have functions and values that don't play well together because one of them is trapped inside an Option or an Either
 * ap is useful in this scenario because it can lift values or functions into a particular category.
 * 
 * 
 * 使用範例 
 * const fooC = (a: number) => (b: string) => foo(a, b) 
 * pipe(O.of(fooC), O.ap(a), O.ap(b))   // lift fooC into the Operation category
 * 
 * ap 的缺點
 * 1. its boring to have to curried every function in existence just to use fp
 * 2. reversing the order of the input value of a function inside of a pipe from left-to-right to right-to-left breaks the natural flow of operations
 * 
 * 帶出 Sequence, 可以用 Sequence 取代 ap
 * In the real world, there's hardly a usecase for ap because we can leverage sequences instead
 * 
 * 什麼是 Sequence ？
 * we think of a sequence as a sequence of numbers
 * 
 * 最常的使用情境
 * The most common usecase for a sequence is convert an array of say Options into an Option of an array 
 * 
 * 問題： 如何把一個Array of Option<A> 轉成  Option of A[]  ?  
 * Array<Option<A>> => Option<A[]>
 * 
 * Ans:
 * import * as A from 'fp-ts/lib/Array'
 * import * as O from 'fp-ts/lib/Option'
 * 
 *  const arr = [1, 2, 3].map(O.of) Array of Option<number>
 *  A.array.sequence(O.option)(arr) // Option<number[]>
 * 
 sequenceT(O.option)(O.of(123), O.of('asdf'))
  pipe(
   sequenceT(O.option)(O.of(123), O.of('asdf')),
   O.map((args) => foo(...args)),
   O.map(bar),
  )
 */

//create a schema to load our user data into
const users = t.type({
    data: t.array(t.type({
        first_name: t.string
    }))
});

//schema to hold the deepest of answers
const answer = t.type({
    ans: t.number
});

// -- Sequence Example 1


/**
 * The most common usecase for a sequence is convert an array of say Options into an Option of an array.
 * 解方 => To do this, you need to provide sequence an instance of Applicative
 * 什麼是 Applicative => An applicative has 3 methods: of, map, and ap. 
 * 
 */
const arr: O.Option<number>[] = [1, 2, 3].map(O.of)  // arr is a array of Option<number>
const result = A.sequence(O.Monad)(arr) // Option<number[]> // result is a Option of number array
console.log("result -> ", result)

/**
 * sequenceT is the same as a regular sequence except you pass it a rest parameter (vararg).
 */
const result2 = sequenceT(O.Monad)(O.of(123), O.of('asdf')) //sequenceT is the same as a regular sequence except you pass it a rest parameter (vararg)
console.log("result2 -> ", result2)

/**
 * input 的參數都先用 sequenceT 裝在 Option中, 然後再用 map 給值到 function
 * 使用 ... spread syntax to convert the tuple into parameter form.
 */
const result3 = pipe(
    sequenceT(O.Monad)(O.of(123), O.of('asdf')),
    O.map((args) => foo(...args)),
    O.map(bar),
)

/**
 * SequenceS
 * Sometime our function takes a single object parameter rather than multiple arguments
 * 
 Example : 
 
 pipe(
  input,
  ({ email, password }) =>
    sequenceS(E.either)({
      email: validateEmail(email),
      password: validatePassword(password),
    }),
  E.map(register),
)

 */

console.log("result3 -> ", result3)

// -- Sequence Example 2

function foo(a: number, b: string): boolean {
    data: {
        _a: a
        _b: b
    }
    return true
}
function bar(a: boolean): object {
    return {
        _a: a
    }
}

const httpGet = (url: string) => TE.tryCatch<Error, AxiosResponse>(
    () => axios.get(url),
    reason => new Error(String(reason))
)

const getUser = pipe(
    httpGet('https://reqres.in/api/users?page=1'),
    TE.map(x => x.data),
    TE.chain((str) => pipe(
        users.decode(str),
        E.mapLeft(err => new Error(String(err))),
        TE.fromEither)
    )
);

const getAnswer = pipe(
    TE.right(42),
    TE.chain(ans => pipe(
        answer.decode({ ans }),
        E.mapLeft(err => new Error(String(err))),
        TE.fromEither)
    )
)

pipe(
    sequenceT(TE.Monad)(getAnswer, getUser),
    TE.map(([answer, users]) => A.Monad.map(users.data, (user) => console.log(`Hello ${user.first_name}! The answer you're looking for is ${answer.ans}`))),
    TE.mapLeft(console.error)
)();

// output:
// [start:*run] Hello George! The answer you're looking for is 42
// [start:*run] Hello Janet! The answer you're looking for is 42
// [start:*run] Hello Emma! The answer you're looking for is 42
// [start:*run] Hello Eve! The answer you're looking for is 42
// [start:*run] Hello Charles! The answer you're looking for is 42
// [start:*run] Hello Tracey! The answer you're looking for is 42