// name a object by either an interface or a type alias

// 方法一：named object type by using interface
// interface Person {
//   name: string
//   age: number
// }

// 方法二：using type alias to name object type
type Person = {
  name: string
  age: number
}

function greet(person: Person) {
  return 'Hello ' + person.name
}

// greet 2 的 input 是一個 anonymous object type
function greet2(person: { name: string; age: number }) {
  return 'Hello ' + person.name
}

console.log(greet({ name: 'John', age: 12 }))

interface Colorful {
  color: string
}
interface Circle {
  radius: number
}

// extending types
interface ColorfulCircle extends Colorful, Circle {}

// Intersection Type
type ColorfulCircle2 = Colorful & Circle

// Interface with method Declaration
interface SearchFunc2 {
  doSomething(source: string, subString: string): boolean
}

const myS: SearchFunc2 = {
  doSomething(src, subSrc) {
    const result = src.search(subSrc)
    return result > -1
  }
}

console.log('myS', myS.doSomething('qqqq', 'q'))
console.log('myS', myS.doSomething('qqqq', 'a'))

// Interface with function as property declaration

interface InterfaceB {
  doSomething: (source: string, subString: string) => boolean // function as property
}

const myIB: InterfaceB = {
  doSomething(src, subSrc) {
    const result = src.search(subSrc)
    return result > -1
  }
}

console.log('myIS', myS.doSomething('qqqq', 'q'))
console.log('myIS', myS.doSomething('qqqq', 'a'))

/**
Interfaces are capable of describing an object with properties
Interfaces are capable of describing function types
*/

// To describe a function type with an interface, we give the interface a call signature
// This is like a function declaration with only the parameter list and return type given

// Function type interface
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc

mySearch = function (source: string, subString: string): boolean {
  const result = source.search(subString)
  return result > -1
}

console.log(mySearch('abcd', 'ab'))
console.log(mySearch('abcd', 'ee'))
