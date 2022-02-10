/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');

const parsers = fs.readdirSync('./parsers').filter((f) => f.endsWith('.js')).map((f) => require(`./parsers/${f}`));
const payloads = fs.readdirSync('./payloads').filter((f) => f.endsWith('.js')).map((f) => require(`./payloads/${f}`));

console.log('Payloads:');
for (const p of payloads) {
  p.repeat = p.repeat ?? 1;
  p.length = JSON.stringify(p.value).length / 1000;
  console.log(` - ${p.name}: ${p.repeat} x ${p.length} kB`);
}

console.log();

const timeResults = {};
const bandwidthResults = {};
const reqPerSecResults = {};
const errorResults = {};

(async () => {
  for (const parser of parsers) {
    const result = { Init: 0 };

    console.log(`${parser.name}: Init`);
    result.Init = -Date.now();
    await parser.init();
    result.Init += Date.now();

    for (const payload of payloads) {
      console.log(`${parser.name}: Testing ${payload.name}`);
      result[payload.name] = -Date.now();
      payload.errors = await parser.test(payload) ?? 0;
      result[payload.name] += Date.now();
    }

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

        timeResults[valName][parser.name] = `${result[valName]} ms`;
        bandwidthResults[valName][parser.name] = `${Math.round(bandwidth * 1000) / 1000} MB/s`;
        reqPerSecResults[valName][parser.name] = `${Math.round(reqPerMs * 1000)} Req/s`;
        errorResults[valName][parser.name] = `${Math.round((payload.errors / payload.repeat) * 1000) / 10} %`;
      } else {
        timeResults[valName][parser.name] = `${result[valName]} ms`;
      }
    }

    console.log();
  }

  const payTable = {};
  payloads.forEach((p) => {
    payTable[p.name] = ({
      Length: `${Math.round(p.length * 100) / 100} kB`,
      Repeat: p.repeat,
      Total: `${Math.round(p.length * p.repeat * 0.1) / 100} MB`,
    });
  });

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
