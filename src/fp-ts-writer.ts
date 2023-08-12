/** function signature 

export interface Writer<W, A> {
    (): [A, W]
}

In contrast to the Reader, the Writer monad receives no input at all, 
but “writes” an additional value of type W into a tuple type besides the actual value of type A.

Normally, the type W is a Monoid, that means a type which can concatenate its values. 

A typical monoid is the array, which even has a function called “concat” in the Javascript specification. 

A classical example of Writer monad is logging :
    besides calculating the value of type A, the monad also returns a log entry of type W
    so that this won’t be calculated as a side-effect but rather will be processed at the end of the workflow. 
 */

import * as W from 'fp-ts/Writer'
import * as A from 'fp-ts/Array'
import * as f from 'fp-ts/function'

// creating a Writer monad with an Array Monoid,
// so that all the logs of our workflow are concatenated into a string array
// The helper method “getChain” returns an actual Monad object with has a “chain” method
const ArrayWriter = W.getChain<Array<string>>(A.getMonoid())

// The denominator of 2 is hardcoded because we cannot read it from anywhere
const fractionWithStaticDenominator: (
  numerator: number
) => W.Writer<Array<string>, number> = (numerator: number) => () =>
  [numerator / 2, [`Numerator: ${numerator}. Denominator: 2`]]

// compose the fraction function three times
// “ArrayWriter.chain” method in fp-ts is not curried and accepts two parameters at the same time
const fractionThreeTimes = (numerator: number) =>
  f.pipe(
    numerator,
    fractionWithStaticDenominator,
    (writer) => ArrayWriter.chain(writer, fractionWithStaticDenominator),
    (writer) => ArrayWriter.chain(writer, fractionWithStaticDenominator)
  )

const startValue = 10
console.log(fractionThreeTimes(startValue)())

// The nice thing with the Writer pattern is that
// we do not need to explicitly handle the concatenation of the log values
// and can concentrate on modifying the actual value of type A instead

// [1]   1.25,
// [1]   [
// [1]     'Numerator: 10. Denominator: 2',
// [1]     'Numerator: 5. Denominator: 2',
// [1]     'Numerator: 2.5. Denominator: 2'
// [1]   ]
// [1] ]
