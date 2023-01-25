import type Evaluator from './Evaluator';
import Exception from './Exception';
import type Translation from '@translation/Translation';
import type Expression from '@nodes/Expression';
import NodeLink from '@translation/NodeLink';

export default class UnparsableException extends Exception {
    readonly unparsable: Expression;

    constructor(evaluator: Evaluator, unparsable: Expression) {
        super(evaluator);

        this.unparsable = unparsable;
    }

    getDescription(translation: Translation) {
        return translation.exceptions.unparsable(
            new NodeLink(
                this.unparsable,
                translation,
                this.getNodeContext(this.unparsable)
            )
        );
    }
}
