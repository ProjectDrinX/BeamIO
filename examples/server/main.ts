import BeamServer from 'beamio/server';
import * as Schemes from 'beamio-example-schemes';

const BS = new BeamServer(Schemes, {
  port: 1010,
});

type UID = number;

interface User {
  username: string,
  color: {
    r: number,
    g: number,
    b: number,
  },
}

const users: { [e: UID]: User } = {}

let i = 0;
BS.on('connect', (client) => {
  const UID = i;
  i++;

  const user = {
    username: `User_${UID}`,
    color: {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    },
  };

  users[UID] = user;
  console.log(`User '${user.username}' connected !`);

  for (const uUID in users) {
    const usr = users[uUID];
    client.emit('userConnected', {
      UID: ~~uUID,
      username: usr.username,
      color: usr.color,
    } as typeof Schemes.userConnected);
  }

  BS.broadcast('userConnected', {
    UID,
    username: user.username,
    color: user.color,
  } as typeof Schemes.userConnected);

  client.on('setUsername', (data: typeof Schemes.setUsername) => {
    if (data.username.length > 25) {
      console.error(
        `The user '${user.username}' set a too long username: ${data.username.length} bytes`,
      );
      return;
    }

    console.log(`User '${user.username}' renamed to '${data.username}'`);
    user.username = data.username;

    BS.broadcast('userRenamed', {
      UID,
      username: user.username,
    } as typeof Schemes.userRenamed);
  });

  client.on('setUsernameColor', (data: typeof Schemes.setUsernameColor) => {
    if (
      data.r < 0 || data.r > 255
      || data.g < 0 || data.g > 255
      || data.b < 0 || data.b > 255
    ) {
      console.error(`The user '${user.username}' set an invalid color:`, data);
      return;
    }

    console.log(`User '${user.username}' set his color to:`, data);

    BS.broadcast('userChangeColor', {
      UID,
      color: user.color,
    } as typeof Schemes.userChangeColor);
  });

  client.on('sendMessage', (data: typeof Schemes.sendMessage) => {
    if (data.message.length > 1000) {
      console.error(
        `The user '${user.username}' sent a too long message: ${data.message.length} bytes`,
      );
      return;
    }

    console.log(`[${user.username}]: ${data.message}`);

    BS.broadcast('messageEvent', {
      sender: UID,
      message: data.message,
    } as typeof Schemes.messageEvent);
  });

  client.on('disconnect', (e) => {
    console.log(`User '${user.username}' disconnected: '${e.reason}' (${e.code})`);

    BS.broadcast('userDisconnected', {
      UID,
    } as typeof Schemes.userDisconnected);

    delete users[UID];
  });
});
