// typescript function signature
// type keyword
// IO functor

import { head, tail } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { boolean } from "io-ts";

// Introduction ///////////////////////////////////////////////
const sum = (a: number, b: number): number => {
    return a + b;
}

// the 10 + 5 is executed before go into sum function
// in lazy evaluated language, the 10 + 5 is evaluated until it's needed
console.log("sum", sum(10 + 5, 20));

// lazy evaluation Sum
const lazySum = (a: () => number, b: () => number): () => number => {
    return () => a() + b();
}

// wrap all of that in the functions
console.log("lazySum -> ", lazySum(() => 10 + 5, () => 20));
console.log("lazySum invoke->", lazySum(() => 10 + 5, () => 20)());

// define a genetic function
type Lazy<T> = () => T

// refactor by using generic function to lazy evaluation sum
// 增加 Readability
const lazyGenericSum = (a: Lazy<number>, b: Lazy<number>): Lazy<number> => {
    return () => a() + b();
}

console.log("lazyGenericSum invoke->", lazyGenericSum(() => 10 + 5, () => 20)());


// Avoiding big computations that are not needed ///////////////////////////////////////////////

// Question: Why we need lazy evaluation ?
// A. if a huge performance we dont need, then lazy evaluation has huge benefits

function hang<T>(): T {
    return hang()
}

function first(a: number, b: number): number {
    return a;
}

function lazyFirst(a: Lazy<number>, b: Lazy<number>): Lazy<number> {
    return a;
}

//console.log(first(10, hang())) // RangeError: Maximum call stack size exceeded, hang() not needed but evaluated

console.log("lazyFisrt\t", lazyFirst(() => 10, () => hang()))
console.log("lazyFisrt invoked\t", lazyFirst(() => 10, () => hang())()) // since we never use second parameter, it never actually hang

// short-circuit evaluation ///////////////////////////////////////////////


// 解釋 : false && ??? , when first parameter is false, it doesn't matter what else
// short-circuti evaluation is very close to lazy evaluation

// and function has short-circuit behaviour
function and(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
    return () => !a() ? false : b() // explain: if a is false, it always false, if a is true, then return b()
}

console.log("\n=============")
console.log(and(() => false, () => true)())
console.log(and(() => false, () => false)())
console.log(and(() => true, () => true)())
console.log(and(() => true, () => false)())

// Q. how do we verify the seoncd parameter never evaluated?

function trace<T>(x: Lazy<T>, message: string): Lazy<T> {
    return () => {
        console.log(message)
        return x()
    }
}

console.log("\n=====AND=======")
console.log(and(trace(() => false, "L"), trace(() => true, "R"))())
console.log(and(trace(() => false, "L"), trace(() => false, "R"))())
console.log(and(trace(() => true, "L"), trace(() => true, "R"))())
console.log(and(trace(() => true, "L"), trace(() => false, "R"))())

// or function has short-circuit behaviour
function or(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
    return () => a() ? true : b()
}

console.log("\n=====OR=======")
console.log(or(trace(() => false, "L"), trace(() => true, "R"))())
console.log(or(trace(() => false, "L"), trace(() => false, "R"))())
console.log(or(trace(() => true, "L"), trace(() => true, "R"))())
console.log(or(trace(() => true, "L"), trace(() => false, "R"))())

// Infinite Data Structures ///////////////////////////////////////////////

// Q. how can you hold infinite data structure in memory ?

// define a lazy list
type LazyList<T> = Lazy<{
    head: Lazy<T>,
    tail: LazyList<T>
} | null>

function toList<T>(xs: T[]): LazyList<T> {
    return () => {
        if (xs.length === 0) {
            return null;
        } else {
            return {
                head: () => xs[0],
                tail: toList(xs.slice(1))
            }
        }
    }
}

console.log("\n=====To List=======")
console.log(toList([1, 2, 3]))
console.log(toList([1, 2, 3])())
console.log(toList([1, 2, 3])()?.head())
console.log(toList([1, 2, 3])()?.tail())
console.log(toList([1, 2, 3])()?.tail()?.head())
console.log(toList([1, 2, 3])()?.tail()?.tail()?.head())
console.log(toList([1, 2, 3])()?.tail()?.tail()?.tail())
console.log(toList([1, 2, 3])()?.tail()?.tail()?.tail()?.head())


// infinite list, it evaluated until it really needed
function range(begin: Lazy<number>): LazyList<number> {
    return () => {
        let x = begin()
        return {
            head: () => x,
            tail: range(() => x + 1)
        }
    }
}

console.log("\n=====Range=======")
console.log(range(() => 3)()?.head())
console.log(range(() => 3)()?.tail()?.head())

console.log("\n===== Print Function =======")
function printList<T>(xs: LazyList<T>) {
    let pair = xs()
    while (pair !== null) {
        console.log(pair.head())
        pair = pair.tail()
    }
}

printList(toList([1, 2, 3, 4, 5]))
//printList(range(() => 3)) // printing infinite data structure =>  Maximum call stack size exceeded

// Solution: take finite subsets of elements from infinite data structure

function take<T>(n: Lazy<number>, xs: LazyList<T>): LazyList<T> {
    return () => {
        let m = n()
        let pair = xs()
        if (m > 0 && pair) {
            return {
                head: pair.head,
                tail: take(() => m - 1, pair.tail)
            }
        } else {
            return null;
        }
    }
}

console.log("\n===== Take Function =======")
printList(take(() => 10, range(() => 3)))


function filter<T>(f: (x: T) => boolean, xs: LazyList<T>): LazyList<T> {
    return () => {
        let pair = xs()
        if (pair === null) {
            return null
        } else {
            let head = pair.head()
            if (f(head)) {
                return {
                    head: () => head,
                    tail: filter(f, pair.tail)
                }
            } else {
                return filter(f, pair.tail)()
            }
        }
    }
}


console.log("\n===== Filter Function =======")

// 先 take 再 filter
printList(filter(
    (x) => x % 2 === 0,
    take<number>(() => 20,
        range(() => 3)))
)

// 先 filter 再 take
printList(
    take(() => 20, filter((x) => x % 2 === 0, range(() => 1)))
)



function sieve(xs: LazyList<number>): LazyList<number> {
    return () => {
        let pair = xs()
        if (pair === null) {
            return null
        } else {
            let head = pair.head()
            return {
                head: () => head,
                tail: sieve(filter((x) => x % head !== 0, pair.tail))
            }
        }
    }
}

console.log("\n===== Sieve Function and Prime Number =======")
let prime = sieve(range(() => 2))
printList(take(() => 20, prime))