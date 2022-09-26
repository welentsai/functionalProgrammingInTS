const index: string = "this's index";
console.log(index);

const Identity = <T>(val: T) => ({
    val,
    map: (f) => Identity(f(val)),
    inspect: () => `Identity(${val})`
})


Identity.of = <T>(x: T) => Identity<T>(x)

Identity.of(1)

const add2 = (x: number) => x + 2;

console.log(Identity.of(1).map((x: number) => x + 1))
console.log(Identity.of(1))
