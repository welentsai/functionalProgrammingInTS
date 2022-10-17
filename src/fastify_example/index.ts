import fastify from 'fastify'
import 'dotenv/config'

const portNum = parseInt(process.env.PORT as string, 10) || 8081;

console.log(portNum)

const server = fastify()

// http://127.0.0.1:8080/ping
server.get('/ping', async (request, reply) => {
    return 'pong\n'
})


server.listen({ port: portNum }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})