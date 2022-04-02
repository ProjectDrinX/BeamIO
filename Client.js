"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BeamClient_1 = __importDefault(require("./dist/src/BeamClient"));
const ws_1 = require("ws");
// @ts-ignore
global.WebSocket = ws_1.WebSocket;
exports.default = BeamClient_1.default;
