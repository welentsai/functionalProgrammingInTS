import mongoose from 'mongoose'
import { pipe, flow } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import 'dotenv/config'

const getConnectionString = () => {
  return pipe(process.env.MONGO_DB, O.fromNullable)
}

const establishConnection = async (connStr: string) => {
  return await mongoose.connect(connStr)
}

const createConnection = flow(getConnectionString, O.map(establishConnection))

createConnection()

const kittySchema = new mongoose.Schema({
  name: String
})

const Kitten = mongoose.model('Kitten', kittySchema)

async function test() {
  const silence = new Kitten({ name: 'Silence~' })
  console.log(silence.name) // 'Silence'
  const fluffy = new Kitten({ name: 'fluffy~' })
  await fluffy.save()
}

test()
