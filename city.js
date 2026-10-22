/* Federal Electric Washington city registry.
   World/location data lives here instead of inside any one playable character's story.
   Character-specific discovery, access, invitations and consequences belong in gameplay state. */
(function(){
 'use strict';

 const LOCATIONS=[
  {
   id:'factory',
   name:'Federal Electric Factory',
   area:'Ivy City / New York Avenue NE near Fenwick Street',
   category:'company',
   radioContext:'office',
   description:'Federal Electric works and company offices in the northeast industrial corridor.',
   map:{n:1,x:.6150,y:.3830},
   defaultRoom:'executive-office',
   rooms:[
    {id:'executive-office',name:'Executive Office',description:'Federal Electric’s existing Washington office hub. The room registry can address it independently of any particular playable character.'}
   ]
  },
  {
   id:'star',
   name:'Star Club',
   area:'Surviving Hay-Adams houses · 16th and H Streets NW',
   category:'social',
   radioContext:'star',
   description:'A discreet private club operated by Madam Star, where businessmen, officials, gamblers and well-connected Washington figures may cross paths.',
   map:{n:2,x:.4000,y:.4530},
   defaultRoom:'star-room',
   rooms:[
    {id:'star-room',name:'Star Room',description:'Placeholder room shell for the Star Club. Final artwork and the club’s internal room layout have not been assigned yet.'}
   ]
  },
  {
   id:'races',
   name:'Capital Race Grounds',
   area:'Benning Race Track · Kenilworth Avenue and Jay Street NE',
   category:'sport',
   description:'The Capital Race Grounds horse-racing venue. Dog racing is registered at a separate kennel track.',
   map:{n:3,x:.8110,y:.4920},
   defaultRoom:'grounds',
   rooms:[
    {id:'grounds',name:'Race Grounds',description:'Placeholder room shell for the Capital Race Grounds. Final venue artwork and internal spaces remain future work.'}
   ]
  },
  {
   id:'workingPoker',
   name:'Neighborhood Game',
   area:'Colonial Village · northern Washington (provisional site)',
   category:'social',
   description:'The lower-stakes working-class poker room.',
   map:{n:4,x:.3930,y:.0900},
   defaultRoom:'card-room',
   rooms:[
    {id:'card-room',name:'Neighborhood Card Room',description:'Placeholder room shell for the lower-stakes neighborhood poker game.'}
   ]
  },
  {
   id:'commercePoker',
   name:'Commerce Club',
   area:'Washington-Hoover Airport · hangar, Arlington, Virginia',
   category:'social',
   description:'The Commerce Club meets once a week in an airport hangar for a pilots’ and businessmen’s poker game.',
   map:{n:5,x:.3000,y:.6460},
   defaultRoom:'club-room',
   rooms:[
    {id:'club-room',name:'Commerce Club Room',description:'Placeholder room shell for the Commerce Club. Final artwork and room arrangement remain unassigned.'}
   ]
  },
  {
   id:'embassyPoker',
   name:'Embassy Room',
   area:'Chevy Chase Club · 6100 Connecticut Avenue, Chevy Chase, Maryland',
   category:'social',
   description:'The invitation-only elite poker room serving wealthy and diplomatic Washington.',
   map:{n:6,x:.2430,y:.1600},
   defaultRoom:'embassy-room',
   rooms:[
    {id:'embassy-room',name:'Embassy Room',description:'Placeholder room shell for the invitation-only elite poker room.'}
   ]
  },
  {
   id:'oldChinatown',name:'Old Chinatown',
   area:'Old Chinatown · Pennsylvania Avenue NW, 4th–7th Streets',category:'social',
   description:'Shops and meeting places in Washington’s early Chinese-American neighborhood.',
   map:{n:7,x:.5080,y:.4890},defaultRoom:'market-street',
   rooms:[{id:'market-street',name:'Market Street',description:'A street of stores and small businesses. Artwork remains unassigned.'}],
   people:[
    {id:'li-wen',name:'Li Wen',language:'zh-Hant',dialogue:[
     '一月第四次營業日的早上，去商業俱樂部。那裡有人想買一批電燈泡。',
     '那位買主中午前就會離開華盛頓。'
    ]},
    {id:'chen-mei',name:'Chen Mei',language:'en',dialogue:[
     'This is a small neighborhood, but our merchants know their customers.',
     'Some visitors speak English. Others prefer their own language.'
    ]}
   ]
  },
  {
   id:'russianTradeHall',name:'Russian Trade Hall',
   area:'Dupont Circle · Massachusetts Avenue NW (proposed hall)',category:'social',
   description:'An informal meeting place for visiting engineers, merchants and diplomats of Imperial Russia.',
   map:{n:8,x:.3720,y:.3580},defaultRoom:'meeting-hall',
   rooms:[{id:'meeting-hall',name:'Meeting Hall',description:'A meeting hall for visiting Russian merchants, without finished artwork.'}],
   people:[
    {id:'pavel-orlov',name:'Pavel Orlov',language:'ru',dialogue:[
     'Во время третьего рабочего дня января на ипподроме появится посыльный с важным заказом.',
     'Он уедет до полудня. Если хотите получить заказ, приходите пораньше.'
    ]},
    {id:'anna-petrovna',name:'Anna Petrovna',language:'en',dialogue:[
     'I was born in Russia. Winter here is nothing compared with what I remember from the motherland.',
     'Not every visitor from Russia wishes to tell you about home.'
    ]}
   ]
  },
  {
   id:'washingtonFairgrounds',name:'D.C. World’s Fair',
   area:'National Mall · Smithsonian grounds (alternate-history exposition)',category:'fair',availableFrom:'1893-01-01',
   description:'The future grounds of the alternate-history 1893 World’s Columbian Exposition.',
   map:{n:9,x:.4700,y:.5660},defaultRoom:'fairgrounds',
   rooms:[{id:'fairgrounds',name:'Exposition Grounds',description:'A registered shell for the 1893 Washington fair. Exhibits and contests are not implemented yet.'}]
  },
  {
   id:'secondNightclub',name:'Second Nightclub',
   area:'Washington, D.C.',category:'social',
   description:'Another Washington social circle whose proprietor will contrast with Madam Star.',
   map:null,defaultRoom:'main-room',
   rooms:[{id:'main-room',name:'Main Room',description:'Reserved placeholder room. Name, owner and artwork remain undecided.'}]
  },
  {
   id:'capitolAirport',
   name:'Capitol Airport',
   area:'North of Benning Race Track · eastern Washington',
   category:'transport',
   description:'The Capitol Airport aviation site, separately chosen for the map; not the Washington-Hoover hangar used by Commerce Club.',
   map:{n:10,x:.8140,y:.3950},
   defaultRoom:'airport-office',
   rooms:[{id:'airport-office',name:'Airport Office',description:'Placeholder aviation office. Interior art and aviation activities are not yet assigned.'}]
  },
  {
   id:'universityMaryland',
   name:'University of Maryland',
   area:'College Park campus · Maryland',
   category:'education',
   description:'College Park campus and the player’s connections to its electrical engineering program.',
   map:{n:11,x:.7620,y:.0800},
   defaultRoom:'engineering-hall',
   rooms:[{id:'engineering-hall',name:'Engineering Hall',description:'Placeholder university room for research, professors, and electrical-engineering contacts.'}]
  },
  {
   id:'home',
   name:'Our Home',
   area:'Capitol Hill · near Eastern Market, 7th and C Streets SE (proposed)',
   category:'residence',
   description:'A modest middle-class brick rowhouse in Capitol Hill. The household and furnishings have not yet been decided.',
   map:{n:12,x:.6190,y:.5800},
   defaultRoom:'front-room',
   rooms:[
    {id:'front-room',name:'Front Room',description:'An unfurnished placeholder for the sitting room of the player’s Washington home.'},
    {id:'bedroom',name:'Bedroom',description:'A private room reserved for sleeping, dressing, and personal belongings. No furnishings assigned yet.'},
    {id:'kitchen',name:'Kitchen',description:'A household kitchen shell, awaiting period-accurate furnishings and domestic routines.'},
    {id:'storage',name:'Household Storage',description:'An addressable storage room. Personal possessions will remain here only when a storage system is implemented.'}
   ]
  },
  {"id":"potomacKennelTrack","name":"Potomac Kennel Track","area":"Washington region · exact site pending","category":"sport","description":"Dog-racing venue with a placeholder room; site under historical review.","map":null,"defaultRoom":"track-office","rooms":[{"id":"track-office","name":"Kennel Track","description":"An undecorated dog-racing location."}]},
  {"id":"capitalSpeedway","name":"Capital Speedway","area":"Washington region · later period","category":"sport","availableFrom":"1930-01-01","description":"Later-period motor racing venue, unavailable in 1890.","map":null,"defaultRoom":"grandstand","rooms":[{"id":"grandstand","name":"Grandstand","description":"Future motor sport room."}]},
  {"id":"licensedGamingHall","name":"Licensed Gaming Hall","area":"Washington, D.C. · undecided address","category":"gaming","plannedOnly":true,"description":"Proposed regulated game hall; the allowed games and site are not yet settled.","map":null,"defaultRoom":"gaming-floor","rooms":[{"id":"gaming-floor","name":"Gaming Floor","description":"Planning only."}]},
  {"id":"privateFightHall","name":"Private Prizefight Venue","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Invitation-only private fight location.","map":null,"defaultRoom":"private-ring","rooms":[{"id":"private-ring","name":"Private Ring","description":"Placeholder private venue."}]},
  {"id":"cockfightingDen","name":"Private Cockfighting Circle","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Hidden private contest venue.","map":null,"defaultRoom":"meeting-yard","rooms":[{"id":"meeting-yard","name":"Meeting Yard","description":"Placeholder private venue."}]},
  {"id":"blackwoodAsylum","name":"Blackwood Asylum (Working Concept)","area":"Washington region · site and governance not yet chosen","category":"institution","plannedOnly":true,"description":"Proposed fictional Victorian-era asylum and possible long-term investment or management venture; neither property rights nor admission policies have been established.","map":null,"defaultRoom":"superintendent-office","rooms":[{"id":"superintendent-office","name":"Superintendent Office","description":"Proposed future operating desk, not an open game location."},{"id":"patient-ward","name":"Patient Ward","description":"Proposed ward shell; confidential records and staffing await design."},{"id":"administration","name":"Administration","description":"Proposed financial and inspection recordkeeping."}]},
  {
   id:'whiteHouse',
   name:'White House',
   area:'1600 Pennsylvania Avenue NW',
   category:'government',
   description:'The Executive Mansion and seat of the presidency.',
   map:null,
   defaultRoom:'unassigned-room',
   rooms:[
    {id:'unassigned-room',name:'White House · Unassigned Room',description:'The White House is registered as a playable city location. The specific interior room is intentionally not chosen yet.'}
   ]
  },
  {
   id:'washingtonArena',
   name:'Washington Arena',
   area:'Washington, D.C.',
   category:'sport',
   description:'Venue used by the licensed boxing world.',
   map:null,
   defaultRoom:'arena-room',
   rooms:[
    {id:'arena-room',name:'Washington Arena',description:'Placeholder room shell for the licensed boxing venue. Final interior and ringside presentation remain future work.'}
   ]
  },
  {
   id:'washingtonAirport',
   availableFrom:'1910-01-01',
   name:'Washington Airport',
   area:'Washington, D.C.',
   category:'transport',
   description:'Washington aviation location reserved for travel, business and future social encounters.',
   map:null,
   defaultRoom:'unassigned-room',
   rooms:[
    {id:'unassigned-room',name:'Washington Airport · Unassigned Room',description:'The airport is registered now so later stories can reuse it. The specific playable interior has not been chosen.'}
   ]
  },
  {
   id:'metropolitanPolice',
   name:'Metropolitan Police',
   area:'Washington, D.C.',
   category:'government',
   description:'Police location reserved for investigations, raids, contacts and later legal consequences.',
   map:null,
   defaultRoom:'unassigned-room',
   rooms:[
    {id:'unassigned-room',name:'Metropolitan Police · Unassigned Room',description:'Placeholder room shell. The exact station, office or interview room will be selected when the police system expands.'}
   ]
  }
 ];

 function copyRoom(room){return Object.assign({},room)}
 function copyLocation(location){
  const copy=Object.assign({},location);
  copy.map=location.map?Object.assign({},location.map):null;
  copy.rooms=location.rooms.map(copyRoom);
  if(location.people)copy.people=location.people.map(p=>({...p,dialogue:[...(p.dialogue||[])]}));
  return copy;
 }
 function listLocations(){return LOCATIONS.map(copyLocation)}
 function getLocation(id){
  const location=LOCATIONS.find(v=>v.id===id);
  return location?copyLocation(location):null;
 }
 function getRoom(locationId,roomId){
  const location=LOCATIONS.find(v=>v.id===locationId);
  if(!location)return null;
  const room=location.rooms.find(v=>v.id===(roomId||location.defaultRoom))||location.rooms[0];
  return room?copyRoom(room):null;
 }
 function mapLocations(){
  return LOCATIONS.filter(v=>v.map).map(v=>({
   id:v.id,
   n:v.map.n,
   name:v.name,
   area:v.area,
   x:v.map.x,
   y:v.map.y,
   description:v.description
  }));
 }

 window.FederalElectricCity={
  version:1,
  listLocations,
  getLocation,
  getRoom,
  mapLocations
 };
})();
