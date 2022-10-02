import * as f from "fp-ts/function";
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import * as A from "fp-ts/Array";
import { sequenceS, sequenceT } from "fp-ts/Apply";
import { pipe } from "fp-ts/function";
import * as t from 'io-ts'
import axios, { AxiosResponse } from 'axios';
import { myTask } from "./te_apply";


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
 * 另一個ap operator使用情境
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
 
 * 
 sequenceT(O.option)(O.of(123), O.of('asdf'))
  pipe(
   sequenceT(O.option)(O.of(123), O.of('asdf')),
   O.map((args) => foo(...args)),
   O.map(bar),
  )
 */

// -- Sequence Example 1

const arr: O.Option<number>[] = [1, 2, 3].map(O.of)  // arr is a array of Option<number>
console.log("arr -> ", arr)
const result = A.sequence(O.Monad)(arr) // Option<number[]> // result is a Option of number array
console.log("result -> ", result)


/**
 * sequenceT is the same as a regular sequence except you pass it a rest parameter (vararg).
 *  - T for tuple
 *  - 第一個參數 -> applicative
 *  - 第二個參數 -> a tuple (參數們)
 */
const result2 = sequenceT(O.Monad)(O.of(123), O.of('asdf'))
console.log("result2 -> ", result2)


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

/**
 * input 的參數都先用 sequenceT 裝在 applicative (本範例是 Monad) , 然後再用 map 給值到 function
 * 使用 ... spread syntax to convert the tuple into parameter form.
 */

const result3 = pipe(
    sequenceT(O.Monad)(O.of(123), O.of('asdf')),
    O.map((args) => foo(...args)),
    O.map(bar),
)



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

console.log("result3 -> ", result3)


/**
 * SequenceS - Sometime our function takes a single object parameter rather than multiple arguments
 *  - S for struct
 */

type RegisterInput = {
    email: string
    password: string
}

const input: RegisterInput = {
    email: "xxyy",
    password: "heyhey"
}

const validateEmail = (email: string): E.Either<Error, string> => {
    //myTask()
    console.log("validateEmail-")
    return E.right(email)
}

const validPassworkd = (passwd: string): E.Either<Error, string> => {
    //myTask()
    console.log("validPassworkd-")
    return E.right(passwd)
}

const register = (input: RegisterInput): string => {
    return "Success"
}


/**
 *  sequenceS 把參數都裝成 struct, 好處是可以用來做之後 domain type 的維護, 比如說 initial 一個domain type
 */

const result4 = pipe(
    input,
    ({ email, password }) =>
        sequenceS(E.Monad)({
            email: validateEmail(email),
            password: validPassworkd(password)
        }),
    E.map(register)
)

console.log("result4 ->", result4)





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