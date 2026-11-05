'use strict';
/* Standalone test-center contract: no career engine, original room art and 32px core. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(dir,p),'utf8');
const html=read('test-center.html'),src=read('test-center.js'),css=read('test-center.css');
assert(html.includes('<canvas id="room" width="512" height="512"'));
assert(html.includes('test-center.js'));
assert(html.indexOf('room-builder-core.js')<html.indexOf('test-center.js'));
assert(html.indexOf('room-builder-kit.js')<html.indexOf('test-center.js'));
for(const id of ['walkMode','editMode','room','tool','category','palette','save','load','new','export','import','undo','redo','rotate','duplicate','remove','inspect'])assert(html.includes('id="'+id+'"'),'Missing control '+id);
assert(!html.includes('app.js')&&!html.includes('career-shell.js'),'Standalone branch must not launch career systems');
assert(!src.includes('ccRoomLayoutV1')&&!src.includes('ccRoomBlueprintLibraryV1'),'Never write live game layout keys');
assert(src.includes("dkSoftworks.testCenter.room.v1"),'Separate test storage key required');
assert(src.includes("C.makeRoom(LOC,ROOM,16,16)"),'Square test room must be 16×16');
assert(src.includes("C.walk(room,player,dx,dy)"),'Use tested collision walking');
assert(src.includes("C.path(room,player,p)"),'Click-to-walk must check path');
assert(src.includes("K.apply(room,"),'Use original atomic tile editing');
assert(src.includes("C.sanitize(JSON.parse("),'Imported / saved rooms must be validated');
assert(src.includes("drawSprite(g,C.asset('charles_'+facing)"),'Use static original character directions');
assert(!/requestAnimationFrame\s*\(|setInterval\s*\(/.test(src),'No continuous frame animation');
assert(css.includes('image-rendering:pixelated'),'Original pixel art must remain sharp');
new vm.Script(src,{filename:'test-center.js'});
const scope={window:{},globalThis:{},module:{exports:{}},Math,Date};
for(const f of ['room-builder-catalog.js','room-builder-core.js','room-builder-kit.js'])vm.runInNewContext(read(f),scope,{filename:f});
const C=scope.window.FE_ROOM_BUILDER_CORE,K=scope.window.FE_ROOM_BUILDER_KIT;
assert.equal(scope.window.FE_ROOM_CATALOG.length,69);
const room=C.makeRoom('test-center','room-01',16,16);
assert.equal(room.widthTiles,room.heightTiles);
assert.equal(C.blocked(room,0,0),true);
assert.equal(C.walk(room,{x:8,y:13},0,1).y,14);
assert(C.place(room,'desk_oak',6,6));
assert.equal(C.walk(room,{x:6,y:5},0,1).y,5);
assert(K.apply(room,'rectangle','floors','floor_rug_red',2,2,4,4).ok);
assert(C.path(room,{x:8,y:13},{x:8,y:10})!==null);
const saved=JSON.parse(JSON.stringify(room));
assert.equal(C.sanitize(saved,'test-center','room-01').objects.length,1);
assert.throws(()=>C.sanitize(saved,'factory','executive-office'),'Test layout cannot load as approved office');

// Check actual copied third-party sprite files and isolated runtime catalog.
assert(html.includes('test-center-vendor-assets.js')&&html.includes('id="artPack"'));
assert(src.includes('THIRD_PARTY')&&src.includes('imageFor(sprite)'));
vm.runInNewContext(read('test-center-vendor-assets.js'),scope,{filename:'test-center-vendor-assets.js'});
assert.equal(scope.window.FE_ROOM_CATALOG.length,79);
for(const sprite of scope.window.FE_ROOM_CATALOG.filter(s=>s.source_image)){
 const bytes=fs.readFileSync(path.join(dir,sprite.source_image));
 assert.equal(bytes.subarray(1,4).toString('ascii'),'PNG','Missing PNG: '+sprite.source_image);
 assert(C.asset(sprite.id));
}
const trial=C.makeRoom('test-center','room-01',16,16);
assert(C.place(trial,'pp_berth',3,3));
assert(C.paint(trial,2,2,'ss14_plating'));
assert(C.sanitize(trial,'test-center','room-01'));

console.log('PASS DK Architect test center: standalone, 69 sprites, square room, static walk/collision, editor, isolated save/export');
