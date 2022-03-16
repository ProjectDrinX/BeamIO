import { Type } from 'beamio';

/** By the client to send a message */
export const sendMessage = {
  message: Type.String,
};

/** By the server to broadcast a message */
export const messageEvent = {
  /** Sender UID */
  sender: Type.Number,
  message: Type.String,
}
