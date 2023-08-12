
const p1 = Promise.resolve('Hello');
const p2 = Promise.resolve(3.14);

(async () => {
    const x = await p1
    const y = await p2
    console.log(x, y)
})()

