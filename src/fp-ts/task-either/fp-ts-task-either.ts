import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import { sequenceS } from 'fp-ts/Apply'

interface AppConfig {
  readonly host: string // web-server host name
  readonly port: number // a port our webserver will be listening
  readonly connectionString: string // a DB connection parameters
}

const data: AppConfig = {
  host: 'http://123.tsmc.com',
  port: 5566,
  connectionString: 'http://abcd'
}

const validateHost = (host: string): TE.TaskEither<Error, string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateHost-'),
    T.delay(2000),
    TE.fromTask,
    TE.mapLeft(() => new Error('host not valid !!'))
  )

const validatePort = (port: number): TE.TaskEither<Error, string> =>
  pipe(
    T.of(new Date().toISOString() + '-validatePort-'),
    T.delay(3000),
    TE.fromTask,
    TE.mapLeft(() => new Error('port not valid !!'))
  )

const validateConnectionString = (
  connectionString: string
): TE.TaskEither<Error, string> =>
  pipe(
    T.of(new Date().toISOString() + '-validateConnectionString-'),
    T.delay(1000),
    TE.fromTask,
    TE.mapLeft(() => new Error('connection string not valid !!'))
  )

// parallel validation
// started at the same time and waiting for the longest task to finish
const result = pipe(
  TE.Do,
  TE.apS('host', validateHost(data.host)),
  TE.apS('port', validatePort(data.port)),
  TE.apS('connStr', validateConnectionString(data.connectionString)),
  TE.map((x) => {
    console.log(new Date(), `---result---`)
    return x
  })
)

result().then((x) => console.log(x))

const appConfigOf =
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

const validatePort2 = (port: number): TE.TaskEither<Error, number> =>
  pipe(
    T.of(new Date().toISOString() + '-validatePort-'),
    T.delay(3000),
    TE.fromTask,
    TE.mapLeft(() => new Error('port not valid !!')),
    TE.map((_) => port)
  )

// parallel task
const apConfig = pipe(
  TE.of(appConfigOf),
  TE.ap(validateHost(data.host)),
  TE.ap(validatePort2(data.port)),
  TE.ap(validateConnectionString(data.connectionString))
)

apConfig().then((config) => console.log(new Date(), `---apConfig---`, config))

// sequence validation !!
const result4 = pipe(data, ({ host, port, connectionString }) =>
  sequenceS(TE.ApplicativeSeq)({
    host: validateHost(host),
    port: validatePort(port),
    connectionString: validateConnectionString(connectionString)
  })
)

result4().then((x) => console.log(new Date().toISOString(), '---result4---', x))
