import * as T from "fp-ts/Task";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
const delay = (ms: number): Promise<unknown> => new Promise(resolve => setTimeout(resolve, ms));


const myTask: T.Task<string> = async (): Promise<string> => {
    await delay(1000)
    console.log(Date.now(), 'myTask');
    return 'Hello'
}

const getHello: T.Task<string> = () => new Promise((resolve) => {
    delay(1000).then(
        () => {
            console.log(Date.now(), 'getHello!');
            resolve('getHello!')
        }
    )
})

pipe(
    sequenceT(T.MonadTask)(myTask, getHello), //[F[A], F[B]] => F[A, B] 
    T.map(([answer, name]) => console.log(`Hello ${name}! The answer you're looking for is ${answer}`))
)();