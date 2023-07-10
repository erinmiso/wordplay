import type Evaluator from './Evaluator';
import Exception from './Exception';
import type Locale from '@locale/Locale';
import type Expression from '@nodes/Expression';
import NodeLink from '@locale/NodeRef';
import concretize from '../locale/concretize';

export default class UnparsableException extends Exception {
    readonly unparsable: Expression;

    constructor(evaluator: Evaluator, unparsable: Expression) {
        super(unparsable, evaluator);

        this.unparsable = unparsable;
    }

    getDescription(locale: Locale) {
        return concretize(
            locale,
            locale.node.UnparsableExpression.exception.UnparsableException,
            new NodeLink(
                this.unparsable,
                locale,
                this.getNodeContext(this.unparsable)
            )
        );
    }
}
