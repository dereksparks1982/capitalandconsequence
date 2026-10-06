/* Federal Electric Washington city registry.
   World/location data lives here instead of inside any one playable character's story.
   Character-specific discovery, access, invitations and consequences belong in gameplay state. */
(function(){
 'use strict';

 const LOCATIONS=[
  {
   id:'factory',
   name:'Federal Electric Factory',
   area:'Ivy City / New York Avenue NE',
   category:'company',
   description:'Federal Electric works and company offices in the northeast industrial corridor.',
   map:{n:1,x:.6101,y:.3778},
   defaultRoom:'executive-office',
   rooms:[
    {id:'executive-office',name:'Executive Office',description:'Federal Electric’s existing Washington office hub. The room registry can address it independently of any particular playable character.'}
   ]
  },
  {
   id:'star',
   name:'Star Club',
   area:'14th Street / Logan–Thomas Circle',
   category:'social',
   description:'A discreet private club operated by Madam Star, where businessmen, officials, gamblers and well-connected Washington figures may cross paths.',
   map:{n:2,x:.4203,y:.4081},
   defaultRoom:'star-room',
   rooms:[
    {id:'star-room',name:'Star Room',description:'Placeholder room shell for the Star Club. Final artwork and the club’s internal room layout have not been assigned yet.'}
   ]
  },
  {
   id:'races',
   name:'Capital Race Grounds',
   area:'East of the Anacostia',
   category:'sport',
   description:'Federal Electric’s horse-racing and dog-racing venue.',
   map:{n:3,x:.8087,y:.5315},
   defaultRoom:'grounds',
   rooms:[
    {id:'grounds',name:'Race Grounds',description:'Placeholder room shell for the Capital Race Grounds. Final venue artwork and internal spaces remain future work.'}
   ]
  },
  {
   id:'workingPoker',
   name:'Neighborhood Game',
   area:'Navy Yard / Southeast',
   category:'social',
   description:'The lower-stakes working-class poker room.',
   map:{n:4,x:.5826,y:.6322},
   defaultRoom:'card-room',
   rooms:[
    {id:'card-room',name:'Neighborhood Card Room',description:'Placeholder room shell for the lower-stakes neighborhood poker game.'}
   ]
  },
  {
   id:'commercePoker',
   name:'Commerce Club',
   area:'Downtown / Pennsylvania Avenue',
   category:'social',
   description:'A respectable Washington club hosting the middle-stakes business poker game.',
   map:{n:5,x:.4536,y:.5088},
   defaultRoom:'club-room',
   rooms:[
    {id:'club-room',name:'Commerce Club Room',description:'Placeholder room shell for the Commerce Club. Final artwork and room arrangement remain unassigned.'}
   ]
  },
  {
   id:'embassyPoker',
   name:'Embassy Room',
   area:'Dupont / Massachusetts Avenue',
   category:'social',
   description:'The invitation-only elite poker room serving wealthy and diplomatic Washington.',
   map:{n:6,x:.3928,y:.3602},
   defaultRoom:'embassy-room',
   rooms:[
    {id:'embassy-room',name:'Embassy Room',description:'Placeholder room shell for the invitation-only elite poker room.'}
   ]
  },
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
