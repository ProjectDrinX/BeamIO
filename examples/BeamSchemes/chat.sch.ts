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
};

/** By the client to notify that he is writing */
export const chatWrite = {};

/** By the server to notify a client writing status */
export const userWritingStatus = {
  uUID: Type.Number,
  status: Type.Boolean,
};
