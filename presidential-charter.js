/* Alternate federal charter: national popular-vote presidential elections
 * every ten years, without a limit on successful reelections.
 * Actual U.S. history had four-year terms; this is an invented constitutional rule.
 * Election results after Tilden's 1876 victory belong to the simulation.
 */
(function(root){'use strict';
const CHARTER=Object.freeze({
 termYears:10,
 maxTerms:null,
 reelectionAllowed:true,
 electoralCollege:false,
 electorate:'nationwide popular vote',
 firstKnownElectionYear:1876,
 firstKnownWinner:'Samuel J. Tilden',
 firstInauguration:'1877-03-04',
 nextElectionYear:1886,
 nextInauguration:'1887-03-04'
});
function electionYear(n){if(!Number.isSafeInteger(n)||n<0||n>100)throw Error('Invalid election index');return 1876+n*CHARTER.termYears}
function scheduledElection(year){return Number.isSafeInteger(year)&&year>=1876&&(year-1876)%CHARTER.termYears===0}
function scheduledTerm(year){if(!scheduledElection(year))throw Error('Not a scheduled presidential election year');return {electionYear:year,begin:(year+1)+'-03-04',end:(year+11)+'-03-04',years:10}}
function electionDue(date){if(typeof date!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))throw Error('Date required');return scheduledElection(Number(date.slice(0,4)))}
const api=Object.freeze({CHARTER,electionYear,scheduledElection,scheduledTerm,electionDue});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_PRESIDENTIAL_CHARTER=api;
})(typeof window!=='undefined'?window:globalThis);
