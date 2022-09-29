import * as f from "fp-ts/function";
import * as O from "fp-ts/Option"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import * as A from "fp-ts/Array";
import { sequenceT } from "fp-ts/Apply";
import { pipe } from "fp-ts/function";
import * as t from 'io-ts'
import axios, { AxiosResponse } from 'axios';


// Q. 如何讓 Task 以 sequential 的方式執行 ?

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

const arr: O.Option<number>[] = [1, 2, 3].map(O.of)  // arr is a array of Option<number>
const result = A.sequence(O.Monad)(arr) // Option<number[]> // result is a Option of number array
const result2 = sequenceT(O.Monad)(O.of(123), O.of('asdf')) //sequenceT is the same as a regular sequence except you pass it a rest parameter (vararg)

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

const result3 = pipe(
    sequenceT(O.Monad)(O.of(123), O.of('asdf')),
    O.map((args) => foo(...args)),
    O.map(bar),
)

console.log(result3)

// -- Sequence Example 2

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