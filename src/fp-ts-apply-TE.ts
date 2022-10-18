import { v4 as uuid } from 'uuid';
import { pipe } from "fp-ts/lib/function";
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { ap } from 'fp-ts/lib/Identity'

// 題目: 如何讓 add 的參數 (模擬為 Task), 而這些 Task 可以同步執行? 

const delay = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));

const getHello: T.Task<string> = () => new Promise((resolve) => {
    resolve('hello')
})


export const myTask = async (): Promise<number> => {
    const id: string = uuid()
    // Do something before delay
    console.log(id, '-- before delay')

    await delay(1000)

    // Do something after
    console.log(id, '-- after delay')
    return 10;
}


const addAtEnd = (b: string) => (a: string): string => a + b


//console.log(myTask())

const myTaskEither =
    TE.tryCatch(
        () => myTask(),
        E.toError
    )





const add = (a: number) => (b: number) => (c: number) => a + b + c;


// Ans : ---  方法一   

const result = pipe(
    myTaskEither,
    TE.map(add),
    TE.ap(myTaskEither),
    TE.ap(myTaskEither)
)


result().then(
    res => console.log("result1 => ", res)
)

// Ans : ---  方法二

const result2 = pipe(
    TE.Do,
    TE.apS('x', myTaskEither),
    TE.apS('y', myTaskEither),
    TE.apS('z', myTaskEither),
    TE.map(({ x, y, z }) => x + y + z)
)

result2().then(
    res => console.log("result2 => ", res)
)

const getHelloAndAddWorld = pipe(
    getHello,
    T.map(addAtEnd(' world !'))
)

getHelloAndAddWorld().then(
    res => console.log(res)
)

/**
 *  Apply - ap operator
 *  -- it is like the reverse of map. Rather than piping a value into a function, you pipe a function into a value
 *  -- Currying is taking a function with multiple parameters and converting it into a higher order function 
 *          such that it takes a single argument repeatedly
 *  -- In essence, ap just makes it easier to curry function values while keeping the correct order of operations
 */