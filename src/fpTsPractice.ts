import { v4 as uuid } from 'uuid';
import { pipe } from "fp-ts/lib/function";
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { ap } from 'fp-ts/lib/Identity'

const delay = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));

const getHello: T.Task<string> = () => new Promise((resolve) => {
    resolve('hello')
})


const myTask = async (): Promise<number> => {
    const id: string = uuid()
    // Do something before delay
    console.log(id, '-- before delay')

    await delay(1000)

    // Do something after
    console.log(id, '-- after delay')
    return 10;
}

const add = (a: number) => (b: number) => (c: number) => a + b + c;
const addAtEnd = (b: string) => (a: string): string => a + b


//console.log(myTask())

const myTaskEither =
    TE.tryCatch(
        () => myTask(),
        E.toError
    )

// const result = pipe(
//     myTaskEither,
//     // TE.chain(res => myTaskEither), // will synchronous run
//     TE.map(add(10)),
//     TE.fold(
//         () => T.of("Oops !! error"),
//         (a) => T.of(`add result is ${a} !`)
//     )
// )

// const result = pipe(
//     TE.Do,
//     TE.apS('x', myTaskEither),
//     TE.apS('y', myTaskEither),
//     TE.map(add)
// )

const result = pipe(
    myTaskEither,
    TE.map(add),
    TE.ap(myTaskEither),
    TE.ap(myTaskEither)
)


result().then(
    res => console.log(res)
)

const getHelloAndAddWorld = pipe(
    getHello,
    T.map(addAtEnd(' world !'))
)

getHelloAndAddWorld().then(
    res => console.log(res)
)