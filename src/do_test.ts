import * as T from 'fp-ts/Task'
import { Do } from 'fp-ts-contrib/lib/Do'


type A = 'A'
type B = 'B'
type C = 'C'

const fa = (): T.Task<A> => {
    return T.of('A')
}

const fb = (a: string): T.Task<B> => {
    return T.of(`B`)
}

const fc = (ab: { a: string; b: string }): T.Task<C> => {
    return T.of(`C`)
}

const result = Do(T.Monad)
    .bind('a', fa()) // task
    .bindL('b', ({ a } /* context */) => fb(a)) // lazy task
    .bindL('c', fc) // lazy task
    .return(({ c }) => c) // Task<"C">


result().then(
    res => console.log(res)
)



