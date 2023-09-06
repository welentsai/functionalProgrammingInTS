import { expect, test } from 'vitest'

// test('adds 1 + 2 to equal 3', () => {
//     expect(1 + 2).toBe(3)
// })

test('regualr expreesion test', () => {
    // const reg = /^@.*\/$/
    // const reg = /@[A-Z\u4E00-\u9FFF]*\/\w+/gi
    const reg = /@[A-Z\u4E00-\u9FFF ]*\/\w+/gi

    // const reg = /@.*\/\w+/gi

    const msg = '@YB @蔡維倫/wltsai @abc kab koruak/korua plese help to comment @詩婷/stli'

    const result = msg.match(reg)

    console.log(result)

    console.log('result', JSON.stringify(result))
})