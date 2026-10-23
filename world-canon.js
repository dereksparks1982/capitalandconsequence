/* Curated alternate Washington knowledge. This is NOT the future-history oracle.
 * History gates are explicit. Unapproved future presidents remain undecided.
 */
(function(root){
 'use strict';
 function forDate(iso){
  if(typeof iso!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(iso))throw Error('Valid game date required');
  const year=Number(iso.slice(0,4));
  const common=[
   'This is a fictional post-Civil-War United States organized into purpose-based districts instead of states.',
   'After the 1861–1865 Civil War the Electoral College was abolished. Presidents are elected only by nationwide popular vote.',
   'Washington, District of Columbia, is the federal capital; exact national district borders are still unsettled.',
   'No character knows events from later than the provided in-game date.'
  ];
  const context=year===1878?[
   'Working alternate-history canon for 1878: Samuel J. Tilden won the 1876 nationwide popular vote and is president. This is deliberately different from actual history.',
   'The present date is in 1878. No resident can cite a later election result as something that already happened.'
  ]:year<1878?[
   'The president for this earlier fictional date has not been established. Do not invent one.'
  ]:[
   'The presidency for this date after 1878 has NOT been established in game canon. Do not give a specific incumbent unless the game supplies a later curated fact.',
   'The outcome of the 1880 election and all later fictional presidential elections is currently undecided.'
  ];
  return {date:iso,year,lines:[...common,...context]};
 }
 const api=Object.freeze({forDate});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORLD_CANON=api;
})(typeof window!=='undefined'?window:globalThis);
