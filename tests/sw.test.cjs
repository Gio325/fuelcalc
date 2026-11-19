const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

test('precache, upgrade and offline navigation', async () => {
  const listeners = {};
  const content = new Map();
  const home = 'https://example.org/fuelcalc/';
  const manifest = home + 'manifest.webmanifest';
  let offline = false;
  let claimed = false;
  const removed = [];
  let requestCount = 0;
  const cache = {
    async addAll(keys) { for (const key of keys) content.set(key, 'cached ' + key); },
    async match(request) { return content.get(request.url || request); },
    async put(url, response) { content.set(url, response); }
  };
  vm.runInNewContext(fs.readFileSync(new URL('../sw.js', 'file://' + __filename), 'utf8'), {
    URL, caches: { open: async () => cache, keys: async () => ['fuelcalc-shell-v1', 'fuelcalc-shell-v3', 'other'],
      delete: async key => removed.push(key) },
    self: { location: { href: home + 'sw.js' }, addEventListener: (n, f) => listeners[n] = f,
      clients: { claim: async () => { claimed = true; } } },
    fetch: async () => {
      requestCount++;
      if (offline) throw Error('offline');
      return { ok: true, clone: () => 'latest HTML' };
    },
  });
  async function lifecycle(type) {
    let task;
    listeners[type]({ waitUntil: value => { task = value; } });
    await task;
  }
  function resource(url, mode = 'navigate') {
    let result;
    listeners.fetch({ request: { url, mode, method: 'GET' }, respondWith: value => { result = value; } });
    return result;
  }
  await lifecycle('install');
  await lifecycle('activate');
  assert.equal(claimed, true);
  assert.deepEqual(removed, ['fuelcalc-shell-v1']);
  await resource(home);
  assert.equal(requestCount, 1);
  offline = true;
  assert.equal(await resource(home), 'latest HTML');
  assert.equal(await resource(home + 'index.html?offline=1'), 'latest HTML');
  assert.equal(await resource(manifest, 'cors'), 'cached ' + manifest);
  assert.equal(resource('https://fuelwide.com/api/fuel-prices/italy', 'cors'), undefined);
});
