export const relationalJourneys = [
 {name: 'Build a new application', ids: ['RL76','RL77','RL78','RL79','RL81','RL84','RL85','RL90','RL93','RL104'], branches: [{name:'PostgreSQL',ids:['RL110']},{name:'CockroachDB',ids:['RL123','RL124']}]},
 {name: 'Explain a wrong result', ids: ['RL81','RL78','RL82','RL83'], branches: []},
 {name: 'Repair a slow endpoint', ids: ['RL87','RL86','RL102'], branches: [{name:'PostgreSQL',ids:['RL113']},{name:'CockroachDB',ids:['RL126']}]},
 {name: 'Protect concurrent work', ids: ['RL79','RL90','RL91','RL93','RL94'], branches: [{name:'Distributed transactions and CockroachDB',ids:['RL106','RL124']}]},
 {name: 'Recover accepted work', ids: ['RL95','RL96'], branches: [{name:'PostgreSQL',ids:['RL115','RL116']},{name:'CockroachDB',ids:['RL129']}]},
 {name: 'Keep a service available', ids: ['RL97','RL98'], branches: [{name:'PostgreSQL physical replicas',ids:['RL117']},{name:'CockroachDB cluster operation',ids:['RL128']}]},
 {name: 'Change an application schema', ids: ['RL100'], branches: [{name:'PostgreSQL',ids:['RL119']},{name:'CockroachDB',ids:['RL130']}]},
 {name: 'Upgrade an installed version', ids: [], branches: [{name:'PostgreSQL',ids:['RL122']},{name:'CockroachDB',ids:['RL131']}]},
 {name: 'Move the application to another installation', ids: [], branches: [{name:'PostgreSQL native routes',ids:['RL122']},{name:'Moving to CockroachDB',ids:['RL132']}]},
 {name: 'Decide whether to distribute', ids: ['RL105','RL106','RL107','RL108','RL109'], branches: [{name:'CockroachDB implementation',ids:['RL123','RL124','RL125','RL127','RL128']}]},
 {name: 'Investigate an incident', ids: ['RL103'], branches: [{name:'PostgreSQL',ids:['RL120']},{name:'CockroachDB',ids:['RL128']}]},
];
