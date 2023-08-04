import { test, expect } from 'vitest';
import { testConflict } from '@conflicts/TestUtilities';
import UnknownColumn from '@conflicts/UnknownColumn';
import IncompatibleCellType from '@conflicts/IncompatibleCellType';
import ExpectedUpdateBind from '@conflicts/ExpectedUpdateBind';
import Update from './Update';
import IncompatibleInput from '../conflicts/IncompatibleInput';
import Evaluator from '../runtime/Evaluator';
import { DefaultLocale } from '../db/Creator';

test.each([
    [
        'table: ⎡one•#⎦\ntable ⎡: one: 1 ⎦ one < 1',
        'table: ⎡one•""⎦\ntable ⎡: one: 1 ⎦ one < 1',
        Update,
        IncompatibleInput,
    ],
    [
        'table: ⎡one•#⎦\ntable ⎡: one: 1 ⎦ one < 1',
        'table: ⎡one•#⎦\ntable ⎡: one ⎦ one < 1',
        Update,
        ExpectedUpdateBind,
    ],
    [
        'table: ⎡one•#⎦\ntable ⎡: one: 1 ⎦ one < 1',
        'table: ⎡one•#⎦\ntable ⎡: one ⎦ one < 1',
        Update,
        ExpectedUpdateBind,
    ],
    [
        'table: ⎡one•#⎦\ntable ⎡: one:1 ⎦ one < 1',
        'table: ⎡one•#⎦\ntable ⎡: two:1 ⎦ one < 1',
        Update,
        UnknownColumn,
    ],
    [
        'table: ⎡one•#⎦\ntable ⎡: one: 1 ⎦ one < 1',
        'table: ⎡one•#⎦\ntable ⎡: one: "" ⎦ one < 1',
        Update,
        IncompatibleCellType,
    ],
])('good: %s bad: %s', (good, bad, kind, conflict) => {
    testConflict(good, bad, kind, conflict);
});

test.each([
    ['⎡a•# b•#⎦⎡1 2⎦ ⎡3 4⎦ ⎡: a: 2 ⎦ ⊤', '⎡ 2 2 ⎦\n⎡ 2 4 ⎦'],
    ['⎡a•# b•#⎦⎡1 2⎦ ⎡3 4⎦ ⎡: a: 2 ⎦ a < 2', '⎡ 2 2 ⎦\n⎡ 3 4 ⎦'],
    ['⎡a•# b•#⎦⎡1 2⎦ ⎡3 4⎦ ⎡: a: 2 b: b + 1 ⎦ a < 2', '⎡ 2 3 ⎦\n⎡ 3 4 ⎦'],
])('%s = %s', (code: string, value: string) => {
    expect(Evaluator.evaluateCode(DefaultLocale, code)?.toWordplay([])).toBe(
        value
    );
});
