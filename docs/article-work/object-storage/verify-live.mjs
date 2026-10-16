import { chromium } from '/private/tmp/staycurrent-browser/node_modules/playwright/index.mjs';
import { lessons } from '../../../src/lib/object-storage/lessons.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';
const base = 'https://staycurrent.dev';
const home = '/learn/databases/object-storage/';
const slugs = fs.readdirSync('src/pages/learn/databases/object-storage').filter(p => p.endsWith('.md')).map(p => p.slice(0, -3));
const routes = [home, ...slugs.map(p => home + p + '/'), home + 'sandbox/', '/', '/articles/', '/playgrounds/', '/learn/databases/choosing/'];
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const pages = await Promise.all(routes.map(async route => {
  const response = await fetch(base + route, { cache: 'no-store' });
  const text = await response.text();
  return {route, status: response.status, matchesLocalBuild: digest(text) === digest(fs.readFileSync('dist' + route + 'index.html')), noindex: /<meta[^>]+name="robots"[^>]+noindex/.test(text)};
}));
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page = await browser.newPage({viewport:{width:1280,height:900}});
const errors = []; page.on('pageerror',e=>errors.push(e.message));
const steps = [];
for (const id of ['lost-reply', 'multipart', 'cost', 'vectors']) {
  const lesson = lessons.find(l=>l.id===id);
  await page.goto(base + home + 'sandbox/?lesson=' + id);
  await page.waitForFunction(()=>document.querySelector('#request')?.value && !document.querySelector('#run').disabled);
  for (let i=0; i<lesson.steps.length; i++) {
    await page.locator('#run').click();
    await page.waitForFunction(()=>!document.querySelector('#run').disabled && !document.querySelector('#response').hidden);
    const result = JSON.parse(await page.locator('#response').textContent());
    steps.push({lesson:id,step:i+1,status:result.status,pass:result.status===lesson.steps[i].status});
    if(i<lesson.steps.length-1) await page.locator('#next').click();
  }
}
await browser.close();
const report = {checkedAt:new Date().toISOString(),publicationCommit:'f54f9eeb4ea9f99f90d2fcd1e70489f058e66e46',pages,steps,errors};
fs.writeFileSync('docs/article-work/object-storage/live-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({pages:pages.length,pageFailures:pages.filter(p=>p.status!==200 || !p.matchesLocalBuild || (p.route.startsWith(home) && p.noindex)),steps:steps.length,stepFailures:steps.filter(s=>!s.pass),errors},null,2));
