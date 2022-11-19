

// Named function
function add(x: number, y: number) {
    return x + y;
}

console.log(add(12, 12))

// Anonymous function
const myAdd = function (x: number, y: number) {
    return x + y;
};

console.log("myAdd", myAdd(1, 2))

// add types to anonymous function 
let myAdd2 = function (x: number, y: number): number {
    return x + y;
};

let myAdd22 = (x: number, y: number): number => {
    return x + y;
};

console.log("add22", myAdd22(1, 3))


// write the full type of the function
let myAdd3: (x: number, y: number) => number = function (
    x: number,
    y: number
): number {
    return x + y;
};

/***
 * Inferring the types
 */

// 等號(=)後面接的就是 anonymous function 
let myAdd4 = function (x: number, y: number): number {
    return x + y;
};

// myAdd has the full function type
// 等號(=)後面接的就是 anonymous function 
// 冒號(:)後面是 type
let myAdd5: (baseValue: number, increment: number) => number = function (x, y) {
    return x + y;
};

let myAdd6 = (x: number, y: number) => {
    return x + y;
};

