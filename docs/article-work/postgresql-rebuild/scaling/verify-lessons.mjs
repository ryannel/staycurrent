import pg from '/private/tmp/staycurrent-pg-lab/node_modules/pg/lib/index.js';
import {writeFileSync} from 'node:fs';
import {postgresqlScalingTutorials} from '../../../../src/lib/sql-lessons/postgresql-scaling.ts';
const config={host:'/private/tmp/staycurrent-pg-rebuild/socket',port:55438,user:'ryannel',database:'postgres'};
const admin=new pg.Client(config);await admin.connect();
if(!(await admin.query("SELECT 1 FROM pg_database WHERE datname='pg_scaling_lab'")).rowCount)await admin.query('CREATE DATABASE pg_scaling_lab');
await admin.end();
const c=new pg.Client({...config,database:'pg_scaling_lab'});await c.connect();const results=[];
try {for(const lesson of postgresqlScalingTutorials){for(const step of lesson.steps){try{const r=await c.query(step.sql);if(step.expectedError)throw Error('Expected '+step.expectedError);results.push({lesson:lesson.id,step:step.title,result:Array.isArray(r)?r.map(x=>({command:x.command,rows:x.rows})):r.rows});}catch(e){results.push({lesson:lesson.id,step:step.title,code:e.code,message:e.message});if(e.code!==step.expectedError)throw e;}}}
writeFileSync(new URL('./lessons-server-observed.json',import.meta.url),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));}finally{await c.end();}
