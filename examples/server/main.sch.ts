import { Type } from 'beamio';

export const loginRequest = {
  /** The account username */
  username: Type.String,
  /** The account password */
  password: Type.String,
  /** A random number */
  nbr: Type.Number,
  /** A boolean */
  boo: Type.Boolean,
};

export * from './test.sch';
