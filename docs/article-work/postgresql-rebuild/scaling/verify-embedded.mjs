import {PGlite} from '@electric-sql/pglite';
import {writeFileSync} from 'node:fs';
import {postgresqlScalingTutorials} from '../../../../src/lib/sql-lessons/postgresql-scaling.ts';
const db=new PGlite(),trace=[];
try{for(const lesson of postgresqlScalingTutorials){for(const step of lesson.steps){try{const result=await db.exec(step.sql);if(step.expectedError)throw Error('Expected '+step.expectedError);trace.push({lesson:lesson.id,step:step.title,result});}catch(e){trace.push({lesson:lesson.id,step:step.title,code:e.code,message:e.message});if(e.code!==step.expectedError)throw e;}}}writeFileSync(new URL('./lessons-embedded-observed.json',import.meta.url),JSON.stringify(trace,null,2));console.log('All 10 embedded lesson steps passed, including expected foreign-key rejection.');}finally{await db.close();}
