/**

Reader can read a value, Writer can write — the combination is the State monad!
State monad can not only read a config, but can also modify it

export interface State<S, A> {
  (s: S): [A, S]
}

The State receives a type S, processes it and writes a (potentially) new value 
of type S alongside a value of type A into a tuple

 */

import * as S from 'fp-ts/State';
import * as f from 'fp-ts/function';

type WriterConfig = {
    denominator: number;
    logs: Array<string>
};

const fractionWithLogs: (numerator: number) => S.State<WriterConfig, number> =
    (numerator: number) => (c: WriterConfig) =>
        [
            numerator / c.denominator,
            {
                denominator: c.denominator,
                logs: [...c.logs, `Numerator: ${numerator}. Denominator: ${c.denominator}`]
            }
        ];

const fractionThreeTimes = (numerator: number) =>
    f.pipe(
        numerator,
        fractionWithLogs,
        S.chain(fractionWithLogs),
        S.chain(fractionWithLogs)
    );

const startValue = 10;
const config: WriterConfig = {
    denominator: 2,
    logs: []
};
console.log(fractionThreeTimes(startValue)(config));