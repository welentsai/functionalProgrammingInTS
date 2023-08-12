import * as S from 'fp-ts/State'
import * as O from 'fp-ts/Option'

type State = 'Unpaid' | 'Paid'
type Gumball = 'Gumball'
type Output = O.Option<Gumball>

const pay =
  (amount: number): S.State<State, Output> =>
  (state: State) => {
    switch (amount) {
      case 50:
        return [O.none, 'Paid']
      default:
        return [O.none, state]
    }
  }

const turn: S.State<State, Output> = (state: State) => {
  switch (state) {
    case 'Unpaid':
      return [O.none, state]
    case 'Paid':
      return [O.some('Gumball'), 'Unpaid']
  }
}

//Single usage:
pay(50)('Unpaid') // [O.none, "Paid"];
console.log(pay(50)('Unpaid'))
console.log(pay(50)('Paid'))
console.log(pay(30)('Unpaid')) // { _tag: 'None' }, 'Unpaid' ]
console.log(pay(30)('Paid')) // [ { _tag: 'None' }, 'Paid' ]

turn('Paid') // [O.some("Gumball"), "Unpaid"]
console.log(turn('Paid')) // [O.some("Gumball"), "Unpaid"]

/**
 *  Now here comes the tricky part, how do we combine these functions together to build up our state machine?
 *  The key is that State s is an instance of Monad and that we can use bind/chain
 *      to combine our different state transition functions into a single one.
 */

// (>>=) :: (Monad m) => m a -> (a -> m b) -> m b   // the definition of bind (>>=) or chain
// instance Monad (State s)
// (>>=) :: (Monad (State s)) => State s a -> (a -> State s b) -> State s b

/**
 *  Bind (chain) takes the first state transition function and gets the output
 *  and state from that to feed it to the second state transition function
 *  creating a new combined state transition function.
 */

const combined = S.chain(() => turn)(pay(50))
combined('Unpaid') // [O.some("Gumball"), "Unpaid"]
console.log(combined('Unpaid')) // [ { _tag: 'Some', value: 'Gumball' }, 'Unpaid' ]

const actions = [pay(5), turn, pay(50), turn, turn, pay(50), turn]

// 不只得到 state array, 因為有chain的effect, 還會把前一個state當作下一個 state transition function 的input
//  S.sequeunceArray to combine an array of state transition functions into a single state transition function
//      that returns a collected array of outputs as well as the final state.
const [outputs, finalState] = S.sequenceArray(actions)('Unpaid')
const numGumballs = outputs.filter(O.isSome).length //2

console.log('outputs', outputs)

// [1] outputs [
// [1]   { _tag: 'None' },
// [1]   { _tag: 'None' },
// [1]   { _tag: 'None' },
// [1]   { _tag: 'Some', value: 'Gumball' },
// [1]   { _tag: 'None' },
// [1]   { _tag: 'None' },
// [1]   { _tag: 'Some', value: 'Gumball' }
// [1] ]
console.log('-----', pay(50)('Unpaid'))

console.log('outputs', numGumballs)
