'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const code=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
for(const p of ['patrol-ui.js','doorman-ui.js','orderly-ui.js']){
 const source=code(p);
 assert.ok(source.includes('S.dayRemaining<=seconds'),p+' must block tasks finishing at phase boundary');
 assert.ok(!source.includes('S.dayRemaining<seconds'),p+' cannot use old loose cutoff');
}
assert.ok(code('patrol-ui.js').includes("id:'patrol:'+result.record.id+':filed'"));
assert.ok(code('doorman-ui.js').includes("id:'doorman:'+result.log.id+':paid'"));
assert.ok(code('orderly-ui.js').includes("id:'ward:'+result.log.id+':file'"));
console.log('PASS strict duty cutoffs and confirmed lifetime records for Sam, Eli and Edmund');
