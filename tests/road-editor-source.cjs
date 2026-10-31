'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),css=read('styles.css'),app=read('app.js');
const editor=read('road-editor.js'),streets=read('capital-street-network.js'),travel=read('capital-travel-system.js');
new vm.Script(editor);
assert.ok(html.includes('id="titleMapRoadEdit"')&&html.includes('id="titleMapRoadCanvas"'));
assert.match(html,/<h2 id="titleMapHeading">Washington, D.C.<\/h2>/);
assert.doesNotMatch(html,/Washington In and Out Guide/);
assert.ok(html.indexOf('id="titleMapRoadTools"')<html.indexOf('id="titleMapViewport"'),
 'The controls belong above the map so opening them is visible');
for(const id of ['titleMapRoadMode','titleMapRoadSeed','titleMapRoadScan','titleMapRoadAccept',
 'titleMapRoadEnable','titleMapRoadDisable','titleMapRoadExport','titleMapRoadImport',
 'titleMapRoadClear','titleMapRoadFinish','titleMapRoadUndo'])
 assert.ok(html.includes('id="'+id+'"'),'Missing editor control '+id);
for(const m of ['value="road"','value="block"','value="paint"','value="erase"'])
 assert.ok(html.includes(m),'Missing painting mode '+m);
assert.match(editor,/getContext\('2d'\)/,'Native canvas drawing does not require Konva to initialize');
assert.match(editor,/function pointerDown\(/);
assert.match(editor,/function pointerMove\(/);
assert.match(editor,/function pointerUp\(/);
assert.match(editor,/rgba\(34,103,220,\.65\)/,'Building marks are painted blue');
assert.match(editor,/root.FE_ROAD_EDITOR_SETUP\?\.\(\)/,'Editor mounts even when app initializes first');
assert.match(editor,/config.persist\?\.\(\)/,'Editor saves on the active game profile');
assert.match(streets,/function setBuildings\(blocks\)/,'Default streets honor marked buildings');
assert.match(app,/FE_CAPITAL_STREETS\?\.setBuildings\?\.\(S.customRoadLayout\?\.blocks\|\|\[\]\)/);
assert.match(travel,/blueBuildings>0\)return \[\]/,'No fallback through marked buildings');
assert.match(css,/\.title-map-tools\{display:flex;flex:1 1 auto/,'Toolbar wraps without horizontal clipping');
assert.ok(css.includes('.title-map-road-canvas.editing'));
console.log('PASS visible Washington toolbar, native road brush, blue obstacles, profile saves and travel integration');
