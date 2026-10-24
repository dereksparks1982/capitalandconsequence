'use strict';
const assert=require('node:assert/strict'),law=require('../gambling-law.js');
for(const venueId of ['working-poker','commerce-poker','embassy-poker','lui-club','horse-racing','dog-racing','midget-car-racing','boxing-wagers','private-fights']){
 const r=law.classify({venueId,game:'texas-holdem',eventKind:'regular',date:'1878-01-02'});
 assert.equal(r.allowed,true);assert.equal(r.legal,false);
}
assert.equal(law.classify({venueId:'star'}).allowed,false);
const official={venueId:'dc-poker-challenge',game:'five-card',eventKind:'tournament',tournamentId:'dc-poker-challenge-1878-01',eventId:'final',date:'1878-01-28'};
assert.equal(law.classify(official).legal,true);
for(const mutation of [{game:'texas-holdem'},{venueId:'embassy-poker'},{eventKind:'regular'},{tournamentId:'dc-poker-challenge-1878-02'},{date:'1878-02-29'},{eventId:''}]){
 assert.equal(law.classify({...official,...mutation}).legal,false,JSON.stringify(mutation));
}
assert.equal(law.classify({venueId:'nonexistent'}).allowed,false);
console.log('PASS government gambling permits, unauthorized social poker and tournament-only five-card permission');
