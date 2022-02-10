declare enum Type {
    'string' = 0,
    'number' = 1,
    'boolean' = 2
}
declare const SupportedTypes: {
    [t: string]: Type;
};
declare type Scheme = {
    [name: string]: Type;
};
declare type Value = (string | number | boolean);
declare type ObjData = {
    [key: string]: Value;
};
interface FormatterConfigurator {
    /** Set it to false to disable the type checking */
    typeChecking?: boolean;
    /** Strict typing mode, useless in production (Default: false) */
    strictTyping?: boolean;
}
declare class Formatter {
    #private;
    constructor(config: FormatterConfigurator);
    checkType(type: Type, value: Value, key: string): void;
    format(scheme?: {
        [s: string]: Type;
    }, data?: {
        [s: string]: any;
    }): string[];
    parse(scheme?: Scheme, chunks?: string[]): ObjData;
}
export default Formatter;
export { Type, SupportedTypes };
