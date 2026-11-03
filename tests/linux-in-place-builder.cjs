'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const script=path.join(__dirname,'..','scripts','build-from-github.py');
const text=fs.readFileSync(script,'utf8');
assert(!text.includes('ARCHIVES ='),'must not create persistent Archives directory');
assert(!text.includes('capital-source-before-build-'),'no automatic historical backup tarballs');
assert(!text.includes('Saving original source backup'),'no old backup prompts or work');
assert(text.includes('with tempfile.TemporaryDirectory('),'must stage transient build input');
assert(text.includes('old = temp / "old-source"'),'keep safe temporary failure rollback');
assert(text.includes('Source copy failed; restoring original source.'),'preserve rollback');
assert(text.includes('os.replace(staging / name, target)'),'replace inside existing project');
assert(text.includes('env["GIT_TERMINAL_PROMPT"] = "0"'),'no Git password prompts');
const python=[
'import importlib.util, tempfile, pathlib',
'spec=importlib.util.spec_from_file_location("ccbuilder", "scripts/build-from-github.py")',
'm=importlib.util.module_from_spec(spec)',
'spec.loader.exec_module(m)',
'with tempfile.TemporaryDirectory() as temporary:',
'    temp=pathlib.Path(temporary)',
'    m.ROOT=temp/"project"',
'    m.ROOT.mkdir()',
'    (m.ROOT/"source.js").write_text("previous version")',
'    staged=temp/"stage"',
'    staged.mkdir()',
'    (staged/"source.js").write_text("current version")',
'    m.synchronize(staged,["source.js"],temp)',
'    assert (m.ROOT/"source.js").read_text()=="current version"',
'    assert not (temp/"DKLab"/"Archives").exists()'
].join('\\n');
const r=cp.spawnSync('python3',['-c',python],{cwd:path.join(__dirname,'..'),encoding:'utf8',timeout:15000});
assert.equal(r.status,0,(r.stderr||r.stdout||r.error?.message||'Python updater test failed').slice(0,3000));
console.log('Linux updater PASS: in-place source replacement with ephemeral rollback and zero permanent backup archives');