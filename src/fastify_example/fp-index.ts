import fastify from 'fastify'
import { pipe, flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import 'dotenv/config'




function getPortNum(): O.Option<number> {
    return pipe(
        process.env.PORT,
        O.fromNullable,
        O.map(num => parseInt(num, 10)),
        // Validate the port number
        O.alt(() => O.of(8081))
    )
}



const server = fastify()

// http://127.0.0.1:8080/ping
server.get('/ping', async (request, reply) => {
    return 'pong\n'
})


const startServer = (portNum: O.Option<number>) => pipe(
    portNum,
    O.match(
        () => console.log('Lack of port number, server failed to start !!  '),
        (portNum) => server.listen({ port: portNum }, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })
    )
)

// 方法一
// flow(
//     getPortNum,
//     startServer
// )()


// 方法二

interface FConfig {
    port: number
}


const portNum: O.Option<number> = O.tryCatch(
    () => pipe(
        process.env.PORT,
        O.fromNullable,
        O.map(num => parseInt(num, 10)),
        O.getOrElse(() => 8080)
    )
);


function getFastifyConfigs(): O.Option<FConfig> {
    return pipe(
        O.Do,
        O.apS('num', portNum),
        O.map(({ num }) => ({ port: num }))
    )
}

flow(
    getFastifyConfigs,
    O.match(
        () => console.log('Lack of port number, server failed to start !!  '),
        (config) => server.listen({ port: config.port }, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })
    )
)()

// 方法三

function getConfigsBind(): O.Option<FConfig> {
    return pipe(
        O.Do,
        O.bind('x', getPortNum),
        O.map(({ x }) => ({ port: x }))
    )
}