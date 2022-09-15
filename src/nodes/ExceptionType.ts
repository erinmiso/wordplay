import type Exception from "../runtime/Exception";
import type { ConflictContext } from "./Node";
import type Node from "./Node";
import Type from "./Type";

export default class ExceptionType extends Type {

    readonly exception: Exception;

    constructor(exception: Exception) {
        super();

        this.exception = exception;

    }

    computeChildren() { return []; }

    getConflicts() { return []; }

    isCompatible(context: ConflictContext, type: Type): boolean {
        return type instanceof ExceptionType && this.exception.constructor === type.exception.constructor;
    }

    getConversion() {
        return undefined;
    }

    getNativeTypeName(): string { return "exception"; }

    toWordplay(): string {
        return this.exception.toString();
    }

    clone(original?: Node, replacement?: Node) { return new ExceptionType(this.exception) as this; }

}