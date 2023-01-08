import * as assert from 'assert'
import { pipe, flow } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { sequenceS, sequenceT } from 'fp-ts/Apply'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/Semigroup'
import * as string from 'fp-ts/string'
import * as A from 'fp-ts/Apply'

interface AppConfig {
  readonly host: string // web-server host name
  readonly port: number // a port our webserver will be listening
  readonly connectionString: string // a DB connection parameters
}

const validateHost = (host: string): E.Either<Error, string> => {
  console.log(Date.now(), '-validateHost-')
  return E.right(host)
  // return E.left(new Error("host not valid !!"))
}

const validatePort = (port: number): E.Either<Error, number> => {
  console.log(Date.now(), '-validatePort--')
  // return E.right(port)
  return E.left(new Error('port not valid !!'))
}

const validateConnectionString = (
  connectionString: string
): E.Either<Error, string> => {
  console.log(Date.now(), '-validateConnectionString-')
  T.delay(1000)
  return E.right(connectionString)
}

const validateHost2 = (host: string): E.Either<string[], string> => {
  console.log(Date.now(), '-validateHost-')
  // return E.right(host)
  return E.left(['host not valid !!'])
}

const validatePort2 = (port: number): E.Either<string[], number> => {
  console.log(Date.now(), '-validatePort--')
  // return E.right(port)
  return E.left(['port not valid !!'])
}

const validateConnectionString2 = (
  connectionString: string
): E.Either<string[], string> => {
  console.log(Date.now(), '-validateConnectionString-')
  T.delay(1000)
  return E.right(connectionString)
}

const data: AppConfig = {
  host: 'http://123.tsmc.com',
  port: 5566,
  connectionString: 'http://abcd'
}

// sequence validation !!
const result = pipe(
  E.Do,
  E.apS('host', validateHost(data.host)),
  E.apS('port', validatePort(data.port)),
  E.apS('connStr', validateConnectionString(data.connectionString))
)

console.log('result1', result)

/**
 *  Paralle Validation by applicative
 */

const toAppConfig =
  (host: string) => (port: number) => (connectionString: string) =>
    appConfig(host, port, connectionString)

function appConfig(
  host: string,
  port: number,
  connectionString: string
): AppConfig {
  return {
    host: host,
    port: port,
    connectionString: connectionString
  }
}

// parallel validation !!
const apConfig = pipe(
  E.of(toAppConfig),
  E.ap(validateHost(data.host)),
  E.ap(validatePort(data.port)),
  E.ap(validateConnectionString(data.connectionString))
)

console.log(apConfig)

// sequence validation !!
const result4 = pipe(data, ({ host, port, connectionString }) =>
  sequenceS(E.Applicative)({
    host: validateHost(host),
    port: validatePort(port),
    connectionString: validateConnectionString(connectionString)
  })
)

console.log(result4)

const validateAppConfig = (input: AppConfig): E.Either<Error, AppConfig> =>
  pipe(
    E.Do,
    E.apS('host', validateHost(input.host)),
    E.apS('port', validatePort(input.port)),
    E.apS('connectionString', validateConnectionString(input.connectionString))
  )

assert.deepStrictEqual(
  validateAppConfig(data),
  E.left(new Error('port not valid !!'))
) // <= first error

// 取得所有的 Errors , 用 Semigroup 連起來
// if you want to get all errors you need to provide a way to concatenate them via a Semigroup
// const Applicative = E.getApplicativeValidation(pipe(string.Semigroup, S.intercalate(', ')))
const Applicative = E.getApplicativeValidation(RA.getSemigroup<string>())
const apS = A.apS(Applicative)

// get all errors
const validateAppConfig2 = (
  input: AppConfig
): E.Either<readonly string[], AppConfig> =>
  pipe(
    E.Do,
    apS('host', validateHost2(input.host)),
    apS('port', validatePort2(input.port)),
    apS('connectionString', validateConnectionString2(input.connectionString))
  )

console.log('validateAppConfig2', validateAppConfig2(data))

pipe(
  data,
  validateAppConfig2,
  E.match(
    (e) => console.log(e),
    (a) => console.log(a)
  )
)
