'use strict';
const assert=require('node:assert/strict'),b=require('../championship-register.js'),e=require('../championships.js');
const S={gameDate:'1878-01-02',sportsChampionships:{champions:{horse:{name:'2',month:'1878-01'},boxing:{name:'4',month:'1878-01'}},
 titleHistory:[{sport:'horse',name:'2',month:'1878-01'}],tournaments:{}},
 racing:{roster:[{id:2,name:'Silver Comet'}]},boxing:{roster:[{id:4,name:'Tommy Keane'}]},
 dogRacing:{roster:[{id:1,name:'Fleet Shadow'}]},
 midgetCarRacing:{roster:[{id:1,name:'Red Comet',driver:'Eddie Marsh'}]}};
let rows=b.summary(S,S.gameDate,e);
assert.equal(rows.length,3,'1878 shows horse, boxing and potential poker, not future sports');
assert.equal(rows.find(x=>x.sport==='horse').champion,'Silver Comet');
assert.equal(rows.find(x=>x.sport==='boxing').champion,'Tommy Keane');
assert.equal(rows.find(x=>x.sport==='poker').champion,null);
S.gameDate='1938-01-02';S.sportsChampionships.champions.car={name:'1',month:'1937-12'};
rows=b.summary(S,S.gameDate,e);
assert.equal(rows.length,5);
assert.equal(rows.find(x=>x.sport==='car').champion,'Red Comet · Eddie Marsh');
const before=JSON.stringify(S);
b.summary(S,S.gameDate,e);assert.equal(JSON.stringify(S),before,'title register is read-only');
console.log('PASS visible D.C. champions register, saved titleholder names and historical availability');
