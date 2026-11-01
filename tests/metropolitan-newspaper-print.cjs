'use strict';
/* Regression: actual Metropolitan Ledger broadsheet retains every feed and
 * archived issue is a readable frozen issue, not a duplicate live dashboard. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'newspaper-print.css'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const section=html.slice(html.indexOf('<section id="news"'),html.indexOf('<section id="notebook"'));
assert.ok(section.startsWith('<section id="news"'),'newspaper section exists');
assert.match(section,/metropolitan-masthead/,'masthead is visible');
assert.match(section,/THE METROPOLITAN LEDGER/,'original paper title');
assert.match(section,/metropolitan-dateline/,'publication date is visible');
assert.match(section,/metropolitan-lead/,'lead headline present');
assert.match(section,/metropolitan-columns/,'column layout present');
for(const id of ['paperDate','headline','story','marketStory','societyStory','sportsStory',
 'washingtonPublicDispatches','archiveEdition','newsArchive','metropolitanEditionNumber',
 'metropolitanArchivePreview','metropolitanArchiveClose']){
 assert.equal((section.match(new RegExp('id="'+id+'"','g'))||[]).length,1,
  id+' must occur exactly once in the newspaper');
}
assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'three narrow news columns');
assert.match(css,/@media print/,'print-friendly edition');
assert.match(css,/@media\(max-width:760px\)/,'small windows must show the article');
assert.match(app,/function openArchivedIssue\(index\)/,'readable prior edition');
assert.match(app,/S\.newsArchive\[index\]/,'archive draws from saved data');
assert.match(app,/\.textContent=item\./,'archived text uses safe textContent');
assert.match(app,/financial:'Federal Exchange index stood at '/,
 'future editions preserve a snapshot instead of today's market wire');
assert.match(html,/newspaper-print\.css\?v=/,'paper stylesheet loaded');
console.log('PASS 1878 Metropolitan Ledger front page, archive and layout source contracts');
