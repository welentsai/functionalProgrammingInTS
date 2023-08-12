import * as TSP from 'ts-pattern'

type Data = { type: 'text'; content: string } | { type: 'img'; src: string }

type Result = { type: 'ok'; data: Data } | { type: 'error'; error: Error }

const result: Result = {
  type: 'ok',
  data: { type: 'text', content: 'hello my friend' }
}

const answer = TSP.match<Result>(result)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with(
    { type: 'ok', data: { type: 'text' } },
    (res) => `<p>${res.data.content}</p>`
  )
  .with(
    { type: 'ok', data: { type: 'img', src: TSP.P.select() } },
    (src) => `<img src=${src} />`
  )
  .exhaustive()

console.log(answer) //[1] <p>hello my friend</p>

const result2: Result = {
  type: 'ok',
  data: { type: 'img', src: 'hello my friend' }
}

const answer2 = TSP.match<Result>(result2)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with(
    { type: 'ok', data: { type: 'text' } },
    (res) => `<p>${res.data.content}</p>`
  )
  .with(
    { type: 'ok', data: { src: TSP.P.select() } },
    (res) => res.data.type.includes('img'),
    (src) => `<img src=${src} />`
  )
  .otherwise(() => `oops`)

console.log(answer2) //[1] <img src=hello my friend />

const result3: Result = {
  type: 'ok',
  data: { type: 'img', src: 'hello P.when' }
}

const answer3 = TSP.match<Result>(result3)
  .with({ type: 'error' }, () => `<p>Oups! An error occured</p>`)
  .with(
    {
      type: 'ok',
      data: {
        type: TSP.P.when((type) => type.includes('im')),
        src: TSP.P.select()
      }
    },
    (src) => `<img src=${src} />`
  )
  .with(
    { type: 'ok', data: { type: 'text' } },
    (res) => `<p>${res.data.content}</p>`
  )
  .otherwise(() => `oops`)

console.log(answer3) // [1] <img src=hello P.when />

// type Input = { score: number };

const output = TSP.match({ score: 10 })
  .with(
    {
      score: TSP.P.when((score): score is 5 => score === 5)
    },
    (input) => '😐' // input is inferred as { score: 5 }
  )
  .with({ score: TSP.P.when((score) => score < 5) }, () => '😞')
  .with({ score: TSP.P.when((score) => score > 5) }, () => '🙂')
  .run()

console.log(output) // => '🙂'

const isBlogPost = TSP.isMatching({
  title: TSP.P.string,
  description: TSP.P.string
})

const value = { title: 'abc', description: 'aaa' }

// 方法1: with single argument
if (isBlogPost(value)) {
  console.log('isBlogPost !') // [1] isBlogPost !
}

const blogPostPattern = {
  title: TSP.P.string,
  description: TSP.P.string
}

// 方法2: with two arguments
if (TSP.isMatching(blogPostPattern, value)) {
  console.log(`blogPostPattern !`) // [1] blogPostPattern !
}
