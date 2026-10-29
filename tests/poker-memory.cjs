'use strict';
const assert=require('node:assert/strict');
const memory=require('../poker-memory.js');
const save={};
assert.equal(memory.remember(save,'session-1','working',
 [{name:'Mickey Dunn',hands:12,raises:11,folds:1,calls:2},
  {name:'Joe Rourke',hands:12,folds:9,calls:1,raises:1},
  {name:'Counterfeit NPC',hands:400,raises:400}],
 {hands:12,raises:9,calls:3,folds:2},12),true);
assert.equal(memory.remember(save,'session-1','working',[],{},12),false,
 'Same authorized session must never be counted twice');
assert.equal(memory.summary(save,'working','Mickey Dunn').trait,'Often raises');
assert.equal(memory.summary(save,'working','Joe Rourke').trait,'Often folds');
assert.equal(memory.summary(save,'working','Counterfeit NPC'),null);
assert.equal(memory.summary(save,'elite','Mickey Dunn'),null,'Different rooms cannot leak relationships');
assert.equal(memory.playerHabits(save,'working').raises,9);
assert.equal(memory.playerHabits(save,'middle').raises,0);
assert.equal(memory.remember(save,'session-2','working',
 [{name:'Mickey Dunn',raises:3,hands:3},
  {name:'Mickey Dunn',raises:999,hands:999}],{},3),true);
assert.equal(memory.summary(save,'working','Mickey Dunn').raises,14,
 'Duplicated opponent rows must not inflate observed statistics');
const json=JSON.stringify(save.pokerMemory);
assert.equal(json.includes('hole'),false);
assert.equal(json.includes('deck'),false);
assert.equal(json.includes('handRank'),false);
console.log('PASS player and patron public memory, traits, duplicate guards and no private-card leaks');
