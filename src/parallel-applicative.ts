import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either"
import * as T from 'fp-ts/Task'
import * as TE from "fp-ts/TaskEither"

interface AppConfig {
    readonly host: string; // web-server host name
    readonly port: number; // a port our webserver will be listening
    readonly connectionString: string; // a DB connection parameters
}

const validateHost = (host: string): E.Either<Error, string> => {
    console.log(Date.now(), "-validateHost-")
    return E.right(host)
    // return E.left(new Error("host not valid !!"))
}

const validatePort = (port: number): E.Either<Error, number> => {
    console.log(Date.now(), "-validatePort--")
    return E.right(port)
    // return E.left(new Error("port not valid !!"))
}

const validateConnectionString = (connectionString: string): E.Either<Error, string> => {
    console.log(Date.now(), "-validateConnectionString-")
    T.delay(1000)
    return E.right(connectionString)
}

const data: AppConfig = {
    host: "http://123",
    port: 5566,
    connectionString: "http://abcd"
}

// sequence validation !!
const result = pipe(
    E.Do,
    E.apS('host', validateHost(data.host)),
    E.apS('port', validatePort(data.port)),
    E.apS('connStr', validateConnectionString(data.connectionString))
)

console.log("result1", result)

/**
 *  Paralle Validation by applicative
 */

const toAppConfig = (host: string) => (port: number) => (connectionString: string) => appConfig(host, port, connectionString)

function appConfig(host: string, port: number, connectionString: string): AppConfig {
    return {
        host: host,
        port: port,
        connectionString: connectionString
    }
}

// parallel validation !!

function createAppConfig(host: string, port: number, connStr: string): E.Either<Error, AppConfig> {
    return pipe(
        E.of(toAppConfig),
        E.ap(validateHost(data.host)),
        E.ap(validatePort(data.port)),
        E.ap(validateConnectionString(data.connectionString))
    )
}

console.log(createAppConfig("http://123", 5566, "http://abcd"))


