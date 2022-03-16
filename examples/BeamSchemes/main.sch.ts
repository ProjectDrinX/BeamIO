import { Type } from 'beamio';

/** By the server to notify that a user has logged in */
export const userConnected = {
  /** The user UID */
  UID: Type.Number,
  /** The user username */
  username: Type.String,
  /** The user username color */
  color: {
    r: Type.Number,
    g: Type.Number,
    b: Type.Number,
  }
};

/** By the server to notify that a user has renamed himself */
export const userRenamed = {
  /** The user UID */
  UID: Type.Number,
  /** The user new username */
  username: Type.String,
};

/** By the server to notify that a user has changed his color */
export const userChangeColor = {
  UID: Type.Number,
  color: {
    r: Type.Number,
    g: Type.Number,
    b: Type.Number,
  },
};

/** By the server to notify that a user has logged in */
export const userDisconnected = {
  /** The user UID */
  UID: Type.Number,
};

/** Required by the client to set its usename */
export const setUsername = {
  username: Type.String,
};

/** By the client to change its username color */
export const setUsernameColor = {
  r: Type.Number,
  g: Type.Number,
  b: Type.Number,
}

export * from './chat.sch';
