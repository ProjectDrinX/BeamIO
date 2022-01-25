const fs = require('fs');

const protocols = fs.readdirSync('./protocols').filter((f) => f.endsWith('.js')).map((f) => require(`./protocols/${f}`));
const payloads = fs.readdirSync('./payloads').filter((f) => f.endsWith('.js')).map((f) => require(`./payloads/${f}`));

console.log('Payloads:')
payloads.forEach((payload) => {
  payload.repeat = payload.repeat ?? 1;
  payload.length = JSON.stringify(payload.value).length / 1000;
  console.log(` - ${payload.name}: ${payload.repeat} x ${payload.length} kB`);
});

console.log();

const timeResults = {};
const bandwidthResults = {};
const reqPerSecResults = {};
const errorResults = {};

(async () => {
  for (const protocol of protocols) {
    const result = {
      ServerInit: 0,
      ClientInit: 0,
    };

    console.log(`${protocol.name}: Creating server`);
    result.ServerInit = -Date.now();
    await protocol.initServer();
    result.ServerInit += Date.now();

    console.log(`${protocol.name}: Creating client`);
    result.ClientInit = -Date.now();
    await protocol.initClient();
    result.ClientInit += Date.now();

    for (const payload of payloads) {
      console.log(`${protocol.name}: Testing ${payload.name}`);
      result[payload.name] = -Date.now();
      payload.errors = await protocol.test(payload);
      result[payload.name] += Date.now();
    }

    await protocol.end();

    for (const valName in result) {
      if (!timeResults[valName]) timeResults[valName] = {};
      const payload = payloads.find((p) => p.name === valName);

      if (payload) {
        if (!bandwidthResults[valName]) bandwidthResults[valName] = {};
        if (!reqPerSecResults[valName]) reqPerSecResults[valName] = {};
        if (!errorResults[valName]) errorResults[valName] = {};

        const realCount = payload.repeat - payload.errors;
        const bandwidth = (realCount * payload.length) / result[valName];
        const reqPerMs = realCount / result[valName];

        timeResults[valName][protocol.name] = `${result[valName]} ms`;
        bandwidthResults[valName][protocol.name] = `${Math.round(bandwidth * 1000) / 1000} MB/s`;
        reqPerSecResults[valName][protocol.name] = `${Math.round(reqPerMs * 1000)} Req/s`;
        errorResults[valName][protocol.name] = `${Math.round(payload.errors / payload.repeat * 1000) / 10} %`;
      } else {
        timeResults[valName][protocol.name] = `${result[valName]} ms`;
      }
    }
  }

  const payTable = {};
  payloads.forEach((p) => payTable[p.name] = ({
    Length: `${Math.round(p.length * 100) / 100} kB`,
    Repeat: p.repeat,
    Total: `${Math.round(p.length * p.repeat * 100) / 100} kB`,
  }));

  console.log('======== Payloads ========');
  console.table(payTable);
  
  console.log('======== Errored requests ========');
  console.table(errorResults);

  console.log('======== Time results ========');
  console.table(timeResults);
  
  console.log('======== Bandwidth results ========');
  console.table(bandwidthResults);

  console.log('======== Req/s results ========');
  console.table(reqPerSecResults);
})();
