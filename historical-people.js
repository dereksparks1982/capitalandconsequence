/* Real identities and distinct fictional appointments. A listed person
 * is not automatically physically present at any hotel or poker table. */
(function(root){'use strict';
const PEOPLE=Object.freeze([
 {id:'samuelTilden',name:'Samuel J. Tilden',history:'1876 Democratic presidential candidate',fiction:'President in alternate timeline; 1877–1887 first term',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'thomasHendricks',name:'Thomas A. Hendricks',history:'Tilden’s 1876 vice-presidential running mate',fiction:'Proposed alternate vice president; not yet appointed',status:'proposed',source:'https://www.senate.gov/'},
 {id:'abramHewitt',name:'Abram S. Hewitt',history:'Politician and Tilden campaign associate',fiction:'Proposed adviser; not yet appointed',status:'proposed',source:'https://bioguide.congress.gov/'},
 {id:'johnBigelow',name:'John Bigelow',history:'Former diplomat and Tilden correspondent',fiction:'Proposed diplomatic adviser',status:'proposed',source:'https://old-digitalcollections.nypl.org/collections/samuel-j-tilden-papers'},
 {id:'mantonMarble',name:'Manton Marble',history:'Newspaper editor and Tilden correspondent',fiction:'Proposed press adviser',status:'proposed',source:'https://old-digitalcollections.nypl.org/collections/samuel-j-tilden-papers'},
 {id:'danielManning',name:'Daniel Manning',history:'New York Democratic organizer and Tilden correspondent',fiction:'Proposed political/Treasury adviser',status:'proposed',source:'https://old-digitalcollections.nypl.org/collections/samuel-j-tilden-papers'},
 {id:'jamesWormley',name:'James Wormley',history:'Black proprietor of Wormley’s Hotel, 15th and H Streets NW',fiction:'Potential hotel NPC; hotel not yet a mapped destination',status:'proposed',source:'https://www.whitehousehistory.org/wormley-hotel-1'},
 {id:'frederickDouglass',name:'Frederick Douglass',history:'Writer, abolitionist and public official',fiction:'Alternate government appointment undecided',status:'proposed',source:'https://www.nps.gov/'},
 {id:'edwinBooth',name:'Edwin Booth',history:'Shakespearean actor',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'josephJefferson',name:'Joseph Jefferson',history:'Actor famous for Rip Van Winkle',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'johnMcCullough',name:'John McCullough',history:'Stage tragedian',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'claraMorris',name:'Clara Morris',history:'American dramatic actress',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'johnTRaymond',name:'John T. Raymond',history:'Comic stage actor',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'charlesHanford',name:'Charles B. Hanford',history:'Young actor, whose actual Washington move was later than 1878',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'},
 {id:'williamRapley',name:'William W. Rapley',history:'National Theatre owner and manager',fiction:'Permanent resident of 1878 Washington and active local National Theatre personality in the game’s alternate history',status:'implemented-NPC',source:'https://www.loc.gov/'}
].map(x=>Object.freeze(x)));
const get=id=>{const p=PEOPLE.find(v=>v.id===id);return p?{...p}:null};
const list=()=>PEOPLE.map(x=>({...x}));
const api=Object.freeze({version:1,get,list});
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.FE_HISTORICAL_PEOPLE=api;
})(typeof window!=='undefined'?window:globalThis);
