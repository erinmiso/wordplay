import type Node from "./Node";
import type Bind from "./Bind";
import Expression from "./Expression";
import type { Token } from "./Token";
import type TypeVariable from "./TypeVariable";
import type Unparsable from "./Unparsable";
import type Block from "./Block";
import type Docs from "./Docs";

export default class CustomType extends Expression {

    readonly docs: Docs[];
    readonly type: Token;
    readonly typeVars: (TypeVariable|Unparsable)[];
    readonly open: Token;
    readonly inputs: (Bind | Unparsable)[];
    readonly close: Token;
    readonly block: Block | Unparsable;

    constructor(docs: Docs[], type: Token, typeVars: (TypeVariable|Unparsable)[], open: Token, inputs: (Bind|Unparsable)[], close: Token, block: Block | Unparsable) {
        super();

        this.docs = docs;
        this.type = type;
        this.typeVars = typeVars;
        this.open = open;
        this.inputs = inputs;
        this.close = close;
        this.block = block;
    }

    getChildren() {
        let children: Node[] = [ ...this.docs, this.type ];
        children = children.concat(this.typeVars);
        children = children.concat([ this.open, ...this.inputs, this.close, this.block ]);
        return children;
    }

}