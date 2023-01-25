import { test } from 'vitest';
import InvalidTypeInput from '@conflicts/InvalidTypeInput';
import { testConflict } from '@conflicts/TestUtilities';
import { UnknownTypeName } from '@conflicts/InvalidTypeName';
import NameType from './NameType';

test.each([
    [
        '•Cat() ()\na•Cat: Cat()',
        'ƒ Cat() 1\na•Cat: 1',
        NameType,
        UnknownTypeName,
    ],
    [
        '•Cat⸨T⸩() ()\na•Cat⸨#⸩: Cat(1)',
        '•Cat()\na•Cat⸨#⸩: Cat()',
        NameType,
        InvalidTypeInput,
    ],
])('Expect %s no conflicts, %s to have one', (good, bad, node, conflict) => {
    testConflict(good, bad, node, conflict);
});
