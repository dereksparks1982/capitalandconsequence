'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),code=fs.readFileSync(path.join(root,'build-linux.sh'),'utf8');
assert.ok(code.includes('asar.extractAll(archive,dir)'));
assert.ok(code.includes('await asar.createPackage(dir,candidate)'));
assert.ok(code.includes('fs.renameSync(candidate,archive)'));
assert.ok(code.includes('asar.extractFile(candidate,file)'));
for(const f of ['peacock-debts.js','peacock-network.js','wardman-escape.js','wardman-estate-police.js'])
 assert.ok(code.includes(f),'New chapter must be included: '+f);
assert.ok(code.includes("['assets','radio','vendor']"));
assert.ok(!/^\s*set\s+-e(?:\s|$)/m.test(code),'The update shell script must not enable exit-on-error');
assert.ok(!code.includes('git clone'));
console.log('PASS existing executable in-place full-source update script');
