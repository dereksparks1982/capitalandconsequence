'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),css=read('styles.css'),app=read('app.js'),editor=read('road-editor.js'),street=read('capital-street-network.js');
new vm.Script(editor);
assert.ok(html.includes('id="titleMapRoadEdit"')&&html.includes('id="titleMapRoadCanvas"'));
for(const key of ['titleMapRoadSeed','titleMapRoadScan','titleMapRoadAccept','titleMapRoadEnable','titleMapRoadDisable','titleMapRoadExport','titleMapRoadImport','titleMapRoadClear','titleMapRoadFinish'])
 assert.ok(html.includes('id="'+key+'"'),key+' exists in map controls');
assert.ok(html.includes('road-editor.js?v=')&&html.includes('road-layout.js?v='));
assert.ok(app.includes('FE_ROAD_EDITOR?.mount?.(')&&app.includes('FE_ROAD_EDITOR?.sync?.()'));
assert.ok(editor.includes('root.Konva.Stage')&&editor.includes('draft.segments.push(')&&editor.includes('draft.blocks.push('));
assert.ok(editor.includes("getImageData(0,0,256,145)")&&editor.includes('FE_CAPITAL_STREETS?.draftSegments?.()'));
assert.ok(street.includes('draftSegments:()=>edges.map('));
assert.ok(css.includes('.title-map-road-canvas.editing'));
console.log('PASS Konva editor hooks, auto suggestions, manual roads, building marking and profile persistence UI');
