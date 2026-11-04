'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const script=path.join(__dirname,'..','scripts','build-from-github.py');
const text=fs.readFileSync(script,'utf8');
assert(text.includes('TREE_URL')&&text.includes('source_manifest()'),
 'Updater must check tracked GitHub files, not download an archive.');
assert(!text.includes('main.zip')&&!text.includes('prepare_zip('),
 'Updater must never download a ZIP of the source repository.');
assert(!text.includes('old-source')&&!text.includes('copy2('),
 'Owner requested no source backup folders or rollback clones.');
assert(text.includes('git_blob_sha(destination) != entry["sha"]'),
 'Verify downloaded files before replacing game source.');
assert(text.includes('with tempfile.TemporaryDirectory('),
 'Source staging must be transient and inside the existing installation.');
assert(text.includes('os.replace(staging / name, target)'),
 'Updates must replace source in the EXISTING project.');
assert(text.includes('env["GIT_TERMINAL_PROMPT"] = "0"'),
 'Never ask Git for a password.');
const py=[
'import importlib.util, tempfile, pathlib, hashlib',
'spec=importlib.util.spec_from_file_location("ccbuilder", "scripts/build-from-github.py")',
'm=importlib.util.module_from_spec(spec)',
'spec.loader.exec_module(m)',
'with tempfile.TemporaryDirectory() as temporary:',
'    temp=pathlib.Path(temporary)',
'    m.ROOT=temp/"project"',
'    m.ROOT.mkdir()',
'    (m.ROOT/"source.js").write_text("previous version")',
'    stage=temp/"stage"',
'    stage.mkdir()',
'    (stage/"source.js").write_text("current version")',
'    assert m.git_blob_sha(stage/"source.js")==hashlib.sha1(b"blob 15\\0current version").hexdigest()',
'    m.synchronize(stage,["source.js"])',
'    assert (m.ROOT/"source.js").read_text()=="current version"',
'    assert not (temp/"old-source").exists()',
'    assert not (temp/"DKLab"/"Archives").exists()'
].join('\n');
const test=cp.spawnSync('python3',['-c',py],{cwd:path.join(__dirname,'..'),
 encoding:'utf8',timeout:15000});
assert.equal(test.status,0,(test.stderr||test.stdout||test.error?.message||'Python updater test failed').slice(0,3000));
console.log('Linux updater PASS: hash-checked changed blobs, no ZIP, no backups, in-place source replacement');
