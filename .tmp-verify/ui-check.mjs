import { chromium } from 'playwright';
const BASE = 'http://localhost:5173';
const errors = [];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage();
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

async function login(email) {
  await page.goto(BASE + '/login');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#email', email);
  await page.fill('#password', 'grotto');
  await page.click('button[type=submit]');
  await page.waitForURL(/\/(leader|committee|officer|admin)/);
}

await login('leader@grottoworks.vn');
await page.goto(BASE + '/leader/support');
await page.waitForSelector('h1');
console.log('L leader/support title:', await page.locator('h1').first().innerText());
console.log('L nav item count:', await page.locator('nav a[href="/leader/support"]').count());
const createBtn = page.locator('button', { hasText: /tạo yêu cầu hỗ trợ/i });
const n = await createBtn.count();
console.log('L create button count:', n);
if (n) {
  await createBtn.first().click();
  await page.waitForTimeout(400);
  console.log('L dialog open:', await page.getByRole('dialog').count());
  await page.keyboard.press('Escape');
}
await page.goto(BASE + '/leader/regs');
await page.waitForSelector('h1');
console.log('L regs title:', await page.locator('h1').first().innerText());
console.log('L regs rows:', await page.locator('table tbody tr').count());
await page.goto(BASE + '/leader/volunteers');
await page.waitForSelector('h1');
console.log('L volunteers title:', await page.locator('h1').first().innerText());
console.log('L volunteers rows:', await page.locator('table tbody tr').count());
await page.locator('table tbody tr').first().click();
await page.waitForTimeout(500);
console.log('L volunteer detail URL:', page.url());

await login('committee@grottoworks.vn');
await page.goto(BASE + '/committee/support');
await page.waitForSelector('h1');
console.log('C support title:', await page.locator('h1').first().innerText());
console.log('C support rows:', await page.locator('table tbody tr').count());
await page.locator('table tbody tr').first().click();
await page.waitForTimeout(400);
console.log('C detail dialog:', await page.getByRole('dialog').count());
const dlg = page.getByRole('dialog');
if (await dlg.count()) console.log('C dialog snippet:', (await dlg.innerText()).slice(0, 150).replace(/\n/g, ' | '));
await page.keyboard.press('Escape');
await page.goto(BASE + '/committee/volunteers');
await page.waitForSelector('h1');
await page.locator('table tbody tr').first().click();
await page.waitForTimeout(500);
console.log('C volunteer detail URL:', page.url());

await browser.close();
console.log('CONSOLE ERRORS:', errors.length ? errors : 'NONE');
