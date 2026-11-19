const assert = require('node:assert/strict');
const { chromium } = require('playwright');

async function verify() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox']
  });
  try {
    const context = await browser.newContext({ viewport: { width: 320, height: 720 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error));
    await page.route('https://fuelwide.com/**', route => route.abort());
    const url = process.env.FUELCALC_URL || 'http://localhost:8103/';
    const select = (id, value) => page.locator(id).selectOption(value);
    const fill = (id, value) => page.locator(id).fill(value);
    const contains = async (id, value) => assert.ok((await page.locator(id).textContent()).includes(value), id + ' ' + value);
    const fuel = value => page.locator('input[value="' + value + '"]').check({ force: true });
    await page.goto(url);
    await page.evaluate(() => {
      localStorage.setItem('fuelcalc.vehicles.v1', JSON.stringify(['MiTo', 'Altra auto']));
      localStorage.setItem('fuelcalc.trips.v1', JSON.stringify([
        { vehicle: 'MiTo', fuel: 'gpl', km: 50, litres: 4, total: 3.5, savedAt: Date.now() - 3600000 }
      ]));
    });
    await page.reload();
    await fuel('gpl');
    await fill('#distance', '100');
    await fill('#efficiency', '14,0');
    await fill('#price', '0,70');
    assert.equal(await page.getByLabel('Dato inserito').inputValue(), 'board');
    await contains('#gpl-active-source', 'MiTo 1.4 T-Jet');
    await fill('#efficiency', '15');
    await contains('#gpl-reading-summary', '11,3 km/l');
    await contains('#total', '6,20');
    await select('#gpl-mode', 'real');
    await contains('#total', '4,67');
    await select('#gpl-mode', 'board');
    await fill('#efficiency', '14,0');
    await page.getByText('Profilo e calibrazione GPL', { exact: true }).click();
    await select('#gpl-vehicle', 'MiTo');
    await select('#gpl-profile', 'mito');
    await contains('#gpl-reading-summary', '10,54');
    await contains('#litres', '9,48');
    await contains('#total', '6,64');
    await contains('#per-100', '6,64');
    await contains('#per-km', '0,066');
    await page.getByText('Calibra consumo GPL', { exact: true }).click();
    await fill('#gpl-km', '300');
    await fill('#gpl-litres', '25');
    await fill('#gpl-reading', '15');
    await page.getByRole('button', { name: 'Salva calibrazione' }).click();
    await contains('#gpl-reading-summary', '11,2');
    await contains('#total', '6,25');
    await page.reload();
    await contains('#total', '6,25');
    await page.getByText('Profilo e calibrazione GPL', { exact: true }).click();
    await select('#gpl-vehicle', 'Altra auto');
    await select('#gpl-profile', '');
    await contains('#total', '5,00');
    await select('#gpl-vehicle', 'MiTo');
    await page.getByRole('button', { name: 'Ripristina coefficiente del profilo' }).click();
    await contains('#total', '6,64');
    await fill('#gpl-factor', '0.5');
    await contains('#total', '10,00');
    await fill('#gpl-factor', '0');
    await contains('#total', '5,00');
    await page.getByRole('button', { name: 'Ripristina coefficiente del profilo' }).click();
    for (const other of ['benzina', 'diesel']) {
      await fuel(other);
      await fill('#price', '1.40');
      await contains('#total', '10,00');
      assert.equal(await page.locator('#gpl-settings').isVisible(), false);
    }
    await fuel('gpl');
    await contains('#total', '6,64');
    for (const invalid of ['', '0', 'a', '-1', '1,2.3']) {
      await fill('#efficiency', invalid);
      await contains('#total', '—');
      assert.equal(await page.locator('#save-trip').isDisabled(), true);
    }
    await fill('#efficiency', '14');
    await page.locator('#save-trip').click();
    await page.locator('#trip-form button[type=submit]').click();
    await page.reload();
    await contains('#trips', 'Stima GPL');
    await contains('#trips', '3,50');
    assert.deepEqual(await page.evaluate(() => {
      const [recent, old] = JSON.parse(localStorage.getItem('fuelcalc.trips.v1'));
      return [recent.gpl.mode, recent.gpl.original, recent.gpl.coefficient, old.total, old.gpl == null];
    }), ['board', 14, 6.1 / 8.1, 3.5, true]);
    assert.equal(await page.locator('#distance').inputValue(), '');
    assert.ok(await page.locator('#gpl-mode').evaluate(el => el.labels.length > 0));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await page.reload();
    await fill('#distance', '100');
    await fill('#efficiency', '14');
    await fill('#price', '0,70');
    await contains('#total', '6,64');
    assert.deepEqual(pageErrors, []);
    console.log('OK: calcoli, profili per mezzo, calibrazione, ripristino, storico e vecchi dati, input, 320 px, API indisponibile e PWA offline');
  } finally {
    await browser.close();
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
