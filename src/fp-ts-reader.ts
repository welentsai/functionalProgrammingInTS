import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts/Reader'
import * as RR from 'fp-ts/ReadonlyRecord'

/**
 * The purpose of the Reader monad is to avoid threading arguments through 
 *  multiple functions in order to only get them where they are needed
 *  Reader<R, A> represents a function (r: R) => A
 * 
    interface Reader<R, A> {
        (r: R): A
    }

 */

const f = (b: boolean): string => (b ? 'true' : 'false')

const g = (n: number): string => f(n > 2)

const h = (s: string): string => g(s.length + 1)

console.log(h('foo')) // 'true'

// 範例二, 多一個 dependency 參數 deps, 那 dependency 則必須由上層一路往下帶
interface Dependencies {
  i18n: {
    true: string
    false: string
  }
  lowerBound: number
}

const f2 = (b: boolean, deps: Dependencies): string =>
  b ? deps.i18n.true : deps.i18n.false
const g2 = (n: number, deps: Dependencies): string => f2(n > 2, deps)
const h2 = (s: string, deps: Dependencies): string => g2(s.length + 1, deps)

const instance: Dependencies = {
  i18n: {
    true: 'vero',
    false: 'falso'
  },
  lowerBound: 2
}

console.log(h2('foo', instance)) // 'vero'

// 範例三, 多一個 dependency 參數 deps, 新解法 (把 dependency 放到 return 值區)

const f3 =
  (b: boolean): ((deps: Dependencies) => string) =>
  (deps) =>
    b ? deps.i18n.true : deps.i18n.false

const g3 = (n: number): ((deps: Dependencies) => string) => f3(n > 2)

const h3 = (s: string): ((deps: Dependencies) => string) => g3(s.length + 1)

// 注意:  (deps: Dependencies) => string  就是 Reader<Dependencies, string>
// 用 fp-ts Reader 改寫
const f4 =
  (b: boolean): R.Reader<Dependencies, string> =>
  (deps) =>
    b ? deps.i18n.true : deps.i18n.false

const g4 = (n: number): R.Reader<Dependencies, string> => f4(n > 2)

const h4 = (s: string): R.Reader<Dependencies, string> => g4(s.length + 1)

console.log('Reader solustion =>', h4('foo')(instance)) // 'vero'

// 情境: 如果 input 多了一個 lowerBound 參數呢?
const instance2 = { ...instance, lowerBound: 4 }

//  we can read lowerBound from the environment using ask
const g5 = (n: number): R.Reader<Dependencies, string> =>
  pipe(
    R.ask<Dependencies>(),
    R.chain((deps) => f4(n > deps.lowerBound))
  )

const h5 = (s: string): R.Reader<Dependencies, string> => g5(s.length + 1)

console.log('g5=>', h5('foo')(instance)) // 'vero'
console.log('g5=>', h5('foo')({ ...instance, lowerBound: 4 })) // 'falso'

/**
 * The Reader monad is a wonderful solution to inject dependencies into your functions.
 * The Reader monad provides a way to "weave" your configuration throughout your programme.
 */

interface Printer {
  write: (message: string) => string
}

class MyPrinter implements Printer {
  write: (message: string) => string = (msg) => {
    console.log(msg)
    return msg
  }
}

// 有問題的地方
//  Calling this function from other functions that don't need the dependency printer is kind of awkward.
const createPrettyNameOriginal = (name: string, printer: Printer) =>
  printer.write(`hello ${name}`)

// 快速解法 - Curry Function
const createPrettyNameCurry = (name: string) => (printer: Printer) =>
  printer.write(`hello ${name}`)
const render = createPrettyNameCurry('Tom') // render(printer)

// Better...But...
//  what if render wants to perform some sort of operation on the result of createPrettyName?
const createPrettyName =
  (name: string): R.Reader<Printer, string> =>
  (printer: Printer) =>
    printer.write(`hello ${name}`)

const render2 = createPrettyName('Tom')

// So now, when a name is supplied to createPrettyName the Reader monad is returned
const reader = R.Monad.map(createPrettyName('Tom'), (s: string) => `---${s}---`)

const result = reader(new MyPrinter())
console.log('result', result)
