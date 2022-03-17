import { Type } from 'beamio';

/** By the client to change the background color */
export const setBackgroundColor = {
  r: Type.Number,
  g: Type.Number,
  b: Type.Number,
};

/** By the server to notify that the background color changed */
export const changeBackgroundColor = {
  r: Type.Number,
  g: Type.Number,
  b: Type.Number,
};
