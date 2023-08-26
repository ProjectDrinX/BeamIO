import BeamServer from 'beamio/Server';
import * as Schemes from 'beamio-example-schemes';

const BS = new BeamServer(Schemes);

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
};

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

  client.emit('changeBackgroundColor', settings.bgColor);

  for (const usrUID in users) {
    const usr = users[usrUID];
    client.emit('userConnected', {
      // @ts-expect-error
      uUID: usrUID,
      username: usr.username,
      color: usr.color,
    });
  }

  BS.broadcast('userConnected', {
    uUID,
    username: user.username,
    color: user.color,
  });

  client.on('setUsername', (data) => {
    const rlLen = data.username.replace(/[^0-z]/gi, '').length;
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
    });

    console.log(`User '${user.username}' renamed to '${data.username}'`);
  });

  client.on('setBackgroundColor', (data) => {
    if (!isColor(data)) {
      console.error(`User '${user.username}' set an invalid background color:`, data);
      return;
    }

    settings.bgColor = data;

    BS.broadcast('changeBackgroundColor', settings.bgColor);
  });

  client.on('setUsernameColor', (data) => {
    if (!isColor(data)) {
      console.error(`User '${user.username}' set an invalid username color:`, data);
      return;
    }

    user.color = data;

    BS.broadcast('userChangeColor', {
      uUID,
      color: user.color,
    });
  });

  client.on('sendMessage', (data) => {
    if (data.message.length > 1000) {
      console.error(
        `User '${user.username}' sent a too long message: ${data.message.length} bytes`,
      );
      return;
    }

    BS.broadcast('messageEvent', {
      sender: uUID,
      message: data.message,
    });

    console.log(`[${user.username}]: ${data.message}`);
  });

  let lastWrite = 0;

  client.on('chatWrite', () => {
    if (lastWrite < Date.now() - 3000) {
      BS.broadcast('userWritingStatus', {
        uUID,
        status: true,
      });

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
        });
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
    });

    setTimeout(ping, 300);
  });

  ping();

  client.on('disconnect', (e) => {
    BS.broadcast('userDisconnected', { uUID });

    delete users[uUID];
    console.log(`User '${user.username}' disconnected: '${e.reason}' (${e.code})`);
  });
});
