"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protocol_1 = __importDefault(require("./protocol"));
const CompiledScheme_1 = __importDefault(require("./CompiledScheme"));
class default_1 {
    schemeHashes = {};
    schemes = {};
    protocol;
    constructor(Schemes, Config = {}) {
        this.protocol = new protocol_1.default(Config.protocolConfig);
        const SchemeIDs = Object.keys(Schemes).sort((a, b) => a.localeCompare(b));
        let i = 0;
        for (const n in SchemeIDs) {
            const schemeID = SchemeIDs[n];
            if (!Object.prototype.hasOwnProperty.call(Schemes, schemeID))
                continue;
            if (i >= 254)
                throw new Error('Reached scheme number limit');
            const hash = String.fromCharCode(i);
            const scheme = new CompiledScheme_1.default(schemeID, Schemes[schemeID]);
            this.schemeHashes[schemeID] = hash;
            this.schemes[hash] = scheme;
            i += 1;
        }
    }
    isRegistered(schemeID) {
        return this.schemeHashes[schemeID] !== undefined;
    }
    serialize(schemeID, data) {
        const hash = this.schemeHashes[schemeID];
        if (!hash)
            throw new Error(`Undeclared scheme '${schemeID}'`);
        const req = this.schemes[hash];
        return `${hash}${this.protocol.encode(req.genIterator(data))}`;
    }
    parse(packet) {
        if (!this.schemes[packet.hash])
            throw new Error(`Undeclared scheme $Hash(${packet.hash.charCodeAt(0)})`);
        const req = this.schemes[packet.hash];
        const values = this.protocol.decode(packet);
        return {
            hash: packet.hash,
            id: req.ID,
            data: req.parse(values),
        };
    }
}
exports.default = default_1;
