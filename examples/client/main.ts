// @ts-ignore
global.IMPORT_MSGS = true;
/* eslint-disable import/first */
import BeamClient from 'beamio/client';
import * as Schemes from 'beamio-example-schemes';

const Client = new BeamClient(Schemes, {
  host: 'localhost',
  port: 1010,
  ssl: false,
});

type UID = number;
export interface User {
  username: string,
  color: {
    r: number,
    g: number,
    b: number,
  },
};

const users: { [UID: UID]: User } = {};

Client.on('connect', () => {
  console.log('Client (re)connected !');

  Client.emit('setUsername', {
    username: `User${Math.round(Math.random() * 100).toString(36)}`,
  } as typeof Schemes.setUsername);
});

setInterval(() => {
  Client.emit('sendMessage', {
    message: 'Hello, this is a message.',
  } as typeof Schemes.sendMessage);
}, 3000);

setTimeout(() => {
  console.log('Setting color'),
  Client.emit('setUsernameColor', {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  } as typeof Schemes.setUsernameColor)
}, 2000);

Client.on('messageEvent', (data: typeof Schemes.messageEvent) => {
  console.log(`[${users[data.sender].username}]: ${data.message}`);
});

Client.on('userChangeColor', (data: typeof Schemes.userChangeColor) => {
  console.log(`User '${users[data.uUID].username}' set his color to`, data.color);
  users[data.uUID].color = data.color;
});

Client.on('userConnected', (data: typeof Schemes.userConnected) => {
  console.log(`User connected: '${data.username}' (${data.uUID}); Color:`, data.color);
  users[data.uUID] = data;
});

Client.on('userRenamed', (data: typeof Schemes.userRenamed) => {
  console.log(`User renamed: '${users[data.uUID].username}' (${data.uUID}) => '${data.username}'`);
  users[data.uUID].username = data.username;
});

Client.on('userDisconnected', (data: typeof Schemes.userDisconnected) => {
  console.log(`User disconnected: ${data.uUID}`);
  delete users[data.uUID];
});

Client.on('disconnect', (e) => {
  console.log(`Client disconnected: '${e.reason}' (${e.code})`);
});
