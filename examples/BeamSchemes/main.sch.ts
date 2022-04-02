import Type from 'beamio/Types';

/** By the server or the client to measure latency */
export const ping = {};

/** By the server to notify a user's latency */
export const userLatency = {
  uUID: Type.Number,
  latency: Type.Number,
};

export * from './user.sch';
export * from './chat.sch';
export * from './settings.sch';
