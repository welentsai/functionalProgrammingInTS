import URL = require('url-parse')
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

const parse = URL

function isDotCom(url: string): boolean {
  try {
    const parsed = parse(url, true)
    console.log(parsed)
    const host = parsed.host
    const parts = host.split('.')
    const n = parts.length
    if (n > 1) {
      const tld = parts[n - 1]
      if (tld === 'com') {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
    return true
  } catch {
    return false
  }
}

function tryParsingUrl(
  url: string
): O.Option<URL<Record<string, string | undefined>>> {
  return O.tryCatch(() => parse(url, true))
}

function getTld(host: string): O.Option<string> {
  return pipe(host, (host) => host.split('.'), A.last)
}

function isDotComOpt(url: string): boolean {
  return pipe(
    url,
    tryParsingUrl,
    O.map((url) => url.host),
    //O.chain(host => A.last(host.split("."))),
    O.chain(getTld),
    O.exists((tld) => tld === 'com')
    // O.map(tld => tld === "com"),
    // O.getOrElse(() => false)
  )
}

const testUrl = 'http://www.website.com/posts?hello=world'
// const testUrl = "http://www.website.gg/posts?hello=world"
// const testUrl = "http://wwwwebsitegg/posts?hello=world"
// const testUrl = "wwwwebsitegg/posts?hello=world"

console.log(isDotCom(testUrl))
console.log(isDotComOpt(testUrl))
