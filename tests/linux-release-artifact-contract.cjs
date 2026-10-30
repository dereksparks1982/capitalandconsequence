'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const p=require('../package.json'),s=fs.readFileSync(path.join(__dirname,'../scripts/verify-linux-distributions.cjs'),'utf8');
assert.equal(p.scripts['verify:linux:artifacts'],'node scripts/verify-linux-distributions.cjs');
assert.equal(p.build.directories.output,'.','all generated Linux deliverables belong in the existing main project folder');
assert.ok(s.includes('dist=root'),'packaged smoke runner finds files in main project folder');
for(const required of ['--smoke-test','FEDERAL_ELECTRIC_SMOKE_OK','XDG_CONFIG_HOME','APPIMAGE_EXTRACT_AND_RUN','.tar.gz','capital-consequence','fs.rmSync(temp'])
 assert.ok(s.includes(required),'Packaged distribution test must include '+required);
console.log('Linux artifact smoke test contract: passed.');
