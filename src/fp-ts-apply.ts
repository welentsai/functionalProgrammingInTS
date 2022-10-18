import { ap } from 'fp-ts/lib/Identity'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

function write(key: string, value: string, flush: boolean): void {
    console.log(`key = ${key} value=${value} flush=${flush}`)
}

const writeC = (key: string) => (value: string) => (flush: boolean) => write(key, value, flush)


// apply 
pipe(writeC, ap('key'), ap('value'), ap(true))


// Example 2

function foo(a: number, b: string): boolean {
    return true
}

const fooC = (a: number) => (b: string) => foo(a, b)


const result = pipe(O.of(fooC), O.ap(O.of(1)), O.ap(O.of('b')))
console.log('result ->', result)