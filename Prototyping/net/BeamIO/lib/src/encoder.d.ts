declare const _default: {
    number: {
        encode(nbr: number): string;
        decode(hex: string): number;
    };
    boolList: {
        encode(bools: boolean[]): string;
        decode(hex: string): boolean[];
    };
};
export default _default;
