import type Bind from '@nodes/Bind';
import type Context from '@nodes/Context';
import NodeLink from '@translation/NodeLink';
import type Translation from '@translation/Translation';
import Conflict from './Conflict';

export default class ExpectedColumnType extends Conflict {
    readonly column: Bind;

    constructor(column: Bind) {
        super(false);
        this.column = column;
    }

    getConflictingNodes() {
        return {
            primary: {
                node: this.column,
                explanation: (translation: Translation, context: Context) =>
                    translation.conflict.ExpectedColumnType.primary(
                        new NodeLink(this.column, translation, context)
                    ),
            },
        };
    }
}
