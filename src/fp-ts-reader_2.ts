import * as R from 'fp-ts/Reader';
import * as f from 'fp-ts/function';


/** function signature 

export interface Reader<R, A> {
  (r: R): A
}

   The Reader is just a function receiving a type R as a parameter and returning a value of type A. 
   Therefore, the Reader “reads” the value R, processes it and returns a result.

   The important thing here is that the Reader conceptually does not alter the input value

   That’s why the Reader monad is perfectly suited for piping a config though a flow of functions 
   that are reading the config value.
 */

type ReaderConfig = {
    denominator: number;
};

// fraction is a high order function
const fraction: (numerator: number) => R.Reader<ReaderConfig, number> =
    (numerator: number) => (config: ReaderConfig) => numerator / config.denominator;


// fraction2 is a high order function
const fraction2 = (numerator: number): R.Reader<ReaderConfig, number> =>
    (config: ReaderConfig) => numerator / config.denominator;

const myConfig: ReaderConfig = {
    denominator: 5
}

// fraction is equal to fraction2 
console.log(typeof fraction)
console.log(fraction(15)(myConfig))
console.log(typeof fraction2)
console.log(fraction2(15)(myConfig))


// compose the fraction function three times, 
// The cool thing here is that the config value itself is not explicitly visible in the composition
// 在 compose fraction function 的過程中, 很酷的是我們不需要提供 ReaderConfig 的 config value
// 換句話說, 即使有 ReaderConfig 的 dependency, 但一開始不需要提供, 然後層層往下傳
const fractionThreeTimes = (numerator: number) =>
    f.pipe(
        numerator,
        fraction,
        R.chain(fraction),
        R.chain(fraction)
    );

const startValue = 10;
const config: ReaderConfig = {
    denominator: 2
};

console.log(fractionThreeTimes(startValue)(config)); // Returns 1.25, dependency 在最後時提供


