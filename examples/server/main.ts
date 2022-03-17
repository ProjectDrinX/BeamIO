import BeamServer from 'beamio/server';
import * as Schemes from 'beamio-example-schemes';

const BS = new BeamServer(Schemes, {
  port: 1010,
});

type UID = number;

interface Color {
  r: number,
  g: number,
  b: number,
}

function isColor(c: Color): boolean {
  return (
    c.r >= 0 && c.r < 256
    && c.g >= 0 && c.g < 256
    && c.b >= 0 && c.b < 256
  );
}

interface User {
  username: string,
  color: Color,
}

interface Settings {
  bgColor: Color,
}

const users: { [e: UID]: User } = {};
const settings: Settings = {
  bgColor: { r: 24, g: 24, b: 24 },
}

let i = 0;
BS.on('connect', (client) => {
  const uUID = i;
  i += 1;

  const user = {
    username: `User_${uUID}`,
    color: {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    },
  };

  users[uUID] = user;
  console.log(`User '${user.username}' connected !`);

  client.emit(
    'changeBackgroundColor',
    settings.bgColor as typeof Schemes.changeBackgroundColor,
  );

  for (const usrUID in users) {
    const usr = users[usrUID];
    client.emit('userConnected', {
      // @ts-ignore
      uUID: usrUID as number,
      username: usr.username,
      color: usr.color,
    } as typeof Schemes.userConnected);
  }

  BS.broadcast('userConnected', {
    uUID,
    username: user.username,
    color: user.color,
  } as typeof Schemes.userConnected);

  client.on('setUsername', (data: typeof Schemes.setUsername) => {
    const rlLen = data.username.replace(/[^a-z]/gi, '').length
    if (rlLen === 0) {
      console.error(`User '${user.username}' set a too short username: ${rlLen} byte(s)`);
      return;
    }

    if (data.username.length > 15) {
      console.error(
        `User '${user.username}' set a too long username: ${data.username.length} byte(s)`,
      );
      return;
    }

    user.username = data.username;

    BS.broadcast('userRenamed', {
      uUID,
      username: user.username,
    } as typeof Schemes.userRenamed);

    console.log(`User '${user.username}' renamed to '${data.username}'`);
  });

  client.on('setBackgroundColor', (data: typeof Schemes.setBackgroundColor) => {
    if (!isColor(data)) {
      console.error(`User '${user.username}' set an invalid background color:`, data);
      return;
    }

    settings.bgColor = data;

    BS.broadcast(
      'changeBackgroundColor',
      settings.bgColor as typeof Schemes.changeBackgroundColor,
    );
  });

  client.on('setUsernameColor', (data: typeof Schemes.setUsernameColor) => {
    if (!isColor(data)) {
      console.error(`User '${user.username}' set an invalid username color:`, data);
      return;
    }

    user.color = data;

    BS.broadcast('userChangeColor', {
      uUID,
      color: user.color,
    } as typeof Schemes.userChangeColor);
  });

  client.on('sendMessage', (data: typeof Schemes.sendMessage) => {
    if (data.message.length > 1000) {
      console.error(
        `User '${user.username}' sent a too long message: ${data.message.length} bytes`,
      );
      return;
    }

    BS.broadcast('messageEvent', {
      sender: uUID,
      message: data.message,
    } as typeof Schemes.messageEvent);

    console.log(`[${user.username}]: ${data.message}`);
  });

  let lastWrite = 0;

  client.on('chatWrite', () => {
    if (lastWrite < Date.now() - 3000) {
      BS.broadcast('userWritingStatus', {
        uUID,
        status: true,
      } as typeof Schemes.userWritingStatus);

      console.log(`User '${user.username}' is writing...`);
    }

    const time = Date.now();
    lastWrite = time;

    setTimeout(() => {
      if (lastWrite === time) {
        console.log(`User '${user.username}' is no longer writing`);

        BS.broadcast('userWritingStatus', {
          uUID,
          status: false,
        } as typeof Schemes.userWritingStatus);
      }
    }, 3000);
  });

  let lastPing = 0;

  function ping() {
    if (!client.isReady) return;
    lastPing = Date.now();
    client.emit('ping', {});
  }

  client.on('ping', () => {
    const latency = Date.now() - lastPing;

    BS.broadcast('userLatency', {
      uUID,
      latency,
    } as typeof Schemes.userLatency);

    setTimeout(ping, 300);
  });

  ping();

  client.on('disconnect', (e) => {
    BS.broadcast('userDisconnected', {
      uUID,
    } as typeof Schemes.userDisconnected);

    delete users[uUID];
    console.log(`User '${user.username}' disconnected: '${e.reason}' (${e.code})`);
  });
});
