function identity<T>(arg: T): T {
  return arg
}

// 兩種方法使用 generic function

// 方法1, pass all of the arguments, including the type argument
console.log(identity<number>(123))
console.log(identity<string>('abc'))

// 方法2, using type argument inference,
// that is we want compiler to set the value of Type for us automatically
const output = identity('myString') // let output: string, compiler 自動給定type

/**
 *  generic arrow function
 */

// 方法1
const foo = <T>(x: T) => x
console.log(foo<number>(123))

// 方法2
const foo2 = <T>(x: T) => x // ERROR : unclosed `T` tag
console.log(foo2<number>(123))

// 方法3: Use extends on the generic parameter to hint the compiler that it's a generic
const foo3 = <T extends unknown>(x: T) => x
console.log(foo3<number>(123))

// examples
const getArray = <T>(items: T[]): T[] => {
  return new Array<T>().concat(items)
}

const myNumArr = getArray<number>([100, 200, 300]) // number[], [ 100, 200, 300 ]
const myStrArr = getArray<string>(['Hello', 'World']) // string[], [ 'Hello', 'World' ]

/**
 * Generic Constraints, 泛型限制
 */

interface Lengthwise {
  length: number
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length) // Now we know it has a .length property, so no more error
  return arg
}

// loggingIdentity(3); //Argument of type 'number' is not assignable to parameter of type 'Lengthwise'

loggingIdentity({ length: 10, value: 3 })

/**
 * Using Type Parameters in Generic Constraints
 */

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key]
}

const x = { a: 1, b: 2, c: 3, d: 4 }

type key = keyof typeof x

console.log(getProperty(x, 'a'))
//getProperty(x, "m"); // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'
