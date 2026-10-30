#!/usr/bin/env python3
"""Update the existing Capital & Consequence Linux Electron app from public main.

Downloads only runtime files differing from resources/app.asar. No sudo, SSH,
password, GitHub Actions, new executable, user save edits, or changes to the
approved original Washington map.
"""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request

REPO = 'dereksparks1982/capitalandconsequence'
API = f'https://api.github.com/repos/{REPO}'
UA = 'capital-consequence-asar-inplace/1.0'
EXTRACT = """
const path=require('node:path'),asar=require('@electron/asar');
asar.extractAll(path.resolve(process.argv[1]),path.resolve(process.argv[2]));
"""
PACK = """
const path=require('node:path'),fs=require('node:fs'),asar=require('@electron/asar');
(async()=>{
 const source=path.resolve(process.argv[1]),output=path.resolve(process.argv[2]);
 await asar.createPackage(source,output);
 if(fs.statSync(output).size<10000)throw Error('Archive is unexpectedly small');
 for(const rel of ['index.html','app.js','tabletop-chess.js',
                   'tabletop-chess-ui.js','vendor/chessjs/chess.js',
                   'vendor/chessjs/LICENSE']){
  const data=asar.extractFile(output,rel);
  if(!data||!data.length)throw Error('Archive verification failed: '+rel);
 }
 console.log('New app.asar verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
"""

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'application/vnd.github+json'})
    with urllib.request.urlopen(req,timeout=90) as response:
        return response.read()

def sha(data):
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()

def included(rel):
    if rel in {'package.json','LICENSE','LEGAL.md','THIRD-PARTY-NOTICES.md',
               'desktop/main.cjs','desktop/preload.cjs','desktop/save-store.cjs',
               'desktop/npc-llm.cjs'}:
        return True
    if '/' not in rel and rel.endswith(('.js','.css','.html')):
        return True
    if rel.startswith(('vendor/','radio/')):
        return True
    if rel.startswith('assets/') and not rel.startswith('assets/artwork/maps/'):
        return True
    return False

def main():
    directory=Path.cwd().resolve()
    launcher=directory/'capital-consequence'
    archive=directory/'resources'/'app.asar'
    if not launcher.is_file() or not archive.is_file():
        raise RuntimeError('Expected existing capital-consequence and resources/app.asar in '+str(directory))
    if not (directory/'package.json').is_file():
        raise RuntimeError('Local package.json is missing. Nothing was changed.')
    if shutil.which('node') is None:
        raise RuntimeError('Node.js is required. Nothing was changed.')
    probe=subprocess.run(['node','-e',"require('@electron/asar')"],
                         cwd=directory,capture_output=True,text=True)
    if probe.returncode:
        raise RuntimeError('Local @electron/asar was not found. No files were changed.')
    print('Capital & Consequence: updating the EXISTING Linux app from GitHub main.')
    print('Original artwork, existing executable and player saves will be preserved.')
    branch=json.loads(fetch(API+'/branches/main'))
    commit=branch['commit']['sha']
    data=json.loads(fetch(API+'/git/trees/'+commit+'?recursive=1'))
    if data.get('truncated'):
        raise RuntimeError('The GitHub file list was truncated; refusing a partial update.')
    entries=[]
    for item in data['tree']:
        rel=item['path']
        if item['type']!='blob' or not included(rel):
            continue
        if Path(rel).is_absolute() or '..' in Path(rel).parts or '\\' in rel:
            raise RuntimeError('Unsafe repository path: '+rel)
        entries.append(item)
    print('Pinned main commit:',commit[:12])
    with tempfile.TemporaryDirectory(prefix='capital-game-update-') as temporary:
        staging=Path(temporary)
        unpacked=staging/'unpacked'
        ready=staging/'app.asar.next'
        subprocess.run(['node','-e',EXTRACT,str(archive),str(unpacked)],
                       check=True,cwd=directory)
        changed=[]
        for item in entries:
            existing=unpacked/item['path']
            if existing.is_file() and sha(existing.read_bytes())==item['sha']:
                continue
            changed.append(item)
        if not changed:
            print('Already up to date. No installed files changed.')
            return
        print('Fetching',len(changed),'changed/new runtime files (not the whole repo) ...')
        for index,item in enumerate(changed,1):
            rel=item['path']
            url='https://raw.githubusercontent.com/'+REPO+'/'+commit+'/'+urllib.parse.quote(rel,safe='/')
            content=fetch(url)
            if sha(content)!=item['sha']:
                raise RuntimeError('File hash mismatch; aborting before installation: '+rel)
            dest=unpacked/rel
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(content)
            if index==1 or index%20==0 or index==len(changed):
                print('  Downloaded',index,'of',len(changed))
        subprocess.run(['node','-e',PACK,str(unpacked),str(ready)],
                       check=True,cwd=directory)
        if not ready.is_file() or ready.stat().st_size<10000:
            raise RuntimeError('Replacement archive did not validate.')
        # /tmp may be on a different filesystem from resources/. A direct
        # os.replace across devices raises EXDEV. Copy the *validated* archive
        # into a temporary file on the destination filesystem, then rename
        # that local temporary file atomically over app.asar.
        target_temp=None
        try:
            with tempfile.NamedTemporaryFile(
                prefix='.app.asar-update-',suffix='.tmp',
                dir=archive.parent,delete=False
            ) as handle:
                target_temp=Path(handle.name)
                with ready.open('rb') as source:
                    shutil.copyfileobj(source,handle,1024*1024)
                handle.flush()
                os.fsync(handle.fileno())
            if target_temp.stat().st_size!=ready.stat().st_size:
                raise RuntimeError('Staged archive size mismatch; existing game preserved.')
            os.replace(target_temp,archive)
            target_temp=None
        finally:
            if target_temp is not None:
                target_temp.unlink(missing_ok=True)
        print('SUCCESS: existing game updated to main',commit[:12])
        print(len(changed),'runtime files updated inside resources/app.asar.')
        print('No new executable, no alternate project folder, no password, no GitHub Actions.')
        print('Launch the existing capital-consequence program normally.')

if __name__=='__main__':
    try:
        main()
    except (OSError,RuntimeError,ValueError,subprocess.CalledProcessError,urllib.error.URLError) as error:
        print('UPDATE FAILED:',error,file=sys.stderr)
        print('Your original app.asar has not been replaced unless validation succeeded.',file=sys.stderr)
        sys.exit(1)
