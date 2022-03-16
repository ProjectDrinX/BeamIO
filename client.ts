import BeamClient from './src/BeamClient';
import { WebSocket } from 'ws';

// @ts-ignore
global.WebSocket = WebSocket;

export default BeamClient;
