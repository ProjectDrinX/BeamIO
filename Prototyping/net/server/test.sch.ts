import { Type } from 'beamio';

// export interface TestRequestPacket { str: String, nbr: Number, boo: Boolean };
export const testRequest = {
  /** This is a string */
  str: Type.String,
  /** This is a number */
  nbr: Type.Number,
  /** This is a boolean */
  boo: Type.Boolean,
};
