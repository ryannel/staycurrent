// Run the existing structural checks against one immutable preview output.
import config from '../../../scripts/check-site/config.mjs';
import {rules} from '../../../scripts/check-site/rules/index.mjs';
import {loadSite} from '../../../scripts/check-site/site.mjs';
import {checkPages,checkSources} from '../../../scripts/check-site/check.mjs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
const work=dirname(fileURLToPath(import.meta.url));
const root=resolve(work,'../../..');
const [output,...keys]=process.argv.slice(2);
if(!output?.startsWith('/private/tmp/')||!keys.length||keys.some(k=>!/^r\d{2}$/.test(k))) throw Error('Usage: check-preview.mjs /private/tmp/output rXX ...');
const site=await loadSite(output,{skip:config.skip});
const record={checked_utc:new Date().toISOString(),output,issues:[...checkPages(site,rules,config),...await checkSources(root,rules,config)]};
for(const key of keys) await writeFile(resolve(work,`writers/${key}/structure-check.json`),JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(record));
process.exitCode=record.issues.some(i=>i.level==='error')?1:0;
