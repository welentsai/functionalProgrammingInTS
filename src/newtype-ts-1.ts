import { Newtype, iso, prism } from 'newtype-ts'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'


interface EUR extends Newtype<{ readonly EUR: unique symbol }, number> { }

// isoEUR: Iso<EUR, number>
const isoEUR = iso<EUR>()

// myamount: EUR
const myamount = isoEUR.wrap(0.85)

// n: number = 0.85
const n = isoEUR.unwrap(myamount)


function saveAmount(eur: EUR): void {
    // do nothing
}

// saveAmount(0.85) // static error: Argument of type '0.85' is not assignable to parameter of type 'EUR'
saveAmount(myamount)

console.log(myamount)



interface Integer extends Newtype<{ readonly Integer: unique symbol }, number> { }

const isInteger = (n: number) => Number.isInteger(n)

// prismInteger: Prism<number, Integer>
const prismInteger = prism<Integer>(isInteger)

// oi: Option<Integer>
const oi = prismInteger.getOption(2)

function f(i: Integer): void {
    console.log(i)
}

// f(2) // static error: Argument of type '2' is not assignable to parameter of type 'Integer'

pipe(
    oi,
    O.map(f)
)