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
   defaultRoom:'receiving-office',
   rooms:[
    {id:'receiving-office',name:'Receiving Office',description:'Customers and deliveries are received at this public factory office.'},
    {id:'production-floor',name:'Production Floor',restricted:true,description:'Employees and authorized visitors work with machinery and materials.'},
    {id:'executive-office',name:'Executive Office',restricted:true,description:'Federal Electric’s existing Washington office hub. The room registry can address it independently of any particular playable character.'},
    {id:'break-room',name:'Factory Break Room',restricted:true,description:'Benches, an enamel kettle and experimental coin-operated refreshment cabinets for workers on break.'},
    {id:'rear-stable',name:'Factory Rear Stable and Carriage Shed',restricted:true,description:'A modest private horse stall and carriage shelter behind the works, initially empty. Feed and repairs must be paid for if animals are eventually kept here.'},
    {id:'workers-lodging',name:'Sullivan’s Rented Room',restricted:true,description:'One simple factory-grounds lodging room rented to the assistant for 25 cents each week. It is a residence, not another employee or a visitor attraction.'}
   ]
  },
  {
   id:'hillsdale',
   name:'Hillsdale / Barry Farm',
   area:'Hillsdale · Southeast Washington, east of the Anacostia River',
   category:'neighborhood',
   description:'Hillsdale is a historically African American landowning neighborhood established after the Civil War, also known on older maps as Barry Farm. Houses, churches, schools, shops and community life make up the area.',
   // Provisional pin on the existing later-era reference artwork; actual 1890 mapping remains pending.
   map:{n:13,x:.7350,y:.7620},
   defaultRoom:'neighborhood-street',
   rooms:[
    {id:'neighborhood-street',name:'Hillsdale Street',description:'Hillsdale’s settled community includes family homes, churches, schools and neighborhood shops.'},
    {id:'hillsdale-market',name:'Hillsdale Market',description:'A community provisions shop selling bread, produce, grains and daily necessities. Enter directly from Hillsdale; it is not another Washington map pin.'},
    {id:'hillsdale-butcher',name:'Hillsdale Butcher',description:'A local butcher selling meat and other provisions to neighborhood households. Enter directly from the Hillsdale street; it is not a separate map destination.'}
   ]
  },
  {
   id:'star',
   name:'Star Club',
   area:'Surviving Hay-Adams houses · 16th and H Streets NW',
   category:'social',
   radioContext:'star',
   description:'Eleanor Victoria Ashcroft, called Madam Star, runs an elegant, expensive club with fine food, quiet period-appropriate musicians and strict discretion. Gambling is not permitted at the Star Club; card games are forbidden.',
   map:{n:2,x:.4000,y:.4530},
   defaultRoom:'star-room',
   rooms:[
    {id:'star-room',name:'Star Club Salon',description:'You are inside Madam Star’s refined Washington club. Guests are welcomed here before choosing a room. There are no cards or gambling.'},
     {id:'main-parlor',name:'Main Parlor',description:'Gentle conversation, guests, introductions and discreet service gather in Madam Star’s main parlor.'},
     {id:'dining-room',name:'Dining Room',description:'Guests may dine and take refreshments with quiet, period-appropriate salon music. Detailed menus and ordering remain in development.'},
     {id:'brandy-room',name:'Brandy Room',description:'A quieter smoking and conversation room for established patrons.'},
     {id:'madam-office',name:'Madam Star’s Private Office',restricted:true,description:'Madam Star grants entry by invitation. Her correspondence and affairs are not open to casual guests.'},
     {id:'private-suites',name:'Private Rooms',restricted:true,description:'Private rooms are accessible only by permission. No gambling is permitted anywhere in the club.'}
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
   id:'oldChinatown',name:'Chinatown',
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
   area:'Potomac Park / Potomac Flats · west of Washington Monument (alternate-history exposition)',category:'fair',availableFrom:'1893-01-01',
   description:'The future grounds of the alternate-history 1893 World’s Columbian Exposition.',
   map:{n:9,x:.4700,y:.5660},defaultRoom:'fairgrounds',
   rooms:[{id:'fairgrounds',name:'Exposition Grounds',description:'A registered shell for the 1893 Washington fair. Exhibits and contests are not implemented yet.'}]
  },
  {
   id:'secondNightclub',name:'Le Paon d’Or',
   area:'Washington, D.C.',category:'social',
   description:'Le Paon d’Or means “The Golden Peacock.” Lucien Étienne “Lui” Delacroix owns this extravagant French cabaret outright. French dancing, burlesque, orchestra, champagne and expensive entertainment attract patrons from Washington’s influential circles. Lui’s connections protect his standing despite scandalous, unverified gossip about his private affairs. Elias Crowe works its entrance.',
   map:null,defaultRoom:'main-room',
   rooms:[
    {id:'main-room',name:'Public Cabaret Room',description:'Le Paon d’Or means “The Golden Peacock.” Lui Delacroix owns this glittering French cabaret outright: can-can, burlesque, music, champagne and indulgent entertainments draw well-connected patrons. Lui trades on powerful friendships as well as spectacle. Rumours about his private appetites are gossip, not established facts; guests do not gain access to his private rooms merely by entering.'},
    {id:'doorman-post',name:'Doorman’s Station',restricted:true,description:'A modest employee post by the entrance, with an admission book and a working shift ledger.'},
    {id:'proprietor-office',name:'Proprietor’s Private Office',restricted:true,description:'Private business records. Eli is not trusted with access.'}
   ]
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
   id:'brokerOffice',
   name:'Stockbroker',
   area:'Downtown Washington financial offices · precise address to be researched',
   category:'finance',
   description:'A private broker handles securities orders, account statements and market correspondence. A personal relationship may eventually permit instructions by telegram or telephone.',
   // Visual position is deliberately provisional until a historically documented office is chosen.
   map:{n:14,x:.5420,y:.4520},
   defaultRoom:'broker-office',
   rooms:[{id:'broker-office',name:'Broker’s Office',description:'The receiving office of a stockbroker. Initial inquiries and personal order instructions belong here; detailed brokerage service is a planned gameplay expansion.'}]
  },
  {
   id:'home',
   name:'Home',
   area:'Capitol Hill · near Eastern Market, 7th and C Streets SE (proposed)',
   category:'residence',
   description:'A modest middle-class brick rowhouse in Capitol Hill. The household and furnishings have not yet been decided.',
   map:{n:12,x:.6190,y:.5800},
   defaultRoom:'front-room',
   rooms:[
    {id:'front-room',name:'Front Room',description:'An unfurnished placeholder for the sitting room of the player’s Washington home.'},
    {id:'bedroom',name:'Bedroom',description:'A private room reserved for sleeping, dressing, and personal belongings. No furnishings assigned yet.'},
    {id:'kitchen',name:'Kitchen',description:'A household kitchen shell, awaiting period-accurate furnishings and domestic routines.'},
    {id:'storage',name:'Household Storage',description:'An addressable storage room. Personal possessions will remain here only when a storage system is implemented.'},
    {id:'private-stable',name:'Private Stable and Carriage House',restricted:true,description:'The modest rear outbuilding holds Charlie’s own horses, wagons, feed, harness and a covered carriage bay. Initially empty; animals only arrive through actual trips.'}
   ]
  },
  {
   id:'governmentHospital',
   name:'District General Hospital',
   area:'Anacostia hillside · southeast Washington, D.C.',
   category:'government',
   description:'In this alternate Washington, this government facility provides general medical care. It is a hospital, not a second asylum. The real-world site was the Government Hospital for the Insane, later called St. Elizabeths; that history is separately documented.',
   // Historical institution: the 1890 name and opening date are verified by NARA.
   // Deliberately unpinned until its exact placement is reconciled with our map artwork.
   map:null,defaultRoom:'reception',
   rooms:[
    {id:'reception',name:'Reception and Inquiry Desk',description:'Public visitors may request information and ask the receiving attendant about hospital procedures. No confidential patient record is accessible here.'},
    {id:'patient-ward',name:'Patient Ward',restricted:true,description:'A patient-care area. Entry requires specific authorization; clinical and patient information remain confidential.'},
    {id:'superintendent-office',name:'Superintendent’s Office',restricted:true,description:'Restricted institutional management offices, not available to an uninvited visitor.'},
    {id:'morgue',name:'Hospital Morgue',restricted:true,description:'Registered remains are examined by authorized medical staff. Entry and reports require permission; ordinary visitors cannot inspect bodies.'}
   ]
  },
  {"id":"potomacKennelTrack","availableFrom":"1919-01-01","name":"Potomac Kennel Track","area":"Washington region · exact site pending","category":"sport","description":"Dog-racing venue with a placeholder room; site under historical review.","map":null,"defaultRoom":"track-office","rooms":[{"id":"track-office","name":"Kennel Track","description":"An undecorated dog-racing location."}]},
  {"id":"capitalSpeedway","name":"Capital Speedway","area":"Washington region · later period","category":"sport","availableFrom":"1933-01-01","description":"Later-period motor racing venue, unavailable in 1890.","map":null,"defaultRoom":"grandstand","rooms":[{"id":"grandstand","name":"Grandstand","description":"Future motor sport room."}]},
  {"id":"licensedGamingHall","name":"Licensed Gaming Hall","area":"Washington, D.C. · undecided address","category":"gaming","plannedOnly":true,"description":"Proposed regulated game hall; the allowed games and site are not yet settled.","map":null,"defaultRoom":"gaming-floor","rooms":[{"id":"gaming-floor","name":"Gaming Floor","description":"Planning only."}]},
  {"id":"privateFightHall","name":"Private Prizefight Venue","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Invitation-only private fight location.","map":null,"defaultRoom":"private-ring","rooms":[{"id":"private-ring","name":"Private Ring","description":"Placeholder private venue."}]},
  {"id":"cockfightingDen","name":"Private Cockfighting Circle","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Hidden private contest venue.","map":null,"defaultRoom":"meeting-yard","rooms":[{"id":"meeting-yard","name":"Meeting Yard","description":"Placeholder private venue."}]},
  {"id":"blackwoodAsylum","name":"District Asylum","area":"Washington region · fictional address pending","category":"government","description":"The one public District Asylum in the alternate Washington. Edmund Wardman works as an orderly here; his elder brother directs it. This is a government institution, not a private asylum.","map":null,"defaultRoom":"reception","rooms":[{"id":"reception","name":"Asylum Reception","description":"Public entrance and inquiries."},{"id":"orderly-station","name":"Orderly Station","restricted":true,"description":"Attendant duty desk, assignment book, and supply register."},{"id":"patient-ward","name":"Patient Ward","restricted":true,"description":"Care area accessible to authorized staff."},{"id":"superintendent-office","name":"Superintendent Office","restricted":true,"description":"Private management offices. Not accessible to family merely by surname."},{"id":"administration","name":"Administration","restricted":true,"description":"Restricted institutional finance records."}]},
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
   description:'Metropolitan Police station with a public entrance, an officers’ duty room and desk ledgers. Historical station location pending.',
   map:null,
   defaultRoom:'unassigned-room',
   rooms:[
    {id:'unassigned-room',name:'Public Station Entrance',description:'Public station counter and waiting area. This stable legacy room ID is retained for existing saves.'},
    {id:'station-duty-room',name:'Patrolmen’s Duty Room',restricted:true,description:'A working police desk for writing routine beat reports. Only authorized officers may enter.'},
    {id:'sergeant-office',name:'Sergeant’s Office',restricted:true,description:'Private supervisory records and assignments. A rookie patrolman has no unrestricted access.'}
   ]
  },
  {
   id:'westLivery',name:'Western Livery and Carriage Yard',
   area:'Western Washington · provisional site',category:'transport',
   description:'Western branch of two competing liveries, each owned by one of two estranged brothers. Known for well-kept riding horses, buggies and carriage service. Why the brothers fell out is undecided.',
   map:null,defaultRoom:'service-desk',rooms:[
    {id:'service-desk',name:'Livery Service Desk',description:'Buy or enquire about horses and carriages at the western stable.'},
    {id:'horse-yard',name:'Horse and Carriage Yard',description:'Stalls, feed, harnesses and wagons, maintained by local stable hands.'},
    {id:'owner-office',name:'Stable Owner’s Office',restricted:true,description:'The western brother’s private accounts and business correspondence.'}
   ]
  },
  {
   id:'eastLivery',name:'Eastern Livery and Wagon Works',
   area:'Eastern Washington · provisional site',category:'transport',
   description:'Eastern branch of a rival livery owned by the western stablekeeper’s brother. Focuses on workhorses and freight wagons; rivalry affects quoted prices without changing the value of money.',
   map:null,defaultRoom:'service-desk',rooms:[
    {id:'service-desk',name:'Livery Service Desk',description:'Buy or enquire about working horses and wagons at the eastern stable.'},
    {id:'horse-yard',name:'Horse and Wagon Yard',description:'Working horses, carts, water troughs and feed stores.'},
    {id:'owner-office',name:'Stable Owner’s Office',restricted:true,description:'The eastern brother’s private account books.'}
   ]
  },
  {
   id:'potomacFishingBank',
   name:'Potomac River Fishing Bank',
   area:'Potomac shoreline · southwest Washington, D.C. (provisional access point)',
   category:'leisure',
   description:'A public riverbank fishing spot in 1878 Washington. The location is accessible from the city map; fishing requires owned tackle; casting and fighting fish are available at the shore.',
   map:null,defaultRoom:'riverbank',rooms:[
    {id:'riverbank',name:'Riverbank',description:'A quiet stretch of the Potomac suitable for shore fishing. Fishing actions and your saved creel are available here.'}
   ]
  },
  {
   id:"babcockLake",name:"Babcock Lake",area:"Washington Monument grounds · historic lake",category:'leisure',
   availableUntil:"1888-12-31",description:"A former canal basin where Washingtonians fished in warm months. Filled by December 1888; no modern lake or aquarium is implied.",map:null,defaultRoom:'shore',rooms:[
    {id:'shore',name:"Lakeside Fishing Bank",description:'Washington shoreline location for future fishing; fishing requires tackle and is available here.'}
   ]
  },
  {
   id:"fletchersCove",name:"Fletcher’s Cove",area:"Upper Potomac · C&O Canal Georgetown approach",category:'leisure',
   description:"A longstanding river cove and fishing reach. The later boathouse is not assumed to exist on opening day in 1878.",map:null,defaultRoom:'shore',rooms:[
    {id:'shore',name:"Cove Shore",description:'Washington shoreline location for future fishing; fishing requires tackle and is available here.'}
   ]
  },
  {
   id:"georgetownCanal",name:"Georgetown Canal Towpath",area:"C&O Canal · Georgetown",category:'leisure',
   description:"An 1878 canalside outing on the completed C&O Canal. Fishing access beside the working canal is a provisional gameplay location.",map:null,defaultRoom:'shore',rooms:[
    {id:'shore',name:"Canal Towpath",description:'Washington shoreline location for future fishing; fishing requires tackle and is available here.'}
   ]
  },
  {
   id:"easternBranchFishing",name:"Eastern Branch Fishing Shore",area:"Anacostia River · near the Navy Yard",category:'leisure',
   description:"Shore fishing along the Eastern Branch, the historic Anacostia name. The exact public bank is provisional.",map:null,defaultRoom:'shore',rooms:[
    {id:'shore',name:"Eastern Branch Bank",description:'Washington shoreline location for future fishing; fishing requires tackle and is available here.'}
   ]
  },
  {
   id:"chainBridgeFishing",name:"Chain Bridge Riverbank",area:"Potomac near Chain Bridge and Little Falls",category:'leisure',
   description:"Shore fishing upstream near the stronger Potomac current. Rapids are hazardous; the bank position remains provisional.",map:null,defaultRoom:'shore',rooms:[
    {id:'shore',name:"Riverside Approach",description:'Washington shoreline location for future fishing; fishing requires tackle and is available here.'}
   ]
  },
  {
   id:"franciscanMonastery",
   name:"Franciscan Monastery of the Holy Land in America",
   area:"Brookland · 1400 Quincy Street NE, Washington, D.C.",
   category:"religious",
   description:"The real Franciscan Monastery of the Holy Land in America in Brookland, with its church and gardens. The Washington guide's fixed illustrated city is used in every alternate-history year. The monastery pin is placed at its historical Brookland block; the exact front gate is not separately labeled on the artwork.",
   map:{n:35,x:1272/2048,y:235/1159},
   defaultRoom:"monastery-grounds",
   rooms:[
    {id:"monastery-grounds",name:"Monastery Grounds",description:"The monastery's public grounds and entrance. Interior monastery activities have not yet been implemented."}
   ]
  },
  {
   id:"cobblerShop",name:"Cobbler & Shoe Repair",
   area:"7th Street SE · beside Eastern Market · fictional storefront",
   category:"commerce",
   description:"An independent Washington cobbler near the public market. Shoes and boots can be brought for resoling, heel repair and leather stitching. The storefront is a fictional business on a real shopping street; prices, owner and repair gameplay are not yet designed.",
   map:{n:36,x:1274/2048,y:486/1159},
   defaultRoom:"repair-counter",
   rooms:[
    {id:"repair-counter",name:"Shoe Repair Counter",description:"A counter for receiving worn shoes and discussing repair requests. Buying and repair transactions await their own approved gameplay slice."},
    {id:"work-bench",name:"Cobbler's Workbench",restricted:true,description:"The shoemaker's leather, lasts, needles, thread and tools. Workers only."}
   ]
  },
  {
   id:"easternMarket",
   name:"Eastern Market",
   area:"225 7th Street SE · Capitol Hill, Washington, D.C.",
   category:"commerce",
   description:"Washington's real Eastern Market, operating on Capitol Hill since the nineteenth century. A public place to buy food and everyday household goods from independent merchants.",
   map:{n:37,x:1258/2048,y:475/1159},
   defaultRoom:"market-hall",
   rooms:[
    {id:"market-hall",name:"Market Hall",description:"Public indoor market with food and daily goods stalls. Individual merchants and finite inventory are not yet separately implemented here."},
    {id:"market-outside",name:"Outside Stalls",description:"The public streets around Eastern Market where vendors and customers gather."}
   ]
  },
  {
   id:'nationalTheatre',name:'National Theatre',
   area:'1321 Pennsylvania Avenue NW · Washington, D.C.',category:'theatre',
   description:'Washington’s National Theatre, under proprietor William W. Rapley. In this alternate history the city is home to actors Edwin Booth, Joseph Jefferson, John McCullough, Clara Morris, John T. Raymond and young Charles B. Hanford, all with independent local routines. Theatrical attendance and private rooms require actual visits or permission.',
   // Added provisional PIN only. The Washington map artwork NEVER changes.
   map:{n:39,x:.505,y:.465},defaultRoom:'theatre-lobby',
   rooms:[
    {id:'theatre-lobby',name:'National Theatre Lobby',description:'Public ticket counters, patrons, playbills and visitors.'},
    {id:'auditorium',name:'Auditorium',description:'Public audience seating, orchestra pit and main stage.'},
    {id:'stage-door',name:'Stage Door',description:'Performers and stagehands arrive and depart through the working stage entrance.'},
    {id:'backstage',name:'Backstage and Dressing Rooms',restricted:true,description:'Company dressing rooms, costumes and theatre equipment. Staff and invited guests only.'},
    {id:'manager-office',name:'Theatre Manager’s Office',restricted:true,description:'William W. Rapley’s theatre accounts, correspondence and booking records.'}
   ]
  },
  {
   id:'districtBank',name:'District Bank',
   area:'Downtown Washington financial district · fictional bank and provisional map placement',category:'finance',
   description:'A Washington bank where you may optionally maintain separate company, personal checking and general savings accounts. Deposits and withdrawals are physical transactions: bring the appropriate money to the teller.',
   map:{n:40,x:.565,y:.455},defaultRoom:'banking-hall',
   rooms:[
    {id:'banking-hall',name:'Banking Hall',description:'Public tellers receive cash deposits and withdrawals into individually identified accounts.'},
    {id:'vault',name:'Bank Vault',restricted:true,description:'Bank staff and authorized personnel only. Deposit accounts do not grant access to the vault.'}
   ]
  },
  {
   id:"georgetownMarketHouse",
   name:"Georgetown Market House",
   area:"3276 M Street NW · Georgetown, Washington, D.C.",
   category:"commerce",
   description:"The historic Georgetown Market House, a real neighborhood market on M Street. It offers local food vendors and day-to-day trade independently of the invented city businesses.",
   map:{n:38,x:572/2048,y:385/1159},
   defaultRoom:"market-hall",
   rooms:[
    {id:"market-hall",name:"Georgetown Market Hall",description:"Public Georgetown market hall. No fictional vendor prices or stocks have been invented."}
   ]
  }
 ];

 // 40 city locations have numbered pins on the ORIGINAL unchanged artwork. Sites
 // with no established address remain directory-only, not claimed as verified.
 // Future/hidden/planned venues remain subject to their original access gates.
 const PROVISIONAL_MAP_PINS=Object.freeze({
  secondNightclub:[15,.425,.483],governmentHospital:[16,.733,.680],
  potomacKennelTrack:[17,.843,.543],capitalSpeedway:[18,.875,.585],
  licensedGamingHall:[19,.517,.463],privateFightHall:[20,.535,.515],
  cockfightingDen:[21,.643,.502],blackwoodAsylum:[22,.772,.723],
  whiteHouse:[23,.434,.454],washingtonArena:[24,.580,.425],
  washingtonAirport:[25,.305,.664],metropolitanPolice:[26,.571,.510],
  westLivery:[27,.190,.515],eastLivery:[28,.885,.488],
  potomacFishingBank:[29,.340,.690],
  babcockLake:[30,.495,.559],fletchersCove:[31,.184,.402],
  georgetownCanal:[32,.271,.475],easternBranchFishing:[33,.758,.642],
  chainBridgeFishing:[34,.11,.326]
 });
 // Historical means the destination is real, not merely a fictional business
 // inside a historic building. Star Club and Embassy Room are therefore fictional.
 const HISTORICAL_DESTINATIONS=new Set([
  'hillsdale','oldChinatown','universityMaryland','governmentHospital',
  'whiteHouse','washingtonAirport','potomacFishingBank','babcockLake',
  'fletchersCove','georgetownCanal','easternBranchFishing','chainBridgeFishing',
  'metropolitanPolice','franciscanMonastery','easternMarket','georgetownMarketHouse','nationalTheatre'
 ]);
 // Pin anchors read against the owner's actual, unchanged 2048 x 1159
 // Washington In and Out Guide image (A-R rows / 1-30 columns).
 // Only visibly identified buildings/grounds are marked verified.
 // Other sites retain their previous default coordinates, explicitly unverified,
 // so no invented site is presented as a historical certainty.
 // Non-fiction reference notes belong to the real world and must never be
 // conflated with the game's divergent Washington history or invented rooms.
 // Wikipedia and LOC are reading links, not runtime gameplay dependencies.
 const HISTORICAL_READING=Object.freeze({
  hillsdale:{"summary":"Barry Farm (Hillsdale) grew as a community of Black landowners and families after emancipation and the Civil War.","wikipedia":"https://en.wikipedia.org/wiki/Barry_Farm","query":"Barry Farm Hillsdale Washington DC"},
  oldChinatown:{"summary":"Washington's original Chinatown emerged along Pennsylvania Avenue NW in the 1880s and later moved to the H Street district in the 1930s. Its earlier appearance in the game's 1878 Washington is alternate history.","wikipedia":"https://en.wikipedia.org/wiki/Chinatown_(Washington,_D.C.)","query":"early Chinatown Pennsylvania Avenue Washington DC"},
  universityMaryland:{"summary":"Chartered as Maryland Agricultural College in 1856, the institution opened in 1859. The modern University of Maryland name and any invented characters in the game should not be read as nineteenth-century fact.","wikipedia":"https://en.wikipedia.org/wiki/University_of_Maryland,_College_Park","query":"Maryland Agricultural College founding history"},
  governmentHospital:{"summary":"The Government Hospital for the Insane opened in 1855 and later became known as St. Elizabeths Hospital. Fictional patient stories in this game are not archival records.","wikipedia":"https://en.wikipedia.org/wiki/St._Elizabeths_Hospital","query":"Government Hospital for the Insane Washington"},
  whiteHouse:{"summary":"The White House became the official residence of United States presidents in 1800. The game's alternate political events should not be mistaken for real presidencies.","wikipedia":"https://en.wikipedia.org/wiki/White_House","query":"White House history 1600 Pennsylvania Avenue"},
  washingtonAirport:{"summary":"Washington Airport opened in Arlington in the late 1920s and merged with Hoover Field in 1933 to form Washington–Hoover Airport. The real airport did not exist in 1878; any earlier game use is invented.","wikipedia":"https://en.wikipedia.org/wiki/Washington%E2%80%93Hoover_Airport","query":"Washington Hoover Airport history"},
  potomacFishingBank:{"summary":"The Potomac River is a real watershed and historic transport corridor. The specific game fishing-bank entrance is a fictional gameplay choice.","wikipedia":"https://en.wikipedia.org/wiki/Potomac_River","query":"Potomac River Washington historical fishing"},
  babcockLake:{"summary":"The Babcock Lakes were former fish-culture ponds near the Washington Monument. They are not a surviving open lake on the game's fixed later-drawn map.","wikipedia":"https://en.wikipedia.org/wiki/Babcock_Lakes","query":"Babcock Lakes United States Fish Commission Washington"},
  fletchersCove:{"summary":"Fletcher's Cove is a real stretch of the upper Potomac associated with the Fletcher family's fishing and boat-rental trade after the Civil War and with the Chesapeake and Ohio Canal. The exact gameplay shore access is not documented here.","wikipedia":"https://en.wikipedia.org/wiki/Fletcher%27s_Cove","query":"Fletcher's Cove Potomac Washington history"},
  georgetownCanal:{"summary":"The Chesapeake and Ohio Canal begins in Georgetown and was an important nineteenth-century transport waterway beside the Potomac.","wikipedia":"https://en.wikipedia.org/wiki/Chesapeake_and_Ohio_Canal","query":"C&O Canal Georgetown Washington historic"},
  easternBranchFishing:{"summary":"The Anacostia River was historically called the Eastern Branch of the Potomac. The game's fishing-bank entrance is not a documented individual historic business.","wikipedia":"https://en.wikipedia.org/wiki/Anacostia_River","query":"Eastern Branch Anacostia River Washington"},
  chainBridgeFishing:{"summary":"Chain Bridge connects Washington with Virginia across the Potomac and takes its name from an earlier bridge design. The exact game fishing bank remains unspecified.","wikipedia":"https://en.wikipedia.org/wiki/Chain_Bridge_(Potomac_River)","query":"Chain Bridge Potomac Washington history"},
  metropolitanPolice:{"summary":"The Metropolitan Police Department of the District of Columbia was established in 1861. The game has not selected a particular historical station for its generic police destination.","wikipedia":"https://en.wikipedia.org/wiki/Metropolitan_Police_Department_of_the_District_of_Columbia","query":"Metropolitan Police Washington DC founding history"},
  franciscanMonastery:{"summary":"The Franciscan Monastery complex in Brookland was established in the late 1890s, with the memorial church completed in 1899. Its appearance in the game's earlier alternate timeline is fictional.","wikipedia":"https://en.wikipedia.org/wiki/Franciscan_Monastery_of_the_Holy_Land_in_America","query":"Franciscan Monastery Holy Land Brookland Washington"},
  easternMarket:{"summary":"Eastern Market is a historic public market in Capitol Hill. Its nineteenth-century market building dates to the 1870s, and the game invents its individual merchants until researched.","wikipedia":"https://en.wikipedia.org/wiki/Eastern_Market%2C_Washington%2C_D.C.","query":"Eastern Market Washington 1873"},
  georgetownMarketHouse:{"summary":"The historic Georgetown Market building on M Street was built in 1865 on a site used for market trade since the late eighteenth century.","wikipedia":"https://en.wikipedia.org/wiki/Georgetown_Market","query":"Georgetown Market House 3276 M Street history"},
  nationalTheatre:{"summary":"The National Theatre is an actual Washington institution. The actors’ permanent residence here from 1878 is a deliberate alternate-history invention, not a claim about their real biographies.","wikipedia":"https://en.wikipedia.org/wiki/National_Theatre_(Washington,_D.C.)","query":"National Theatre Washington 1878 William Rapley"}
 });
 // Fictional history is canonical *game-world writing*, never historical
 // evidence for a real street, named building or real-world organization.
 // Entries draw on the existing location descriptions; future expansion is
 // editorial work and does not itself implement NPCs, transactions or events.
 const FICTIONAL_STORY=Object.freeze({
    factory: "In our Washington, Federal Electric is a small but ambitious electrical works in Ivy City. Charlie's contracts, shortages and decisions may shape the company's rise or failure.",
    star: "Eleanor Victoria Ashcroft, called Madam Star, runs this fictional presidential-founded club. Its fine dining, discreet companionship and background musicians operate under strict rules. No cards or gambling.",
    races: "Our capital maintains the fictional Capital Race Grounds in the Benning area. Racing fortunes, patrons and rivalries belong to this game's divergent history.",
    workingPoker: "A modest neighborhood card game offers working Washingtonians a seat at the table. Its exact venue remains undecided in our fictional city.",
    commercePoker: "Our fictional Commerce Club gathers pilots and businessmen for a weekly poker game in a Washington-Hoover airport hangar. The airport is real; the club and game are invented.",
    embassyPoker: "In our Washington, the Embassy Room is an invitation-only private poker venue associated with the Chevy Chase Club. That room is a game invention, not a historical claim about the real club.",
    russianTradeHall: "Merchants, engineers and diplomats of Imperial Russia have an informal Washington meeting hall in this alternate timeline. Its business and conversations are written for the game.",
    washingtonFairgrounds: "The game's alternative national history brings the 1893 World's Columbian Exposition to Washington's Potomac Flats rather than its real-world venue.",
    secondNightclub: "Le Paon d’Or (The Golden Peacock) belongs outright to Lucien Étienne Delacroix, called Lui. His flamboyant French cabaret trades in music, dance, spectacle and extravagant hospitality. The proprietor’s powerful connections shelter his reputation. Rumors are rumors, not privileged truths; Eli Crowe works the entrance.",
    districtBank: "District Bank is the fictional independent bank where Washington residents may optionally keep separate business, checking and untargeted savings balances. Cash must physically arrive or be collected.",
    capitolAirport: "Our fictional Capitol Airport operates near Benning, separate from the historical Washington-Hoover airfield. Its precise property is still undecided.",
    brokerOffice: "A Washington stockbroker receives Charlie's personal securities orders in our game world. The fictional office's actual building has not been chosen.",
    home: "Charlie's prospective Capitol Hill home is a private family address within our Washington story. Its rooms and furnishings evolve through the player's choices.",
    potomacKennelTrack: "The Potomac Kennel Track is a proposed dog-racing destination in the game's Washington region. Its exact location has not been established.",
    capitalSpeedway: "Capital Speedway belongs to a later chapter of the game's alternative Washington, when motor racing becomes part of the city. It is unavailable in the early campaign.",
    licensedGamingHall: "Our Washington may permit a regulated gaming hall, but its rules, rooms and location remain undecided. It should not be mistaken for a documented historical establishment.",
    privateFightHall: "This invitation-only boxing venue belongs to the game's private sporting world. Its location is deliberately undisclosed within the story.",
    cockfightingDen: "An undisclosed private contest circle exists in the game's underworld. Its membership and premises are fictional, not a claim about a real community.",
    blackwoodAsylum: "The fictional District Asylum is managed by Edmund Wardman's brother. Edmund begins his own uncertain career here as an orderly; it is separate from the real Government Hospital for the Insane.",
    washingtonArena: "The Washington Arena is an invented venue serving this game's boxing scene. Its bouts and business records are alternate-history events.",
    westLivery: "One of two estranged brothers runs a west-side Washington livery, competing for riders and carriage customers. What caused their feud remains an unwritten chapter.",
    eastLivery: "The other brother keeps an east-side horse and wagon business. The quarrel between the stables is part of the fictional local economy.",
    cobblerShop: "An independent cobbler serves our invented Capitol Hill neighborhood near Eastern Market, repairing worn shoes and boots. Its owner, prices and actual storefront have not yet been decided."
});
 // Exact placement uses the user's original 2048x1159 Washington In and Out
 // Guide scan. Its printed map spans approximately pixels 215..1425, 24..692.
 // Named sites below are identified on the scan; invented street addresses
 // reference a *district/block*, not an invented historically verified doorway.
 const MAP_ARTWORK_ANCHORS=Object.freeze({
  whiteHouse:[841,428,'White House / Executive Mansion grounds, printed guide coordinate 12-I'],
  washingtonAirport:[718,730,'WASHINGTON AIRPORT lettering on the Virginia field, printed guide coordinate 9-P'],
  governmentHospital:[1483,834,'Government Hospital (St. Elizabeths hillside), printed guide coordinate 25-R'],
  georgetownCanal:[638,415,'Georgetown C&O Canal, north bank of Potomac, printed guide coordinate 7-I'],
  easternBranchFishing:[1425,622,'Eastern Branch / Anacostia riverside, north bank near Navy Yard, printed guide coordinate 24-M']
 });
 const MAP_AREA_REFERENCES=Object.freeze({
  star:[826,405,'16th and H Streets NW, Hay-Adams houses near the White House; fictional club'],
  oldChinatown:[1020,382,'Pennsylvania Avenue NW near 4th–7th Streets; early Chinatown block, not a surveyed shop'],
  russianTradeHall:[755,362,'Dupont Circle / Massachusetts Avenue NW; proposed fictional hall'],
  commercePoker:[711,712,'Washington-Hoover Airport grounds, Arlington; fictional club in a hangar'],
  home:[1200,480,'Capitol Hill by Eastern Market, 7th Street SE; fictional proposed home'],
  fletchersCove:[395,370,'Upper Potomac north bank above Georgetown; cove access provisional'],
  potomacFishingBank:[921,625,'Potomac Park / Southwest Washington shoreline; provisional shore entrance'],
  franciscanMonastery:[1272,235,'Brookland, 1400 Quincy Street NE, monastery grounds; doorway not labeled'],
  hillsdale:[1498,765,'Barry Farm / Hillsdale southeast of the Anacostia; general neighborhood, not one residence'],
  blackwoodAsylum:[1540,795,'District Asylum: invented government premises southeast of central Washington; no historic lot claimed'],
  factory:[1266,325,'Ivy City / New York Avenue NE near Fenwick Street; fictional industrial block'],
  races:[1640,355,'Kenilworth / Benning east of the Anacostia; fictional race-track property'],
  capitolAirport:[1660,280,'East of the Anacostia north of Benning; proposed fictional airfield'],
  universityMaryland:[1555,90,'College Park / Maryland Agricultural College vicinity; northern map edge, not a surveyed campus entrance'],
  embassyPoker:[505,132,'Chevy Chase Club vicinity / 6100 Connecticut Avenue; fictional room'],
  washingtonFairgrounds:[750,538,'Potomac Park west of Washington Monument; fictional 1893 fair site'],
  babcockLake:[857,527,'Washington Monument vicinity / earlier basin, absent from fixed later-era artwork'],
  easternMarket:[1258,475,'225 7th Street SE, Eastern Market block; original building not individually labeled'],
  georgetownMarketHouse:[572,385,'3276 M Street NW, Georgetown Market House area, not separately labeled'],
  cobblerShop:[1274,486,'Fictional shoemaker by Eastern Market on 7th Street SE']
 });
 const IMAGE_WIDTH=2048,IMAGE_HEIGHT=1159;
 // Coordinates describe the PRINTED map, not longitude/latitude.
 const GRID_LEFT=323,GRID_TOP=59,GRID_COL_PITCH=48.5,GRID_ROW_PITCH=45.55;
 function mapGridReference(x,y){
  const px=x*IMAGE_WIDTH,py=y*IMAGE_HEIGHT;
  if(px<286||px>1778||py<30||py>864)return 'Outside map';
  const col=Math.max(1,Math.min(30,Math.round((px-GRID_LEFT)/GRID_COL_PITCH)+1));
  const row=Math.max(0,Math.min(17,Math.round((py-GRID_TOP)/GRID_ROW_PITCH)));
  return col+'-'+String.fromCharCode(65+row);
 }
 for(const location of LOCATIONS){
  const position=PROVISIONAL_MAP_PINS[location.id];
  if(!location.map&&position){
   location.map={n:position[0],x:position[1],y:position[2]};
  }
  location.mapOrigin=HISTORICAL_DESTINATIONS.has(location.id)?'historical':'fictional';
  location.story=location.mapOrigin==='fictional'?(FICTIONAL_STORY[location.id]||location.description):null;
  location.history=location.mapOrigin==='historical'?(HISTORICAL_READING[location.id]||null):null;
  const anchor=MAP_ARTWORK_ANCHORS[location.id];
  const area=MAP_AREA_REFERENCES[location.id];
  const point=anchor||area;
  if(point&&location.map){
   location.map.x=point[0]/IMAGE_WIDTH;
   location.map.y=point[1]/IMAGE_HEIGHT;
   location.mapEvidence=point[2];
  }
  if(location.map){
   location.mapPlacement=anchor?'map-anchored':area?'area-located':'unverified';
   location.provisionalMapPosition=!anchor;
  }
 }
 function copyRoom(room){return Object.assign({},room)}
 function copyLocation(location){
  const copy=Object.assign({},location);
  copy.map=location.map?Object.assign({},location.map):null;
  if(location.history)copy.history=Object.assign({},location.history);
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
   category:v.category,
   x:v.map.x,
   y:v.map.y,
   description:v.description,
   provisional:!!v.provisionalMapPosition,
   origin:v.mapOrigin,
   placement:v.mapPlacement,
   grid:mapGridReference(v.map.x,v.map.y),
   evidence:v.mapEvidence||'',
   history:v.history?Object.assign({},v.history):null,
   story:v.story||null
  }));
 }

 window.FederalElectricCity={
  version:1,
  listLocations,
  getLocation,
  getRoom,
  mapLocations,
  mapGridReference,
  mapGridConstants:Object.freeze({left:GRID_LEFT,top:GRID_TOP,columnPitch:GRID_COL_PITCH,rowPitch:GRID_ROW_PITCH,columns:30,rows:18,imageWidth:IMAGE_WIDTH,imageHeight:IMAGE_HEIGHT})
 };
})();
