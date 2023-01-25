import { test, expect } from 'vitest';
import { testConflict } from '@conflicts/TestUtilities';
import { IncompatibleKey } from '@conflicts/IncompatibleKey';
import Evaluator from '@runtime/Evaluator';
import SetOrMapAccess from './SetOrMapAccess';
import { NotASetOrMap } from '@conflicts/NotASetOrMap';

test.each([
    [
        '{1:1 2:2 3:3}{1}',
        '{1:1 2:2 3:3}{"hi"}',
        SetOrMapAccess,
        IncompatibleKey,
    ],
    ['{1:1 2:2 3:3}{1}', '[1 2 3]{"hi"}', SetOrMapAccess, NotASetOrMap],
])(
    'Expect %s no conflicts, %s to have %s with %s',
    (good, bad, node, conflict) => {
        testConflict(good, bad, node, conflict);
    }
);

test.each([
    ['{1 2 3}{2}', '⊤'],
    ["{1:'a' 2:'b' 3:'c'}{2}", '"b"'],
])('Expect %s to be %s', (code, value) => {
    expect(Evaluator.evaluateCode(code)?.toString()).toBe(value);
});

test('Test set and map access evaluation', () => {});
