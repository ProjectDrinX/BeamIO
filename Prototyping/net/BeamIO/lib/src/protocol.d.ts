interface ProtocolConfig {
    /** Main separator char */
    CHAR_MAIN_SEP: string;
    /** Escape char */
    CHAR_ESCAPE: string;
}
interface ProtocolConfigurator {
    /** Main separator char */
    CHAR_MAIN_SEP?: string;
    /** Escape char */
    CHAR_ESCAPE?: string;
}
declare class Protocol {
    #private;
    get config(): ProtocolConfig;
    /**
     * @param {ProtocolConfigurator} config Protocol config
     */
    constructor(config?: ProtocolConfigurator);
    encodeRaw(str?: string): string;
    decodeRaw(str?: string): string;
    decode(packet?: string): string[];
    encode(array?: never[]): string;
}
export default Protocol;
