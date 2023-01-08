import { match, P } from 'ts-pattern'

interface WeatherConfig {
  sunny: 'Sunny'
  rainy: 'Rainy'
  snowy: 'Snowy'
  cloudy: 'Cloudy'
}

type Weather = WeatherConfig[keyof WeatherConfig]

let currentWeather: Weather = 'Sunny'

const weatherToFeeling: string =
  currentWeather === 'Sunny'
    ? 'happy'
    : currentWeather === 'Rainy'
    ? 'sad'
    : 'cold'

console.log(weatherToFeeling)

/**
 * Pattern Matching
 */

const weatherToFeeling2 = match<Weather>(currentWeather)
  .with('Sunny', () => 'happy')
  .with('Rainy', () => 'sad')
  .with('Snowy', () => 'cold')
  .otherwise(() => 'Unkown')

console.log('=== Pattern Matching ===')
console.log(weatherToFeeling2)

currentWeather = 'Cloudy'
const weatherToFeeling3 = match<Weather>(currentWeather)
  .with('Sunny', () => 'happy')
  .with('Rainy', () => 'sad')
  .with('Snowy', () => 'cold')
  .with(P.string, () => 'unknown weather') // wildcard
  .with(P.nullish, () => 'it is either null or undefined!') // wildcard
  .exhaustive()

console.log('=== Pattern Matching ===')
console.log(weatherToFeeling3)

type Weather2 = { type: 'Sunny' } | { type: 'Rainy' } | { type: 'Snowy' }

const input: Weather2 = { type: 'Rainy' }

const output = match<Weather2>(input)
  .with({ type: 'Sunny' }, () => 'happy')
  .with({ type: 'Rainy' }, () => 'sad')
  .with({ type: 'Snowy' }, () => 'cold')
  .exhaustive()

console.log('=== Pattern Matching ===')
console.log(output)
