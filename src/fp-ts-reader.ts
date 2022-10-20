import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RR from 'fp-ts/ReadonlyRecord'

/**
 * The Reader monad is a wonderful solution to inject dependencies into your functions.
 * The Reader monad provides a way to "weave" your configuration throughout your programme.
 */


interface Printer {
    write: (message: string) => string
}

class MyPrinter implements Printer {
    write: (message: string) => string =
        (msg) => {
            console.log(msg)
            return msg
        }
}

// 有問題的地方
//  Calling this function from other functions that don't need the dependency printer is kind of awkward.
const createPrettyNameOriginal = (name: string, printer: Printer) => printer.write(`hello ${name}`)

// 快速解法 - Curry Function
const createPrettyNameCurry = (name: string) => (printer: Printer) => printer.write(`hello ${name}`)
const render = createPrettyNameCurry('Tom') // render(printer)

// Better...But...
//  what if render wants to perform some sort of operation on the result of createPrettyName?
const createPrettyName = (name: string): R.Reader<Printer, string> =>
    (printer: Printer) => printer.write(`hello ${name}`)

// So now, when a name is supplied to createPrettyName the Reader monad is returned
const reader = R.Monad.map(createPrettyName('Tom'), (s: string) => `---${s}---`)

const result = reader(new MyPrinter())
console.log(result)