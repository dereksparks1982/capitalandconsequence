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
   'After the 1861–1865 Civil War the Electoral College was abolished. Presidents are elected only by nationwide popular vote for TEN-YEAR terms, with NO LIMIT on reelection.',
   'Washington, District of Columbia, is the federal capital; exact national district borders are still unsettled.',
   'No character knows events from later than the provided in-game date.'
  ];
  const context=iso>='1877-03-04'&&iso<'1887-03-04'?[
   'In this alternate timeline, Samuel J. Tilden won the 1876 nationwide popular vote and is president during his first ten-year term. This differs from real history.',
   'Tilden was inaugurated on March 4, 1877 for a ten-year term scheduled through March 4, 1887. The next regular election is 1886; later election winners and any intervening succession depend on the simulation.'
  ]:iso<'1877-03-04'?[
   'The president for this earlier fictional date has not been established. Do not invent one.'
  ]:[
   'The presidency for this date after 1878 has NOT been established in game canon. Do not give a specific incumbent unless the game supplies a later curated fact.',
   'There is NO presidential election in 1880 in this timeline. After 1876, regular presidential elections occur every TEN years: 1886, 1896, and so on; outcomes remain undecided.'
  ];
  return {date:iso,year,lines:[...common,...context]};
 }
 const api=Object.freeze({forDate});
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.FE_WORLD_CANON=api;
})(typeof window!=='undefined'?window:globalThis);
