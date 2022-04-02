import type { Packet } from './engine';
export interface ProtocolConfig {
    /** Main separator char */
    CHAR_MAIN_SEP?: string;
    /** Escape char */
    CHAR_ESCAPE?: string;
}
declare class Protocol {
    readonly config: {
        CHAR_MAIN_SEP: string;
        CHAR_ESCAPE: string;
    };
    /**
     * @param {ProtocolConfig} config Protocol config
     */
    constructor(config?: ProtocolConfig);
    decodeRaw(s?: string): string;
    decode(packet: Packet): string[];
    encode(iterator: Generator<string>): string;
}
export default Protocol;
