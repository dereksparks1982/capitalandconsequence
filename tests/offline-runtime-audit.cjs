'use strict';
const assert=require('node:assert/strict');
const {auditSource,auditHtml,auditRuntime}=require('../desktop/check-offline-runtime.cjs');
const links=[
 "const wiki='https://en.wikipedia.org/wiki/Barry_Farm';",
 'const loc="https://www.loc.gov/search/?q=Washington";',
 "readingLink('Historic archive', 'https://en.wikipedia.org/wiki/Barry_Farm');"
].join('\n');
assert.deepEqual(auditSource('historical.js',links),[],'Optional historical hyperlinks do not require the network');
for(const [label,body] of [
 ['fetch',"fetch('https://example.com/data.json')"],
 ['xhr','new XMLHttpRequest()'],
 ['websocket',"new WebSocket('ws://localhost:3000')"],
 ['eventsource',"new EventSource('/feed')"],
 ['media assignment',"audio.src='https://example.com/sound.mp3'"],
 ['media constructor',"new Audio('https://example.com/sound.mp3')"],
 ['css import',"@import url('https://example.com/style.css');"],
 ['css image','body{background:url("https://example.com/pic.png")}']
]){
 assert.ok(auditSource('game.js',body).length>0,'Network loading blocked: '+label);
}
assert.deepEqual(auditHtml('<script src="app.js?v=1"></script><link href="styles.css"><img src="assets/artwork/maps/title-map-1938.jpg">'),[]);
for(const tag of [
 '<script src="https://example.com/runtime.js"></script>',
 '<link rel="stylesheet" href="https://example.com/style.css">',
 '<audio src="https://example.com/background.mp3"></audio>',
 '<img src="https://example.com/picture.jpg">'
])assert.ok(auditHtml(tag).length,'Remote HTML resource rejected: '+tag);
assert.deepEqual(auditRuntime(),[],'Current game supports offline gameplay and optional historical links');
console.log('Offline runtime network classification: passed.');
