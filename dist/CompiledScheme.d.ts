declare type TType = (string | number | boolean);
declare type Value = (string | number | boolean);
export interface DeepObject {
    [k: string]: (Value | DeepObject);
}
export interface DeepScheme {
    [k: string]: (TType | DeepScheme);
}
declare type Parser = (raw: Value[], bools: boolean[]) => DeepObject;
declare type Stamper = (DeepObj: DeepObject) => Generator<[TType, Value]>;
export default class CompiledScheme {
    ID: string;
    hasBool: boolean;
    types: TType[];
    parser: Parser;
    stamper: Stamper;
    constructor(ID: string, Scheme?: DeepScheme, getter?: boolean);
    genIterator(DeepObj: DeepObject): Generator<string>;
    parse(chunks: Value[]): DeepObject;
}
export {};
