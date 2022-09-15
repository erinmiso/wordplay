import type Definition from "./Definition";
import Borrow from "./Borrow";
import Unparsable from "./Unparsable";
import type Conflict from "../conflicts/Conflict";
import Block from "../nodes/Block";
import type Evaluator from "../runtime/Evaluator";
import type Evaluable from "../runtime/Evaluable";
import type Step from "../runtime/Step";
import Finish from "../runtime/Finish";
import Action from "../runtime/Start";
import StructureDefinitionValue from "../runtime/StructureDefinitionValue";
import Stream from "../runtime/Stream";
import Token from "./Token";
import type { ConflictContext } from "./Node";
import Node from "./Node";

export default class Program extends Node implements Evaluable {
    
    readonly borrows: (Borrow | Unparsable)[];
    readonly block: Block | Unparsable;
    readonly end: Token | Unparsable;

    constructor(borrows: (Borrow|Unparsable)[], block: Block | Unparsable, end: Token | Unparsable) {

        super();

        this.borrows = borrows.slice();
        this.block = block;
        this.end = end;

        // Assign all the parents in tree.
        this._parent = null;
        this.cacheParents();

    }

    isBindingEnclosureOfChild(child: Node): boolean { return child === this.block; }

    computeChildren() { return [ ...this.borrows, this.block, this.end ]; }
    getConflicts(conflict: ConflictContext): Conflict[] { return []; }

    getDefinition(context: ConflictContext, node: Node, name: string): Definition {

        if(context.shares !== undefined) {
            const share = context.shares.resolve(name);
            if(share instanceof StructureDefinitionValue)
                return share.definition;
            else if(share instanceof Stream)
                return share;
        }
        return undefined;
    }
    
    compile(context: ConflictContext):Step[] {
        // Execute the borrows, then the block, then this.
        return [ 
            new Action(this),
            ...this.borrows.reduce((steps: Step[], borrow) => [...steps, ...borrow.compile(context)], []),
            ...this.block.compile(context),
            new Finish(this)            
        ];
    }

    evaluate(evaluator: Evaluator) {

        // Return whatever the block computed.
        return evaluator.popValue();

    }

    clone(original?: Node, replacement?: Node) { 
        return new Program(
            this.borrows.map(b => b.cloneOrReplace([ Borrow, Unparsable ], original, replacement)), 
            this.block.cloneOrReplace([ Block, Unparsable ], original, replacement), 
            this.end.cloneOrReplace([ Token ], original, replacement)
        ) as this; 
    }

}