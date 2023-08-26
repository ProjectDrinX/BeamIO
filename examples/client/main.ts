import BeamClient from 'beamio/Client';
import * as Schemes from 'beamio-example-schemes';

const Client = new BeamClient(Schemes, {
  host: 'localhost',
  port: 8310,
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
}

const users: { [UID: UID]: User } = {};

Client.on('connect', () => {
  console.log('Client (re)connected !');

  Client.emit('setUsername', {
    username: 'BeamBot',
  });
});

const messages = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
];

let i = 0;

setInterval(() => {
  Client.emit('chatWrite', {});
  setTimeout(() => {
    Client.emit('sendMessage', {
      message: messages[i],
    });

    if (messages[i + 1]) i += 1; else i = 0;
  }, 2000);
}, 5000);

setInterval(() => {
  // console.log('Setting color');
  Client.emit('setUsernameColor', {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  });
}, 100);

Client.on('messageEvent', (data) => {
  console.log(`[${users[data.sender].username}]: ${data.message}`);
});

Client.on('userChangeColor', (data) => {
  users[data.uUID].color = data.color;
});

Client.on('userConnected', (data) => {
  console.log(`User connected: '${data.username}' (${data.uUID}); Color:`, data.color);
  users[data.uUID] = data;
});

Client.on('userRenamed', (data) => {
  console.log(`User renamed: '${users[data.uUID].username}' (${data.uUID}) => '${data.username}'`);
  users[data.uUID].username = data.username;
});

Client.on('userDisconnected', (data) => {
  console.log(`User disconnected: ${data.uUID}`);
  delete users[data.uUID];
});

Client.on('ping', () => {
  Client.emit('ping', {});
});

Client.on('disconnect', (e) => {
  console.log(`Client disconnected: '${e.reason}' (${e.code})`);
});
