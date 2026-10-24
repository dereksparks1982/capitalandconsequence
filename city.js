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
    {id:'rear-stable',name:'Factory Rear Stable and Carriage Shed',restricted:true,description:'A modest private horse stall and carriage shelter behind the works, initially empty. Feed and repairs must be paid for if animals are eventually kept here.'},
    {id:'workers-lodging',name:'Sullivan’s Rented Room',restricted:true,description:'One simple factory-grounds lodging room rented to the assistant for 25 cents each week. It is a residence, not another employee or a visitor attraction.'}
   ]
  },
  {
   id:'hillsdale',
   name:'Hillsdale',
   area:'Hillsdale · Southeast Washington, east of the Anacostia River',
   category:'neighborhood',
   description:'Hillsdale is a historically African American landowning neighborhood established after the Civil War, also known on older maps as Barry Farm. Houses, churches, schools, shops and community life make up the area.',
   // Provisional pin on the existing later-era reference artwork; actual 1890 mapping remains pending.
   map:{n:13,x:.7350,y:.7620},
   defaultRoom:'neighborhood-street',
   rooms:[
    {id:'neighborhood-street',name:'Hillsdale Street',description:'Hillsdale’s settled community includes family homes, churches, schools, shops and neighborhood street life. Detailed businesses and residents will arrive in future slices.'}
   ]
  },
  {
   id:'star',
   name:'Star Club',
   area:'Surviving Hay-Adams houses · 16th and H Streets NW',
   category:'social',
   radioContext:'star',
   description:'A discreet establishment operated by Madam Star, where Washington visitors and well-connected figures may cross paths. Gambling is not permitted at the Star Club.',
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
   id:'secondNightclub',name:'Second Nightclub',
   area:'Washington, D.C.',category:'social',
   description:'An operating social establishment. Its proprietor and final public name have not been approved. A low-ranking doorman works the entrance at night.',
   map:null,defaultRoom:'main-room',
   rooms:[
    {id:'main-room',name:'Public Club Room',description:'Patrons gather in the main room; the proprietor’s identity and final artwork remain undecided.'},
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
    {id:'storage',name:'Household Storage',description:'An addressable storage room. Personal possessions will remain here only when a storage system is implemented.'},
    {id:'private-stable',name:'Private Stable and Carriage House',restricted:true,description:'The modest rear outbuilding holds Charlie’s own horses, wagons, feed, harness and a covered carriage bay. Initially empty; animals only arrive through actual trips.'}
   ]
  },
  {
   id:'governmentHospital',
   name:'Government Hospital for the Insane',
   area:'Anacostia hillside · southeast Washington, D.C.',
   category:'institution',
   description:'A federal psychiatric hospital operating since 1855, later officially named St. Elizabeths in 1916. Public inquiries are received at the entrance; treatment wards and administrative offices require permission.',
   // Historical institution: the 1890 name and opening date are verified by NARA.
   // Deliberately unpinned until its exact placement is reconciled with our map artwork.
   map:null,defaultRoom:'reception',
   rooms:[
    {id:'reception',name:'Reception and Inquiry Desk',description:'Public visitors may request information and ask the receiving attendant about hospital procedures. No confidential patient record is accessible here.'},
    {id:'patient-ward',name:'Patient Ward',restricted:true,description:'A patient-care area. Entry requires specific authorization; clinical and patient information remain confidential.'},
    {id:'superintendent-office',name:'Superintendent’s Office',restricted:true,description:'Restricted institutional management offices, not available to an uninvited visitor.'}
   ]
  },
  {"id":"potomacKennelTrack","name":"Potomac Kennel Track","area":"Washington region · exact site pending","category":"sport","description":"Dog-racing venue with a placeholder room; site under historical review.","map":null,"defaultRoom":"track-office","rooms":[{"id":"track-office","name":"Kennel Track","description":"An undecorated dog-racing location."}]},
  {"id":"capitalSpeedway","name":"Capital Speedway","area":"Washington region · later period","category":"sport","availableFrom":"1930-01-01","description":"Later-period motor racing venue, unavailable in 1890.","map":null,"defaultRoom":"grandstand","rooms":[{"id":"grandstand","name":"Grandstand","description":"Future motor sport room."}]},
  {"id":"licensedGamingHall","name":"Licensed Gaming Hall","area":"Washington, D.C. · undecided address","category":"gaming","plannedOnly":true,"description":"Proposed regulated game hall; the allowed games and site are not yet settled.","map":null,"defaultRoom":"gaming-floor","rooms":[{"id":"gaming-floor","name":"Gaming Floor","description":"Planning only."}]},
  {"id":"privateFightHall","name":"Private Prizefight Venue","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Invitation-only private fight location.","map":null,"defaultRoom":"private-ring","rooms":[{"id":"private-ring","name":"Private Ring","description":"Placeholder private venue."}]},
  {"id":"cockfightingDen","name":"Private Cockfighting Circle","area":"Location undisclosed","category":"underground","hiddenFromDirectory":true,"description":"Hidden private contest venue.","map":null,"defaultRoom":"meeting-yard","rooms":[{"id":"meeting-yard","name":"Meeting Yard","description":"Placeholder private venue."}]},
  {"id":"blackwoodAsylum","name":"District Asylum","area":"Washington region · fictional address pending","category":"institution","description":"Fictional District Asylum directed by Edmund Wardman’s unnamed brother. Edmund is the family black sheep and begins here as an orderly. Separate from the historical federal hospital.","map":null,"defaultRoom":"reception","rooms":[{"id":"reception","name":"Asylum Reception","description":"Public entrance and inquiries."},{"id":"orderly-station","name":"Orderly Station","restricted":true,"description":"Attendant duty desk, assignment book, and supply register."},{"id":"patient-ward","name":"Patient Ward","restricted":true,"description":"Care area accessible to authorized staff."},{"id":"superintendent-office","name":"Superintendent Office","restricted":true,"description":"Private management offices. Not accessible to family merely by surname."},{"id":"administration","name":"Administration","restricted":true,"description":"Restricted institutional finance records."}]},
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

 // All 38 registered locations have stable numbered map destinations. Sites
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
  chainBridgeFishing:[34,.139,.326]
 });
 // Historical means the destination is real, not merely a fictional business
 // inside a historic building. Star Club and Embassy Room are therefore fictional.
 const HISTORICAL_DESTINATIONS=new Set([
  'hillsdale','oldChinatown','universityMaryland','governmentHospital',
  'whiteHouse','washingtonAirport','potomacFishingBank','babcockLake',
  'fletchersCove','georgetownCanal','easternBranchFishing','chainBridgeFishing',
  'metropolitanPolice','franciscanMonastery','easternMarket','georgetownMarketHouse'
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
  oldChinatown:{"summary":"Chinese-American merchants and residents established a Washington community near Pennsylvania Avenue NW before Chinatown later shifted to a different downtown area.","wikipedia":"https://en.wikipedia.org/wiki/Chinatown_(Washington,_D.C.)","query":"early Chinatown Pennsylvania Avenue Washington DC"},
  universityMaryland:{"summary":"The institution began as the Maryland Agricultural College in the nineteenth century. Its history is distinct from this game's fictional academic encounters.","wikipedia":"https://en.wikipedia.org/wiki/University_of_Maryland,_College_Park","query":"Maryland Agricultural College founding history"},
  governmentHospital:{"summary":"The Government Hospital for the Insane opened in 1855 and later became known as St. Elizabeths Hospital. Fictional patient stories in this game are not archival records.","wikipedia":"https://en.wikipedia.org/wiki/St._Elizabeths_Hospital","query":"Government Hospital for the Insane Washington"},
  whiteHouse:{"summary":"The White House became the official residence of United States presidents in 1800. The game's alternate political events should not be mistaken for real presidencies.","wikipedia":"https://en.wikipedia.org/wiki/White_House","query":"White House history 1600 Pennsylvania Avenue"},
  washingtonAirport:{"summary":"Washington's early airfields and Washington–Hoover Airport were part of aviation in the capital region. Exact names and years in this alternate-history map may diverge from real airport chronology.","wikipedia":"https://en.wikipedia.org/wiki/Washington%E2%80%93Hoover_Airport","query":"Washington Hoover Airport history"},
  potomacFishingBank:{"summary":"The Potomac River is a real watershed and historic transport corridor. The specific game fishing-bank entrance is a fictional gameplay choice.","wikipedia":"https://en.wikipedia.org/wiki/Potomac_River","query":"Potomac River Washington historical fishing"},
  babcockLake:{"summary":"The Babcock Lakes were former fish-culture ponds near the Washington Monument. They are not a surviving open lake on the game's fixed later-drawn map.","wikipedia":"https://en.wikipedia.org/wiki/Babcock_Lakes","query":"Babcock Lakes United States Fish Commission Washington"},
  fletchersCove:{"summary":"Fletcher's Cove is a real stretch of the upper Potomac associated with river recreation and the Chesapeake and Ohio Canal. The exact gameplay shore access is not documented here.","wikipedia":"","query":"Fletcher's Cove Potomac Washington history"},
  georgetownCanal:{"summary":"The Chesapeake and Ohio Canal begins in Georgetown and was an important nineteenth-century transport waterway beside the Potomac.","wikipedia":"https://en.wikipedia.org/wiki/Chesapeake_and_Ohio_Canal","query":"C&O Canal Georgetown Washington historic"},
  easternBranchFishing:{"summary":"The Anacostia River was historically called the Eastern Branch of the Potomac. The game's fishing-bank entrance is not a documented individual historic business.","wikipedia":"https://en.wikipedia.org/wiki/Anacostia_River","query":"Eastern Branch Anacostia River Washington"},
  chainBridgeFishing:{"summary":"Chain Bridge connects Washington with Virginia across the Potomac and takes its name from an earlier bridge design. The exact game fishing bank remains unspecified.","wikipedia":"https://en.wikipedia.org/wiki/Chain_Bridge_(Potomac_River)","query":"Chain Bridge Potomac Washington history"},
  metropolitanPolice:{"summary":"The Metropolitan Police Department of the District of Columbia was established in 1861. The game has not selected a particular historical station for its generic police destination.","wikipedia":"https://en.wikipedia.org/wiki/Metropolitan_Police_Department_of_the_District_of_Columbia","query":"Metropolitan Police Washington DC founding history"},
  franciscanMonastery:{"summary":"The Franciscan Monastery complex in Brookland was established in the late 1890s, with the memorial church completed in 1899. Its appearance in the game's earlier alternate timeline is fictional.","wikipedia":"https://en.wikipedia.org/wiki/Franciscan_Monastery_of_the_Holy_Land_in_America","query":"Franciscan Monastery Holy Land Brookland Washington"},
  easternMarket:{"summary":"Eastern Market is a historic public market in Capitol Hill. Its nineteenth-century market building dates to the 1870s, and the game invents its individual merchants until researched.","wikipedia":"https://en.wikipedia.org/wiki/Eastern_Market%2C_Washington%2C_D.C.","query":"Eastern Market Washington 1873"},
  georgetownMarketHouse:{"summary":"The historic Georgetown Market building on M Street was built in 1865 on a site used for market trade since the late eighteenth century.","wikipedia":"https://en.wikipedia.org/wiki/Georgetown_Market","query":"Georgetown Market House 3276 M Street history"}
 });
 const MAP_ARTWORK_ANCHORS=Object.freeze({
  whiteHouse:[841,428,'White House building at 1600 Pennsylvania Avenue NW, printed immediately north of the south lawn; 12-I'],
  washingtonAirport:[718,730,'Washington Airport, named on map, Arlington'],
  governmentHospital:[1483,834,'St. Elizabeths hospital complex, printed near south edge'],
  georgetownCanal:[638,415,'C&O Canal along Georgetown north bank (route, not surveyed entrance)'],
  easternBranchFishing:[1425,622,'Anacostia shore beside the Navy Yard (bank, not surveyed entrance)']
 });
 // These sites have an agreed street/area on the printed map but no
 // individually labelled building/entrance. They are explicitly NOT verified.
 // Coordinates indicate the stated real-world block or riverbank, not a
 // guessed historical claim for the fictional business located there.
 const MAP_AREA_REFERENCES=Object.freeze({
  star:[826,405,'16th and H Streets NW, just north of the White House; fictional Star Club'],
  oldChinatown:[1035,401,'Pennsylvania Avenue NW, 4th–7th Streets; northern city blocks, not the Mall'],
  russianTradeHall:[755,362,'Dupont Circle / Massachusetts Avenue NW; fictional hall'],
  commercePoker:[711,712,'Washington-Hoover Airport grounds; fictional Commerce Club hangar'],
  home:[1200,480,'Capitol Hill, 7th and C Streets SE near Eastern Market; proposed fictional home'],
  fletchersCove:[395,370,'Upper Potomac north bank upstream of Georgetown; Fletcher cove entrance not labeled'],
  potomacFishingBank:[921,625,'Southwest D.C. Potomac Park shore; precise fishing bank unsettled'],
  franciscanMonastery:[1272,235,'1400 Quincy Street NE, Brookland; mapped block by CUA, monastery entrance not individually labeled'],
  hillsdale:[1498,765,'Barry Farm / Hillsdale southeast of the Anacostia, north of St. Elizabeths'],
  factory:[1266,325,'Ivy City / New York Avenue NE near Fenwick Street; invented works'],
  races:[1640,355,'East side of Anacostia near Kenilworth Ave and Jay St NE; fictional Capital Race Grounds, not river'],
  capitolAirport:[1660,280,'East of Anacostia on land north of Benning race area; fictional aviation site, no exact lot approved'],
  universityMaryland:[1555,90,'University of Maryland campus, College Park; northeastern map area'],
  embassyPoker:[505,132,'Chevy Chase Club vicinity, 6100 Connecticut Avenue; fictional room'],
  washingtonFairgrounds:[750,538,'Potomac Park / Flats west of the Washington Monument; fictional exposition site'],
  babcockLake:[857,527,'Former Washington Monument grounds lake; no water feature on permanent 1938 drawing'],
  easternMarket:[1258,475,'225 7th Street SE in Capitol Hill; historic market block, entrance not individually annotated'],
  georgetownMarketHouse:[572,385,'3276 M Street NW in Georgetown; historic market building area, individually unlabelled'],
  cobblerShop:[1274,486,'Fictional repair storefront beside Eastern Market; invented business lot on a real shopping street']
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
   history:v.history?Object.assign({},v.history):null
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
