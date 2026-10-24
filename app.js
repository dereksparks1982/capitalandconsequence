const $=s=>document.querySelector(s), money=n=>'$'+Math.round(n).toLocaleString('en-US'), cash=n=>(n<0?'-$':'$')+Math.abs(n).toFixed(2), clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const stockSeed=[
['AMW','American Motor Works','Automotive',31.40,.024,.040],['DMW','Dearborn Motor Works','Automotive',24.80,.018,.043],['CMC','Continental Motor Co.','Automotive',18.65,.016,.048],
['NAC','National Aircraft Corp.','Aviation',16.20,.008,.060],['PAW','Pacific Aeronautical Works','Aviation',12.75,.000,.068],['CAA','Columbia Aircraft & Aviation','Aviation',9.40,.000,.072],
['HBC','Hudson Banking Corp.','Banking',42.60,.032,.028],['FNT','First National Trust','Banking',36.15,.030,.026],['USB','Union States Bank','Banking',28.90,.027,.032],
['ATL','Atlantic Chemical','Chemicals',24.10,.025,.040],['UCD','Union Chemical & Dye','Chemicals',38.70,.021,.045],['ACP','American Chemical & Powder','Chemicals',44.30,.020,.048],
['NRT','National Radio & Telegraph','Communications',18.75,.015,.052],['CTC','Continental Telegraph Co.','Communications',27.20,.026,.038],['ATG','American Telephone & Telegraphic','Communications',61.80,.038,.026],
['AEC','American Electrical Corp.','Electrical',34.10,.026,.040],['WEC','Western Electric Apparatus','Electrical',28.35,.024,.043],['RMI','Republic Motor & Instrument','Electrical',21.90,.018,.050],
['MEC','Metropolitan Edison Co.','Utilities',39.60,.042,.024],['CPL','Capital Power & Light','Utilities',32.25,.045,.025],['GPL','Great Plains Light & Power','Utilities',25.70,.041,.028],
['ACS','American Consolidated Steel','Steel',29.85,.020,.052],['LSI','Liberty Steel & Iron','Steel',23.40,.018,.055],['RST','Republic Steel Trust','Steel',17.95,.012,.060],
['NPT','National Petroleum','Petroleum',35.75,.031,.038],['LSP','Lone Star Petroleum','Petroleum',22.60,.028,.045],['GOC','Gulf & Ocean Oil','Petroleum',19.30,.026,.048],
['PAR','Pennsylvania & Atlantic RR','Railroads',27.45,.036,.042],['NCR','New York Continental RR','Railroads',33.80,.040,.038],['CPR','Continental Pacific Railway','Railroads',21.15,.033,.046],['GNR','Great Northern & Western RR','Railroads',25.90,.035,.043],
['NMC','National Mercantile & Catalog','Retail',26.30,.022,.044],['FWC','Franklin Ward & Co.','Retail',19.85,.020,.048],['WFT','Worthington Five & Ten','Retail',14.60,.027,.036],
['AHW','American Harvester Works','Machinery',37.10,.025,.041],['CMW','Central Machine Works','Machinery',20.40,.019,.050],['UTM','Union Tool & Machine','Machinery',15.75,.016,.055],
['INM','International Nickel & Metals','Mining',30.55,.030,.046],['CCM','Continental Copper & Mining','Mining',18.20,.022,.058],['AMC','American Metals Corp.','Mining',24.65,.026,.052],
['ATS','Atlantic Transport & Steamship','Shipping',17.80,.025,.055],['USL','United States Lines & Freight','Shipping',22.30,.028,.050],['PSN','Pacific Steam Navigation','Shipping',13.95,.020,.060],
['NFC','National Foods Corp.','Food',28.40,.033,.030],['APC','American Provision Co.','Food',21.60,.031,.034],['GMC','Great Mills Corp.','Food',16.90,.029,.036],
['ACC','American Consumer Corp.','Consumer',25.15,.028,.038],['HHA','Household & Home Appliances','Consumer',19.45,.020,.048],['USG','United Soap & Goods','Consumer',23.75,.032,.033],['RTA','Republic Tobacco & Allied','Consumer',34.50,.045,.035]
];
/* Fictional 1878 quotations in the alternate district republic, not documented historical listings.
   Later stockSeed entries unlock in their era; legacy 1890 profiles retain their stock universe. */
const stockSeed1878=[
 ['PWR','Potomac & Western Railroad','Railroads',22.40,.035,.038],
 ['CBR','Chesapeake & Baltimore Railway','Railroads',34.10,.030,.042],
 ['DTC','District Telegraph Company','Communications',18.75,.026,.051],
 ['PTE','Potomac Telegraph Exchange','Communications',24.20,.024,.042],
 ['DBC','District Banking Company','Banking',31.50,.034,.029],
 ['MCI','Mid-Atlantic Coal & Iron','Mining',19.60,.015,.052],
 ['PSF','Potomac Steamship & Freight','Shipping',17.85,.024,.051],
 ['NMI','National Machine & Instrument','Machinery',21.90,.018,.048]
];
const stockOpeningValues=Object.fromEntries([...stockSeed1878,...stockSeed].map(row=>[row[0],row[3]]));
function stockUniverse(startYear=CAMPAIGN_START_YEAR){return startYear<1890?[...stockSeed1878,...stockSeed]:stockSeed}
let SAVE_KEY='federalElectricSave';
const CAMPAIGN_START_YEAR=1878, CAMPAIGN_START_DATE='1878-01-02';
const APP_VERSION='v0.6.88-dev', TURNS_PER_MONTH=4, CAMPAIGN_MONTHS=93, CAMPAIGN_TURNS=TURNS_PER_MONTH*CAMPAIGN_MONTHS, BUSINESS_DAY_SECONDS=3600, NIGHT_SECONDS=3600, DAY_SECONDS=BUSINESS_DAY_SECONDS, MARKET_TICK_MS=5000, STOCK_HISTORY_DAYS=90, WORKER_HOURLY_WAGE_1890=.18, WORKDAY_HOURS=8, WORKER_DAILY_WAGE=WORKER_HOURLY_WAGE_1890*WORKDAY_HOURS, GENERAL_MANAGER_DAILY_WAGE=5.50;
const PROFILE_INDEX_KEY='federalElectricProfilesV1', ACTIVE_PROFILE_KEY='federalElectricActiveProfile', PROFILE_MIGRATED_KEY='federalElectricProfilesMigratedV1', PROFILE_LIMIT=4;
const MATERIAL_MARKET={copper:{name:'Copper',unitPrice:.012},glass:{name:'Glass',unitPrice:.006},carbon:{name:'Carbon filaments',unitPrice:.008},tungsten:{name:'Tungsten filaments',unitPrice:.018}};
function filamentMaterial(){return S.gameDate>='1906-01-01'?'tungsten':'carbon'}
function periodRadioAvailable(){return S.gameDate>='1938-01-01'}
function stockAvailableInYear(ticker,sector,year){if(stockSeed1878.some(row=>row[0]===ticker))return year>=1878;return year>=({Automotive:1896,Aviation:1910}[sector]||1890) && !(ticker==='NRT'&&year<1920) && !(ticker==='RMI'&&year<1910) && !(ticker==='HHA'&&year<1900)}
function unitCash(n){return '$'+Number(n).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')}
const contractCustomers=[
 ['Capital Hardware & Supply Co.','Existing customer','balanced'],['Potomac Hotel Supply','Commercial buyer','forgiving'],['District Lighting & Fixture Co.','Regional distributor','strict'],['Chesapeake Mercantile Co.','Wholesale buyer','price'],['National Home Stores','Retail chain','quality'],['Columbia Property Management','Property operator','impatient']
];
const customerTraits={balanced:{label:'Practical',reject:.55,discount:.82,partial:true},forgiving:{label:'Forgiving',reject:.28,discount:.88,partial:true},strict:{label:'Strict specification buyer',reject:.82,discount:.72,partial:false},price:{label:'Price-sensitive wholesaler',reject:.42,discount:.78,partial:true},quality:{label:'Quality-focused chain',reject:.88,discount:.70,partial:false},impatient:{label:'Deadline-sensitive operator',reject:.62,discount:.80,partial:true}};
const contractGrades=[
 {quality:'economy',qualityName:'Economy Short-Life',price:.12},
 {quality:'standard',qualityName:'Standard Service',price:.15},
 {quality:'long',qualityName:'Long-Life Premium',price:.20}
];
function hashString(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function seededUnit(key){return (hashString(key)%1000000)/1000000}
function businessDaysBefore(iso,count){const out=[],d=new Date(iso+'T12:00:00');while(out.length<count){d.setDate(d.getDate()-1);if(d.getDay()!==0&&d.getDay()!==6)out.unshift(d.toISOString().slice(0,10))}return out}
function openingGapFor(ticker,iso,vol){let gap=(seededUnit(ticker+'|open|'+iso)-.5)*Math.min(.018,.004+vol*.18);if(Math.abs(gap)<.0008)gap=gap<0?-.0008:.0008;return gap}
function makeStockHistory(ticker,openingPrice,vol,count=STOCK_HISTORY_DAYS,startISO=CAMPAIGN_START_DATE){
 const dates=businessDaysBefore(startISO,count),gap=openingGapFor(ticker,startISO,vol);
 let p=Math.max(1,Math.round((openingPrice/(1+gap))*100)/100),back=[];
 for(let i=dates.length-1;i>=0;i--){back.push({date:dates[i],close:+p.toFixed(2)});const move=(seededUnit(ticker+'|history|'+dates[i])-.5)*vol*.35;p=Math.max(1,p/(1+move))}
 return back.reverse();
}
function makeStocks(startISO=CAMPAIGN_START_DATE,startYear=+startISO.slice(0,4)){return Object.fromEntries(stockUniverse(startYear).map(([ticker,name,sector,price,yieldRate,vol])=>{const history=stockAvailableInYear(ticker,sector,+startISO.slice(0,4))?makeStockHistory(ticker,price,vol,STOCK_HISTORY_DAYS,startISO):[],prevClose=history.length?history[history.length-1].close:price;return [ticker,{name,sector,price,hiddenPrice:price,prev:prevClose,prevClose,open:price,yieldRate,vol,history}]}))}
function mergeStockHistory(seedHistory,savedHistory){
 const byDate=new Map();
 for(const v of Array.isArray(seedHistory)?seedHistory:[]){if(v&&v.date&&Number.isFinite(+v.close))byDate.set(v.date,{date:v.date,close:+v.close})}
 for(const v of Array.isArray(savedHistory)?savedHistory:[]){if(v&&v.date&&Number.isFinite(+v.close))byDate.set(v.date,{date:v.date,close:+v.close})}
 return [...byDate.values()].sort((a,b)=>a.date.localeCompare(b.date)).slice(-260);
}
function makePortfolio(startYear=CAMPAIGN_START_YEAR){return Object.fromEntries(stockUniverse(startYear).map(x=>[x[0],{shares:0,cost:0,realized:0}]))}
function businessTurnDatesForMonth(iso){
 const parts=iso.slice(0,7).split('-').map(Number),y=parts[0],m=parts[1],days=new Date(y,m,0).getDate(),weekdays=[];
 for(let d=1;d<=days;d++){const x=new Date(y,m-1,d,12,0,0);if(x.getDay()!==0&&x.getDay()!==6)weekdays.push(String(y)+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'))}
 if(weekdays.length<=TURNS_PER_MONTH)return weekdays;
 const out=[];for(let i=0;i<TURNS_PER_MONTH;i++){const idx=Math.round(i*(weekdays.length-1)/(TURNS_PER_MONTH-1)),date=weekdays[idx];if(!out.includes(date))out.push(date)}return out;
}
function campaignDateForTurn(serial,startYear=CAMPAIGN_START_YEAR){
 const turn=Math.max(1,Math.floor(serial)),monthIndex=Math.floor((turn-1)/TURNS_PER_MONTH),slot=(turn-1)%TURNS_PER_MONTH,d=new Date(startYear,monthIndex,1,12,0,0),key=String(d.getFullYear())+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01',dates=businessTurnDatesForMonth(key);
 return startYear===1890&&monthIndex===0&&slot===0?CAMPAIGN_START_DATE:dates[Math.min(slot,dates.length-1)];
}
function nextBusinessTurn(iso){
 const current=businessTurnDatesForMonth(iso),next=current.find(d=>d>iso);if(next)return next;
 const p=iso.slice(0,7).split('-').map(Number),d=new Date(p[0],p[1],1,12,0,0),nextMonth=String(d.getFullYear())+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01';
 return businessTurnDatesForMonth(nextMonth)[0];
}
function turnNumberForDate(iso){const dates=businessTurnDatesForMonth(iso);let best=0;for(let i=0;i<dates.length;i++){if(dates[i]<=iso)best=i;else break}return Math.min(TURNS_PER_MONTH,best+1)}
function deadlineLabel(key){const p=key.split('-').map(Number),d=new Date(p[0],p[1]-1,1,12,0,0);return 'End of '+d.toLocaleDateString('en-US',{month:'long',year:'numeric'})+' · Turn '+TURNS_PER_MONTH}
function monthKey(iso){return iso.slice(0,7)}
function campaignSerialForMonthEnd(key,startYear=CAMPAIGN_START_YEAR){const p=key.split('-').map(Number),monthIndex=(p[0]-startYear)*12+(p[1]-1);return Math.max(1,monthIndex*TURNS_PER_MONTH+TURNS_PER_MONTH)}
function contractDeadlineDate(serial,startYear=CAMPAIGN_START_YEAR){return campaignDateForTurn(Math.max(1,serial),startYear)}
function contractDeadlineLabel(serial,deadlineClass='STANDARD',startYear=CAMPAIGN_START_YEAR){const iso=contractDeadlineDate(serial,startYear),d=new Date(iso+'T12:00:00'),date=d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),turnLabel=S?.endlessMode?'Turn '+serial:'Turn '+serial+'/'+CAMPAIGN_TURNS;return deadlineClass==='SAME DAY'?'TODAY · '+date+' · '+turnLabel:date+' · '+turnLabel}
function chooseContractWindow(quantity){const roll=Math.random();if(roll<.08)return {deadlineClass:'SAME DAY',turns:1,priceMult:1.2};if(roll<.18)return {deadlineClass:'RUSH',turns:2,priceMult:1.12};if(quantity>=15000)return {deadlineClass:'MAJOR',turns:12,priceMult:1.04};if(quantity>=8000)return {deadlineClass:'LARGE',turns:8,priceMult:1.035};if(quantity>=5000)return {deadlineClass:'EXTENDED',turns:6,priceMult:1.025};return {deadlineClass:'STANDARD',turns:4,priceMult:1}}
function rollRaidDays(iso){const d=new Date(iso+'T12:00:00'),y=d.getFullYear(),m=d.getMonth(),days=new Date(y,m+1,0).getDate(),count=1+Math.floor(Math.random()*2),set=new Set();while(set.size<count){const n=1+Math.floor(Math.random()*days),x=new Date(y,m,n);if(x.getDay()!==0)set.add(n)}return [...set].sort((a,b)=>a-b)}
function rollStarRaidTurn(serial){return Math.max(1,Math.floor(serial||1))+16+Math.floor(Math.random()*17)}
function starRaidDateForTurn(serial,startYear=CAMPAIGN_START_YEAR){return campaignDateForTurn(Math.max(1,Math.floor(serial||1)),startYear)}
function pokerRisk(circle){return circle==='working'?.012:circle==='middle'?.007:.003}
const starterContract=()=>({id:'FE-001',customer:'Capital Hardware & Supply Co.',product:'Electric Light Bulbs',quality:'standard',qualityName:'Standard Service',quantity:1000,delivered:0,completed:0,productionQuantity:1000,productionPolicy:'normal',productionState:'queued',price:.15,status:'accepted',deadlineClass:'STANDARD',deadlineTurns:4,deadlineTurnSerial:4,deadlineDate:campaignDateForTurn(4),deadline:'End of January 1890 · Turn 4/372',deadlineMonth:'1890-01',deadlinePassed:false,relationship:'Existing customer',history:0,productionSeconds:600});
function nextContractNumber(){return Math.max(1,...S.contracts.concat(S.contractOffers||[]).map(x=>+(String(x.id||'').replace(/\D/g,''))||0))+1}
function contractGrade(q){return contractGrades.find(g=>g.quality===q)||contractGrades[1]}
function contractRunSeconds(qty){return Math.max(600,Math.ceil(Math.max(1,qty)/1000)*2400)}
function makeContractOffer(){
 const sizeRoll=Math.random();
 const quantity=sizeRoll<.34?1000+Math.floor(Math.random()*7)*250:sizeRoll<.67?3000+Math.floor(Math.random()*9)*250:sizeRoll<.9?6000+Math.floor(Math.random()*13)*500:12500+Math.floor(Math.random()*16)*500;
 const productionSeconds=contractRunSeconds(quantity),win=chooseContractWindow(quantity),deadlineTurnSerial=(S.turnSerial||1)+win.turns-1;
 const customer=contractCustomers[Math.floor(Math.random()*contractCustomers.length)],grade=contractGrades[Math.floor(Math.random()*contractGrades.length)],hist=S.customerHistory?.[customer[0]],loyalty=hist?(hist.completed*2-hist.rejected*2-hist.late):0;
 const guideAdj=.98+Math.random()*.07+Math.max(-.035,Math.min(.045,loyalty*.005));
 const suggestedPrice=+(grade.price*guideAdj*win.priceMult).toFixed(3);
 return {id:'FE-'+String(nextContractNumber()).padStart(3,'0'),customer:customer[0],product:'Electric Light Bulbs',requestedQuality:grade.quality,requestedQualityName:grade.qualityName,requestedQuantity:quantity,suggestedPrice,quality:grade.quality,qualityName:grade.qualityName,quantity,delivered:0,completed:0,productionQuantity:quantity,productionPolicy:'normal',productionState:'queued',price:suggestedPrice,status:'offered',deadlineClass:win.deadlineClass,deadlineTurns:win.turns,deadlineTurnSerial,deadlineDate:contractDeadlineDate(deadlineTurnSerial,S.campaignStartYear),deadline:contractDeadlineLabel(deadlineTurnSerial,win.deadlineClass,S.campaignStartYear),deadlineMonth:monthKey(contractDeadlineDate(deadlineTurnSerial,S.campaignStartYear)),deadlinePassed:false,relationship:customer[1],customerTrait:customer[2],history:0,productionSeconds,negotiation:{rounds:0,counter:null,lastProposal:null}};
}
const initial=()=>({version:15,campaignStartYear:CAMPAIGN_START_YEAR,gameDate:CAMPAIGN_START_DATE,turnSerial:1,campaignCompleted:false,campaignEndPending:false,endlessMode:true,phase:'day',dayRemaining:DAY_SECONDS,phaseBudgetRemainder:0,paused:false,worldCalendar:window.FE_CALENDAR_BRIDGE?.start?.({},CAMPAIGN_START_DATE)||null,worldCalendarRemainder:0,worldCalendarStatus:'ready',dayStartCompanyCash:2500,dayStartPersonalCash:600,dailyReport:null,currentLocation:{locationId:'factory',roomId:'executive-office'},personalEffects:{version:1,items:[]},fishing:{version:1,gear:false,attempts:0,session:null,catches:[],history:[]},housing:{version:1,primaryResidenceId:'capitol-hill-rowhouse',tenure:'undetermined',properties:[],staff:[],improvements:[]},institutionInterests:{version:1,investments:[],appointments:[]},characterRoute:'industrialist',otherLives:{version:1,seed:null,lastProcessedTurn:0,actors:{},history:[]},npcSimulation:{version:1,seed:null,lastStep:null,agents:{},events:[]},transport:{version:2,assets:[],events:[],journeys:[]},pokerSessions:{version:1,pending:[],settled:[]},brokerage:{version:1,visits:0,lastVisitDate:null},mapLeads:{version:1,pending:[],history:[]},outcomeEvents:[],companyCash:2500,personalCash:600,ownerDistributionsToday:0,divertedToday:0,unaccountedFunds:0,corporateMisuseCount:0,debt:0,reputation:55,workers:1,machinery:92,workforce:{present:1,late:0,absent:0,skill:68,morale:73,discipline:81,efficiency:1,quality:92},turnConditions:{weather:'Cold and clear',summary:'Cold, clear Washington weather. Roads and utility service are normal.',productionFactor:1,powerOutageSeconds:0},personnelIssue:null,delegation:{foremanAutoStart:false,alerts:[],managementNeglect:0,lastNeglectTurn:0,generalManager:{hired:false,name:'General Manager',competence:72,reliability:70,dailyWage:GENERAL_MANAGER_DAILY_WAGE}},lineHoldReason:null,inventory:0,inventoryByGrade:{economy:0,standard:0,long:0},finishedLots:[],pendingQualityClaims:[],lastProductionQuality:null,materials:{copper:6000,glass:6000,carbon:3500,tungsten:0},standingSalesTotal:0,cityOpportunities:[],lastRevenue:0,lastExpenses:0,workshopPayroll:{version:1,owedCents:0,entries:{}},ledger:[],stocks:makeStocks(),portfolio:makePortfolio(),transactions:[],marketWire:'The Federal Exchange is open. Federal Electric has the opening quotation sheet; closing quotations will be published after the bell.',headline:'TELEGRAPH APPARATUS IN DEMAND',story:'Washington instrument makers supply telegraph companies and the electrical trade.',societyStory:'Washington begins another business day of meetings, dinners, private clubs and quiet conversations.',sportsStory:'Capital Race Grounds and licensed boxing results will appear here as the sporting calendar develops.',lastRaceResult:null,lastBoxingResult:null,newsArchive:[],titleNewspaperPurchases:[],titleNewspaperArchive:{},collectibleCards:[],notes:[],componentWorks:window.FE_COMPONENT_WORKS?.createOpeningOrders?.(window.FE_COMPONENT_WORKS?.createState?.(CAMPAIGN_START_DATE))||null,componentTransactionSequence:0,contacts:{madamStar:{name:'Madam Star',trust:0,met:false},bookie:{name:'Eddie Doyle, bookmaker',trust:0,met:false},hayes:{name:'Inspector Arthur Hayes',trust:0,resentment:0,met:false},vale:{name:'Harrison Vale',trust:0,met:false},promoter:{name:'Marty Kane, fight promoter',trust:0,met:false}},raidMonth:'1878-01',raidDays:rollRaidDays(CAMPAIGN_START_DATE),starNextRaidTurnSerial:rollStarRaidTurn(1),starNextRaidDate:null,starVisitedTonight:false,starRaidOccurred:false,bookieKnown:false,middlePokerUnlocked:false,elitePokerUnlocked:false,pokerWins:{working:0,middle:0,elite:0},pokerSimulated:{working:0,middle:0,elite:0},pokerDay:CAMPAIGN_START_DATE,pokerPlayed:{working:0,middle:0,elite:0},lastRaidOutcome:null,contracts:[],contractOffers:[],productionQueue:[],activeContractId:null,lineStatus:'idle',lineMessage:'No production order is running.',customerHistory:{'Capital Hardware & Supply Co.':{completed:0,rejected:0,late:0}}});
let S=initial(), marketTimer=null, clockTimer=null, autosaveTimer=null, selectedStockTicker=null;
const stockTradeQuantityDrafts=Object.create(null);
function migrate(x){const fresh=initial();if(!x)return fresh;Object.assign(fresh,x,{version:15});fresh.campaignStartYear=Number.isInteger(+x.campaignStartYear)?+x.campaignStartYear:(String(x.gameDate||'')>='1938-01-01'?1938:String(x.gameDate||'')>='1890-01-01'?1890:CAMPAIGN_START_YEAR);fresh.materials=Object.assign({copper:6000,glass:6000,carbon:3500,tungsten:0},x.materials||{});fresh.cityOpportunities=Array.isArray(x.cityOpportunities)?x.cityOpportunities:[];if(!x.gameDate){fresh.gameDate=CAMPAIGN_START_DATE;fresh.dayRemaining=DAY_SECONDS}fresh.phase=['day','night','report'].includes(x.phase)?x.phase:'day';fresh.phaseBudgetRemainder=Number.isSafeInteger(x.phaseBudgetRemainder)&&x.phaseBudgetRemainder>=0&&x.phaseBudgetRemainder<(fresh.phase==='day'?9:fresh.phase==='night'?15:1)?x.phaseBudgetRemainder:0;fresh.paused=!!x.paused;window.FE_CALENDAR_BRIDGE?.migrate?.(fresh,x);fresh.mapLeads=window.FE_MAP_LEADS?.migrate?.(x.mapLeads)||initial().mapLeads;fresh.dayStartCompanyCash=Number.isFinite(+x.dayStartCompanyCash)?+x.dayStartCompanyCash:+fresh.companyCash;fresh.dayStartPersonalCash=Number.isFinite(+x.dayStartPersonalCash)?+x.dayStartPersonalCash:+fresh.personalCash;fresh.dailyReport=x.dailyReport||null;fresh.stocks=makeStocks(fresh.campaignStartYear===1938?'1938-01-03':fresh.campaignStartYear>=1890?'1890-01-02':CAMPAIGN_START_DATE,fresh.campaignStartYear);for(const [k,v] of Object.entries(x.stocks||{})){if(fresh.stocks[k]){const opening=+v.open||+v.price||fresh.stocks[k].open,visible=+v.price||opening,hidden=+v.hiddenPrice||visible||opening,history=mergeStockHistory(fresh.stocks[k].history,v.history).filter(h=>stockAvailableInYear(k,fresh.stocks[k].sector,+h.date.slice(0,4))),syntheticPrev=Math.max(1,Math.round(opening/(1+openingGapFor(k,fresh.gameDate,fresh.stocks[k].vol))*100)/100),prevClose=Number.isFinite(+v.prevClose)&&+v.prevClose>0?+v.prevClose:syntheticPrev;Object.assign(fresh.stocks[k],v,{open:opening,price:fresh.phase==='day'?opening:visible,hiddenPrice:hidden,prev:prevClose,prevClose,history})}}fresh.portfolio=makePortfolio(fresh.campaignStartYear);for(const [k,v] of Object.entries(x.portfolio||{})){if(!fresh.portfolio[k])continue;fresh.portfolio[k]=typeof v==='number'?{shares:v,cost:v*(fresh.stocks[k]?.price||0),realized:0}:{shares:+v.shares||0,cost:+v.cost||0,realized:+v.realized||0}}fresh.transactions=x.transactions||[];fresh.newsArchive=x.newsArchive||[];fresh.titleNewspaperPurchases=Array.isArray(x.titleNewspaperPurchases)?x.titleNewspaperPurchases:[];fresh.titleNewspaperArchive=x.titleNewspaperArchive&&typeof x.titleNewspaperArchive==='object'?x.titleNewspaperArchive:{};fresh.collectibleCards=Array.isArray(x.collectibleCards)?x.collectibleCards.filter(v=>v&&typeof v==='object').map(v=>Object.assign({},v)):[];fresh.notes=x.notes||[];fresh.contacts=Object.assign(initial().contacts,x.contacts||{});if(fresh.contacts.hayes?.name==='Commissioner Arthur Hayes')fresh.contacts.hayes.name='Inspector Arthur Hayes';fresh.raidMonth=x.raidMonth||monthKey(fresh.gameDate);fresh.raidDays=x.raidDays||rollRaidDays(fresh.gameDate);fresh.starNextRaidTurnSerial=Number.isFinite(+x.starNextRaidTurnSerial)&&+x.starNextRaidTurnSerial>fresh.turnSerial?Math.floor(+x.starNextRaidTurnSerial):rollStarRaidTurn(fresh.turnSerial);fresh.starNextRaidDate=starRaidDateForTurn(fresh.starNextRaidTurnSerial,fresh.campaignStartYear);fresh.starVisitedTonight=!!x.starVisitedTonight;fresh.starRaidOccurred=!!x.starRaidOccurred;fresh.bookieKnown=!!(x.bookieKnown||fresh.contacts.bookie?.met);fresh.pokerWins=Object.assign({working:0,middle:0,elite:0},x.pokerWins||{});fresh.pokerSimulated=Object.assign({working:0,middle:0,elite:0},x.pokerSimulated||{});fresh.middlePokerUnlocked=!!x.middlePokerUnlocked||!!x.bookieKnown||!!fresh.contacts.bookie?.met;fresh.elitePokerUnlocked=!!x.elitePokerUnlocked;fresh.pokerDay=x.pokerDay||fresh.gameDate;fresh.pokerPlayed=x.pokerPlayed||{working:0,middle:0,elite:0};fresh.contracts=x.contracts||[starterContract()];fresh.contractOffers=x.contractOffers||[];
 fresh.componentWorks=x.componentWorks?window.FE_COMPONENT_WORKS.verify(x.componentWorks):null;
 fresh.workshopPayroll=x.workshopPayroll&&x.workshopPayroll.version===1?x.workshopPayroll:{version:1,owedCents:0,entries:{}};
 fresh.componentTransactionSequence=Number.isSafeInteger(x.componentTransactionSequence)&&x.componentTransactionSequence>=0?x.componentTransactionSequence:0;
 fresh.turnSerial=Number.isFinite(+x.turnSerial)?Math.max(1,Math.floor(+x.turnSerial)):1;
 fresh.campaignCompleted=!!x.campaignCompleted;fresh.campaignEndPending=false;fresh.endlessMode=true;
 fresh.inventoryByGrade=Object.assign({economy:0,standard:0,long:0},x.inventoryByGrade||{});
 fresh.finishedLots=Array.isArray(x.finishedLots)?x.finishedLots.map(v=>Object.assign({},v)):[];
 if(!fresh.finishedLots.length){for(const q of ['economy','standard','long']){const amount=Math.max(0,+fresh.inventoryByGrade[q]||0);if(amount>0)fresh.finishedLots.push({id:'LEGACY-'+q.toUpperCase(),runId:null,contractId:null,product:'Electric Light Bulbs',quality:q,qualityName:contractGrade(q).qualityName,available:amount,produced:amount,rejected:0,qc:92,latentDefectRate:.006,producedDate:fresh.gameDate})}}
 fresh.pendingQualityClaims=Array.isArray(x.pendingQualityClaims)?x.pendingQualityClaims:[];
 fresh.workforce=Object.assign({present:fresh.workers,late:0,absent:0,skill:68,morale:73,discipline:81,efficiency:1,quality:92},x.workforce||{});
 fresh.turnConditions=Object.assign({weather:'Clear',summary:'Normal operating conditions.',productionFactor:1,powerOutageSeconds:0},x.turnConditions||{});
 fresh.personnelIssue=x.personnelIssue||null;
 fresh.delegation=Object.assign({foremanAutoStart:false,alerts:[],managementNeglect:0,lastNeglectTurn:0,generalManager:null},x.delegation||{});
 fresh.delegation.foremanAutoStart=!!fresh.delegation.foremanAutoStart;
 fresh.delegation.alerts=Array.isArray(fresh.delegation.alerts)?fresh.delegation.alerts.filter(v=>v&&typeof v==='object').slice(-20):[];
 fresh.delegation.managementNeglect=clamp(Math.floor(+fresh.delegation.managementNeglect||0),0,12);
 fresh.delegation.lastNeglectTurn=Math.max(0,Math.floor(+fresh.delegation.lastNeglectTurn||0));
 fresh.delegation.generalManager=Object.assign({hired:false,name:'General Manager',competence:72,reliability:70,dailyWage:GENERAL_MANAGER_DAILY_WAGE},fresh.delegation.generalManager||{});
 fresh.delegation.generalManager.hired=!!fresh.delegation.generalManager.hired;
 fresh.delegation.generalManager.dailyWage=GENERAL_MANAGER_DAILY_WAGE;
 fresh.lineHoldReason=x.lineHoldReason||null;
 fresh.currentLocation=normalizeCurrentLocation(x.currentLocation);
 // Existing executives stay executives. Other lives use the same city but need their own stories.
 fresh.characterRoute=window.FE_CHARACTERS?.normalize?.(x.characterRoute)||'industrialist';
 fresh.otherLives=x.otherLives&&typeof x.otherLives==='object'?x.otherLives:initial().otherLives;
 fresh.npcSimulation=x.npcSimulation&&typeof x.npcSimulation==='object'?x.npcSimulation:initial().npcSimulation;
 fresh.transport={version:2,assets:[],events:[],journeys:[]};
 const seenTransport=new Set();
 for(const v of Array.isArray(x.transport?.assets)?x.transport.assets:[]){
  if(!v||typeof v.id!=='string'||seenTransport.has(v.id)||!['horse','carriage'].includes(v.kind)||!['tethered','stabled','traveling','missing','stolen','in-care'].includes(v.status))continue;
  if(typeof v.locationId!=='string'||!v.locationId||typeof v.name!=='string')continue;
  seenTransport.add(v.id);
  fresh.transport.assets.push({id:v.id,name:v.name.slice(0,80),kind:v.kind,locationId:v.locationId,status:v.status,condition:Math.max(0,Math.min(100,Number.isFinite(+v.condition)?+v.condition:100)),homeLocationId:typeof v.homeLocationId==='string'?v.homeLocationId:null});
 }
 fresh.transport.events=Array.isArray(x.transport?.events)?x.transport.events.filter(v=>v&&typeof v.id==='string'&&typeof v.assetId==='string').slice(-256):[];
 fresh.transport.journeys=Array.isArray(x.transport?.journeys)?x.transport.journeys.filter(v=>v&&typeof v.id==='string'&&typeof v.from==='string'&&typeof v.to==='string'&&v.provisional===true).slice(-256):[];
 fresh.pokerSessions={version:1,pending:[],settled:[]};
 for(const r of Array.isArray(x.pokerSessions?.pending)?x.pokerSessions.pending:[]){if(r&&typeof r.id==='string'&&typeof r.profileId==='string'&&['working','middle','elite'].includes(r.circle)&&Number.isFinite(+r.stake)&&+r.stake>0&&typeof r.gameDate==='string')fresh.pokerSessions.pending.push({id:r.id,profileId:r.profileId,circle:r.circle,stake:+r.stake,gameDate:r.gameDate,claimed:!!r.claimed})}
 fresh.pokerSessions.settled=Array.isArray(x.pokerSessions?.settled)?x.pokerSessions.settled.filter(r=>r&&typeof r.id==='string').slice(-256):[];
 fresh.outcomeEvents=Array.isArray(x.outcomeEvents)?x.outcomeEvents.filter(r=>r&&typeof r.id==='string'&&typeof r.type==='string').slice(-512):[];
 // Save this alongside the player profile, never in a global shared inventory.
 // Do not create documents or possessions that the player has not acquired.
 const validPersonalContainers=new Set(['left-pocket','right-pocket','home-storage','office-storage']);
 const seenPersonalEffects=new Set();
 fresh.personalEffects={version:1,items:[]};
 for(const item of Array.isArray(x.personalEffects?.items)?x.personalEffects.items:[]){
  if(!item||typeof item.id!=='string'||typeof item.name!=='string'||!validPersonalContainers.has(item.container)||seenPersonalEffects.has(item.id))continue;
  if(!item.id.trim()||!item.name.trim())continue;
  seenPersonalEffects.add(item.id);
  fresh.personalEffects.items.push({id:item.id,name:item.name.slice(0,120),kind:typeof item.kind==='string'?item.kind.slice(0,60):'object',container:item.container});
 }
 fresh.fishing=x.fishing&&x.fishing.version===1?x.fishing:initial().fishing;
 window.FE_FISHING?.ensure?.(fresh);
 // Housing is an independent family/property record, not a company asset.
 // Existing profiles gain the baseline residence without claiming they own it.
 const oldHousing=x.housing&&typeof x.housing==='object'?x.housing:{};
 fresh.housing={
  version:1,primaryResidenceId:'capitol-hill-rowhouse',
  tenure:['rented','owned','provided','undetermined'].includes(oldHousing.tenure)?oldHousing.tenure:'undetermined',
  properties:Array.isArray(oldHousing.properties)?oldHousing.properties.filter(v=>typeof v==='string').slice(0,30):[],
  staff:Array.isArray(oldHousing.staff)?oldHousing.staff.filter(v=>typeof v==='string').slice(0,30):[],
  improvements:Array.isArray(oldHousing.improvements)?oldHousing.improvements.filter(v=>typeof v==='string').slice(0,40):[]
 };
 fresh.institutionInterests={version:1,investments:[],appointments:[]};
 // Do not turn a prospective asylum into a free or automatically owned institution.
 for(const entry of Array.isArray(x.institutionInterests?.investments)?x.institutionInterests.investments:[]){
  if(entry&&entry.institutionId==='blackwoodAsylum'&&Number.isFinite(+entry.stakePercent)&&+entry.stakePercent>0&&+entry.stakePercent<=100)fresh.institutionInterests.investments.push({institutionId:'blackwoodAsylum',stakePercent:+entry.stakePercent});
 }
 for(const entry of Array.isArray(x.institutionInterests?.appointments)?x.institutionInterests.appointments:[]){
  if(entry&&entry.institutionId==='blackwoodAsylum'&&['superintendent','board-member','manager'].includes(entry.role))fresh.institutionInterests.appointments.push({institutionId:'blackwoodAsylum',role:entry.role});
 }
 fresh.customerHistory=x.customerHistory||{'Capital Hardware & Supply Co.':{completed:0,rejected:0,late:0}};
 for(const c of fresh.contracts.concat(fresh.contractOffers)){if(c.product==='Electric Lamps')c.product='Electric Light Bulbs';if(!fresh.customerHistory[c.customer])fresh.customerHistory[c.customer]={completed:0,rejected:0,late:0,discounted:0,partial:0};if(c.customerTrait==null)c.customerTrait=(contractCustomers.find(v=>v[0]===c.customer)||[])[2]||'balanced';if(c.producedQuality==null)c.producedQuality=c.quality;if(!Number.isFinite(+c.delivered))c.delivered=(c.status==='delivered'||c.status==='delivered-discount')?Math.max(0,+c.quantity||0):0;if(!Number.isFinite(+c.productionQuantity)||+c.productionQuantity<1)c.productionQuantity=Math.max(1,+c.quantity||1);if(!c.productionPolicy)c.productionPolicy='normal';if(!c.deadlineMonth)c.deadlineMonth=monthKey(fresh.gameDate);if(!Number.isFinite(+c.deadlineTurnSerial))c.deadlineTurnSerial=campaignSerialForMonthEnd(c.deadlineMonth,fresh.campaignStartYear);if(!c.deadlineClass)c.deadlineClass='STANDARD';if(!Number.isFinite(+c.deadlineTurns))c.deadlineTurns=Math.max(1,c.deadlineTurnSerial-fresh.turnSerial+1);c.deadlineDate=c.deadlineDate||contractDeadlineDate(c.deadlineTurnSerial,fresh.campaignStartYear);c.deadlineMonth=monthKey(c.deadlineDate);c.deadline=contractDeadlineLabel(c.deadlineTurnSerial,c.deadlineClass,fresh.campaignStartYear);c.deadlinePassed=!!c.deadlinePassed;if(!Number.isFinite(+c.lastLatePenaltyTurn))c.lastLatePenaltyTurn=0;if(c.status==='production'||c.status==='complete')c.status='accepted';if(!c.productionState)c.productionState=(c.status==='delivered'||c.status==='delivered-discount')?'complete':(+c.completed>=+c.productionQuantity?'complete':'queued');if(c.status==='offered'){if(c.requestedQuantity==null)c.requestedQuantity=c.quantity;if(c.requestedQuality==null)c.requestedQuality=c.quality;if(c.requestedQualityName==null)c.requestedQualityName=contractGrade(c.requestedQuality).qualityName;if(c.suggestedPrice==null)c.suggestedPrice=+c.price||contractGrade(c.requestedQuality).price;if(!c.negotiation)c.negotiation={rounds:0,counter:null,lastProposal:null}}if(!c.productionSeconds)c.productionSeconds=contractRunSeconds(c.productionQuantity||c.quantity)}
 fresh.productionQueue=(x.productionQueue||fresh.contracts.filter(c=>c.productionState==='queued'||c.productionState==='running'||c.productionState==='paused').map(c=>c.id)).filter(id=>{const c=fresh.contracts.find(v=>v.id===id);return c&&c.status!=='delivered'&&c.status!=='delivered-discount'&&(+c.completed||0)<(+c.productionQuantity||+c.quantity||1)});
 fresh.activeContractId=fresh.productionQueue.includes(x.activeContractId)?x.activeContractId:null;fresh.lineStatus=x.lineStatus||'idle';fresh.lineMessage=x.lineMessage||'No production run is running.';fresh.lastProductionQuality=x.lastProductionQuality||null;
 for(const p of Object.values(fresh.portfolio)){if(p.realized==null)p.realized=0}for(const c of fresh.contracts.concat(fresh.contractOffers||[])){if(!c.productionSeconds)c.productionSeconds=contractRunSeconds(c.productionQuantity||c.quantity)}fresh.marketWire='Trading continues on the Federal Exchange. Federal Electric has no live intraday quotation service; the opening sheet remains posted until the closing quotations are published.';return fresh}
let profileSaveReadBlocked=false;
let profileSaveWriteError='';
let diskSaveQueue=Promise.resolve();
function enqueueDiskWrite(profileId,json){
 if(!window.FE_DISK_SAVES)return;
 diskSaveQueue=diskSaveQueue.catch(()=>{}).then(()=>window.FE_DISK_SAVES.write(profileId,json)).catch(err=>{
  console.warn('Federal Electric: disk save mirror failed; local autosave is still present',err);
 });
}
function enqueueDiskDelete(profileId){
 if(!window.FE_DISK_SAVES)return;
 diskSaveQueue=diskSaveQueue.catch(()=>{}).then(()=>window.FE_DISK_SAVES.remove(profileId)).catch(err=>{
  console.warn('Federal Electric: could not delete saved disk mirror',err);
 });
}
function setSaveWarning(message=''){
 profileSaveWriteError=message;
 const banner=document.getElementById('saveFailureBanner');
 if(!banner)return;
 banner.hidden=!message;
 banner.textContent=message;
}
function save(silent=true){
 if(!activeProfileId()||profileSaveReadBlocked)return false;
 const profileId=activeProfileId();
 let payload=S;
 if(titleDevInfiniteMoney&&titleDevMoneySnapshot){
  payload=Object.assign({},payload,{companyCash:titleDevMoneySnapshot.companyCash,personalCash:titleDevMoneySnapshot.personalCash});
 }
 // Never persist a developer-only room location into ordinary career saves.
 if(titleDevUnlockAllRooms&&S.currentLocation){
  const position=currentCityLocation();
  if(!ordinaryPlayerRoomAllowed(position.locationId,position.roomId))
   payload=Object.assign({},payload,{currentLocation:{locationId:'hillsdale',roomId:'neighborhood-street'}});
 }
 // Never persist the temporary player-absent simulation scope.
 if(S.npcOffscreenCatchup)payload=Object.assign({},payload,{npcOffscreenCatchup:false});
 // localStorage writes can throw QuotaExceededError or security exceptions.
 // A failed write is never represented as a successful autosave.
 try{
  const serialized=JSON.stringify(payload);
  localStorage.setItem(SAVE_KEY,serialized);
  enqueueDiskWrite(profileId,serialized);
 }catch(err){
  const message='AUTOSAVE FAILED. Your latest progress is not on disk. Free up storage space and keep Federal Electric open, then try again.';
  if(profileSaveWriteError!==message)console.error('Federal Electric autosave failure',err);
  setSaveWarning(message);
  return false;
 }
 if(profileSaveWriteError)setSaveWarning('');
 try{touchActiveProfile()}catch(err){console.warn('Profile save succeeded; profile index update failed',err)}
 updateCashHeader();
 if(!silent)note('Company books saved.');
 return true;
}
function readProfiles(){try{const p=JSON.parse(localStorage.getItem(PROFILE_INDEX_KEY)||'[]');return Array.isArray(p)?p.slice(0,PROFILE_LIMIT):[]}catch(e){return[]}}
function writeProfiles(p){localStorage.setItem(PROFILE_INDEX_KEY,JSON.stringify((p||[]).slice(0,PROFILE_LIMIT)))}
function profileSaveKey(id){return 'federalElectricProfile_'+id}
function activeProfileId(){return localStorage.getItem(ACTIVE_PROFILE_KEY)||''}
function setActiveProfileId(id){if(id)localStorage.setItem(ACTIVE_PROFILE_KEY,id);else localStorage.removeItem(ACTIVE_PROFILE_KEY);SAVE_KEY=id?profileSaveKey(id):'federalElectricSave'}
function bootstrapProfiles(){
 let profiles=readProfiles();
 if(!profiles.length&&!localStorage.getItem(PROFILE_MIGRATED_KEY)){
  const legacy=localStorage.getItem('federalElectricSave')||localStorage.getItem('continentalElectricSave');
  if(legacy){
   const id='profile1';
   localStorage.setItem(profileSaveKey(id),legacy);
   profiles=[{id,name:'Profile 1',created:Date.now(),lastPlayed:Date.now()}];
   writeProfiles(profiles);setActiveProfileId(id);
  }
  localStorage.setItem(PROFILE_MIGRATED_KEY,'1');
 }
 const active=activeProfileId(),valid=profiles.some(p=>p.id===active);
 if(valid)setActiveProfileId(active);
 else if(profiles.length)setActiveProfileId(profiles[0].id);
 else setActiveProfileId('');
}
function touchActiveProfile(){
 const id=activeProfileId();if(!id)return;
 const profiles=readProfiles(),p=profiles.find(v=>v.id===id);if(!p)return;
 p.lastPlayed=Date.now();writeProfiles(profiles);
}
function activeProfileName(){
 const id=activeProfileId();if(!id)return 'UNASSIGNED';
 return readProfiles().find(p=>p.id===id)?.name||'UNASSIGNED';
}
function renderActiveProfileLabel(){
 const el=$('#activeProfileLabel');if(el)el.textContent='PROFILE: '+activeProfileName();
}
function loadInitial(){
 const id=activeProfileId();
 if(!id){profileSaveReadBlocked=false;return}
 const raw=localStorage.getItem(profileSaveKey(id));
 if(!raw){profileSaveReadBlocked=true;S=initial();return}
 try{const migrated=migrate(JSON.parse(raw));S=migrated;profileSaveReadBlocked=false;save(true)}
 catch(e){profileSaveReadBlocked=true;S=initial()}
}
function displayDate(){return new Date(S.gameDate+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
function displayHeaderDate(){const iso=window.FE_WASHINGTON_TIME?.now?.(S)?.date||S.gameDate;const d=new Date(iso+'T12:00:00'),days=['SUN','MON','TUES','WED','THUR','FRI','SAT'],months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];return days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()}
function displayTurn(){return S.endlessMode?'TURN '+S.turnSerial+' · FREE PLAY':'TURN '+Math.min(S.turnSerial,CAMPAIGN_TURNS)+' OF '+CAMPAIGN_TURNS}
function displayHeaderTurn(){return S.endlessMode?'TURN '+S.turnSerial+' · FREE PLAY':'TURN '+Math.min(S.turnSerial,CAMPAIGN_TURNS)+'/'+CAMPAIGN_TURNS}
function clockText(){return window.FE_WASHINGTON_TIME?.now?.(S)?.time||'TIME UNAVAILABLE'}
function businessOpen(){return S.phase==='day'}
const NAV_GROUP_BY_TAB={desk:'desk',factory:'factory',warehouse:'factory',contracts:'factory',market:'markets',news:'markets',notebook:'journal',contactsTab:'journal',infoTab:'journal',helpTab:'journal'};
function syncTopNavigation(id=document.querySelector('.tab.active')?.id||'desk'){const group=NAV_GROUP_BY_TAB[id]||id;document.querySelectorAll('nav button[data-nav-group]').forEach(btn=>btn.classList.toggle('active',btn.dataset.navGroup===group));document.querySelectorAll('.section-tabs button[data-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===id))}
function showTab(id){
 if(S.characterRoute!=='industrialist'&&['factory','warehouse','contracts'].includes(id))id='desk';
 document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
 const tab=$('#'+id);if(tab)tab.classList.add('active');
 syncTopNavigation(id);
 setRadioLocationContext('office');
 if(id==='racing'&&!pastimeActivityState.legal)setPastimeActivity('legal','horse');
 if(id==='washington'&&!pastimeActivityState.illicit)setPastimeActivity('illicit','star');
 if(id==='washington')renderWashington();
}
const pastimeActivityState={legal:null,illicit:null};
function canEnterPastime(group,target){
 const venues=window.FE_VENUES;
 if(!venues||!activeProfileId())return false;
 const map={legal:{horse:['horse-racing'],dog:['dog-racing'],car:['midget-racing'],boxing:['boxing']},illicit:{star:['star'],leads:['star'],poker:['working-poker','commerce-poker','embassy-poker'],private:['private-fight'],cock:['cockfight']}};
 return (map[group]?.[target]||[]).some(id=>venues.canUse(id));
}

function setPastimeActivity(group,target=null){
 const panels=[...document.querySelectorAll('[data-activity-panel="'+group+'"]')],buttons=[...document.querySelectorAll('[data-activity-group="'+group+'"]')];
 const requested=target?document.querySelector('[data-activity-panel="'+group+'"][data-activity-name="'+target+'"]'):null;
 const wasOpen=!!(requested&&!requested.hidden&&pastimeActivityState[group]===target);
 const canShow=!!(target&&canEnterPastime(group,target));
 panels.forEach(p=>p.hidden=true);buttons.forEach(b=>{b.classList.remove('active');b.setAttribute('aria-expanded','false')});pastimeActivityState[group]=null;
 if(target&&!wasOpen&&requested&&canShow){requested.hidden=false;pastimeActivityState[group]=target;const btn=buttons.find(b=>b.dataset.activityTarget===target);if(btn){btn.classList.add('active');btn.setAttribute('aria-expanded','true')}}
 if(group==='illicit')setRadioLocationContext(pastimeActivityState.illicit==='star'?'star':'office');
 const notice=document.getElementById(group==='legal'?'legalSportsNotice':'illicitActivitiesNotice');
 if(notice)notice.textContent=target&&!canShow?'You must visit the correct Washington venue (and have any required invitation) to enter this activity. Use M to travel.':'Closing a panel does not pause the world clock or cancel events.';
 buttons.forEach(b=>{const id=b.dataset.activityTarget;b.disabled=!canEnterPastime(group,id);b.title=b.disabled?'Visit the venue to participate':''});
}
window.isPastimeActivityOpen=(group,target)=>pastimeActivityState[group]===target;
document.addEventListener('click',e=>{
 const close=e.target instanceof Element?e.target.closest('[data-activity-close]'):null;
 if(close){setPastimeActivity(close.dataset.activityClose,null);return}
 const btn=e.target instanceof Element?e.target.closest('[data-activity-target][data-activity-group]'):null;
 if(btn)setPastimeActivity(btn.dataset.activityGroup,btn.dataset.activityTarget);
});
function clearPauseLock(){
 document.querySelectorAll('[data-pause-lock="1"]').forEach(el=>{el.disabled=el.dataset.pauseWasDisabled==='1';delete el.dataset.pauseWasDisabled;delete el.dataset.pauseLock});
 document.body.classList.remove('game-paused');
}
function applyPauseLock(){
 document.body.classList.toggle('game-paused',!!S.paused);
 if(!S.paused)return;
 showTab('desk');
 document.querySelectorAll('button, input, select, textarea').forEach(el=>{
  if(el.id==='reset'||el.id==='pauseToggle'){el.disabled=false;return}
  if(el.dataset.pauseLock!=='1'){el.dataset.pauseWasDisabled=el.disabled?'1':'0';el.dataset.pauseLock='1'}
  el.disabled=true;
 });
}
document.addEventListener('click',e=>{
 if(!S.paused)return;
 const target=e.target instanceof Element?e.target.closest('button,[onclick],a[href],input,select,textarea'):null;
 if(!target||target.id==='reset'||target.id==='pauseToggle')return;
 if(!target.closest('main')&&!target.closest('nav'))return;
 e.preventDefault();e.stopImmediatePropagation();
 note('Game is paused. Press PLAY to resume.');
},true);
function updateCashHeader(){const company=$('#headerCompanyCash'),personal=$('#headerPersonalCash');if(company)company.textContent=money(S.companyCash);if(personal)personal.textContent=money(S.personalCash)}
function renderPauseToggle(){const btn=$('#pauseToggle');if(!btn)return;const paused=!!S.paused;btn.textContent=paused?'PLAY':'PAUSE';btn.setAttribute('aria-label',paused?'Play simulation':'Pause simulation');btn.setAttribute('aria-pressed',paused?'true':'false');btn.title=paused?'Play simulation':'Pause simulation';btn.classList.toggle('paused',paused)}
window.updateCashHeader=updateCashHeader;
function accountingExposure(){
 const missing=Math.max(0,+S.unaccountedFunds||0);if(!missing)return 'NONE';
 const base=Math.max(1,S.companyCash+missing),ratio=missing/base,count=+S.corporateMisuseCount||0;
 if(ratio>=.15||count>=8)return 'CRITICAL';
 if(ratio>=.075||count>=5)return 'SERIOUS';
 if(ratio>=.025||count>=3)return 'NOTICEABLE';
 return 'LOW';
}
function renderTreasury(){
 const draw=$('#ownerDrawsToday'),diverted=$('#divertedToday'),missing=$('#unaccountedFunds'),exposure=$('#accountingExposure'),distribution=$('#ownerDistribution'),divert=$('#divertCompanyFunds');
 if(draw)draw.textContent=money(S.ownerDistributionsToday||0);if(diverted)diverted.textContent=money(S.divertedToday||0);if(missing)missing.textContent=money(S.unaccountedFunds||0);if(exposure)exposure.textContent=accountingExposure();
 if(distribution)distribution.disabled=!businessOpen()||S.paused;if(divert)divert.disabled=S.phase==='report'||S.paused;
}
let ipoScaffoldOpen=false;
function companyValueEstimate(){
 const finished=Object.entries(S.inventoryByGrade||{}).reduce((sum,[q,qty])=>sum+(Math.max(0,+qty||0)*(contractGrade(q).price*.65)),0);
 const raw=Object.entries(MATERIAL_MARKET).reduce((sum,[k,m])=>sum+(Math.max(0,+S.materials?.[k]||0)*m.unitPrice),0);
 return S.companyCash+finished+raw-Math.max(0,+S.debt||0);
}
function renderOwnership(){
 const panel=$('#ipoScaffold'),openBtn=$('#exploreIpo');if(!panel||!openBtn)return;
 panel.hidden=!ipoScaffoldOpen;openBtn.setAttribute('aria-expanded',ipoScaffoldOpen?'true':'false');
 const value=$('#ipoCompanyValue'),rep=$('#ipoReputation'),exposure=$('#ipoExposure');
 if(value)value.textContent=money(companyValueEstimate());
 if(rep)rep.textContent=Math.round(S.reputation)+'/100';
 if(exposure)exposure.textContent=accountingExposure();
}
function capacity(){return Math.floor(S.workers*60*(S.machinery/100)*workforceProductionFactor())}
function normalizeProductionTimes(){for(const c of S.contracts.concat(S.contractOffers||[])){if(!c.productionSeconds)c.productionSeconds=contractRunSeconds(c.productionQuantity||c.quantity)}}
function portfolioValue(){return Object.entries(S.portfolio).reduce((a,[k,p])=>a+p.shares*S.stocks[k].price,0)}
function portfolioCost(){return Object.values(S.portfolio).reduce((a,p)=>a+p.cost,0)}
function marketIndex(){const rows=Object.entries(S.stocks).filter(([k,x])=>stockAvailableInYear(k,x.sector,+S.gameDate.slice(0,4))),current=rows.reduce((a,[,x])=>a+x.price,0),base=rows.reduce((a,[k])=>a+(stockOpeningValues[k]||0),0);return base?current/base*100:100}
function signed(n){return (n>=0?'+':'')+n.toFixed(2)+'%'}
function note(t){$('#notice').textContent=t;$('#productionNote').textContent=t}
function render(){
 document.body.classList.toggle('pre-radio-era',!periodRadioAvailable());
 document.body.classList.toggle('pre-car-racing-era',S.gameDate<'1930-01-01');
 document.body.classList.toggle('component-era',!!S.componentWorks);
 if(!periodRadioAvailable()){if(titleRadioAudio)titleRadioAudio.pause();for(const feed of titleRadioBackgroundFeeds.values())feed.pause()}
 $('#businessDate').textContent=displayHeaderDate()+' · '+displayHeaderTurn();const rest=$('#endDay');if(rest)rest.textContent='Rest Until Morning';renderActiveProfileLabel();const appVersion=$('#appVersion');if(appVersion)appVersion.textContent=APP_VERSION;$('#dayClock').textContent=clockText();renderPauseToggle();const phaseName=$('#phaseName');if(phaseName)phaseName.textContent=S.phase==='day'?'BUSINESS DAY':S.phase==='night'?'WASHINGTON NIGHT':'DAILY REPORT';$('#marketStatus').textContent=S.phase==='day'?'EXCHANGE OPEN':S.phase==='night'?'EXCHANGE CLOSED':'BOOKS CLOSED';const quoteHead=$('#quotationHeading'),quoteNote=$('#quotationNote');if(quoteHead)quoteHead.textContent=S.phase==='day'?'Published Quotation Sheet · Opening':'Closing Quotations · Final';if(quoteNote)quoteNote.textContent=S.phase==='day'?'Trading continues behind the scenes, but the opening quotations remain posted until the closing bell. Closing the app freezes the market and world clock.':'The Federal Exchange is closed. Final closing quotations are now posted and remain fixed until the next business morning.';const endBtn=$('#endDay');if(endBtn){endBtn.textContent=S.phase==='day'?'End Business Day Early':S.phase==='night'?'Retire Early':'Daily Report Open';endBtn.disabled=S.phase==='report'};
 updateCashHeader();$('#companyCash').textContent=money(S.companyCash);$('#personalCash').textContent=money(S.personalCash);$('#marketCash').textContent=money(S.personalCash);$('#companyValue').textContent=money(companyValueEstimate());renderOwnership();$('#reputation').textContent=Math.round(S.reputation)+'/100';$('#workers').textContent=S.workers;$('#machinery').textContent=S.machinery.toFixed(1)+'%';$('#capacity').textContent=capacity().toLocaleString();$('#inventory').textContent=Object.values(S.inventoryByGrade).reduce((a,b)=>a+b,0).toLocaleString();$('#dateFoot').textContent=displayDate();$('#paperDate').textContent=displayDate().toUpperCase();$('#headline').textContent=S.headline;$('#story').textContent=S.story;$('#societyStory').textContent=S.societyStory;const sports=$('#sportsStory');if(sports)sports.textContent=S.sportsStory||'No major sporting results reported.';
 if(window.FE_LIVING_CHARACTERS?.renderPublicDispatches)window.FE_LIVING_CHARACTERS.renderPublicDispatches();
 const idx=marketIndex();$('#marketIndex').textContent=idx.toFixed(2);$('#marketStory').textContent='Federal Exchange index stands at '+idx.toFixed(2)+'. '+S.marketWire;$('#marketWire').textContent=S.marketWire;const pv=portfolioValue(),ug=pv-portfolioCost();$('#portfolio').textContent=money(pv);$('#unrealized').textContent=cash(ug);$('#unrealized').className=ug>=0?'gain':'loss';
 $('#ledger').innerHTML=S.ledger.slice(-10).reverse().map(x=>'<tr><td>'+x.date+'</td><td>'+money(x.rev)+'</td><td>'+money(x.exp)+'</td><td>'+money(x.rev-x.exp)+'</td></tr>').join('')||'<tr><td colspan="4" class="empty">No closed business days yet.</td></tr>';
 $('#materials').innerHTML=Object.entries(MATERIAL_MARKET).filter(([k])=>k!=='tungsten'||S.gameDate>='1906-01-01').map(([k,m])=>'<tr><td>'+m.name+'</td><td id="material_stock_'+k+'">'+Math.floor(S.materials[k]).toLocaleString()+'</td><td>'+unitCash(m.unitPrice)+'/unit</td><td><div class="material-trade"><input id="material_qty_'+k+'" type="number" min="1" step="1" value="1000" aria-label="'+m.name+' quantity"><div class="trade-buttons"><button onclick="tradeMaterial(\''+k+'\',1)">Buy</button><button onclick="tradeMaterial(\''+k+'\',-1)">Sell</button><button onclick="sellAllMaterial(\''+k+'\')">Sell All</button></div></div></td></tr>').join('');
 renderFactory();renderWarehouse();renderWorkforce();renderDelegation();renderContracts();refreshStockSectorFilter();renderStocks();renderHoldings();renderTransactions();renderNotes();renderArchive();renderWashington();window.FE_NPC_AI?.renderContactItineraries?.();renderUnresolvedPoker();if(window.FE_INSTITUTIONS?.renderConcept)window.FE_INSTITUTIONS.renderConcept();if(window.FE_TRANSPORT?.renderRegister)window.FE_TRANSPORT.renderRegister();renderTreasury();renderDailyReport();renderCampaignEnd();applyPauseLock();syncTopNavigation();window.FE_CAREER_SHELL?.refreshDesk?.();window.FE_PATROL_UI?.refresh?.();window.FE_DOORMAN_UI?.refresh?.();window.FE_COMPONENT_PANEL?.render?.()
}
function wagerBucket(bets){
 const out={wagered:0,payout:0,net:0,tickets:0};
 for(const b of Object.values(bets||{})){if(b?.settled){out.wagered+=+b.wager||0;out.payout+=+b.payout||0;out.net+=+b.net||0;out.tickets++}}
 return out;
}
function wagerSummaryForReport(iso){
 const horse=S.racing?.meeting?.date===iso?wagerBucket(S.racing.meeting.bets):wagerBucket();
 const dog=S.dogRacing?.meeting?.date===iso?wagerBucket(S.dogRacing.meeting.bets):wagerBucket();
 const car=S.midgetCarRacing?.meeting?.date===iso?wagerBucket(S.midgetCarRacing.meeting.bets):wagerBucket();
 const boxing=S.boxing?.card?.date===iso?wagerBucket(S.boxing.card.bets):wagerBucket();
 const underground=wagerBucket();
 if(S.underworld?.events?.date===iso){for(const e of [S.underworld.events.privateFight,S.underworld.events.cockfight]){if(e?.bet?.settled){underground.wagered+=+e.bet.wager||0;underground.payout+=+e.bet.payout||0;underground.net+=+e.bet.net||0;underground.tickets++}}}
 const groups=[horse,dog,car,boxing,underground],total=groups.reduce((o,g)=>({wagered:o.wagered+g.wagered,payout:o.payout+g.payout,net:o.net+g.net,tickets:o.tickets+g.tickets}),{wagered:0,payout:0,net:0,tickets:0});
 return {horse,dog,car,boxing,underground,total};
}
function wagerReportLine(g){return 'Wagered '+money(g.wagered)+' · Payout '+money(g.payout)+' · Net '+(g.net>0?'+':'')+cash(g.net)}

function renderDailyReport(){
 const panel=$('#dailyReportOverlay');if(!panel)return;
 if(S.phase!=='report'||!S.dailyReport){panel.hidden=true;return}
 const r=S.dailyReport,w=wagerSummaryForReport(r.iso),personalEnd=r.personalEnd??S.personalCash,companyEnd=r.companyEnd??r.companyClose??S.companyCash;
 const notes=S.notes.filter(n=>n.date===r.date).slice(-10);
 const events=notes.length?'<div class="report-events"><h4>Notable events</h4>'+notes.map(n=>'<div><b>'+escapeHtml(n.source||'record')+'</b><span>'+escapeHtml(n.text)+'</span></div>').join('')+'</div>':'<div class="report-events"><h4>Notable events</h4><p class="fine">No additional events were entered in the record.</p></div>';
 panel.hidden=false;$('#dailyReportDate').textContent=r.date||displayDate();
 $('#dailyReportBody').innerHTML='<div class="report-grid">'+
 '<article><b>Company opening cash</b><span>'+money(r.openingCompanyCash||0)+'</span></article>'+
 '<article><b>Company closing cash</b><span>'+money(companyEnd)+'</span></article>'+
 '<article><b>Revenue</b><span>'+money(r.revenue||0)+'</span></article>'+
 '<article><b>Expenses</b><span>'+money(r.expenses||0)+'</span></article>'+
 '<article><b>Company net</b><span>'+cash((r.revenue||0)-(r.expenses||0))+'</span></article>'+
 '<article><b>Personal opening cash</b><span>'+money(r.openingPersonalCash||0)+'</span></article>'+
 '<article><b>Personal closing cash</b><span>'+money(personalEnd)+'</span></article>'+
 '<article><b>Personal cash change</b><span>'+cash(personalEnd-(r.openingPersonalCash||0))+'</span></article>'+
 '<article><b>Recorded owner distributions</b><span>'+money(r.ownerDistributions||0)+'</span></article>'+
 '<article><b>Diverted company funds</b><span>'+money(r.divertedFunds||0)+'</span></article>'+
 '<article><b>Unaccounted company funds</b><span>'+money(r.unaccountedFunds||0)+'</span></article>'+
 '<article><b>Accounting exposure</b><span>'+escapeHtml(r.accountingExposure||'NONE')+'</span></article>'+
 '<article><b>Stock trades</b><span>'+(r.stockTrades||0)+'</span></article>'+
 '<article><b>Realized stock P/L</b><span>'+cash(r.stockRealized||0)+'</span></article>'+
 '<article><b>Held-stock day move</b><span>'+cash(r.stockPositionMove||0)+'</span></article>'+
 '<article><b>Federal Exchange close</b><span>'+((r.marketCloseIndex||marketIndex()).toFixed(2))+'</span></article>'+
 '<article><b>Horse racing</b><span>'+wagerReportLine(w.horse)+'</span></article>'+
 '<article><b>Dog racing</b><span>'+wagerReportLine(w.dog)+'</span></article>'+
 '<article><b>Midget car racing</b><span>'+wagerReportLine(w.car)+'</span></article>'+
 '<article><b>Licensed boxing</b><span>'+wagerReportLine(w.boxing)+'</span></article>'+
 '<article><b>Underground betting</b><span>'+wagerReportLine(w.underground)+'</span></article>'+
 '<article><b>Total wagered</b><span>'+money(w.total.wagered)+'</span></article>'+
 '<article><b>Total payout</b><span>'+money(w.total.payout)+'</span></article>'+
 '<article><b>Settled wagers</b><span>'+w.total.tickets+'</span></article>'+
 '<article><b>Total wager net</b><span>'+(w.total.net>0?'+':'')+cash(w.total.net)+'</span></article>'+
 '<article><b>Portfolio at close</b><span>'+money(r.portfolioEnd||r.portfolioAtMarketClose||0)+'</span></article>'+
 '<article><b>Reputation</b><span>'+Math.round(S.reputation)+'/100</span></article>'+
 '</div>'+events+'<p class="fine">This is Federal Electric\'s private accounting of the completed date. The Metropolitan Ledger appears only after you retire and the next business morning begins.</p>';
 const nextBtn=$('#beginNextDay');if(nextBtn)nextBtn.textContent='Continue Washington';
}
function renderCampaignEnd(){
 const panel=$('#campaignEndOverlay');if(!panel)return;
 if(!S.campaignEndPending||S.endlessMode){panel.hidden=true;return}
 panel.hidden=false;
 const body=$('#campaignEndBody');if(body)body.innerHTML='<div class="campaign-end-grid">'+
 '<article><b>Main campaign</b><span>January '+S.campaignStartYear+' – September '+(S.campaignStartYear+7)+'</span></article>'+
 '<article><b>Turns completed</b><span>'+CAMPAIGN_TURNS+'</span></article>'+
 '<article><b>Company value</b><span>'+money(companyValueEstimate())+'</span></article>'+
 '<article><b>Company cash</b><span>'+money(S.companyCash)+'</span></article>'+
 '<article><b>Personal cash</b><span>'+money(S.personalCash)+'</span></article>'+
 '<article><b>Reputation</b><span>'+Math.round(S.reputation)+'/100</span></article>'+
 '<article><b>Workers</b><span>'+Math.round(S.workers)+'</span></article>'+
 '<article><b>Ownership</b><span>Privately held</span></article>'+
 '</div><p class="fine">The numbered campaign is complete. Continue Empire keeps this exact save and removes the turn limit so Federal Electric can keep operating indefinitely. Start New Game returns to January 1890.</p>';
}

const productionPolicies={quality:{label:'Quality Priority',speed:.88,defects:.55},normal:{label:'Normal Production',speed:1,defects:1},rush:{label:'Rush Production',speed:1.18,defects:1.9}};
function activeContract(){return S.contracts.find(x=>x.id===S.activeContractId)||null}
function queuedContracts(){return S.productionQueue.map(id=>S.contracts.find(c=>c.id===id)).filter(c=>c&&c.status!=='delivered'&&c.status!=='delivered-discount')}
function productionTarget(c){const n=Math.floor(Number(c.productionQuantity));return Number.isFinite(n)&&n>0?n:Math.max(1,c.quantity)}
function productionPolicyCfg(c){return productionPolicies[c?.productionPolicy]||productionPolicies.normal}
function managementNeglectFactor(){const n=clamp(+S.delegation?.managementNeglect||0,0,12);return clamp(1-n*.03,.64,1)}
function workforceProductionFactor(){const wf=S.workforce||{},cond=S.turnConditions||{};return clamp((Number.isFinite(+wf.efficiency)?+wf.efficiency:1)*(Number.isFinite(+cond.productionFactor)?+cond.productionFactor:1)*managementNeglectFactor(),.35,1.15)}
function productionRunSeconds(c){const target=productionTarget(c),base=c.productionSeconds||contractRunSeconds(c.quantity);return Math.max(1,base*(target/Math.max(1,c.quantity)))}
function remainingProductionSeconds(c){const target=productionTarget(c),left=Math.max(0,target-(+c.completed||0)),base=productionRunSeconds(c)*(left/Math.max(1,target)),factor=(S.machinery/92)*workforceProductionFactor()*productionPolicyCfg(c).speed;return Math.max(0,base/Math.max(.2,factor))}
function recomputeWorkforce(){
 const w=S.workforce||(S.workforce={present:S.workers,late:0,absent:0,skill:68,morale:73,discipline:81,efficiency:1,quality:92}),scheduled=Math.max(1,S.workers),attendance=clamp((w.present-(w.late||0)*.35)/scheduled,.35,1);
 w.efficiency=clamp(attendance*(.72+(w.skill||68)/400+(w.morale||73)/650+(w.discipline||81)/900),.45,1.08);
 w.quality=clamp((w.skill||68)*.32+(w.morale||73)*.16+(w.discipline||81)*.17+S.machinery*.35,45,99);
}
function generateTurnConditions(){
 const m=new Date(S.gameDate+'T12:00:00').getMonth()+1,winter=m<=3||m>=11,summer=m>=6&&m<=8,r=Math.random();let weather='Clear',summary='Normal weather and transportation conditions.',prod=1,extraAbsent=0,extraLate=0,outage=0;
 if(winter&&r<.12){weather='Ice storm';summary='Ice has made roads dangerous and damaged utility lines.';prod=.84;extraAbsent=6+Math.floor(Math.random()*7);extraLate=8+Math.floor(Math.random()*10);if(Math.random()<.6)outage=300+Math.floor(Math.random()*601)}
 else if(winter&&r<.3){weather='Heavy snow';summary='Heavy snow is disrupting worker travel and freight movement.';prod=.9;extraAbsent=3+Math.floor(Math.random()*6);extraLate=7+Math.floor(Math.random()*9)}
 else if(winter&&r<.46){weather='Severe cold';summary='Severe cold is slowing the morning start and increasing absenteeism.';prod=.94;extraAbsent=2+Math.floor(Math.random()*4);extraLate=3+Math.floor(Math.random()*6)}
 else if(summer&&r<.16){weather='Heat wave';summary='Heat is reducing shop-floor efficiency and increasing machinery strain.';prod=.9;extraAbsent=1+Math.floor(Math.random()*3)}
 else if(r<.09){weather='Severe thunderstorm';summary='Storms are disrupting deliveries and threatening utility service.';prod=.93;extraLate=2+Math.floor(Math.random()*5);if(Math.random()<.35)outage=180+Math.floor(Math.random()*481)}
 else if(r<.2){weather='Heavy rain';summary='Heavy rain is slowing traffic and freight around Washington.';prod=.97;extraLate=2+Math.floor(Math.random()*5)}
 const absent=Math.min(S.workers,Math.floor(Math.random()*3)+extraAbsent),late=Math.min(Math.max(0,S.workers-absent),Math.floor(Math.random()*4)+extraLate),present=Math.max(0,S.workers-absent);
 S.workforce=Object.assign({skill:68,morale:73,discipline:81},S.workforce||{},{present,absent,late});
 S.turnConditions={weather,summary,productionFactor:prod,powerOutageSeconds:outage};recomputeWorkforce();
 if(!S.componentWorks&&!S.personnelIssue&&Math.random()<.09){const names=['Thomas Miller','Frank Walsh','George Carter','Samuel Reed','Henry Collins','Arthur Bennett'],name=names[Math.floor(Math.random()*names.length)],kind=Math.random()<.55?'Repeated tardiness':'Poor workmanship';S.personnelIssue={name,role:'Assembly worker',kind,detail:kind==='Repeated tardiness'?'The foreman reports repeated late arrivals under otherwise normal circumstances.':'The foreman reports repeated missed inspections and careless assembly work.'};addManagementAlert('personnel','Foreman Sullivan reports '+name+': '+kind+'.','attention')}
}
function addManagementAlert(type,text,severity='attention'){
 const d=S.delegation||(S.delegation={foremanAutoStart:false,alerts:[]}),alerts=d.alerts||(d.alerts=[]);
 const key=type+'|'+S.gameDate+'|'+text;
 if(alerts.some(a=>a.key===key))return;
 alerts.push({id:'MGT-'+Date.now()+'-'+Math.floor(Math.random()*10000),key,type,text,severity,date:displayDate(),turn:S.turnSerial||1});
 if(alerts.length>20)alerts.splice(0,alerts.length-20);
}
function renderDelegation(){
 const d=S.delegation||(S.delegation={foremanAutoStart:false,alerts:[]});
 const btn=$('#foremanAutoStart'),status=$('#managementStatus'),alerts=$('#managementAlerts');
 if(btn){
  btn.textContent='Routine Auto-Start: '+(d.foremanAutoStart?'ON':'OFF');
  btn.setAttribute('aria-pressed',d.foremanAutoStart?'true':'false');
  btn.classList.toggle('is-on',d.foremanAutoStart);
 }
 if(status){
  const hold=S.lineHoldReason;
  status.innerHTML='<b>Foreman Sullivan</b><span>'+(d.foremanAutoStart?'Authorized to start queued work and resume closing-bell holds each Business Day.':'Routine production still requires your morning authorization.')+'</span>'+
   (hold?'<small>Current line hold: '+escapeHtml(String(hold).replace(/-/g,' ').toUpperCase())+'</small>':'');
 }
 const neglect=clamp(+d.managementNeglect||0,0,12),neglectLabel=neglect===0?'CLEAR':neglect<=2?'WATCH':neglect<=5?'STRAINED':'CRITICAL';
 if(status)status.innerHTML+='<small>Management neglect: '+neglect+'/12 · '+neglectLabel+' · output factor '+Math.round(managementNeglectFactor()*100)+'%</small>';
 const gm=d.generalManager||{},gmStatus=$('#generalManagerStatus'),gmTerms=$('#generalManagerTerms'),gmToggle=$('#generalManagerToggle');
 if(gmStatus)gmStatus.textContent=gm.hired?'HIRED · COMPETENCE '+Math.round(gm.competence||0)+'/100 · RELIABILITY '+Math.round(gm.reliability||0)+'/100':'VACANT';
 if(gmTerms)gmTerms.textContent='1890 manager salary · '+cash(gm.dailyWage||GENERAL_MANAGER_DAILY_WAGE)+' per Business Day';
 if(gmToggle){gmToggle.textContent=gm.hired?'Dismiss General Manager':'Hire General Manager';gmToggle.classList.toggle('danger',gm.hired)}
 if(alerts){
  const rows=(d.alerts||[]).slice().reverse().map(a=>'<article class="management-alert '+escapeHtml(a.severity||'attention')+'"><div><b>'+escapeHtml((a.type||'management').toUpperCase())+'</b><small>'+escapeHtml(a.date||'')+'</small></div><p>'+escapeHtml(a.text||'')+'</p><button type="button" onclick="dismissManagementAlert(\''+escapeHtml(a.id)+'\')">Acknowledge</button></article>').join('');
  alerts.innerHTML=rows||'<p class="empty">No management alerts require your attention.</p>';
 }
}
window.dismissManagementAlert=id=>{const d=S.delegation;if(!d)return;d.alerts=(d.alerts||[]).filter(a=>a.id!==id);save(true);renderDelegation()}
function ageManagementNeglect(){
 const d=S.delegation||(S.delegation={foremanAutoStart:false,alerts:[],managementNeglect:0,lastNeglectTurn:0});
 const turn=S.turnSerial||1;if(d.lastNeglectTurn===turn)return;
 const seriousHold=['breakdown','materials-or-cash'].includes(S.lineHoldReason);
 const unresolved=Number(seriousHold)+Number(!!S.personnelIssue);
 if(unresolved>0){
  d.managementNeglect=clamp((+d.managementNeglect||0)+unresolved,0,12);
  if(d.managementNeglect>=3){S.workforce.morale=clamp((S.workforce.morale||0)-.5,0,100);S.workforce.discipline=clamp((S.workforce.discipline||0)-.35,0,100)}
  addManagementAlert('neglect','Unresolved management problems carried into another Business Day. Management neglect is now '+d.managementNeglect+'/12.','critical');
 }else d.managementNeglect=clamp((+d.managementNeglect||0)-1,0,12);
 d.lastNeglectTurn=turn;recomputeWorkforce();
}
function easeManagementNeglect(amount=1){
 const d=S.delegation;if(!d)return;d.managementNeglect=clamp((+d.managementNeglect||0)-Math.max(0,+amount||0),0,12);
}
function applyMorningDelegation(){
 const d=S.delegation;if(!businessOpen())return false;
 const managerActive=!!d?.generalManager?.hired;
 if(!d?.foremanAutoStart&&!managerActive)return false;
 if(S.lineStatus==='awaiting'&&S.lineHoldReason==='closing-bell'){
  const x=activeContract();
  if(x){
   x.productionState='running';S.lineStatus='running';S.lineHoldReason=null;
   S.lineMessage='Foreman Sullivan restarted '+x.id+' at the opening bell under standing authority.';
   S.notes.push({date:displayDate(),text:S.lineMessage,source:'factory management'});
   return true;
  }
 }
 if(S.lineStatus==='idle'&&!activeContract()&&queuedContracts().length){
  startNextQueued();
  if(S.lineStatus==='running'){
   S.lineMessage='Foreman Sullivan started the next queued production run under standing authority.';
   S.notes.push({date:displayDate(),text:S.lineMessage,source:'factory management'});
   return true;
  }
 }
 return false;
}
function renderWorkforce(){
 const w=S.workforce||{};for(const [id,val] of [['workersPresent',Math.max(0,Math.floor(w.present||0))],['workersLate',Math.max(0,Math.floor(w.late||0))],['workersAbsent',Math.max(0,Math.floor(w.absent||0))],['workerSkill',Math.round(w.skill||0)+'/100'],['workerMorale',Math.round(w.morale||0)+'/100'],['workerDiscipline',Math.round(w.discipline||0)+'/100'],['workerEfficiency',Math.round((w.efficiency||0)*100)+'%'],['workerQuality',Math.round(w.quality||0)+'/100']]){const el=$('#'+id);if(el)el.textContent=val}
 const weather=$('#weatherSummary');if(weather){const c=S.turnConditions||{};weather.innerHTML='<b>'+escapeHtml(c.weather||'Normal conditions')+'</b> · '+escapeHtml(c.summary||'')+(c.powerOutageSeconds>0?' <span class="loss">Utility outage in effect: about '+Math.ceil(c.powerOutageSeconds/60)+' min remaining.</span>':'')}
 const matter=$('#personnelMatter');if(matter){const p=S.personnelIssue;if(!p)matter.innerHTML='<p class="empty">No personnel matter currently requires executive attention.</p>';else matter.innerHTML='<div><b>'+escapeHtml(p.name)+'</b> · '+escapeHtml(p.role)+'</div><p><strong>'+escapeHtml(p.kind)+'</strong> — '+escapeHtml(p.detail)+'</p><div class="actions"><button onclick="resolvePersonnelIssue(\'ignore\')">Ignore</button><button onclick="resolvePersonnelIssue(\'verbal\')">Verbal Warning</button><button onclick="resolvePersonnelIssue(\'formal\')">Formal Warning</button><button onclick="resolvePersonnelIssue(\'suspend\')">Suspend</button><button onclick="resolvePersonnelIssue(\'dismiss\')">Dismiss</button></div>'}
}
window.resolvePersonnelIssue=action=>{const p=S.personnelIssue;if(!p)return;const w=S.workforce;if(action==='ignore'){w.discipline=clamp(w.discipline-2,0,100);w.morale=clamp(w.morale+.5,0,100)}else if(action==='verbal'){w.discipline=clamp(w.discipline+1,0,100);w.morale=clamp(w.morale-.25,0,100)}else if(action==='formal'){w.discipline=clamp(w.discipline+2,0,100);w.morale=clamp(w.morale-1,0,100)}else if(action==='suspend'){w.discipline=clamp(w.discipline+3,0,100);w.morale=clamp(w.morale-2,0,100);w.present=Math.max(0,(w.present||S.workers)-1)}else if(action==='dismiss'){S.workers=Math.max(1,S.workers-1);w.present=Math.min(w.present||S.workers,S.workers);w.discipline=clamp(w.discipline+2,0,100);w.morale=clamp(w.morale-1,0,100)}S.notes.push({date:displayDate(),text:'Personnel action: '+action+' regarding '+p.name+' ('+p.kind+').',source:'company personnel file'});S.personnelIssue=null;easeManagementNeglect(.5);recomputeWorkforce();save();render()}
function nextLotNumber(){return 1+Math.max(0,...(S.finishedLots||[]).map(l=>+(String(l.id||'').replace(/\D/g,''))||0))}
function ensureFinishedLot(c,q){if(!S.finishedLots)S.finishedLots=[];let lot=S.finishedLots.find(l=>l.id===c.currentLotId&&l.quality===q);if(lot)return lot;lot={id:'FE-LOT-'+String(nextLotNumber()).padStart(4,'0'),runId:c.id,contractId:c.id,product:c.product||'Electric Light Bulbs',quality:q,qualityName:contractGrade(q).qualityName,available:0,produced:0,rejected:0,qc:100,latentDefectRate:0,producedDate:S.gameDate,producedTurn:S.turnSerial};S.finishedLots.push(lot);c.currentLotId=lot.id;return lot}
function renderMaterialStocks(){for(const k of Object.keys(MATERIAL_MARKET)){const el=$('#material_stock_'+k);if(el)el.textContent=Math.max(0,Math.floor(S.materials[k]||0)).toLocaleString()}}
function renderWarehouse(){
 const totals=$('#warehouseTotals');if(totals)totals.innerHTML=['economy','standard','long'].map(q=>'<tr><td>'+escapeHtml(contractGrade(q).qualityName)+'</td><td>'+Math.floor(S.inventoryByGrade[q]||0).toLocaleString()+'</td></tr>').join('');
 const lots=$('#warehouseLots');if(lots)lots.innerHTML=(S.finishedLots||[]).filter(l=>(l.available||0)>0).slice().reverse().map(l=>'<tr><td>'+escapeHtml(l.id)+'</td><td>'+escapeHtml(l.qualityName||contractGrade(l.quality).qualityName)+'</td><td>'+Math.floor(l.available||0).toLocaleString()+'</td><td>'+Math.round(l.qc||0)+'/100</td><td>'+escapeHtml(l.producedDate||'')+'</td></tr>').join('')||'<tr><td colspan="5" class="empty">No finished goods are currently in the warehouse.</td></tr>'
}
function renderFactory(){
 const x=activeContract()||queuedContracts()[0],q=queuedContracts(),required=q.reduce((a,c)=>a+remainingProductionSeconds(c),0),closed=!businessOpen();
 const minuteOfDay=window.FE_WASHINGTON_TIME.now(S)?.minuteOfDay??1020;
 const secondsToClosing=Math.max(0,(1020-minuteOfDay)*60-(S.worldCalendarRemainder||0));
 $('#queueSummary').innerHTML=businessOpen()?'<b>Queued production:</b> '+Math.ceil(required/60)+' min estimated · <b>Until 5 PM closing bell:</b> '+Math.ceil(secondsToClosing/60)+' min'+(required>secondsToClosing?' <span class="loss">⚠ Commitments exceed the current shift by '+Math.ceil((required-secondsToClosing)/60)+' min.</span>':''):'<b>Works closed:</b> production is stopped. Any unfinished run must be restarted manually next Business Day.';
 $('#productionQueue').innerHTML=q.map((c,i)=>'<div class="queue-row '+(c.id===S.activeContractId?'queue-active':'')+'"><b>#'+(i+1)+' '+escapeHtml(c.id)+'</b><span>'+escapeHtml(c.customer)+'</span><span>'+escapeHtml(c.qualityName)+' · '+escapeHtml((c.productionState||'queued').toUpperCase())+'</span><span>'+Math.floor(c.completed||0).toLocaleString()+' / '+productionTarget(c).toLocaleString()+' · ~'+Math.ceil(remainingProductionSeconds(c)/60)+' min</span><div><button onclick="switchProduction(\''+c.id+'\')" '+(closed||c.id===S.activeContractId&&S.lineStatus==='running'?'disabled':'')+'>Run</button><button onclick="moveQueue(\''+c.id+'\',-1)" '+(i===0||c.id===S.activeContractId?'disabled':'')+'>↑</button><button onclick="moveQueue(\''+c.id+'\',1)" '+(i===q.length-1||c.id===S.activeContractId?'disabled':'')+'>↓</button></div></div>').join('')||'<p class="empty">Production queue is empty.</p>';
 if(!x){$('#factoryOrder').innerHTML='<p class="empty">No production run is currently queued.</p>';$('#productionFill').style.width='0%';$('#productionPercent').textContent='0%';$('#productionCount').textContent='0 / 0 manufactured';$('#lineStatus').textContent=closed?'WORKS CLOSED':'NO RUN ACTIVE';$('#startProduction').disabled=true;$('#resumeProduction').disabled=true;const pb=$('#pauseProduction');if(pb)pb.disabled=true;const ab=$('#abandonProduction');if(ab)ab.disabled=true;$('#maintain').disabled=closed;return}
 const target=productionTarget(x),pct=Math.min(100,(+x.completed||0)/target*100),policy=productionPolicyCfg(x),selectedGrade=selectedProductionGrade(x);
 $('#factoryOrder').innerHTML='<div class="order-grid"><b>Linked Contract</b><span>'+escapeHtml(x.id)+' · '+escapeHtml(x.customer)+'</span><b>Product</b><span>'+escapeHtml(x.product)+'</span><b>Required Quality</b><span>'+escapeHtml(x.qualityName)+'</span><b>Production Grade</b><span><select id="productionGrade" onchange="setProductionGrade(\''+x.id+'\',this.value)" '+(closed||x.productionState==='running'||S.activeContractId===x.id?'disabled':'')+'>'+contractGrades.map(g=>'<option value="'+g.quality+'" '+(selectedGrade===g.quality?'selected':'')+'>'+g.qualityName+'</option>').join('')+'</select></span><b>Base Variable Cost</b><span>'+unitCash(productionVariableUnitCost(selectedGrade))+' / gross unit</span><b>Production Policy</b><span><select id="productionPolicy" onchange="setProductionPolicy(\''+x.id+'\',this.value)" '+(closed||x.productionState==='running'?'disabled':'')+'>'+Object.entries(productionPolicies).map(([k,v])=>'<option value="'+k+'" '+((x.productionPolicy||'normal')===k?'selected':'')+'>'+v.label+'</option>').join('')+'</select></span><b>Contract Quantity</b><span>'+x.quantity.toLocaleString()+'</span><b>Delivered</b><span>'+Math.floor(x.delivered||0).toLocaleString()+'</span><b>Production Target</b><span><input id="productionQuantity" type="number" min="'+Math.max(1,Math.ceil(x.completed||0))+'" step="1" value="'+target+'" oninput="setProductionQuantity(\''+x.id+'\',this.value)" '+(closed||x.productionState==='running'?'disabled':'')+'></span><b>Manufactured</b><span>'+Math.floor(x.completed||0).toLocaleString()+'</span><b>Estimated Run</b><span id="productionRunEstimate">'+Math.ceil(remainingProductionSeconds(x)/60)+' min</span><b>Deadline</b><span>'+escapeHtml(x.deadline)+'</span></div><p class="fine">'+policy.label+' affects production speed and defect risk. Finished bulbs enter the Warehouse as they are manufactured; nothing is shipped automatically.</p>';
 $('#productionFill').style.width=pct.toFixed(2)+'%';$('#productionPercent').textContent=pct.toFixed(1)+'%';$('#productionCount').textContent=Math.floor(x.completed||0).toLocaleString()+' / '+target.toLocaleString()+' manufactured';
 $('#lineStatus').textContent=S.lineStatus==='running'?'LINE RUNNING':S.lineStatus==='awaiting'?'LINE STOPPED · AWAITING EXECUTIVE DECISION':x.productionState==='paused'?'RUN PAUSED':x.productionState==='abandoned'?'RUN STOPPED':x.productionState==='complete'?'RUN COMPLETE':'READY TO START';
 $('#startProduction').disabled=closed||S.lineStatus==='running'||S.lineStatus==='awaiting'||x.productionState==='complete';$('#resumeProduction').disabled=closed||S.lineStatus!=='awaiting';const pb=$('#pauseProduction');if(pb)pb.disabled=closed||S.lineStatus!=='running';const ab=$('#abandonProduction');if(ab)ab.disabled=closed||(+x.completed||0)>=target;$('#maintain').disabled=closed
}
function customerTraitFor(name){const row=contractCustomers.find(x=>x[0]===name);return row?row[2]:'balanced'}
function customerHistory(name){if(!S.customerHistory[name])S.customerHistory[name]={completed:0,rejected:0,late:0,discounted:0,partial:0};return S.customerHistory[name]}
function renderContracts(){
 const el=$('#contractList'),closed=!businessOpen();const seek=$('#seekContractsBtn');if(seek)seek.disabled=closed;
 el.innerHTML=S.contracts.map(x=>{const trait=customerTraits[x.customerTrait||customerTraitFor(x.customer)],delivered=Math.floor(x.delivered||0),remaining=Math.max(0,x.quantity-delivered),matching=Math.floor(S.inventoryByGrade[x.quality]||0),open=remaining>0&&x.status!=='cancelled',queueing=S.productionQueue.includes(x.id);return '<div class="sheet contract-card"><div><span class="tag">'+x.id+'</span> <b>'+escapeHtml(x.customer)+'</b></div><h3>'+x.quantity.toLocaleString()+' '+escapeHtml(x.qualityName)+' '+escapeHtml(x.product)+'</h3><div class="contract-grid"><span>Buyer</span><b>'+trait.label+'</b><span>Agreed price</span><b>'+cash(x.price)+'/unit</b><span>Gross value</span><b>'+cash(x.quantity*x.price)+'</b><span>Deadline</span><b>'+escapeHtml(x.deadline)+'</b><span>Delivery window</span><b>'+escapeHtml(x.deadlineClass||'STANDARD')+' · '+Math.max(1,+x.deadlineTurns||4)+' turn'+((+x.deadlineTurns||4)===1?'':'s')+'</b><span>Status</span><b>'+escapeHtml((x.status||'accepted').toUpperCase())+'</b><span>Delivered</span><b>'+delivered.toLocaleString()+' / '+x.quantity.toLocaleString()+'</b><span>Remaining due</span><b>'+remaining.toLocaleString()+'</b><span>Matching warehouse stock</span><b>'+matching.toLocaleString()+'</b><span>Manufactured on linked run</span><b>'+Math.floor(x.completed||0).toLocaleString()+'</b></div>'+(open?'<div class="contract-proposal"><label>Ship quantity<input id="ship_qty_'+x.id+'" type="number" min="1" max="'+remaining+'" step="1" value="'+Math.max(1,Math.min(remaining,matching||remaining))+'"></label><label>Ship grade<select id="ship_grade_'+x.id+'">'+contractGrades.map(g=>'<option value="'+g.quality+'" '+(g.quality===x.quality?'selected':'')+'>'+g.qualityName+' · '+Math.floor(S.inventoryByGrade[g.quality]||0).toLocaleString()+' in warehouse</option>').join('')+'</select></label></div><div class="actions"><button onclick="shipFromWarehouse(\''+x.id+'\')" '+(closed?'disabled':'')+'>Ship from Warehouse</button><button onclick="queueContractProduction(\''+x.id+'\')" '+(closed||queueing?'disabled':'')+'>'+(queueing?'Production Queued':'Queue / Resume Production')+'</button></div><p class="fine">Production and delivery are separate. Goods may remain in the warehouse until you choose to ship them, up to the contract deadline.</p>':'')+'</div>'}).join('');
 $('#contractOffers').innerHTML=(S.contractOffers||[]).map(x=>{
  const trait=customerTraits[x.customerTrait||customerTraitFor(x.customer)],h=customerHistory(x.customer),n=x.negotiation||{rounds:0,counter:null,lastProposal:null},counter=n.counter;
  const proposal=counter||n.lastProposal||{quantity:x.requestedQuantity,quality:x.requestedQuality,price:x.suggestedPrice};
  const counterBox=counter?'<div class="contract-counter"><b>CUSTOMER COUNTER</b><span>'+counter.quantity.toLocaleString()+' '+escapeHtml(contractGrade(counter.quality).qualityName)+' bulbs at '+cash(counter.price)+'/unit</span><button onclick="acceptContractCounter(\''+x.id+'\')" '+(closed?'disabled':'')+'>Accept Counter · 1 min</button></div>':'';
  return '<div class="sheet contract-card offer-card"><div><span class="tag">'+x.id+'</span> <b>'+escapeHtml(x.customer)+'</b></div><h3>Purchase Request</h3><div class="contract-grid"><span>Customer requests</span><b>'+x.requestedQuantity.toLocaleString()+' '+escapeHtml(x.requestedQualityName)+' bulbs</b><span>Buyer</span><b>'+trait.label+'</b><span>Prior correct orders</span><b>'+h.completed+'</b><span>Federal Electric suggested quote</span><b>'+cash(x.suggestedPrice)+'/unit</b><span>Deadline</span><b>'+escapeHtml(x.deadline)+'</b><span>Delivery window</span><b>'+escapeHtml(x.deadlineClass||'STANDARD')+' · '+Math.max(1,+x.deadlineTurns||4)+' turn'+((+x.deadlineTurns||4)===1?'':'s')+'</b></div>'+counterBox+'<div class="contract-proposal"><label>Offer quantity<input id="proposal_qty_'+x.id+'" type="number" min="1" step="1" value="'+Math.max(1,Math.floor(proposal.quantity))+'"></label><label>Offer grade<select id="proposal_grade_'+x.id+'">'+contractGrades.map(g=>'<option value="'+g.quality+'" '+(proposal.quality===g.quality?'selected':'')+'>'+g.qualityName+'</option>').join('')+'</select></label><label>Price / unit<input id="proposal_price_'+x.id+'" type="number" min="0.001" step="0.001" value="'+Number(proposal.price).toFixed(3)+'"></label></div><div class="actions"><button onclick="submitContractProposal(\''+x.id+'\')" '+(closed?'disabled':'')+'>Submit Proposal · 1 min</button><button onclick="declineContract(\''+x.id+'\')" '+(closed?'disabled':'')+'>Decline Request</button></div><p class="fine">Federal Electric sets the proposed quantity, grade and price. The buyer may accept, reject, or return a counteroffer.</p></div>';
 }).join('')||'<p class="empty">No open customer requests on the desk. Seek new business to look for contracts.</p>';
 $('#customerRecord').innerHTML=Object.entries(S.customerHistory).map(([name,h])=>'<div class="customer-record"><b>'+escapeHtml(name)+'</b><span>'+customerTraits[customerTraitFor(name)].label+' · Correct: '+h.completed+' · Discounted: '+(h.discounted||0)+' · Rejected: '+h.rejected+' · Late/short: '+h.late+'</span></div>').join('');
}
window.seekContracts=()=>{
 if(S.paused)return note('Game is paused.');
 if(!businessOpen())return note('Business offices are closed for the night.');
 if(!window.FE_WASHINGTON_TIME.canSpend(S,120))return note('There is not enough time left today to seek new contracts.');
 window.advanceWorldTime(120,true);
 const roll=Math.random(),count=roll<.28?0:roll<.62?1:roll<.87?2:3;
 S.contractOffers=[];
 for(let i=0;i<count;i++){const o=makeContractOffer();while(S.contractOffers.some(x=>x.id===o.id))o.id='FE-'+String(nextContractNumber()+i).padStart(3,'0');S.contractOffers.push(o)}
 note(count?count+' new customer request'+(count===1?'':'s')+' located. Seeking business consumed 2 minutes.':'No suitable customer requests were located this time. Seeking business consumed 2 minutes.');
 save();render();
}
function negotiationProfile(key){return {balanced:{price:.09,qty:.14,lower:false},forgiving:{price:.14,qty:.24,lower:true},strict:{price:.05,qty:.06,lower:false},price:{price:.035,qty:.14,lower:true},quality:{price:.08,qty:.08,lower:false},impatient:{price:.12,qty:.20,lower:true}}[key]||{price:.09,qty:.14,lower:false}}
function proposalFromInputs(id){
 const q=Math.floor(Number(document.getElementById('proposal_qty_'+id)?.value)),quality=document.getElementById('proposal_grade_'+id)?.value,price=Number(document.getElementById('proposal_price_'+id)?.value);
 if(!Number.isFinite(q)||q<1||!contractGrades.some(g=>g.quality===quality)||!Number.isFinite(price)||price<=0)return null;
 return {quantity:q,quality,price:+price.toFixed(3)};
}
function finalizeContractOffer(x,terms,source){
 S.contractOffers=S.contractOffers.filter(o=>o.id!==x.id);
 x.quantity=terms.quantity;x.quality=terms.quality;x.qualityName=contractGrade(terms.quality).qualityName;x.price=terms.price;x.completed=0;x.delivered=0;x.productionQuantity=terms.quantity;x.productionPolicy='normal';x.productionState='queued';x.status='accepted';if(!Number.isFinite(+x.deadlineTurnSerial)){const win=chooseContractWindow(terms.quantity);x.deadlineClass=win.deadlineClass;x.deadlineTurns=win.turns;x.deadlineTurnSerial=(S.turnSerial||1)+win.turns-1}x.deadlineDate=contractDeadlineDate(x.deadlineTurnSerial,S.campaignStartYear);x.deadlineMonth=monthKey(x.deadlineDate);x.deadline=contractDeadlineLabel(x.deadlineTurnSerial,x.deadlineClass||'STANDARD',S.campaignStartYear);x.deadlinePassed=false;x.productionSeconds=contractRunSeconds(terms.quantity);x.producedQuality=x.quality;x.negotiation={...(x.negotiation||{}),counter:null};
 S.contracts.push(x);S.productionQueue.push(x.id);if(!S.customerHistory[x.customer])S.customerHistory[x.customer]={completed:0,rejected:0,late:0,discounted:0,partial:0};
 S.notes.push({date:displayDate(),text:x.customer+' and Federal Electric agreed to '+terms.quantity.toLocaleString()+' '+x.qualityName+' light bulbs at '+cash(terms.price)+' per unit under '+x.id+'. Delivery is due by '+x.deadline+'.',source:'contract negotiation'});
 note(x.id+' accepted at '+cash(terms.price)+'/unit and added to the production queue'+(source==='counter'?' from the customer counteroffer.':'.'));save();render();
}
window.submitContractProposal=id=>{
 if(S.paused)return note('Game is paused.');
 if(!businessOpen())return note('Contract offices are closed for the night.');
 if(!window.FE_WASHINGTON_TIME.canSpend(S,60))return note('There is not enough time left today to negotiate this request.');
 const x=S.contractOffers.find(o=>o.id===id);if(!x)return;
 const p=proposalFromInputs(id);if(!p)return note('Enter a valid quantity, grade and positive price.');
 window.advanceWorldTime(60,true);
 const key=x.customerTrait||customerTraitFor(x.customer),profile=negotiationProfile(key),requestedGrade=contractGrade(x.requestedQuality),proposedGrade=contractGrade(p.quality),rank={economy:0,standard:1,long:2},qtyDiff=Math.abs(p.quantity-x.requestedQuantity)/Math.max(1,x.requestedQuantity),relationshipAdj=clamp((x.suggestedPrice||requestedGrade.price)/requestedGrade.price,.94,1.08),fairPrice=proposedGrade.price*relationshipAdj,priceRatio=p.price/fairPrice,lowerGrade=rank[p.quality]<rank[x.requestedQuality],n=x.negotiation||(x.negotiation={rounds:0,counter:null,lastProposal:null});
 n.rounds++;n.lastProposal=p;n.counter=null;
 const acceptableGrade=!lowerGrade||profile.lower,inside=priceRatio<=1+profile.price&&qtyDiff<=profile.qty&&acceptableGrade;
 const acceptanceChance=clamp(.78+(1-priceRatio)*.8-qtyDiff*.7+(rank[p.quality]-rank[x.requestedQuality])*.05+Math.min(.08,(customerHistory(x.customer).completed||0)*.015),.18,.96);
 if(inside&&Math.random()<acceptanceChance){return finalizeContractOffer(x,p,'proposal')}
 const clearlyUnacceptable=priceRatio>1+profile.price*3||qtyDiff>Math.max(.45,profile.qty*3)||(lowerGrade&&!profile.lower&&rank[x.requestedQuality]-rank[p.quality]>0&&key==='quality');
 if(clearlyUnacceptable&&Math.random()<.7){
  S.contractOffers=S.contractOffers.filter(o=>o.id!==id);S.notes.push({date:displayDate(),text:x.customer+' rejected Federal Electric\'s proposal for '+x.id+'.',source:'contract negotiation'});note(x.customer+' rejected the proposal and withdrew the request.');save();render();return;
 }
 const counterQuality=lowerGrade&&!profile.lower?x.requestedQuality:p.quality,counterQty=Math.max(1,Math.round(((p.quantity+x.requestedQuantity*2)/3)/50)*50),counterFair=contractGrade(counterQuality).price*relationshipAdj,counterPrice=+Math.min(p.price,counterFair*(1+profile.price*.35)).toFixed(3);
 n.counter={quantity:counterQty,quality:counterQuality,price:counterPrice};
 S.notes.push({date:displayDate(),text:x.customer+' returned a counteroffer on '+x.id+': '+counterQty.toLocaleString()+' '+contractGrade(counterQuality).qualityName+' bulbs at '+cash(counterPrice)+' per unit.',source:'contract negotiation'});
 note(x.customer+' returned a counteroffer. You may accept it or revise Federal Electric\'s proposal.');save();render();
}
window.acceptContractCounter=id=>{
 if(S.paused)return note('Game is paused.');
 if(!businessOpen())return note('Contract offices are closed for the night.');
 if(!window.FE_WASHINGTON_TIME.canSpend(S,60))return note('There is not enough time left today to complete this negotiation.');
 const x=S.contractOffers.find(o=>o.id===id),counter=x?.negotiation?.counter;if(!x||!counter)return;
 window.advanceWorldTime(60,true);finalizeContractOffer(x,counter,'counter');
}
window.declineContract=id=>{if(S.paused)return note('Game is paused.');if(!businessOpen())return note('Contract offices are closed for the night.');S.contractOffers=S.contractOffers.filter(x=>x.id!==id);note(id+' declined.');save();render()}
window.setProductionGrade=(id,q)=>{if(!businessOpen())return note('The works are closed for the night.');const x=S.contracts.find(c=>c.id===id);if(!x||!contractGrades.some(g=>g.quality===q))return;if(x.productionState==='running'||S.activeContractId===id)return note('Pause or switch away from this production run before changing its grade.');x.producedQuality=q;x.currentLotId=null;save();renderFactory()}
window.setProductionPolicy=(id,p)=>{if(!businessOpen())return note('The works are closed for the night.');const x=S.contracts.find(c=>c.id===id);if(!x||x.productionState==='running'||!productionPolicies[p])return;x.productionPolicy=p;save();renderFactory()}
window.setProductionQuantity=(id,value)=>{if(!businessOpen())return note('The works are closed for the night.');const x=S.contracts.find(c=>c.id===id);if(!x||x.productionState==='running')return;const qty=Math.floor(Number(value)),minimum=Math.max(1,Math.ceil(x.completed||0));if(!Number.isFinite(qty)||qty<minimum)return;x.productionQuantity=qty;if(qty>(x.completed||0)&&!S.productionQueue.includes(id)&&x.status!=='delivered'&&x.status!=='delivered-discount'){S.productionQueue.push(id);x.productionState='queued'}save();renderFactory()}
function activateProduction(x){if(!x)return;S.activeContractId=x.id;S.lineHoldReason=null;const q=selectedProductionGrade(x);if(S.lastProductionQuality&&S.lastProductionQuality!==q){window.advanceWorldTime(60,false);S.lineMessage='Works changed tooling from '+S.lastProductionQuality+' to '+q+' production. 1 minute setup time used.'}else S.lineMessage='Production run started for '+x.customer+'.';S.lastProductionQuality=q;x.productionState='running';S.lineStatus='running'}
window.switchProduction=id=>{if(!businessOpen())return note('The works are closed for the night.');const next=S.contracts.find(c=>c.id===id);if(!next)return;if(!S.productionQueue.includes(id))S.productionQueue.push(id);const current=activeContract();if(current&&current.id!==id&&(current.productionState==='running'||S.lineStatus==='awaiting')){const msg='Production line is currently assigned to '+current.id+'. '+Math.floor(current.completed||0).toLocaleString()+' of '+productionTarget(current).toLocaleString()+' units have been manufactured. Switch production? Completed bulbs will remain in the Warehouse and this run will be paused.';if(!confirm(msg))return;current.productionState='paused';S.lineStatus='idle';S.activeContractId=null}if(current&&current.id===id){if(current.productionState==='paused'){activateProduction(current);note(S.lineMessage);save();render()}return}activateProduction(next);note(S.lineMessage);save();render()}
window.queueContractProduction=id=>{if(!businessOpen())return note('The works are closed for the night.');const x=S.contracts.find(c=>c.id===id);if(!x||x.status==='delivered'||x.status==='delivered-discount')return;if(!S.productionQueue.includes(id))S.productionQueue.push(id);if((x.completed||0)>=productionTarget(x))x.productionQuantity=Math.max(Math.ceil(x.completed||0)+Math.max(1,x.quantity-(x.delivered||0)),Math.ceil(x.completed||0)+1);x.productionState='queued';save();render();showTab('factory');note(x.id+' is queued for production.')}
window.pauseActiveProduction=()=>{if(!businessOpen())return note('The works are closed for the night.');const x=activeContract();if(!x||S.lineStatus!=='running')return;x.productionState='paused';S.activeContractId=null;S.lineStatus='idle';S.lineHoldReason='manual';S.lineMessage=x.id+' paused at '+Math.floor(x.completed||0).toLocaleString()+' units. Finished bulbs remain in the Warehouse.';note(S.lineMessage);save();render()}
window.abandonProductionRun=()=>{if(!businessOpen())return note('The works are closed for the night.');const x=activeContract()||queuedContracts()[0];if(!x)return;const made=Math.floor(x.completed||0),target=productionTarget(x);if(made<target&&!confirm('Stop the remaining production on '+x.id+'? '+made.toLocaleString()+' units already manufactured will remain in the Warehouse. The contract itself will NOT be cancelled.'))return;S.productionQueue=S.productionQueue.filter(v=>v!==x.id);if(S.activeContractId===x.id)S.activeContractId=null;x.productionState='abandoned';S.lineStatus='idle';S.lineHoldReason=null;S.lineMessage=x.id+' production stopped at '+made.toLocaleString()+' units. The customer contract remains open.';note(S.lineMessage);save();render()}
window.moveQueue=(id,dir)=>{if(!businessOpen())return note('The works office is closed for the night.');const i=S.productionQueue.indexOf(id),j=i+dir;if(i<0||j<0||j>=S.productionQueue.length||id===S.activeContractId)return;[S.productionQueue[i],S.productionQueue[j]]=[S.productionQueue[j],S.productionQueue[i]];save();renderFactory()}
function startNextQueued(){normalizeProductionTimes();const x=queuedContracts()[0];if(!x){S.activeContractId=null;S.lineStatus='idle';S.lineMessage='Production queue complete.';return}activateProduction(x)}
function productionCfg(q){return {standard:{c:1,g:1,t:.5,cost:.015},long:{c:1.12,g:1.08,t:.72,cost:.022},economy:{c:.82,g:.88,t:.35,cost:.012}}[q]}
function selectedProductionGrade(c){
 const q=c?.producedQuality||c?.quality||'standard';
 return contractGrades.some(g=>g.quality===q)?q:'standard';
}
function productionVariableUnitCost(q){
 const cfg=productionCfg(q)||productionCfg('standard');
 return cfg.c*MATERIAL_MARKET.copper.unitPrice+cfg.g*MATERIAL_MARKET.glass.unitPrice+cfg.t*MATERIAL_MARKET[filamentMaterial()].unitPrice+cfg.cost;
}
function productionQualityProfile(c){
 const w=S.workforce||{},policy=productionPolicyCfg(c),base=clamp((w.skill||68)*.32+(w.morale||73)*.16+(w.discipline||81)*.17+S.machinery*.35,45,99),internal=clamp((100-base)*.0007*policy.defects,.002,.06),latent=clamp((100-base)*.00025*policy.defects,.0005,.025),qc=clamp(100-internal*150-latent*200,70,99.8);return {internal,latent,qc}
}
function addFinishedUnits(c,q,good,rejected,qc,latent){
 if(good<=0)return;const lot=ensureFinishedLot(c,q),before=lot.produced||0,total=before+good;lot.qc=total?(lot.qc*before+qc*good)/total:qc;lot.latentDefectRate=total?((lot.latentDefectRate||0)*before+latent*good)/total:latent;lot.produced=total;lot.available=(lot.available||0)+good;lot.rejected=(lot.rejected||0)+Math.max(0,rejected);lot.producedDate=S.gameDate;S.inventoryByGrade[q]=(S.inventoryByGrade[q]||0)+good
}
function advanceProduction(seconds,away=false){if(!businessOpen())return;const x=activeContract();if(!x||S.lineStatus!=='running'||x.productionState!=='running'||seconds<=0)return;let effective=seconds;if(away&&Math.random()<.14){if(Math.random()<.62){const lost=Math.min(effective,60+Math.floor(Math.random()*361));effective=Math.max(0,effective-lost);S.lineMessage='A breakdown occurred while you were away. Foreman Sullivan repaired it after '+Math.ceil(lost/60)+' minutes.'}else{
 const gm=S.delegation?.generalManager,managerChance=gm?.hired?clamp((gm.competence||0)*.006+(gm.reliability||0)*.003,0,.78):0;
 if(gm?.hired&&Math.random()<managerChance){
  const lost=Math.min(effective,120+Math.floor(Math.random()*361));
  effective=Math.max(0,effective-lost);
  S.lineMessage='A serious line breakdown occurred while you were away. The General Manager authorized repairs and restored production after '+Math.ceil(lost/60)+' minutes.';
  addManagementAlert('breakdown',S.lineMessage,'attention');
 }else{
  effective=Math.max(0,effective*(.12+Math.random()*.35));S.lineStatus='awaiting';S.lineHoldReason='breakdown';x.productionState='paused';
  S.lineMessage=gm?.hired?'A serious line breakdown exceeded the General Manager\'s handling authority. Production is stopped pending your decision.':'The line broke down while you were away. Foreman Sullivan needs your authorization before repairs can continue.';
  addManagementAlert('breakdown',S.lineMessage,'critical');
 }
}}const filamentKey=filamentMaterial();const target=productionTarget(x),remaining=Math.max(0,target-(+x.completed||0)),factor=(S.machinery/92)*workforceProductionFactor()*productionPolicyCfg(x).speed,rate=target/productionRunSeconds(x)*factor,desired=Math.min(remaining,rate*effective),selectedGrade=selectedProductionGrade(x),cfg=productionCfg(selectedGrade),qp=productionQualityProfile(x),yieldRate=Math.max(.85,1-qp.internal),possible=Math.min(desired,S.materials.copper*yieldRate/cfg.c,S.materials.glass*yieldRate/cfg.g,S.materials[filamentKey]*yieldRate/cfg.t,S.companyCash*yieldRate/cfg.cost);if(possible<=0){S.lineStatus='awaiting';S.lineHoldReason='materials-or-cash';x.productionState='paused';S.lineMessage='Production stopped for lack of materials or operating cash.';addManagementAlert('production',S.lineMessage,'critical');return}const gross=possible/yieldRate,rejected=Math.max(0,gross-possible);S.materials.copper=Math.max(0,S.materials.copper-gross*cfg.c);S.materials.glass=Math.max(0,S.materials.glass-gross*cfg.g);S.materials[filamentKey]=Math.max(0,S.materials[filamentKey]-gross*cfg.t);const cost=gross*cfg.cost;S.companyCash-=cost;S.lastExpenses+=cost;x.completed=(+x.completed||0)+possible;addFinishedUnits(x,selectedGrade,possible,rejected,qp.qc,qp.latent);if(x.completed>=target-.01){x.completed=target;S.productionQueue=S.productionQueue.filter(id=>id!==x.id);S.activeContractId=null;x.productionState='complete';S.lineMessage='Production run '+x.id+' complete. '+Math.floor(target).toLocaleString()+' finished units are in Warehouse inventory. Nothing has been shipped automatically.';startNextQueued()}renderMaterialStocks();renderFactory();renderWarehouse();renderContracts()}
function takeWarehouseUnits(grade,qty){let left=qty;const allocations=[];for(const lot of (S.finishedLots||[])){if(lot.quality!==grade||(lot.available||0)<=0)continue;const take=Math.min(left,Math.floor(lot.available));if(take<=0)continue;lot.available-=take;allocations.push({lotId:lot.id,qty:take,latentDefectRate:lot.latentDefectRate||0});left-=take;if(left<=0)break}const taken=qty-left;if(taken>0)S.inventoryByGrade[grade]=Math.max(0,(S.inventoryByGrade[grade]||0)-taken);return {taken,allocations}}
function returnWarehouseUnits(grade,allocations){let total=0;for(const a of allocations){let lot=(S.finishedLots||[]).find(l=>l.id===a.lotId);if(!lot){lot={id:a.lotId,quality:grade,qualityName:contractGrade(grade).qualityName,product:'Electric Light Bulbs',available:0,produced:0,rejected:0,qc:90,latentDefectRate:a.latentDefectRate||.006,producedDate:S.gameDate};S.finishedLots.push(lot)}lot.available=(lot.available||0)+a.qty;total+=a.qty}S.inventoryByGrade[grade]=(S.inventoryByGrade[grade]||0)+total}
function scheduleQualityClaim(x,qty,allocations){
 const expected=allocations.reduce((a,v)=>a+v.qty*(v.latentDefectRate||0),0),defective=Math.min(qty,Math.max(0,Math.round(expected*(.55+Math.random()*.9))));if(defective<Math.max(3,Math.ceil(qty*.004))||Math.random()>.55)return;
 S.pendingQualityClaims.push({contractId:x.id,qty:defective,dueTurn:(S.turnSerial||1)+1+Math.floor(Math.random()*2),unitPrice:x.price})
}
window.shipFromWarehouse=id=>{if(!businessOpen())return note('Shipping is closed for the night.');const x=S.contracts.find(c=>c.id===id);if(!x)return;const remaining=Math.max(0,x.quantity-(x.delivered||0));if(!remaining)return note(x.id+' is already fully delivered.');const qty=Math.floor(Number($('#ship_qty_'+id)?.value)),grade=$('#ship_grade_'+id)?.value;if(!Number.isFinite(qty)||qty<1||qty>remaining)return note('Enter a shipment quantity between 1 and '+remaining.toLocaleString()+'.');const trait=customerTraits[x.customerTrait||customerTraitFor(x.customer)];if(qty<remaining&&!trait.partial)return note(x.customer+' requires the remaining order in one shipment.');if(!contractGrades.some(g=>g.quality===grade))return note('Choose a valid warehouse grade.');if(Math.floor(S.inventoryByGrade[grade]||0)<qty)return note('Warehouse does not contain '+qty.toLocaleString()+' '+contractGrade(grade).qualityName+' bulbs.');const picked=takeWarehouseUnits(grade,qty);if(picked.taken!==qty){returnWarehouseUnits(grade,picked.allocations);return note('Warehouse lot records do not contain enough units for that shipment.')}const h=customerHistory(x.customer),correct=grade===x.quality;if(!correct&&Math.random()<trait.reject){returnWarehouseUnits(grade,picked.allocations);h.rejected++;S.reputation=clamp(S.reputation-1.2,0,100);S.notes.push({date:displayDate(),text:x.customer+' rejected a proposed shipment of '+qty.toLocaleString()+' '+contractGrade(grade).qualityName+' bulbs under '+x.id+' because the grade was wrong.',source:'customer correspondence'});note(x.customer+' rejected the wrong-grade shipment. The bulbs were returned to the Warehouse.');save();render();return}const rate=correct?1:trait.discount,rev=qty*x.price*rate;S.companyCash+=rev;S.lastRevenue+=rev;x.delivered=(x.delivered||0)+qty;if(qty<remaining)h.partial=(h.partial||0)+1;if(x.delivered>=x.quantity){x.delivered=x.quantity;x.status=correct?'delivered':'delivered-discount';if(correct)h.completed++}else x.status=x.deadlinePassed?'overdue':'accepted';if(!correct)h.discounted=(h.discounted||0)+1;else scheduleQualityClaim(x,qty,picked.allocations);S.notes.push({date:displayDate(),text:x.customer+' accepted '+qty.toLocaleString()+' '+contractGrade(grade).qualityName+' bulbs from Warehouse under '+x.id+(correct?'.':' at a '+Math.round((1-rate)*100)+'% wrong-grade discount.'),source:'customer correspondence'});note(qty.toLocaleString()+' units shipped from Warehouse. '+Math.max(0,x.quantity-x.delivered).toLocaleString()+' remain due on '+x.id+'.');save();render()}
window.shipPartial=id=>window.shipFromWarehouse(id);
function processPendingQualityClaims(){
 const keep=[];
 for(const claim of S.pendingQualityClaims||[]){
  if(claim.dueTurn>(S.turnSerial||1)){keep.push(claim);continue}
  const x=S.contracts.find(c=>c.id===claim.contractId);if(!x)continue;
  const qty=Math.min(Math.floor(x.delivered||0),Math.floor(claim.qty||0));if(qty<=0)continue;
  const refund=qty*(claim.unitPrice||x.price);
  x.delivered=Math.max(0,(x.delivered||0)-qty);
  x.status='replacement';
  S.companyCash-=refund;S.lastExpenses+=refund;
  customerHistory(x.customer).rejected++;
  S.reputation=clamp(S.reputation-.6,0,100);
  const matching=Math.max(0,Math.floor(S.inventoryByGrade[x.quality]||0));
  const remaining=Math.max(0,x.quantity-x.delivered);
  if(matching<remaining){
   const shortage=remaining-matching;
   x.productionQuantity=Math.max(Math.ceil(x.completed||0)+shortage,Math.ceil(x.completed||0)+1);
   x.productionState='queued';
   if(!S.productionQueue.includes(x.id))S.productionQueue.push(x.id);
  }
  S.notes.push({date:displayDate(),text:x.customer+' reported '+qty.toLocaleString()+' defective bulbs under '+x.id+'. Federal Electric refunded '+cash(refund)+' and now owes replacement units.',source:'customer complaint'});
 }
 S.pendingQualityClaims=keep;
}
function markOverdueContractsAtTurn(serial){
 for(const x of S.contracts){
  const remaining=Math.max(0,x.quantity-(x.delivered||0));
  if(remaining<=0||!Number.isFinite(+x.deadlineTurnSerial)||+x.deadlineTurnSerial>serial)continue;
  const h=customerHistory(x.customer);
  if(!x.deadlinePassed){
   x.deadlinePassed=true;x.status='overdue';h.late++;
   S.reputation=clamp(S.reputation-.6,0,100);
   S.notes.push({date:displayDate(),text:x.id+' reached its delivery deadline with '+remaining.toLocaleString()+' units still due to '+x.customer+'. The inventory remains Federal Electric property until actually shipped.',source:'company records'});
  }
  if((+x.lastLatePenaltyTurn||0)>=serial)continue;
  const penalty=Math.max(.5,Math.min(25,remaining*x.price*.01));
  x.lastLatePenaltyTurn=serial;
  S.companyCash-=penalty;S.lastExpenses+=penalty;
  S.reputation=clamp(S.reputation-.25,0,100);
  S.notes.push({date:displayDate(),text:x.id+' incurred a '+cash(penalty)+' late-service penalty with '+remaining.toLocaleString()+' units still outstanding to '+x.customer+'.',source:'customer correspondence'});
 }
}
function finishDeadlineContracts(){markOverdueContractsAtTurn(S.turnSerial||1)}
function finishDayContracts(){markOverdueContractsAtTurn(S.turnSerial||1)}
function snapshotStockTradeQuantities(){
 document.querySelectorAll('#stocks input[id^="qty_"]').forEach(el=>{
  stockTradeQuantityDrafts[el.id.slice(4)]=el.value;
 });
}
function restoreStockTradeQuantities(){
 for(const [k,value] of Object.entries(stockTradeQuantityDrafts)){
  const el=$('#qty_'+k);if(!el)continue;
  el.value=value;
  renderTradeEstimate(k);
 }
}
function brokerChannel(){return window.FE_BROKER?.channel?.(S,currentCityLocation().locationId,S.characterRoute)||null}
function renderBrokerOffice(){
 const panel=document.getElementById('cityRoomBrokerage');if(!panel)return;
 const active=cityRoomSession.locationId==='brokerOffice'&&!cityRoomSession.dev;
 panel.hidden=!active;if(!active)return;
 const info=window.FE_BROKER?.progress?.(S),label=document.getElementById('brokerRelationStatus');
 if(info&&label)label.textContent='Separate game-date visits: '+info.visits+'. '+(info.wireAllowed?'Telegram instructions accepted from your executive office.':'Return on '+info.remaining+' more separate day'+(info.remaining===1?'':'s')+' to establish correspondence privileges.');
 const advisory=document.getElementById('brokerAdvisory');
 if(advisory){
  const notes=window.FE_BROKER?.ensure?.(S).notices||[];
  const last=notes[notes.length-1];
  advisory.textContent=last?("Broker note · "+last.date+": "+last.text):"The broker has no assessment of your holdings on record yet.";
 }
 const select=document.getElementById('brokerStockTicker');
 if(select){
  const prev=select.value;
  const eligible=Object.entries(S.stocks).filter(([k,v])=>stockAvailableInYear(k,v.sector,+S.gameDate.slice(0,4)));
  select.replaceChildren();
  for(const [k,v] of eligible){const opt=document.createElement('option');opt.value=k;opt.textContent=k+' · '+v.name;select.appendChild(opt)}
  if(eligible.some(([k])=>k===prev))select.value=prev;
 }
 for(const id of ['brokerBuy','brokerSell']){const btn=document.getElementById(id);if(btn)btn.disabled=!businessOpen()||S.paused}
}
function brokerPlaceOrder(direction){
 const result=document.getElementById('brokerOrderStatus');if(!result)return;
 if(!brokerChannel()||currentCityLocation().locationId!=='brokerOffice'){result.textContent='You must be at your broker’s office.';return}
 const k=document.getElementById('brokerStockTicker')?.value,qty=Number(document.getElementById('brokerStockQuantity')?.value);
 if(!k||!Number.isSafeInteger(qty)||qty<1){result.textContent='Enter a positive whole share quantity.';return}
 const count=S.transactions.length;window.trade(k,direction,qty);
 result.textContent=S.transactions.length>count
  ?'Broker accepted '+(direction>0?'purchase':'sale')+' of '+qty+' '+k+' shares. Personal cash: '+cash(S.personalCash)+'.'
  :document.getElementById('notice')?.textContent||'Order not accepted.';
}
function tradeQty(k){const el=$('#qty_'+k),n=Number(el?.value);return Number.isSafeInteger(n)&&n>0?n:0}
function renderTradeEstimate(k){const el=$('#estimate_'+k);if(!el)return;const qty=tradeQty(k),x=S.stocks[k];if(!qty){el.textContent='';return}const commission=Math.max(1,qty*.05);el.textContent='Buy total '+cash(x.price*qty+commission)}
function refreshStockSectorFilter(){
 const select=$('#sectorFilter');if(!select)return;
 const sectors=[...new Set(Object.entries(S.stocks).filter(([k,x])=>stockAvailableInYear(k,x.sector,+S.gameDate.slice(0,4))).map(([,x])=>x.sector))].sort(),values=['All',...sectors];
 if(Array.from(select.options).map(opt=>opt.value).join('|')===values.join('|'))return;
 const chosen=select.value;
 select.replaceChildren();
 for(const name of values){const option=document.createElement('option');option.value=name;option.textContent=name==='All'?'All sectors':name;select.appendChild(option)}
 select.value=values.includes(chosen)?chosen:'All';
}
function renderStocks(){
 snapshotStockTradeQuantities();
 const q=$('#stockSearch').value.trim().toLowerCase(),sector=$('#sectorFilter').value,closed=!businessOpen()||S.paused||!brokerChannel();
 const rows=Object.entries(S.stocks).filter(([k,x])=>stockAvailableInYear(k,x.sector,+S.gameDate.slice(0,4))&&(sector==='All'||x.sector===sector)&&(!q||k.toLowerCase().includes(q)||x.name.toLowerCase().includes(q)));
 $('#stocks').innerHTML=rows.map(([k,x])=>{
   const basis=Number.isFinite(+x.prevClose)&&+x.prevClose>0?+x.prevClose:(+x.prev||x.open),quote=S.phase==='day'?x.open:x.price,ch=(quote/basis-1)*100,p=S.portfolio[k],dis=closed?' disabled':'',sellDis=(closed||!p.shares)?' disabled':'';
   return '<tr><td><button class="stock-ticker-link" onclick="showStockDetail(\''+k+'\')">'+k+'</button></td><td><button class="stock-name-link" onclick="showStockDetail(\''+k+'\')">'+escapeHtml(x.name)+'</button></td><td>'+x.sector+'</td><td>$'+quote.toFixed(2)+'</td><td class="'+(ch>=0?'gain':'loss')+'">'+signed(ch)+'</td><td>'+(x.yieldRate*100).toFixed(1)+'%</td><td>'+p.shares+'</td><td><div class="trade-box"><input id="qty_'+k+'" type="number" min="1" step="1" value="10" oninput="renderTradeEstimate(\''+k+'\')"'+dis+'><div class="trade-buttons"><button onclick="trade(\''+k+'\',1)"'+dis+'>Buy</button><button onclick="trade(\''+k+'\',-1)"'+dis+'>Sell</button><button onclick="sellAll(\''+k+'\')"'+sellDis+'>Sell All</button></div><small id="estimate_'+k+'"></small></div></td></tr>'
 }).join('')
 restoreStockTradeQuantities();
 renderStockDetail();
}
function stockHistorySeries(k){
 const x=S.stocks[k];if(!x)return[];
 const series=(Array.isArray(x.history)?x.history:[]).slice(-STOCK_HISTORY_DAYS).map(v=>({date:v.date,close:+v.close}));
 const current={date:S.gameDate,close:S.phase==='day'?x.open:x.price};
 if(!series.length||series[series.length-1].date!==current.date)series.push(current);else series[series.length-1]=current;
 return series;
}
function stockChartSvg(series,label){
 if(series.length<2)return '';
 const width=820,height=250,pad=44,vals=series.map(v=>v.close),min=Math.min(...vals),max=Math.max(...vals),span=Math.max(.01,max-min);
 const points=series.map((v,i)=>{const x=pad+i*(width-pad*2)/Math.max(1,series.length-1),y=height-pad-(v.close-min)*(height-pad*2)/span;return x.toFixed(1)+','+y.toFixed(1)}).join(' ');
 const hgrid=Array.from({length:5},(_,i)=>{const y=pad+i*(height-pad*2)/4;return '<line x1="'+pad+'" y1="'+y+'" x2="'+(width-pad)+'" y2="'+y+'" />'}).join('');
 const vgrid=Array.from({length:7},(_,i)=>{const x=pad+i*(width-pad*2)/6;return '<line x1="'+x+'" y1="'+pad+'" x2="'+x+'" y2="'+(height-pad)+'" />'}).join('');
 return '<svg class="stock-history-chart" viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+escapeHtml(label)+' quotation history"><g class="stock-chart-grid">'+hgrid+vgrid+'</g><polyline class="stock-history-line" points="'+points+'"/><text x="'+pad+'" y="24">HIGH $'+max.toFixed(2)+'</text><text x="'+(width-pad-110)+'" y="24">LOW $'+min.toFixed(2)+'</text></svg>';
}
function renderStockDetail(){
 const box=$('#stockDetail');if(!box)return;
 if(!selectedStockTicker||!S.stocks[selectedStockTicker]||!stockAvailableInYear(selectedStockTicker,S.stocks[selectedStockTicker].sector,+S.gameDate.slice(0,4))){box.hidden=true;box.innerHTML='';return}
 const k=selectedStockTicker,x=S.stocks[k],series=stockHistorySeries(k),quote=S.phase==='day'?x.open:x.price,basis=x.prevClose||x.prev||quote,day=(quote/basis-1)*100,start=series[0]?.close||quote,range=(quote/start-1)*100,vals=series.map(v=>v.close),recordHigh=Math.max(...vals),recordLow=Math.min(...vals),ledgerRows=series.slice().reverse(),firstDate=series[0]?.date||S.gameDate,lastDate=series[series.length-1]?.date||S.gameDate;
 box.hidden=false;box.innerHTML='<div class="stock-detail-head"><div><span class="tag">'+k+'</span><h3>'+escapeHtml(x.name)+'</h3><p class="fine">Security Record · seeded quotation history begins before Federal Electric opens on its starting date. Completed game sessions are added to the same record.</p></div><button onclick="closeStockDetail()">Close Record</button></div><div class="stock-detail-stats stock-detail-stats-six"><span><b>Published quote</b>$'+quote.toFixed(2)+'</span><span><b>Prior close</b>$'+Number(basis).toFixed(2)+'</span><span><b>Day</b><i class="'+(day>=0?'gain':'loss')+'">'+signed(day)+'</i></span><span><b>Record move</b><i class="'+(range>=0?'gain':'loss')+'">'+signed(range)+'</i></span><span><b>Record high</b>$'+recordHigh.toFixed(2)+'</span><span><b>Record low</b>$'+recordLow.toFixed(2)+'</span></div><div class="stock-history-period"><b>History shown:</b> '+firstDate+' through '+lastDate+' · '+series.length+' quoted sessions</div>'+stockChartSvg(series,x.name)+'<div class="table-wrap stock-history-ledger"><table><thead><tr><th>Date</th><th>Close / Published Quote</th><th>Change</th></tr></thead><tbody>'+ledgerRows.map(r=>{const idx=series.findIndex(v=>v.date===r.date),prev=idx>0?series[idx-1].close:null,ch=prev?(r.close/prev-1)*100:null;return '<tr><td>'+r.date+'</td><td>$'+r.close.toFixed(2)+'</td><td class="'+(ch==null?'':ch>=0?'gain':'loss')+'">'+(ch==null?'—':signed(ch))+'</td></tr>'}).join('')+'</tbody></table></div>';
}
window.showStockDetail=k=>{if(S.paused)return;selectedStockTicker=k;renderStockDetail()}
window.closeStockDetail=()=>{selectedStockTicker=null;renderStockDetail()}
function renderHoldings(){const rows=Object.entries(S.portfolio).filter(([,p])=>p.shares>0||Math.abs(p.realized||0)>.005);$('#holdings').innerHTML=rows.map(([k,p])=>{const x=S.stocks[k],avg=p.shares?p.cost/p.shares:0,mv=p.shares*x.price,g=mv-p.cost;return '<tr><td>'+k+'</td><td>'+p.shares+'</td><td>'+(p.shares?'$'+avg.toFixed(2):'—')+'</td><td>$'+x.price.toFixed(2)+'</td><td>'+cash(mv)+'</td><td class="'+(g>=0?'gain':'loss')+'">'+cash(g)+'</td><td class="'+((p.realized||0)>=0?'gain':'loss')+'">'+cash(p.realized||0)+'</td></tr>'}).join('')||'<tr><td colspan="7" class="empty">No securities held or realized trades recorded.</td></tr>'}
function renderTransactions(){$('#transactions').innerHTML=S.transactions.slice(-20).reverse().map(t=>'<tr><td>'+t.date+'</td><td>'+t.action+'</td><td>'+t.ticker+'</td><td>'+t.shares+'</td><td>$'+(+t.price).toFixed(2)+'</td><td>'+cash(t.amount)+'</td><td class="'+((t.realized||0)>=0?'gain':'loss')+'">'+(t.action==='SELL'?cash(t.realized||0):'—')+'</td></tr>').join('')||'<tr><td colspan="7" class="empty">No transactions yet.</td></tr>'}
window.renderTradeEstimate=renderTradeEstimate;
function renderNotes(){$('#notes').innerHTML=S.notes.slice().reverse().map(n=>'<div class="note-entry"><b>'+n.date+'</b> · '+escapeHtml(n.text)+'<br><small>Source: '+escapeHtml(n.source||'personal observation')+'</small></div>').join('')||'<p class="empty">No notes recorded.</p>'}
function renderArchive(){$('#newsArchive').innerHTML=S.newsArchive.slice().reverse().map(n=>'<div class="archive-entry"><b>'+n.date+'</b><br>'+escapeHtml(n.headline)+'</div>').join('')||'<p class="empty">No editions archived.</p>'}
function renderWashington(){const c=S.contacts;if(S.pokerDay!==S.gameDate){S.pokerDay=S.gameDate;S.pokerPlayed={working:0,middle:0,elite:0}}const wLeft=Math.max(0,5-S.pokerPlayed.working),mLeft=Math.max(0,3-S.pokerPlayed.middle),eLeft=Math.max(0,1-S.pokerPlayed.elite),middleOpen=!!S.middlePokerUnlocked;$('#starRelation').textContent=c.madamStar.met?(c.madamStar.trust>2?'Warm acquaintance':'Acquainted'):'Not yet acquainted';const dayActions=$('#starDayActions'),nightActions=$('#starNightActions'),phaseNote=$('#starPhaseNote');if(dayActions)dayActions.hidden=S.phase!=='day';if(nightActions)nightActions.hidden=S.phase!=='night';if(phaseNote)phaseNote.textContent=S.phase==='day'?'Daytime visits draw a quieter crowd of businessmen, officials and people slipping away from their offices.':S.phase==='night'?'Evening visits draw a busier crowd of gamblers, promoters, wealthy patrons and people from Washington\'s underground.':'The Star Club is closed while the Daily Report is open.';$('#contacts').innerHTML=Object.values(c).filter(x=>x.met).map(x=>'<div class="contact-card"><b>'+escapeHtml(x.name)+'</b><span>'+((x===c.madamStar)?'The Star Club':(x===c.bookie?'Private bookmaker':(x===c.promoter?'Fight promoter':'Washington contact')))+'</span><small>Met personally. Private motives and reliability unknown.</small></div>').join('')||'<p class="empty">Your card index is empty. Meet people around Washington to add contacts.</p>';$('#pokerWorking').disabled=false;$('#simPokerWorking').disabled=wLeft===0;$('#pokerMiddle').disabled=false;$('#simPokerMiddle').disabled=!middleOpen||mLeft===0;$('#pokerElite').disabled=false;$('#simPokerElite').disabled=!S.elitePokerUnlocked||eLeft===0;$('#pokerWorking').textContent='Play · $25 stake · '+wLeft+' available';$('#simPokerWorking').textContent='Simulate · 5 min';$('#pokerMiddle').textContent=middleOpen?'Play · $100 stake · '+mLeft+' available':'Meet Eddie Doyle to unlock';$('#simPokerMiddle').textContent='Simulate · 10 min';$('#pokerElite').textContent=S.elitePokerUnlocked?'Play · $500 stake · '+eLeft+' available':'Harrison Vale invitation required';$('#simPokerElite').textContent='Simulate · 25 min';$('#pokerProgress').textContent='Neighborhood Game: OPEN · Commerce Club: '+(middleOpen?'UNLOCKED':'EDDIE DOYLE INTRODUCTION REQUIRED')+' · Embassy Room: '+(S.elitePokerUnlocked?'UNLOCKED':'VALE INVITATION REQUIRED')}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function materialQty(k){const n=Math.floor(Number(document.getElementById('material_qty_'+k)?.value));return Number.isFinite(n)&&n>0?n:0}
window.tradeMaterial=(k,direction,forcedQty=null)=>{
 if(S.paused)return note('Game is paused.');
 if(!businessOpen())return note('Suppliers are closed for the night.');
 const market=MATERIAL_MARKET[k],qty=forcedQty||materialQty(k);if(!market||!qty)return note('Enter a valid material quantity.');
 const amount=market.unitPrice*qty;
 if(direction>0){if(S.companyCash<amount)return note('Insufficient company cash. '+market.name+' purchase requires '+cash(amount)+'.');S.companyCash-=amount;S.materials[k]+=qty;S.lastExpenses+=amount;note('Bought '+qty.toLocaleString()+' '+market.name.toLowerCase()+' units for '+cash(amount)+'.')}
 else{const held=Math.floor(S.materials[k]||0);if(held<qty)return note('Federal Electric only has '+held.toLocaleString()+' '+market.name.toLowerCase()+' units available to sell.');S.materials[k]-=qty;S.companyCash+=amount;S.lastRevenue+=amount;note('Sold '+qty.toLocaleString()+' '+market.name.toLowerCase()+' units for '+cash(amount)+'.')}
 save();render();
}
window.sellAllMaterial=k=>{const qty=Math.floor(S.materials[k]||0);if(!qty)return note('No '+(MATERIAL_MARKET[k]?.name||k).toLowerCase()+' inventory to sell.');window.tradeMaterial(k,-1,qty)}
window.trade=(k,direction,forcedQty=null)=>{if(S.paused)return note('The game is paused.');if(!businessOpen())return note('The Federal Exchange is closed for the night.');if(!brokerChannel())return note('Stock orders require a visit to your broker. Only the Federal Electric proprietor may send telegrams from the executive office after repeated meetings.');const qty=forcedQty===null?tradeQty(k):Number(forcedQty),x=S.stocks[k],p=S.portfolio[k];if(!Number.isSafeInteger(qty)||qty<1)return note('Enter a positive whole number of shares.');if(!x||!p||!stockAvailableInYear(k,x.sector,+S.gameDate.slice(0,4)))return note('That security is not listed on the Federal Exchange in this year.');const commission=Math.max(1,qty*.05),gross=x.price*qty;if(direction>0){const total=gross+commission;if(S.personalCash<total)return note('Insufficient personal cash. Purchase requires '+cash(total)+' including commission; available cash is '+cash(S.personalCash)+'.');S.personalCash-=total;p.shares+=qty;p.cost+=total;S.transactions.push({date:displayDate(),action:'BUY',ticker:k,shares:qty,price:x.price,amount:-total,realized:0});note('Bought '+qty+' '+k+' at '+cash(x.price)+' · total cost '+cash(total)+' · cash available '+cash(S.personalCash)+'.')}else{if(p.shares<qty)return note('Not enough '+k+' shares. You own '+p.shares+'.');const avg=p.cost/p.shares,proceeds=gross-commission,costBasis=avg*qty,realized=proceeds-costBasis;p.shares-=qty;p.cost=Math.max(0,p.cost-costBasis);if(p.shares===0)p.cost=0;p.realized=(p.realized||0)+realized;S.personalCash+=proceeds;S.transactions.push({date:displayDate(),action:'SELL',ticker:k,shares:qty,price:x.price,amount:proceeds,realized});note('Sold '+qty+' '+k+' · proceeds '+cash(proceeds)+' · realized '+(realized>=0?'profit ':'loss ')+cash(Math.abs(realized))+' · cash available '+cash(S.personalCash)+'.')}save();render()}
window.sellAll=k=>{const qty=S.portfolio[k].shares;if(!qty)return note('No '+k+' shares to sell.');window.trade(k,-1,qty)}
function stepHiddenMarket(){
 const sectors=[...new Set(Object.values(S.stocks).map(x=>x.sector))],sectorMove={};sectors.forEach(s=>sectorMove[s]=(Math.random()-.5)*.0012);
 const broad=(Math.random()-.5)*.0008;
 for(const [ticker,x] of Object.entries(S.stocks)){if(!stockAvailableInYear(ticker,x.sector,+S.gameDate.slice(0,4)))continue;const current=Number.isFinite(+x.hiddenPrice)?+x.hiddenPrice:+x.price;x.prevHidden=current;const company=(Math.random()-.5)*x.vol*.025,move=broad+sectorMove[x.sector]+company;x.hiddenPrice=Math.max(1,Math.round(current*(1+move)*100)/100)}
}
function setMarketWireOpen(){S.marketWire='Trading continues on the Federal Exchange. Federal Electric has no live intraday quotation service; the opening sheet remains posted until the closing quotations are published.';const wire=$('#marketWire');if(wire)wire.textContent=S.marketWire}
function moveMarket(){stepHiddenMarket();setMarketWireOpen()}
function advanceHiddenMarket(seconds){
 if(!businessOpen()||seconds<=0)return;
 const stepSeconds=MARKET_TICK_MS/1000,steps=Math.floor(seconds/stepSeconds);
 for(let i=0;i<steps;i++)stepHiddenMarket();
 if(steps)setMarketWireOpen();
}
// World time moves at 1:1. Player actions add their duration, split at
// schedule/shift boundaries to simulate other lives chronologically.
function advanceWorldSimulation(seconds,away=false,kind='action',deferWorkshopClose=false){
 if(S.paused||S.phase==='report'||!Number.isSafeInteger(seconds)||seconds<=0)return 0;
 let remaining=seconds,spent=0;
 const oldAway=!!S.npcOffscreenCatchup;
 if(away)S.npcOffscreenCatchup=true;
 try{
  while(remaining>0){
   const until=window.FE_WASHINGTON_TIME.secondsToBoundary(S);
   if(!Number.isSafeInteger(until)||until<=0)break;
   const delta=Math.min(remaining,until),working=businessOpen();
   const receipt=window.FE_WASHINGTON_TIME.advance(S,delta,kind);
   if(!receipt.applied)break;
   if(working){
    let productive=delta;const cond=S.turnConditions||{};
    if((cond.powerOutageSeconds||0)>0){
     const lost=Math.min(productive,cond.powerOutageSeconds);
     cond.powerOutageSeconds=Math.max(0,cond.powerOutageSeconds-lost);productive-=lost;
     if(activeContract()&&S.lineStatus==='running')S.lineMessage='Utility outage stopped production for '+Math.ceil(lost/60)+' minute(s).';
    }
    advanceProduction(productive,away);
    if(kind!=='tick')advanceHiddenMarket(delta);
   }
   spent+=delta;remaining-=delta;
   const reached=window.FE_WASHINGTON_TIME.now(S);
   if(reached?.minuteOfDay===1020&&S.phase==='day'){
     // At the exact bell, a workshop order must be committed to company cash
     // before the closing-bell report and assistant payroll are calculated.
     if(!(deferWorkshopClose&&S.componentWorks&&remaining===0))closeBusinessDay(false);
    }
   else if(reached?.minuteOfDay===480&&S.phase==='night'){closeNight(false);beginNextDay();}
   window.FE_NPC_AI?.syncClock?.();
  }
 }finally{S.npcOffscreenCatchup=oldAway}
 return spent;
}
window.advanceWorldTime=(seconds,away=false)=>advanceWorldSimulation(Math.max(0,Math.floor(seconds||0)),away,'action');
// Component transactions that land exactly at 5 PM hold the bell only until
// their inventory/cash receipt has been committed. No NPC adds clock time.
window.advanceWorkshopTime=(seconds,away=false)=>advanceWorldSimulation(Math.max(0,Math.floor(seconds||0)),away,'action',true);
window.finishWorkshopClosingBell=()=>{
 const reached=window.FE_WASHINGTON_TIME?.now?.(S);
 if(!S.componentWorks||S.phase!=='day'||reached?.minuteOfDay!==1020)return false;
 closeBusinessDay(false);
 return S.phase==='night';
};

function archiveToday(){if(S.newsArchive.some(n=>n.iso===S.gameDate))return;S.newsArchive.push({iso:S.gameDate,date:displayDate(),headline:S.headline,story:S.story,society:S.societyStory,sports:S.sportsStory});if(S.newsArchive.length>400)S.newsArchive.shift()}
function payMonthlyDividends(oldIso,newIso){if(monthKey(oldIso)===monthKey(newIso))return;let total=0;for(const [k,p] of Object.entries(S.portfolio)){const x=S.stocks[k],amount=p.shares*x.price*x.yieldRate/12;if(amount>.009){total+=amount;S.transactions.push({date:displayDate(),action:'DIVIDEND',ticker:k,shares:p.shares,price:x.price,amount})}}S.personalCash+=total}
function generatePaper(){const d=new Date(S.gameDate+'T12:00:00'),day=d.getDate(),sportsItems=[S.lastRaceResult,S.lastBoxingResult].filter(Boolean);S.sportsStory=sportsItems.length?sportsItems.join(' '):'No major Washington sporting results were filed overnight.';S.lastRaceResult=null;S.lastBoxingResult=null;if(S.lastRaidOutcome==='caught'){S.headline='PROMINENT INDUSTRIALIST QUESTIONED IN CLUB RAID';S.story='Police activity at a private Washington club has drawn attention to several patrons, including the head of Federal Electric.';S.societyStory='The Star Club raid is the subject of unusually energetic conversation in Washington social circles.';S.lastRaidOutcome=null}else if(S.lastRaidOutcome==='missed'){S.headline='POLICE RAID PRIVATE WASHINGTON CLUB';S.story='Police descended on a private club last evening and detained several patrons for questioning.';S.societyStory='The raid has unsettled bookmakers and private gaming circles across the District.';S.lastRaidOutcome=null}else if(S.companyCash<10000){S.headline='CREDITORS WATCH INDUSTRIAL BALANCE SHEETS';S.story='Tight liquidity has become a concern in several manufacturing offices.';S.societyStory='Bankers report growing attention to industrial credit.'}else{S.headline='FACTORIES WEIGH ORDERS, COSTS AND RECOVERY';S.story='Industrial managers report uneven demand as companies compete for orders and preserve working capital.';S.societyStory=day%3===0?'Private clubs remain busy as businessmen and officials exchange gossip after hours.':'Washington begins another day of meetings, dinners and quiet conversations.'}}
// Modest recurring local lighting sales cover normal labor without risky expansion.
function settleStandingTrade(){
 if(S.campaignStartYear!==1890)return;
 const units=Math.min(240,Math.max(0,Math.floor(capacity()*.45))),grade=productionCfg('standard'),filament=filamentMaterial();
 if(!units)return;
 const inputs={copper:grade.c*units,glass:grade.g*units,[filament]:grade.t*units};
 const materialsCost=Object.entries(inputs).reduce((total,[key,qty])=>total+qty*MATERIAL_MARKET[key].unitPrice,0);
 const overhead=grade.cost*units,required=materialsCost+overhead;
 if(S.companyCash<required){addManagementAlert('standing-sales','Routine local lighting orders were missed: operating cash could not cover materials.','attention');return}
 for(const [key,qty] of Object.entries(inputs)){S.materials[key]=(S.materials[key]||0)+qty;S.materials[key]-=qty}
 const sales=units*contractGrades[1].price;
 const routineService=S.machinery>=85?.75:0;
 if(S.companyCash<required+routineService)return;
 S.companyCash+=sales-required-routineService;S.lastRevenue+=sales;S.lastExpenses+=required+routineService;
 if(routineService)S.machinery=clamp(S.machinery+.7,20,100);
 S.standingSalesTotal=(+S.standingSalesTotal||0)+units;
}
function closeBusinessDay(manual=false){
 if(S.phase!=='day')return;
 const shiftRun=activeContract();
 if(shiftRun&&S.lineStatus==='running'&&shiftRun.productionState==='running'&&(+shiftRun.completed||0)<productionTarget(shiftRun)){
  shiftRun.productionState='paused';S.lineStatus='awaiting';S.lineHoldReason='closing-bell';S.lineMessage='Closing bell stopped '+shiftRun.id+'. '+(S.delegation?.foremanAutoStart?'Foreman Sullivan is authorized to restart it next Business Day.':'The line will remain stopped next Business Day until you authorize a restart.');
 }
 if(window.finishRaceMeeting)window.finishRaceMeeting();
 if(window.finishUnderworldDay)window.finishUnderworldDay();
 finishDayContracts();
 for(const [ticker,x] of Object.entries(S.stocks)){if(!stockAvailableInYear(ticker,x.sector,+S.gameDate.slice(0,4)))continue;const close=Number.isFinite(+x.hiddenPrice)?+x.hiddenPrice:+x.price;x.price=close;if(!Array.isArray(x.history))x.history=[];const last=x.history[x.history.length-1];if(last&&last.date===S.gameDate)last.close=close;else x.history.push({date:S.gameDate,close});if(x.history.length>260)x.history=x.history.slice(-260);x.prev=x.prevClose}
 if(!S.componentWorks)settleStandingTrade();
 if(S.componentWorks){
  // Charlie is the owner; the one assistant's earned wage transfers real cash
  // into the NPC account once, with arrears instead of fabricated payment.
  const wages=window.FE_WORKSHOP_STAFF.settleDay(S);
  if(wages.paidCents||wages.paidCostsCents||wages.owedCents||wages.shopOwedCents)S.notes.push({date:displayDate(),text:
   'Saturday accounts: Sullivan '+cash(wages.paidCents/100)+' paid'+
   (wages.owedCents?' · '+cash(wages.owedCents/100)+' owed':'')+
   '; shop expenses '+cash(wages.paidCostsCents/100)+' paid'+
   (wages.shopOwedCents?' · '+cash(wages.shopOwedCents/100)+' unpaid':'')+'.',source:'company payroll'});
 }else{
  const workerPayroll=S.workers*WORKER_DAILY_WAGE,managerPayroll=S.delegation?.generalManager?.hired?(S.delegation.generalManager.dailyWage||GENERAL_MANAGER_DAILY_WAGE):0,payroll=workerPayroll+managerPayroll;
  S.companyCash-=payroll;S.lastExpenses+=payroll;
  if(managerPayroll>0)S.notes.push({date:displayDate(),text:'General Manager salary paid: '+cash(managerPayroll)+'.',source:'company payroll'});
 }
 const animalCare=window.FE_HORSE_CARE?.settleDay?.(S);
 if(animalCare?.saturday&&(animalCare.paidCents||animalCare.arrearsCents))
  S.notes.push({date:displayDate(),source:'horse and carriage upkeep',text:
   'Owned horse/vehicle care: '+cash(animalCare.paidCents/100)+' paid'+
   (animalCare.arrearsCents?' · '+cash(animalCare.arrearsCents/100)+' owed.':'.')});
 const reportDate=displayDate(),dayTrades=S.transactions.filter(t=>t.date===reportDate&&(t.action==='BUY'||t.action==='SELL')),stockRealized=dayTrades.filter(t=>t.action==='SELL').reduce((a,t)=>a+(t.realized||0),0),stockPositionMove=Object.entries(S.portfolio).reduce((a,[k,p])=>a+p.shares*((S.stocks[k]?.price||0)-(S.stocks[k]?.open||0)),0);
 S.ledger.push({date:reportDate,rev:S.lastRevenue,exp:S.lastExpenses});
 S.dailyReport={iso:S.gameDate,date:reportDate,openingCompanyCash:S.dayStartCompanyCash,openingPersonalCash:S.dayStartPersonalCash,revenue:S.lastRevenue,expenses:S.lastExpenses,companyClose:S.companyCash,personalAtClose:S.personalCash,stockTrades:dayTrades.length,stockRealized,stockPositionMove,marketCloseIndex:marketIndex(),portfolioAtMarketClose:portfolioValue()};
 S.lastRevenue=0;S.lastExpenses=0;S.machinery=clamp(S.machinery-.7,20,100);
 S.phase='night';S.dayRemaining=NIGHT_SECONDS;S.phaseBudgetRemainder=0;window.FE_NPC_AI?.syncClock?.();
 S.marketWire='The Federal Exchange has closed. Closing quotations are posted; the exchange remains closed until the next business morning.';
 save();render();note(manual?'Business day closed early. Washington Night begins.':'Closing bell. Washington Night begins.');
}
function closeNight(manual=false){
 if(S.phase!=='night')return;
 if(window.finishBoxingNight)window.finishBoxingNight();
 if(window.finishMidgetCarNight)window.finishMidgetCarNight();
 if(window.finishUnderworldNight)window.finishUnderworldNight();
 if((S.turnSerial||1)===(S.starNextRaidTurnSerial||0)){
  if(S.contacts.madamStar.met){
   S.lastRaidOutcome=S.starVisitedTonight?'caught':'missed';
   S.notes.push({date:displayDate(),text:S.starVisitedTonight?'Police raided the Star Club while I was there. I was caught in the sweep.':'Police raided the Star Club tonight, but I was not present.',source:'personal recollection'});
   if(S.starVisitedTonight)S.reputation=clamp(S.reputation-4,0,100);
  }
  S.starRaidOccurred=true;
  S.starNextRaidTurnSerial=rollStarRaidTurn(S.turnSerial||1);
  S.starNextRaidDate=starRaidDateForTurn(S.starNextRaidTurnSerial,S.campaignStartYear);
 }
 if(!S.dailyReport)S.dailyReport={iso:S.gameDate,date:displayDate(),openingCompanyCash:S.dayStartCompanyCash,openingPersonalCash:S.dayStartPersonalCash,revenue:0,expenses:0,companyClose:S.companyCash,personalAtClose:S.personalCash};
 S.dailyReport.companyEnd=S.companyCash;S.dailyReport.personalEnd=S.personalCash;S.dailyReport.portfolioEnd=portfolioValue();S.dailyReport.ownerDistributions=S.ownerDistributionsToday||0;S.dailyReport.divertedFunds=S.divertedToday||0;S.dailyReport.unaccountedFunds=S.unaccountedFunds||0;S.dailyReport.accountingExposure=accountingExposure();
 S.phase='report';S.dayRemaining=0;S.phaseBudgetRemainder=0;save();render();note(manual?'You retired early. Review the Daily Report.':'Washington Night has ended. Review the Daily Report.');
}
function beginNextDay(){
 if(S.phase!=='report')return;
 if(!S.endlessMode&&(S.turnSerial||1)>=CAMPAIGN_TURNS){S.campaignCompleted=true;S.campaignEndPending=true;save(true);render();return}
 archiveToday();const old=S.gameDate,next=window.FE_WASHINGTON_TIME?.now?.(S)?.date||window.FE_WASHINGTON_TIME.nextCivilDay(S.gameDate);finishDeadlineContracts(old,next);S.gameDate=next;S.turnSerial=(S.turnSerial||1)+1;payMonthlyDividends(old,S.gameDate);
 S.phase='day';S.dayRemaining=BUSINESS_DAY_SECONDS;S.phaseBudgetRemainder=0;window.FE_NPC_AI?.syncClock?.();
 for(const [ticker,x] of Object.entries(S.stocks)){if(!stockAvailableInYear(ticker,x.sector,+S.gameDate.slice(0,4)))continue;const priorClose=+x.price||+x.open;x.prevClose=priorClose;x.prev=priorClose;const open=Math.max(1,Math.round(priorClose*(1+openingGapFor(ticker,S.gameDate,x.vol))*100)/100);x.open=open;x.price=open;x.hiddenPrice=open}
 S.marketWire='The Federal Exchange is open. Federal Electric has the opening quotation sheet; closing quotations will be published after the bell.';
 if(S.raidMonth!==monthKey(S.gameDate)){S.raidMonth=monthKey(S.gameDate);S.raidDays=rollRaidDays(S.gameDate)}
 generateTurnConditions();if(!S.componentWorks){processPendingQualityClaims();ageManagementNeglect()}const delegatedStart=S.componentWorks?false:applyMorningDelegation();generatePaper();
 if(window.FE_LIVING_CHARACTERS){const freshPublic=window.FE_LIVING_CHARACTERS.advance(S.turnSerial);window.FE_LIVING_CHARACTERS.publishInPaper(freshPublic)}
 if(S.componentWorks){S.componentWorks.date=S.gameDate;
  if(window.FE_COMPONENT_WORKS.renewStandingOrders(S.componentWorks,S.gameDate))
   S.notes.push({date:displayDate(),text:'Capital Railway Telegraph renewed the weekly telegraph component order for Saturday delivery.',source:'factory contracts'});
 }
  S.dayStartCompanyCash=S.companyCash;S.dayStartPersonalCash=S.personalCash;S.ownerDistributionsToday=0;S.divertedToday=0;S.starVisitedTonight=false;S.dailyReport=null;save();render();note(S.lineStatus==='awaiting'?'A new business turn begins. The factory is still stopped and requires your authorization to resume production.':delegatedStart?'A new business turn begins. Foreman Sullivan has started routine production under standing authority.':'A new business turn begins. The morning Metropolitan Ledger is on your desk.');
}
function isRaidToday(){return S.raidDays.includes(new Date(S.gameDate+'T12:00:00').getDate())}
const generalManagerToggle=$('#generalManagerToggle');if(generalManagerToggle)generalManagerToggle.onclick=()=>{
 const gm=S.delegation.generalManager||(S.delegation.generalManager={hired:false,name:'General Manager',competence:72,reliability:70,dailyWage:GENERAL_MANAGER_DAILY_WAGE});
 if(gm.hired){
  if(!confirm('Dismiss the General Manager? Routine management coverage will end immediately.'))return;
  gm.hired=false;S.notes.push({date:displayDate(),text:'Federal Electric dismissed its General Manager.',source:'factory management'});addManagementAlert('management','General Manager position is vacant.','attention');
 }else{
  gm.hired=true;S.notes.push({date:displayDate(),text:'Federal Electric hired a General Manager at '+cash(GENERAL_MANAGER_DAILY_WAGE)+' per Business Day.',source:'factory management'});addManagementAlert('management','General Manager hired. Routine trouble may now be handled without executive intervention, but outcomes are not guaranteed.','attention');
 }
 save(true);renderDelegation();render();
};
const foremanAutoStart=$('#foremanAutoStart');if(foremanAutoStart)foremanAutoStart.onclick=()=>{S.delegation.foremanAutoStart=!S.delegation.foremanAutoStart;S.notes.push({date:displayDate(),text:'Foreman Sullivan routine production authority '+(S.delegation.foremanAutoStart?'enabled':'revoked')+'.',source:'factory management'});save(true);renderDelegation();note('Foreman routine auto-start '+(S.delegation.foremanAutoStart?'enabled.':'disabled.'))};
$('#startProduction').onclick=()=>{if(!businessOpen())return note('The works are closed for the night.');if(S.lineStatus==='running')return;startNextQueued();note(S.lineMessage);save();render()}
$('#resumeProduction').onclick=()=>{if(!businessOpen())return note('The works are closed for the night.');if(S.lineStatus!=='awaiting')return;const x=activeContract();if(x)x.productionState='running';const priorHold=S.lineHoldReason;S.lineStatus='running';S.lineHoldReason=null;if(['breakdown','materials-or-cash'].includes(priorHold))easeManagementNeglect(.5);S.lineMessage='Executive authorization received. The line is running again.';note(S.lineMessage);save();render()}
const pauseProduction=$('#pauseProduction');if(pauseProduction)pauseProduction.onclick=window.pauseActiveProduction;
const abandonProduction=$('#abandonProduction');if(abandonProduction)abandonProduction.onclick=window.abandonProductionRun;
$('#maintain').onclick=()=>{if(!businessOpen())return note('Regular works maintenance authorization resumes next Business Day.');if(S.companyCash<80)return note('Insufficient company cash.');S.companyCash-=80;S.lastExpenses+=80;S.machinery=clamp(S.machinery+12,0,100);save();render()}
$('#endDay').onclick=()=>{
 if(S.paused)return note('The game is paused.');
 const seconds=window.FE_WASHINGTON_TIME.secondsUntilMorning(S);
 if(!seconds||seconds<=0)return note('The next morning is unavailable.');
 if(!confirm('Rest until 8:00 AM? Washington and its residents continue through the elapsed hours.'))return;
 const elapsed=advanceWorldSimulation(seconds,true,'action');
 if(elapsed!==seconds)return note('The rest interval was interrupted.');
 save();render();note('Morning arrived. Washington continued while you rested.');
}
const stepAwayDesk=$('#stepAwayDesk');if(stepAwayDesk)stepAwayDesk.onclick=stepAwayFromDesk
const nextDayBtn=$('#beginNextDay');if(nextDayBtn)nextDayBtn.onclick=beginNextDay
function startFreshGame(){const route=S.characterRoute;clearPauseLock();S=initial();S.characterRoute=window.FE_CHARACTERS?.normalize?.(route)||'industrialist';selectedStockTicker=null;save();render()}
$('#reset').onclick=()=>{if(confirm('You are about to start a new game. All previous progress will be lost. Continue?'))startFreshGame()}
const continueEmpire=$('#continueEmpire');if(continueEmpire)continueEmpire.onclick=()=>{S.endlessMode=true;S.campaignCompleted=true;S.campaignEndPending=false;save(true);render();beginNextDay()};
const campaignNewGame=$('#campaignNewGame');if(campaignNewGame)campaignNewGame.onclick=()=>startFreshGame();
const pauseToggle=$('#pauseToggle');if(pauseToggle)pauseToggle.onclick=()=>{if(S.paused){clearPauseLock();S.paused=false;resumeTitleAudio()}else{S.paused=true;pauseTitleAudio();showTab('desk')}save(true);render()};
function treasuryAmount(){const n=Math.floor(Number($('#treasuryAmount')?.value));return Number.isFinite(n)&&n>0?n:0}
const exploreIpo=$('#exploreIpo');if(exploreIpo)exploreIpo.onclick=()=>{ipoScaffoldOpen=!ipoScaffoldOpen;renderOwnership()};
const closeIpoScaffold=$('#closeIpoScaffold');if(closeIpoScaffold)closeIpoScaffold.onclick=()=>{ipoScaffoldOpen=false;renderOwnership()};
const ownerDistribution=$('#ownerDistribution');if(ownerDistribution)ownerDistribution.onclick=()=>{
 const amount=treasuryAmount(),out=$('#treasuryNote');if(!businessOpen())return out.textContent='Recorded distributions are handled during the Business Day.';
 if(!amount)return out.textContent='Enter a valid amount.';if(amount>S.companyCash)return out.textContent='Federal Electric does not have that much company cash.';
 S.companyCash-=amount;S.personalCash+=amount;S.ownerDistributionsToday=(S.ownerDistributionsToday||0)+amount;
 S.notes.push({date:displayDate(),text:'A recorded owner distribution of '+cash(amount)+' was transferred from Federal Electric to personal funds.',source:'company books'});
 out.textContent='Recorded distribution completed: '+cash(amount)+' moved to personal cash.';save();render();
};
const divertCompanyFunds=$('#divertCompanyFunds');if(divertCompanyFunds)divertCompanyFunds.onclick=()=>{
 const amount=treasuryAmount(),out=$('#treasuryNote');if(S.phase==='report')return out.textContent='The books are closed for the completed date.';
 if(!amount)return out.textContent='Enter a valid amount.';if(amount>S.companyCash)return out.textContent='Federal Electric does not have that much company cash.';
 S.companyCash-=amount;S.personalCash+=amount;S.divertedToday=(S.divertedToday||0)+amount;S.unaccountedFunds=(S.unaccountedFunds||0)+amount;S.corporateMisuseCount=(S.corporateMisuseCount||0)+1;
 S.notes.push({date:displayDate(),text:cash(amount)+' of Federal Electric funds were diverted to personal use, creating an unexplained corporate shortfall.',source:'private financial record'});
 out.textContent='Company funds diverted: '+cash(amount)+' moved to personal cash. Accounting exposure is now '+accountingExposure()+'.';save();render();
};
$('#archiveEdition').onclick=()=>{archiveToday();save();renderArchive();note('Edition placed in the archive.')}
$('#addNote').onclick=()=>{const text=$('#noteText').value.trim(),source=$('#noteSource').value.trim();if(!text)return;S.notes.push({date:displayDate(),text,source});$('#noteText').value='';$('#noteSource').value='';save();renderNotes()}
function visitStar(seconds,price,encounterChance,trustGain,period){
 if(!window.FE_VENUES?.canUse('star'))return $('#starNote').textContent='Visit the Star Club in Washington to spend time there.';
 if(S.phase==='report')return $('#starNote').textContent='The day is already closed. Review the Daily Report.';
 if(period==='day'&&S.phase!=='day')return $('#starNote').textContent='Those daytime visits are no longer available tonight.';
 if(period==='night'&&S.phase!=='night')return $('#starNote').textContent='Evening visits become available after the closing bell.';
 if(!window.FE_WASHINGTON_TIME.canSpend(S,seconds)){$('#starNote').textContent='There is not enough time remaining in this phase for that visit.';return}
 if(S.personalCash<price){$('#starNote').textContent='You do not have enough personal cash for that visit.';return}
 S.personalCash-=price;window.advanceWorldTime(seconds,true);
 if(period==='night')S.starVisitedTonight=true;
 const first=!S.contacts.madamStar.met;S.contacts.madamStar.met=true;S.contacts.madamStar.trust+=trustGain;
 S.notes.push({date:displayDate(),text:first?'Visited the Star Club and met Madam Star. She now knows my name.':'Spent time at the Star Club and spoke with Madam Star again.',source:'personal recollection'});
 const dayPeople=[['hayes','Inspector Arthur Hayes','Met Inspector Arthur Hayes during a quiet daytime visit to the Star Club. We exchanged introductions.'],['bookie','Eddie Doyle, bookmaker','Madam Star introduced me to Eddie Doyle during the day. He offered to put my name in at the Commerce Club poker game.']];
 const nightPeople=[['bookie','Eddie Doyle, bookmaker','Ran into Eddie Doyle during an evening visit. The bookmaker seemed to know where money was moving around Washington.'],['promoter','Marty Kane, fight promoter','Met Marty Kane, a fight promoter who moves easily between licensed boxing and less respectable fight circles.']];
 if(Math.random()<encounterChance){
   const people=period==='night'?nightPeople:dayPeople,pick=people[Math.floor(Math.random()*people.length)],x=S.contacts[pick[0]];
   x.met=true;if(pick[0]==='bookie'){S.bookieKnown=true;S.middlePokerUnlocked=true;window.FE_MAP_LEADS?.flag?.(S,'commercePoker','star-bookie-introduction')}
   S.notes.push({date:displayDate(),text:pick[2],source:'personal recollection'});$('#starNote').textContent=pick[2]
 }else $('#starNote').textContent=period==='night'?(seconds===900?'You make a brief evening visit. The room is lively, but nothing especially useful develops.':'You spend part of the evening at the Star Club. Nothing especially useful develops.'):(seconds===900?'You make a brief daytime visit to the Star Club. Nothing especially useful develops.':'You spend the afternoon at the Star Club. Nothing especially useful develops.');
 save();render();
}
$('#visitStarBrief').onclick=()=>visitStar(900,50,.12,1,'day');
$('#visitStarAfternoon').onclick=()=>visitStar(1800,150,.28,2,'day');
const visitStarEveningBrief=$('#visitStarEveningBrief');if(visitStarEveningBrief)visitStarEveningBrief.onclick=()=>visitStar(900,100,.18,1,'night');
const visitStarEvening=$('#visitStarEvening');if(visitStarEvening)visitStarEvening.onclick=()=>visitStar(1800,300,.38,2,'night');
function pokerAccess(circle){if(circle==='working')return true;if(circle==='middle')return !!S.middlePokerUnlocked;if(circle==='elite')return !!S.elitePokerUnlocked;return false}
function pokerLimit(circle){return {working:5,middle:3,elite:1}[circle]||0}
function pokerCircleName(circle){return circle==='working'?'Neighborhood Game':circle==='middle'?'Commerce Club':'Embassy Room'}
function maybePokerProgress(circle){if(circle==='middle'&&!S.elitePokerUnlocked){const vale=S.contacts.vale;if(!vale.met&&Math.random()<.22){vale.met=true;vale.trust=1;S.notes.push({date:displayDate(),text:'Met Harrison Vale at the Commerce Club. The industrialist mentioned that he sometimes attends a much more private Washington table.',source:'card-table conversation'});return ' You met Harrison Vale, an industrialist with access to more private games.'}if(vale.met&&Math.random()<.28){vale.trust++;if(vale.trust>=2){S.elitePokerUnlocked=true;window.FE_MAP_LEADS?.flag?.(S,'embassyPoker','vale-invitation');S.notes.push({date:displayDate(),text:'Harrison Vale offered to put my name forward for the Embassy Room, an invitation-only private society poker game.',source:'card-table conversation'});return ' Harrison Vale has secured you an invitation to the Embassy Room.'}return ' Harrison Vale spent more time at your table. The acquaintance is becoming useful.'}}return ''}
function recordPokerResult(circle,delta,hands,simulated,timeSeconds,creditMoney=true){if(creditMoney)S.personalCash+=delta;if(delta>0)S.pokerWins[circle]=(S.pokerWins[circle]||0)+1;if(simulated)S.pokerSimulated[circle]=(S.pokerSimulated[circle]||0)+1;if(timeSeconds>0)window.advanceWorldTime(timeSeconds,true);let extra=maybePokerProgress(circle),raid=false;if(isRaidToday()&&Math.random()<pokerRisk(circle)){raid=true;S.lastRaidOutcome='caught';S.reputation=clamp(S.reputation-(circle==='elite'?7:3),0,100);S.notes.push({date:displayDate(),text:'Police raided the card game while I was present. I was caught in the sweep.',source:'personal recollection'})}const verb=simulated?'Simulated':'Played';S.notes.push({date:displayDate(),text:verb+' '+hands+' hand'+(hands===1?'':'s')+' at '+pokerCircleName(circle)+' and left '+(delta>=0?'ahead ':'down ')+cash(Math.abs(delta))+'.'+(simulated?' '+Math.round(timeSeconds/60)+' business minutes elapsed.':''),source:simulated?'game simulation':'personal recollection'});$('#pokerNote').textContent=raid?'The game was caught in a rare police sweep.':verb+' session: '+hands+' hands · '+(delta>=0?'won ':'lost ')+cash(Math.abs(delta))+' · '+(simulated?Math.round(timeSeconds/60)+' minutes elapsed.':'session recorded.')+extra;save();render()}
function pokerSessions(){
 if(!S.pokerSessions||typeof S.pokerSessions!=='object')S.pokerSessions={version:1,pending:[],settled:[]};
 if(!Array.isArray(S.pokerSessions.pending))S.pokerSessions.pending=[];
 if(!Array.isArray(S.pokerSessions.settled))S.pokerSessions.settled=[];
 return S.pokerSessions;
}
function playPokerCircle(circle,stake){
 if(S.pokerDay!==S.gameDate){S.pokerDay=S.gameDate;S.pokerPlayed={working:0,middle:0,elite:0}}
 if(S.paused||!activeProfileId())return;
 if(!pokerAccess(circle)){$('#pokerNote').textContent='That card table requires an invitation.';return}
 const venueId={working:'working-poker',middle:'commerce-poker',elite:'embassy-poker'}[circle];
 if(!venueId||window.FE_VENUES&&!window.FE_VENUES.canUse(venueId)){$('#pokerNote').textContent='Travel to the correct gambling room first.';return}
 if(S.pokerPlayed[circle]>=pokerLimit(circle)){$('#pokerNote').textContent='No sessions remain at this table today.';return}
 if(S.personalCash<stake){$('#pokerNote').textContent='You need '+cash(stake)+' personal cash.';return}
 const sessions=pokerSessions();
 if(sessions.pending.some(p=>p.profileId===activeProfileId()&&p.gameDate===S.gameDate)){$('#pokerNote').textContent='An earlier card session remains open. Its stake is reserved.';return}
 const token=window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 sessions.pending.push({id:token,profileId:activeProfileId(),circle,stake,gameDate:S.gameDate,claimed:false});
 S.personalCash-=stake;S.pokerPlayed[circle]++;save(true);
 const popup=window.open('poker.html?room='+encodeURIComponent(circle)+'&session='+encodeURIComponent(token),'FEPoker_'+token,'popup=yes,width=1180,height=860,resizable=yes,scrollbars=yes');
 if(!popup){
  sessions.pending=sessions.pending.filter(p=>p.id!==token);
  S.personalCash+=stake;S.pokerPlayed[circle]--;save(true);
  $('#pokerNote').textContent='Poker popup blocked. The stake has been refunded.';
 }
 renderWashington();
}
window.FE_POKER_AUTHORIZE=(token,circle)=>{
 const p=pokerSessions().pending.find(p=>p.id===token);
 if(!p||p.claimed||p.profileId!==activeProfileId()||p.circle!==circle||p.gameDate!==S.gameDate)return false;
 p.claimed=true;save(true);return true;
};
window.FE_POKER_SETTLE=(token,circle,rawDelta,rawHands,elapsed)=>{
 const state=pokerSessions(),entry=state.pending.find(p=>p.id===token);
 if(!entry||!entry.claimed||entry.profileId!==activeProfileId()||entry.circle!==circle||state.settled.some(p=>p.id===token))return false;
 if(!Number.isFinite(+rawDelta)||!Number.isFinite(+rawHands))return false;
 const delta=clamp(Math.round(+rawDelta),-entry.stake,3*entry.stake),hands=Math.max(0,Math.min(1000,Math.floor(+rawHands)));
 state.pending=state.pending.filter(p=>p.id!==token);
 state.settled.push({id:token,circle,delta,turn:S.turnSerial});
 if(state.settled.length>256)state.settled.splice(0,state.settled.length-256);
 if(!Array.isArray(S.outcomeEvents))S.outcomeEvents=[];
 S.outcomeEvents.push({id:'poker:'+token,type:'poker-result',delta,turn:S.turnSerial});
 if(S.outcomeEvents.length>512)S.outcomeEvents.splice(0,S.outcomeEvents.length-512);
 S.personalCash+=entry.stake+delta;
 recordPokerResult(circle,delta,hands,false,0,false);
 return true;
};
function unresolvedPoker(){
 const active=activeProfileId();
 if(!active)return null;
 return pokerSessions().pending.find(p=>p.profileId===active)||null;
}
function renderUnresolvedPoker(){
 const message=document.getElementById('unresolvedPokerStatus'),btn=document.getElementById('unresolvedPokerResolve');
 if(!message||!btn)return;
 const pending=unresolvedPoker();
 if(!pending){message.textContent='No unsettled card session.';btn.hidden=true;return}
 const date=pending.gameDate||'previous visit';
 const status=pending.claimed?'A table was opened. If the game closed before settlement, its stake is forfeited.':'A table was reserved but no game was dealt. The stake may be returned.';
 message.textContent=pokerCircleName(pending.circle)+' · '+date+' · '+cash(pending.stake)+' reserved. '+status;
 btn.textContent=pending.claimed?'Forfeit Unfinished Stake':'Cancel Undealt Reservation';
 btn.hidden=false;btn.disabled=false;
}
function resolveUnfinishedPoker(token){
 const store=pokerSessions(),pending=store.pending.find(p=>p.id===token&&p.profileId===activeProfileId());
 if(!pending||store.settled.some(p=>p.id===token))return false;
 const refund=!pending.claimed;
 store.pending=store.pending.filter(p=>p.id!==token);
 store.settled.push({id:token,circle:pending.circle,delta:refund?0:-pending.stake,turn:S.turnSerial,resolution:refund?'undealt-canceled':'forfeit'});
 if(store.settled.length>256)store.settled.splice(0,store.settled.length-256);
 if(refund){S.personalCash+=pending.stake;}
 if(!Array.isArray(S.outcomeEvents))S.outcomeEvents=[];
 S.outcomeEvents.push({id:'poker:'+token,type:refund?'poker-undealt-canceled':'poker-forfeit',delta:refund?0:-pending.stake,turn:S.turnSerial});
 if(S.outcomeEvents.length>512)S.outcomeEvents.splice(0,S.outcomeEvents.length-512);
 S.notes.push({date:displayDate(),text:refund?'Canceled an undealt '+pokerCircleName(pending.circle)+' reservation. '+cash(pending.stake)+' returned.':'Forfeited the unfinished '+pokerCircleName(pending.circle)+' session. '+cash(pending.stake)+' stake lost.',source:'personal betting record'});
 save(true);render();return true;
}
const unresolvedPokerResolve=document.getElementById('unresolvedPokerResolve');
if(unresolvedPokerResolve)unresolvedPokerResolve.onclick=()=>{
 const pending=unresolvedPoker();
 if(!pending)return;
 const question=pending.claimed?'The table was already opened. FORFEIT '+cash(pending.stake)+' permanently? This cannot be undone.':'Cancel this UNDEALT poker reservation and return '+cash(pending.stake)+'?';
 if(!confirm(question))return;
 resolveUnfinishedPoker(pending.id);
};
function pokerSimSeconds(circle){return circle==='working'?300:circle==='middle'?600:1500}
function simulatePoker(circle,stake){
 const venue={working:'working-poker',middle:'commerce-poker',elite:'embassy-poker'}[circle];
 if(!venue||!window.FE_VENUES?.canUse(venue))return $('#pokerNote').textContent='Visit the appropriate card room to play.';if(S.pokerDay!==S.gameDate){S.pokerDay=S.gameDate;S.pokerPlayed={working:0,middle:0,elite:0}}if(!pokerAccess(circle)){$('#pokerNote').textContent=circle==='working'?'The Neighborhood Game is open.':circle==='middle'?'Meet Eddie Doyle at the Star Club to get into the Commerce Club.':'An Embassy Room invitation is required.';return}if(S.pokerPlayed[circle]>=pokerLimit(circle))return $('#pokerNote').textContent='No more '+pokerCircleName(circle)+' sessions are available today.';if(S.personalCash<stake)return $('#pokerNote').textContent='You need '+cash(stake)+' personal cash for this table.';const simSeconds=pokerSimSeconds(circle);if(!window.FE_WASHINGTON_TIME.canSpend(S,simSeconds))return $('#pokerNote').textContent='The game clock is paused or unavailable.';S.pokerPlayed[circle]++;const hands=6+Math.floor(Math.random()*10),swing={working:5,middle:18,elite:80}[circle];let delta=0;for(let i=0;i<hands;i++){const r=Math.random();delta+=r<.43?-swing*(.25+Math.random()*.85):r<.83?swing*(.2+Math.random()*.7):swing*(.8+Math.random()*1.7)}delta=Math.round(delta);delta=clamp(delta,-Math.min(stake,S.personalCash),stake*2);recordPokerResult(circle,delta,hands,true,simSeconds)}
window.FE_POKER_CLOCK=()=>window.FE_WASHINGTON_TIME.now(S)?.time||null;
function pokerButton(circle,stake){return playPokerCircle(circle,stake)}
$('#pokerWorking').onclick=()=>pokerButton('working',25);$('#pokerMiddle').onclick=()=>pokerButton('middle',100);$('#pokerElite').onclick=()=>pokerButton('elite',500);$('#simPokerWorking').onclick=()=>simulatePoker('working',25);$('#simPokerMiddle').onclick=()=>simulatePoker('middle',100);$('#simPokerElite').onclick=()=>simulatePoker('elite',500);
document.querySelectorAll('nav button[data-tab]:not([data-nav-group="pastimes"]),.section-tabs button[data-tab]').forEach(b=>b.onclick=()=>{if(S.paused)return;showTab(b.dataset.tab)});
refreshStockSectorFilter();$('#stockSearch').oninput=renderStocks;$('#sectorFilter').onchange=renderStocks;
const TITLE_CITY_AMBIENCE_VOLUME=.07;
const TITLE_CITY_AMBIENCE_MOBILE_VOLUME=.005;
const TITLE_NIGHT_AMBIENCE_VOLUME=.14;
const TITLE_NIGHT_AMBIENCE_MOBILE_VOLUME=.01;
const TITLE_DAY_AMBIENCE_SRC='assets/audio/title-day-ambience.mp3?v=desktop1';
const TITLE_NIGHT_AMBIENCE_SRC='assets/audio/freesound_community-street-at-night-with-cars-49378.mp3?v=20261004-night3';
let titleCityAmbienceAudio=null,titleCityAmbienceMode='';
function titleMobileRadioOnly(){
 return !!(window.matchMedia&&window.matchMedia('(max-width:900px)').matches);
}
function titleCityAmbienceVolume(mode=titleCityAmbienceMode||'day'){
 const mobile=titleMobileRadioOnly();
 if(mode==='night')return mobile?TITLE_NIGHT_AMBIENCE_MOBILE_VOLUME:TITLE_NIGHT_AMBIENCE_VOLUME;
 return mobile?TITLE_CITY_AMBIENCE_MOBILE_VOLUME:TITLE_CITY_AMBIENCE_VOLUME;
}
function ensureTitleCityAmbience(){
 if(titleCityAmbienceAudio)return titleCityAmbienceAudio;
 const audio=new Audio();
 audio.preload='auto';audio.loop=true;audio.volume=titleCityAmbienceVolume();
 titleCityAmbienceAudio=audio;
 return audio;
}
function titleEnvironmentIsDay(){
 const bg=document.getElementById('titleOfficeBackground');
 return !!(bg&&bg.dataset.mode==='day');
}
function syncTitleCityAmbience(){
 if(!periodRadioAvailable()){stopTitleCityAmbience(false);return}
 if(titleMobileRadioOnly()){stopTitleCityAmbience(false);return}
 const audio=ensureTitleCityAmbience();
 const mode=titleEnvironmentIsDay()?'day':'night';
 const volume=titleCityAmbienceVolume(mode),visible=titleScreenVisible()&&!careerMainMenuVisible()&&!S.paused&&titleDevOutsideNoise;
 const src=mode==='day'?TITLE_DAY_AMBIENCE_SRC:TITLE_NIGHT_AMBIENCE_SRC;
 if(titleCityAmbienceMode!==mode){
  audio.pause();
  titleCityAmbienceMode=mode;
  audio.src=src;
  audio.load();
  try{audio.currentTime=0}catch(e){}
 }
 audio.volume=volume;
 if(visible){
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
 }else{
  audio.pause();
 }
}
function stopTitleCityAmbience(reset=true){
 if(!titleCityAmbienceAudio)return;
 titleCityAmbienceAudio.pause();
 if(reset){try{titleCityAmbienceAudio.currentTime=0}catch(e){}}
 titleCityAmbienceAudio.volume=titleCityAmbienceVolume(titleEnvironmentIsDay()?'day':'night');
}

function titleRadioDefaultVolumePercent(){
 return window.matchMedia&&window.matchMedia('(max-width:700px)').matches?20:40;
}
let titleRadioVolumePercent=titleRadioDefaultVolumePercent();
function titleRadioVolume(){
 return clamp(titleRadioVolumePercent/100,0,1);
}
function applyTitleRadioVolume(){
 const volume=titleRadioVolume();
 if(titleRadioAudio)titleRadioAudio.volume=volume;
 for(const audio of titleRadioBackgroundFeeds.values())audio.volume=volume;
 updateTitleRadioControls();
}
function setTitleRadioVolumePercent(value){
 const parsed=Number(value);
 titleRadioVolumePercent=Number.isFinite(parsed)?clamp(Math.round(parsed),0,100):titleRadioDefaultVolumePercent();
 applyTitleRadioVolume();
}
const TITLE_RADIO_STATIONS=[
 {name:'Federal Electric Network',dial:'610 AM',tracks:['assets/audio/sunflower-slow-drag.ogg?v=20261003-title2']},
 {name:'Capital Signal',dial:'540 AM',tracks:['assets/audio/radio-static-station.mp3?v=20261004-radio1'],nightTracks:['assets/audio/545962__cloud-10__radio-static-2.wav?v=20261004-night1','assets/audio/capital-signal-night-message-01.ogg?v=20261004-night1','assets/audio/545962__cloud-10__radio-static-2.wav?v=20261004-night1']},
 {name:'Capital Radio Theatre',dial:'720 AM',tracks:['assets/audio/mercury-theatre-war-of-the-worlds.mp3?v=20261004-local1'],duration:3084.552,nightTracks:['assets/audio/orson-welles-dracula-1938-github.mp3?v=20261004-dracula1']},
 {name:'Capital Melody',dial:'880 AM',tracks:['assets/audio/capital-melody-1930s.mp3?v=20261004-local1'],duration:7978.083265,nightTracks:['assets/audio/pepsi-jingle-commercial.mp3?v=20261004-pepsi1','assets/audio/capital-melody-night-github.mp3?v=20261004-nightmelody1','assets/audio/cocoacola-audio-2.mp3?v=20261004-coke1']},
 {name:'Capital News Service',dial:'1010 AM',tracks:['assets/audio/station-5-newscast.mp3?v=20261004-news1'],duration:22831.584}
];
let titleRadioAudio=null,titleRadioFadeTimer=null,titleRadioOff=false,titleRadioStationIndex=0,titleRadioTrackIndex=0,titleRadioAirStartAt=0,titleRadioAirSyncTimer=null;
let titleRadioAutoTune=true,titleRadioLocationContext='title';
const TITLE_RADIO_CONTEXT_STATIONS={title:0,office:4,star:3};
const titleRadioBackgroundFeeds=new Map();
let titleScreenDeskBreak=false;
function careerMainMenuVisible(){const el=document.getElementById('careerMainMenu');return !!(el&&!el.hidden)}
function titleScreenVisible(){const el=document.getElementById('titleScreen');return !!(el&&!el.hidden)}
function titleScreenBlocksSimulation(){return careerMainMenuVisible()}
function currentTitleRadioStation(){return TITLE_RADIO_STATIONS[titleRadioStationIndex]||TITLE_RADIO_STATIONS[0]}
function titleRadioStationAvailable(index){
 const station=TITLE_RADIO_STATIONS[index];
 return !!station&&(!station.dayOnly||titleEnvironmentIsDay());
}
function titleRadioFeedProgram(index){
 const station=TITLE_RADIO_STATIONS[index];
 if(!station)return null;
 if(!titleEnvironmentIsDay()&&Array.isArray(station.nightTracks)&&station.nightTracks.length){
  return {mode:'night',tracks:station.nightTracks,loop:false};
 }
 return {mode:'day',tracks:station.tracks||[],loop:true};
}
function configureTitleRadioFeedProgram(index,audio,force=false){
 if(!audio)return;
 const program=titleRadioFeedProgram(index);
 if(!program||!program.tracks.length)return;
 if(!force&&audio.dataset.titleRadioProgram===program.mode)return;
 const muted=audio.muted;
 audio.pause();
 audio.dataset.titleRadioProgram=program.mode;
 audio.dataset.titleRadioTrack='0';
 audio.loop=program.loop;
 audio.src=program.tracks[0];
 audio.load();
 audio.volume=titleRadioVolume();
 audio.muted=muted;
 if(!S.paused&&titleRadioStationAvailable(index)){
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
 }
}
function advanceTitleRadioFeed(index,audio){
 if(!audio)return;
 const program=titleRadioFeedProgram(index);
 if(!program||program.loop||!program.tracks.length)return;
 const current=Math.max(0,Number(audio.dataset.titleRadioTrack)||0);
 const next=(current+1)%program.tracks.length;
 audio.dataset.titleRadioTrack=String(next);
 audio.loop=false;
 audio.src=program.tracks[next];
 audio.load();
 audio.volume=titleRadioVolume();
 if(!S.paused&&titleRadioStationAvailable(index)){
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
 }
}
function ensureTitleRadioAudio(){
 if(titleRadioAudio)return titleRadioAudio;
 const station=TITLE_RADIO_STATIONS[0];
 const src=station&&station.tracks&&station.tracks[0]?station.tracks[0]:'';
 titleRadioAudio=new Audio(src);
 titleRadioAudio.preload='auto';
 titleRadioAudio.volume=titleRadioVolume();
 titleRadioAudio.dataset.titleRadioSource=src;
 if(src)titleRadioAudio.load();
 titleRadioAudio.addEventListener('ended',()=>{
  titleRadioTrackIndex=0;
  try{titleRadioAudio.currentTime=0}catch(e){}
  if(titleRadioStationIndex===0&&!titleRadioOff&&titleScreenVisible()&&!S.paused){
   const p=titleRadioAudio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
  }
 });
 return titleRadioAudio;
}
function loadTitleRadioTrack(playNow=false){
 const audio=ensureTitleRadioAudio();
 const station=TITLE_RADIO_STATIONS[0];
 if(!station||!station.tracks.length)return;
 titleRadioTrackIndex=0;
 audio.pause();
 const src=station.tracks[0];
 if(audio.dataset.titleRadioSource!==src){
  audio.src=src;
  audio.dataset.titleRadioSource=src;
  audio.load();
 }
 audio.volume=titleRadioVolume();
 try{audio.currentTime=0}catch(e){}
 if(playNow&&titleRadioStationIndex===0&&!titleRadioOff&&titleScreenVisible()&&!S.paused){
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
 }
}
function titleRadioAirElapsedSeconds(){return titleRadioAirStartAt?Math.max(0,(Date.now()-titleRadioAirStartAt)/1000):0}
function titleRadioFeedDuration(audio){
 const index=Number(audio?.dataset?.titleRadioStation);
 const known=TITLE_RADIO_STATIONS[index]?.duration;
 if(Number.isFinite(known)&&known>0)return known;
 return Number.isFinite(audio?.duration)&&audio.duration>0?audio.duration:0;
}
function syncTitleRadioFeedToAir(audio,force=false){
 if(!audio)return false;
 const index=Number(audio?.dataset?.titleRadioStation);
 const program=titleRadioFeedProgram(index);
 if(program&&!program.loop)return true;
 const duration=titleRadioFeedDuration(audio);
 if(!duration)return false;
 const target=titleRadioAirElapsedSeconds()%duration;
 const drift=Math.abs((audio.currentTime||0)-target);
 if(force||drift>1.5){try{audio.currentTime=target;return true}catch(e){return false}}
 return true;
}
function forceTitleRadioFeedToAir(audio){
 if(!audio)return;
 if(syncTitleRadioFeedToAir(audio,true))return;
 const onReady=()=>{syncTitleRadioFeedToAir(audio,true);audio.removeEventListener('loadedmetadata',onReady);audio.removeEventListener('durationchange',onReady)};
 audio.addEventListener('loadedmetadata',onReady);
 audio.addEventListener('durationchange',onReady);
}
function startTitleRadioAirSync(){
 if(titleRadioAirSyncTimer)return;
 titleRadioAirSyncTimer=setInterval(()=>{
  if(S.paused||titleRadioOff||titleRadioStationIndex<=0)return;
  const audio=titleRadioBackgroundFeeds.get(titleRadioStationIndex);
  if(audio&&!audio.paused)syncTitleRadioFeedToAir(audio,false);
 },1000);
}
function ensureTitleRadioBackgroundFeed(index,preloadMode='auto'){
 if(index<=0||index>=TITLE_RADIO_STATIONS.length)return null;
 if(titleRadioBackgroundFeeds.has(index)){
  const existing=titleRadioBackgroundFeeds.get(index);
  if(preloadMode==='auto')existing.preload='auto';
  return existing;
 }
 const station=TITLE_RADIO_STATIONS[index];
 const program=titleRadioFeedProgram(index);
 if(!station||!program||!program.tracks.length)return null;
 const audio=new Audio(program.tracks[0]);
 audio.dataset.titleRadioStation=String(index);
 audio.dataset.titleRadioProgram=program.mode;
 audio.dataset.titleRadioTrack='0';
 audio.preload=preloadMode;
 audio.loop=program.loop;
 audio.volume=titleRadioVolume();
 audio.muted=true;
 audio.addEventListener('loadedmetadata',()=>forceTitleRadioFeedToAir(audio));
 audio.addEventListener('ended',()=>advanceTitleRadioFeed(index,audio));
 titleRadioBackgroundFeeds.set(index,audio);
 return audio;
}
function prewarmHeavyTitleRadioOnDesktop(){
 const desktop=window.matchMedia&&window.matchMedia('(min-width:901px)').matches;
 if(!desktop)return;
 const melody=ensureTitleRadioBackgroundFeed(3,'metadata');
 if(melody){
  melody.muted=true;
  melody.pause();
  try{melody.load()}catch(e){}
 }
}
function startTitleRadioBackgroundFeeds(){
 if(careerMainMenuVisible()||!periodRadioAvailable())return;
 if(!titleRadioAirStartAt)titleRadioAirStartAt=Date.now();
 startTitleRadioAirSync();
 if(titleRadioStationIndex<=0||titleRadioOff||S.paused)return;
 const audio=ensureTitleRadioBackgroundFeed(titleRadioStationIndex);if(!audio)return;
 configureTitleRadioFeedProgram(titleRadioStationIndex,audio);
 forceTitleRadioFeedToAir(audio);
 if(!titleRadioStationAvailable(titleRadioStationIndex)){audio.muted=true;audio.pause();return}
 audio.muted=false;
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
function updateTitleRadioAudibility(){
 if(careerMainMenuVisible()){if(titleRadioAudio)titleRadioAudio.pause();for(const audio of titleRadioBackgroundFeeds.values()){audio.muted=true;audio.pause()}return}
 if(!periodRadioAvailable()){for(const audio of titleRadioBackgroundFeeds.values()){audio.muted=true;audio.pause()}return}
 for(const [index,audio] of titleRadioBackgroundFeeds){
  configureTitleRadioFeedProgram(index,audio);
  audio.volume=titleRadioVolume();
  const selected=index===titleRadioStationIndex&&!titleRadioOff&&!S.paused&&titleRadioStationAvailable(index);
  audio.muted=!selected;
  if(!selected){audio.pause();continue}
  forceTitleRadioFeedToAir(audio);
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
 }
}
function startTitleRadio(){
 if(careerMainMenuVisible()||S.paused||!periodRadioAvailable())return;
 startTitleRadioBackgroundFeeds();
 updateTitleRadioAudibility();
 if(titleRadioOff||titleRadioStationIndex!==0)return;
 const audio=ensureTitleRadioAudio();
 if(!audio.src)loadTitleRadioTrack(false);
 if(titleRadioFadeTimer){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null}
 audio.volume=titleRadioVolume();
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
function updateTitleRadioControls(){
 const knob=$('#titleRadioKnob'),station=currentTitleRadioStation();
 if(knob)knob.setAttribute('aria-label','Tune physical radio dial. Current: '+(station.dial?station.dial+' ':'')+station.name);
 const globalStation=$('#globalRadioStation'),globalPower=$('#globalRadioPower'),globalVolumeUp=$('#globalRadioVolumeUp'),globalVolumeDown=$('#globalRadioVolumeDown'),globalVolumeValue=$('#globalRadioVolumeValue');
 if(globalStation)globalStation.textContent=(station.dial?station.dial+' · ':'')+station.name;
 if(globalVolumeValue)globalVolumeValue.textContent=String(titleRadioVolumePercent);
 if(globalVolumeUp)globalVolumeUp.disabled=titleRadioVolumePercent>=100;
 if(globalVolumeDown)globalVolumeDown.disabled=titleRadioVolumePercent<=0;
 if(globalPower){
  globalPower.textContent=titleRadioOff?'OFF':'ON';
  globalPower.setAttribute('aria-pressed',titleRadioOff?'false':'true');
  globalPower.setAttribute('aria-label',titleRadioOff?'Turn radio on':'Turn radio off');
 }
}
function initGlobalRadioDrag(){
 const bar=$('#globalRadioBar'),handle=bar?.querySelector('.global-radio-readout');
 if(!bar||!handle)return;
 let drag=null;
 const place=(left,top)=>{
  const rect=bar.getBoundingClientRect(),margin=4;
  const maxLeft=Math.max(margin,window.innerWidth-rect.width-margin);
  const maxTop=Math.max(margin,window.innerHeight-rect.height-margin);
  const x=clamp(left,margin,maxLeft),y=clamp(top,margin,maxTop);
  bar.style.setProperty('left',x+'px','important');
  bar.style.setProperty('top',y+'px','important');
  bar.style.setProperty('bottom','auto','important');
  bar.style.setProperty('transform','none','important');
 };
 handle.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'&&e.button!==0)return;
  const rect=bar.getBoundingClientRect();
  drag={pointerId:e.pointerId,offsetX:e.clientX-rect.left,offsetY:e.clientY-rect.top};
  try{handle.setPointerCapture(e.pointerId)}catch(err){}
  bar.classList.add('is-dragging');
  e.preventDefault();
 });
 handle.addEventListener('pointermove',e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  place(e.clientX-drag.offsetX,e.clientY-drag.offsetY);
  e.preventDefault();
 });
 const release=e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  drag=null;
  bar.classList.remove('is-dragging');
  try{handle.releasePointerCapture(e.pointerId)}catch(err){}
  e.preventDefault();
 };
 handle.addEventListener('pointerup',release);
 handle.addEventListener('pointercancel',release);
 window.addEventListener('resize',()=>{
  if(!bar.style.top)return;
  const rect=bar.getBoundingClientRect();
  place(rect.left,rect.top);
 });
}
function tuneTitleRadioStation(index){
 if(!periodRadioAvailable())return;
 const next=((Math.floor(+index)||0)%TITLE_RADIO_STATIONS.length+TITLE_RADIO_STATIONS.length)%TITLE_RADIO_STATIONS.length;
 if(titleRadioFadeTimer){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null}
 if(titleRadioAudio){titleRadioAudio.pause();if(titleRadioStationIndex===0||next===0){try{titleRadioAudio.currentTime=0}catch(e){}}}
 for(const audio of titleRadioBackgroundFeeds.values()){audio.pause();audio.muted=true}
 titleRadioStationIndex=next;titleRadioTrackIndex=0;
 if(titleRadioStationIndex===0){
  updateTitleRadioAudibility();
  loadTitleRadioTrack(!titleRadioOff);
 }else if(!titleRadioOff&&!S.paused){
  const feed=ensureTitleRadioBackgroundFeed(titleRadioStationIndex);
  if(feed){
   configureTitleRadioFeedProgram(titleRadioStationIndex,feed);
   forceTitleRadioFeedToAir(feed);
   feed.muted=false;
   const p=feed.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
  }
  updateTitleRadioAudibility();
 }
 updateTitleRadioControls();
}
function cycleTitleRadioStation(direction=1){
 tuneTitleRadioStation(titleRadioStationIndex+(direction<0?-1:1));
}
function setRadioLocationContext(context,force=false){
 if(!Object.prototype.hasOwnProperty.call(TITLE_RADIO_CONTEXT_STATIONS,context))context='office';
 const changed=titleRadioLocationContext!==context;
 titleRadioLocationContext=context;
 if(titleRadioAutoTune&&(changed||force))tuneTitleRadioStation(TITLE_RADIO_CONTEXT_STATIONS[context]);
 updateTitleDevPanel();
}
function toggleTitleRadioPower(){
 if(titleRadioFadeTimer){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null}
 titleRadioOff=!titleRadioOff;
 if(titleRadioOff){
  if(titleRadioAudio)titleRadioAudio.pause();
  updateTitleRadioAudibility();
 }else if(titleRadioStationIndex===0){
  loadTitleRadioTrack(true);
  updateTitleRadioAudibility();
 }else{
  const feed=ensureTitleRadioBackgroundFeed(titleRadioStationIndex);
  if(feed){
   configureTitleRadioFeedProgram(titleRadioStationIndex,feed);
   forceTitleRadioFeedToAir(feed);
  }
  updateTitleRadioAudibility();
 }
 updateTitleRadioControls();
}
function pauseTitleAudio(){
 if(titleRadioFadeTimer){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null}
 if(titleCityAmbienceAudio)titleCityAmbienceAudio.pause();
 if(titleRadioAudio)titleRadioAudio.pause();
 stopTitleNewspaperRustle(false);
 stopTitleFilingCabinetOpen();
 stopTitleFanAudio(false);
 stopTitleClockAudio(false);
 for(const feed of titleRadioBackgroundFeeds.values()){feed.pause();feed.muted=true}
}
function resumeTitleAudio(){
 if(titleScreenVisible()){
  syncTitleCityAmbience();
  syncTitleFanAudio();
  syncTitleClockAudio();
 }
 startTitleRadioBackgroundFeeds();
 updateTitleRadioAudibility();
 if(!titleRadioOff&&titleRadioStationIndex===0)startTitleRadio();
}
function stopTitleRadio(fade=true){
 if(titleRadioFadeTimer){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null}
 const audio=titleRadioAudio;
 const finish=()=>{
  if(audio){audio.pause();try{audio.currentTime=0}catch(e){}audio.volume=titleRadioVolume()}
  for(const feed of titleRadioBackgroundFeeds.values()){feed.pause();feed.muted=true;try{feed.currentTime=0}catch(e){}}
  if(titleRadioAirSyncTimer){clearInterval(titleRadioAirSyncTimer);titleRadioAirSyncTimer=null}
  titleRadioAirStartAt=0;
 };
 if(!audio||!fade||audio.paused){finish();return}
 const start=Math.max(0,audio.volume),steps=12;let step=0;
 titleRadioFadeTimer=setInterval(()=>{step++;audio.volume=Math.max(0,start*(1-step/steps));if(step>=steps){clearInterval(titleRadioFadeTimer);titleRadioFadeTimer=null;finish()}},50);
}
function openTitleDialog(title,html){
 const dialog=$('#titleDialog'),heading=$('#titleDialogHeading'),body=$('#titleDialogBody');
 if(!dialog||!heading||!body)return;heading.textContent=title;body.innerHTML=html;dialog.hidden=false;
}
function closeTitleDialog(){const dialog=$('#titleDialog');if(dialog){const closingNewspaper=dialog.classList.contains('title-newspaper-dialog')&&!dialog.hidden;if(closingNewspaper)playTitleNewspaperRustle();dialog.hidden=true;dialog.classList.remove('title-newspaper-dialog')}}
const TITLE_NEWSPAPER_PRICE=.03;
const TITLE_NEWSPAPER_EDITION='1938-09-30';
const TITLE_NEWSPAPER_CATALOG={
 '1938-09-30':{id:'1938-09-30',kind:'image',dateLabel:'September 30, 1938',headline:'EUROPE WATCHES MUNICH ACCORD',image:'assets/artwork/newspapers/1938-munich-accord-newspaper.webp?v=20261004-news1'}
};
const TITLE_NEWSPAPER_RUSTLE_VOLUME=.18;
const TITLE_FILING_CABINET_OPEN_SRC='assets/audio/filing-cabinet-open.mp3?v=20261004-cabinet1';
const TITLE_FILING_CABINET_OPEN_VOLUME=.22;
let titleFilingCabinetAudio=null;
function preloadTitleFilingCabinetOpen(){
 if(titleFilingCabinetAudio)return titleFilingCabinetAudio;
 const audio=new Audio(TITLE_FILING_CABINET_OPEN_SRC);
 audio.preload='auto';
 audio.volume=TITLE_FILING_CABINET_OPEN_VOLUME;
 audio.load();
 titleFilingCabinetAudio=audio;
 return audio;
}
function playTitleFilingCabinetOpen(){
 if(S.paused)return;
 const audio=preloadTitleFilingCabinetOpen();
 audio.pause();
 audio.volume=TITLE_FILING_CABINET_OPEN_VOLUME;
 try{audio.currentTime=0}catch(e){}
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
function stopTitleFilingCabinetOpen(){
 if(titleFilingCabinetAudio)titleFilingCabinetAudio.pause();
}

const TITLE_NEWSPAPER_RUSTLES=[
 'assets/audio/newspaper-rustle-01.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-02.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-03.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-04.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-05.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-06.mp3?v=20261004-paper1',
 'assets/audio/newspaper-rustle-07.mp3?v=20261004-paper1'
];
let titleNewspaperRustleAudio=null,titleNewspaperRustleLast=-1,titleNewspaperRustlePressAt=0;
const titleNewspaperRustlePool=[];
function preloadTitleNewspaperRustles(){
 if(titleNewspaperRustlePool.length||!TITLE_NEWSPAPER_RUSTLES.length)return;
 for(const src of TITLE_NEWSPAPER_RUSTLES){
  const audio=new Audio(src);
  audio.preload='auto';
  audio.volume=TITLE_NEWSPAPER_RUSTLE_VOLUME;
  audio.load();
  titleNewspaperRustlePool.push(audio);
 }
}
function playTitleNewspaperRustle(){
 if(S.paused||!TITLE_NEWSPAPER_RUSTLES.length)return;
 preloadTitleNewspaperRustles();
 let index=0;
 if(TITLE_NEWSPAPER_RUSTLES.length===1)index=0;
 else index=(titleNewspaperRustleLast+1+Math.floor(Math.random()*(TITLE_NEWSPAPER_RUSTLES.length-1)))%TITLE_NEWSPAPER_RUSTLES.length;
 titleNewspaperRustleLast=index;
 const audio=titleNewspaperRustlePool[index];
 if(!audio)return;
 if(titleNewspaperRustleAudio&&titleNewspaperRustleAudio!==audio)titleNewspaperRustleAudio.pause();
 titleNewspaperRustleAudio=audio;
 audio.volume=TITLE_NEWSPAPER_RUSTLE_VOLUME;
 try{audio.currentTime=0}catch(e){}
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
function primeTitleNewspaperRustle(){
 titleNewspaperRustlePressAt=typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
 playTitleNewspaperRustle();
}
function ensureTitleNewspaperRustleForOpen(){
 const now=typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
 if(!titleNewspaperRustlePressAt||now-titleNewspaperRustlePressAt>500)playTitleNewspaperRustle();
 titleNewspaperRustlePressAt=0;
}
function stopTitleNewspaperRustle(reset=false){
 if(!titleNewspaperRustleAudio)return;
 titleNewspaperRustleAudio.pause();
 if(reset){try{titleNewspaperRustleAudio.currentTime=0}catch(e){}}
}

function lastPlayedProfile(){
 const profiles=readProfiles();
 if(!profiles.length)return null;
 return profiles.slice().sort((a,b)=>(+b.lastPlayed||0)-(+a.lastPlayed||0))[0]||null;
}
function titleNewspaperIssueFromSave(saveData){
 const raw=saveData?.gameDate||TITLE_NEWSPAPER_EDITION;
 const iso=/^\d{4}-\d{2}-\d{2}$/.test(raw)?raw:TITLE_NEWSPAPER_EDITION;
 if(TITLE_NEWSPAPER_CATALOG[iso])return Object.assign({},TITLE_NEWSPAPER_CATALOG[iso]);
 const d=new Date(iso+'T12:00:00');
 const dateLabel=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
 return {
  id:iso,kind:'generated',dateLabel,
  headline:saveData?.headline||'WASHINGTON WATCHES INDUSTRY WITH CAUTION',
  story:saveData?.story||'Manufacturers weigh orders, costs and the uncertain pace of recovery.',
  societyStory:saveData?.societyStory||'Washington begins another day of meetings, dinners and quiet conversations.',
  sportsStory:saveData?.sportsStory||'No major sporting results were filed for this edition.',
  marketWire:saveData?.marketWire||'Markets remain a subject of close attention in business offices across the capital.'
 };
}
function snapshotTitleNewspaperIssue(issue){
 return {id:issue.id,kind:issue.kind,dateLabel:issue.dateLabel,headline:issue.headline,story:issue.story||'',societyStory:issue.societyStory||'',sportsStory:issue.sportsStory||'',marketWire:issue.marketWire||'',image:issue.image||''};
}
function titleNewspaperIssueHtml(issue){
 if(issue.kind==='image'&&issue.image)return '<img class="title-newspaper-view" src="'+escapeHtml(issue.image)+'" alt="The Metropolitan Ledger front page for '+escapeHtml(issue.dateLabel)+'">';
 return '<article class="title-generated-newspaper"><header><small>WASHINGTON, D.C. · 3 CENTS</small><h3>THE METROPOLITAN LEDGER</h3><b>'+escapeHtml(issue.dateLabel)+'</b></header><h4>'+escapeHtml(issue.headline)+'</h4><p>'+escapeHtml(issue.story||'')+'</p><div class="title-generated-news-grid"><section><h5>FINANCIAL &amp; INDUSTRIAL</h5><p>'+escapeHtml(issue.marketWire||'')+'</p></section><section><h5>WASHINGTON &amp; SOCIETY</h5><p>'+escapeHtml(issue.societyStory||'')+'</p></section><section><h5>SPORTS</h5><p>'+escapeHtml(issue.sportsStory||'')+'</p></section></div></article>';
}
function titleNewspaperArchiveCard(issue){
 const preview=issue.kind==='image'&&issue.image?'<img src="'+escapeHtml(issue.image)+'" alt="">':'<div class="title-archive-generated-thumb"><strong>THE<br>METROPOLITAN<br>LEDGER</strong><span>'+escapeHtml(issue.dateLabel)+'</span><b>'+escapeHtml(issue.headline)+'</b></div>';
 return '<button class="title-archive-card" type="button" data-archive-newspaper="'+escapeHtml(issue.id)+'">'+preview+'<span>'+escapeHtml(issue.dateLabel)+'</span><b>'+escapeHtml(issue.headline)+'</b><small>OWNED · REOPEN FREE</small></button>';
}
function purchaseTitleNewspaper(){
 const profile=lastPlayedProfile();
 if(!profile){
  const issue=Object.assign({},TITLE_NEWSPAPER_CATALOG[TITLE_NEWSPAPER_EDITION]);
  return {ok:true,charged:false,profile:null,reason:'no-profile',issue};
 }
 const key=profileSaveKey(profile.id);
 let saveData=null;
 try{saveData=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
 if(!saveData)saveData=initial();
 saveData=migrate(saveData);
 const issue=titleNewspaperIssueFromSave(saveData);
 saveData.titleNewspaperPurchases=Array.isArray(saveData.titleNewspaperPurchases)?saveData.titleNewspaperPurchases:[];
 saveData.titleNewspaperArchive=saveData.titleNewspaperArchive&&typeof saveData.titleNewspaperArchive==='object'?saveData.titleNewspaperArchive:{};
 if(saveData.titleNewspaperPurchases.includes(issue.id)){
  if(!saveData.titleNewspaperArchive[issue.id])saveData.titleNewspaperArchive[issue.id]=snapshotTitleNewspaperIssue(issue);
  localStorage.setItem(key,JSON.stringify(saveData));
  return {ok:true,charged:false,profile,issue:saveData.titleNewspaperArchive[issue.id]};
 }
 const balance=Number(saveData.personalCash)||0;
 if(balance<TITLE_NEWSPAPER_PRICE)return {ok:false,charged:false,profile,issue};
 saveData.personalCash=Math.round((balance-TITLE_NEWSPAPER_PRICE)*100)/100;
 saveData.titleNewspaperPurchases.push(issue.id);
 saveData.titleNewspaperArchive[issue.id]=snapshotTitleNewspaperIssue(issue);
 localStorage.setItem(key,JSON.stringify(saveData));
 if(activeProfileId()===profile.id){
  S.personalCash=saveData.personalCash;
  S.titleNewspaperPurchases=saveData.titleNewspaperPurchases.slice();
  S.titleNewspaperArchive=Object.assign({},saveData.titleNewspaperArchive);
 }
 return {ok:true,charged:true,profile,issue:saveData.titleNewspaperArchive[issue.id]};
}
function titleArchiveSave(){
 const profile=lastPlayedProfile();if(!profile)return {profile:null,saveData:null};
 let saveData=null;try{saveData=JSON.parse(localStorage.getItem(profileSaveKey(profile.id))||'null')}catch(e){}
 if(!saveData)return {profile,saveData:null};
 return {profile,saveData:migrate(saveData)};
}
function archivedTitleNewspaperIssue(saveData,editionId){
 if(saveData?.titleNewspaperArchive?.[editionId])return saveData.titleNewspaperArchive[editionId];
 if(TITLE_NEWSPAPER_CATALOG[editionId])return Object.assign({},TITLE_NEWSPAPER_CATALOG[editionId]);
 return null;
}
function openArchivedTitleNewspaper(editionId){
 const {saveData}=titleArchiveSave(),issue=archivedTitleNewspaperIssue(saveData,editionId);if(!issue)return;
 ensureTitleNewspaperRustleForOpen();
 openTitleDialog('The Metropolitan Ledger','<p class="title-newspaper-receipt">ARCHIVE COPY · '+escapeHtml(issue.dateLabel)+' · no charge</p>'+titleNewspaperIssueHtml(issue));
 const dialog=$('#titleDialog');if(dialog)dialog.classList.add('title-newspaper-dialog');
}
function collectibleCardPreviewHtml(card){
 const category=escapeHtml(card.category||'Federal Electric');
 const title=escapeHtml(card.title||'Untitled Record');
 const subtitle=escapeHtml(card.subtitle||card.acquiredDate||'');
 return '<button class="fe-collectible-card" type="button" data-archive-card="'+escapeHtml(card.id||'')+'"><span class="fe-card-category">'+category+'</span><div class="fe-card-face"><small>FEDERAL ELECTRIC ARCHIVE</small><h4>'+title+'</h4>'+(subtitle?'<p>'+subtitle+'</p>':'')+'<b>OPEN RECORD</b></div></button>';
}
function openArchivedCollectibleCard(cardId){
 const {saveData}=titleArchiveSave();
 const card=(saveData?.collectibleCards||[]).find(v=>String(v.id)===String(cardId));if(!card)return;
 openTitleDialog(card.title||'Federal Electric Archive Card','<article class="fe-card-detail"><small>'+escapeHtml(card.category||'Federal Electric')+'</small><h3>'+escapeHtml(card.title||'Untitled Record')+'</h3>'+(card.subtitle?'<h4>'+escapeHtml(card.subtitle)+'</h4>':'')+'<p>'+escapeHtml(card.body||card.description||'No additional archive text has been recorded for this card.')+'</p>'+(card.acquiredDate?'<footer>ACQUIRED · '+escapeHtml(card.acquiredDate)+'</footer>':'')+'</article>');
}
function renderTitleArchives(){
 const {profile,saveData}=titleArchiveSave();
 if(!profile){
  openTitleDialog('Archives','<p class="title-dialog-note">Create or load a profile before collecting archive material.</p>');
  return;
 }
 const owned=Array.isArray(saveData?.titleNewspaperPurchases)?saveData.titleNewspaperPurchases:[];
 const newspaperCards=owned.map(id=>archivedTitleNewspaperIssue(saveData,id)).filter(Boolean).sort((a,b)=>String(b.id).localeCompare(String(a.id))).map(titleNewspaperArchiveCard).join('');
 const collectibleCards=(saveData?.collectibleCards||[]).filter(v=>v&&v.id).map(collectibleCardPreviewHtml).join('');
 const html='<p class="title-dialog-note">'+escapeHtml(profile.name)+' · Personal Archive</p>'+
  '<section class="title-archive-section"><h3>Purchased Newspapers</h3>'+(newspaperCards?'<div class="title-archive-gallery">'+newspaperCards+'</div>':'<p>No purchased newspaper issues are in this profile\'s archive yet.</p>')+'</section>'+
  '<section class="title-archive-section"><h3>Collectible Cards</h3>'+(collectibleCards?'<div class="fe-collectible-gallery">'+collectibleCards+'</div>':'<p>No collectible cards have been earned by this profile yet.</p>')+'</section>';
 openTitleDialog('Archives',html);
 $('#titleDialogBody').querySelectorAll('[data-archive-newspaper]').forEach(button=>button.onclick=()=>openArchivedTitleNewspaper(button.dataset.archiveNewspaper));
 $('#titleDialogBody').querySelectorAll('[data-archive-card]').forEach(button=>button.onclick=()=>openArchivedCollectibleCard(button.dataset.archiveCard));
}
function openTitleNewspaper(){
 const purchase=purchaseTitleNewspaper();
 if(!purchase.ok){
  openTitleDialog('The Metropolitan Ledger','<p class="title-dialog-note">The Metropolitan Ledger costs 3¢. '+escapeHtml(purchase.profile?.name||'The last-played profile')+' does not have enough Personal Cash.</p>');
  return;
 }
 ensureTitleNewspaperRustleForOpen();
 const issue=purchase.issue||Object.assign({},TITLE_NEWSPAPER_CATALOG[TITLE_NEWSPAPER_EDITION]);
 const receipt=purchase.charged?'<p class="title-newspaper-receipt">3¢ charged to '+escapeHtml(purchase.profile?.name||'last-played profile')+' · Personal Cash</p>':'<p class="title-newspaper-receipt">OWNED ARCHIVE ISSUE · no additional charge</p>';
 openTitleDialog('The Metropolitan Ledger',receipt+titleNewspaperIssueHtml(issue));
 const dialog=$('#titleDialog');if(dialog)dialog.classList.add('title-newspaper-dialog');
}
function closeTitleScreen(){document.getElementById('titleScreen')?.classList.remove('desk-interior');if(!titleScreenDeskBreak)titleRadioLocationContext='office';closeTitleDialog();closeTitleMap();closeCityRoom();stopTitleCityAmbience(true);stopTitleNewspaperRustle(true);stopTitleFanAudio(true);stopTitleClockAudio(true);if(titleClockTimer){clearInterval(titleClockTimer);titleClockTimer=null}const screen=$('#titleScreen');if(screen)screen.hidden=true;startTitleRadioBackgroundFeeds();updateTitleRadioAudibility();if(!titleRadioOff&&titleRadioStationIndex===0)startTitleRadio()}
function stepAwayFromDesk(){
 // The retired illustrated office title is never a navigation destination.
 // The personal career desk is the home UI; a step away opens the actual room
 // where the player stands, or the city map if they are at their own factory.
 const current=currentCityLocation();
 if(current.locationId!=='factory'&&openCityRoom(current.locationId,current.roomId,{dev:false,source:'resume'}))return;
 openTitleMap();
}
function profileSummary(p){
 let save=null;try{save=JSON.parse(localStorage.getItem(profileSaveKey(p.id))||'null')}catch(e){}
 const date=save?.gameDate?new Date(save.gameDate+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'New game';
 const turn=Number.isFinite(+save?.turnSerial)?'Turn '+Math.max(1,Math.floor(+save.turnSerial)):'No turns played';
 return date+' · '+turn+' · '+(window.FE_CHARACTERS?.label?.(save?.characterRoute)||'Industrialist');
}
function renderProfileManager(message=''){
 const profiles=readProfiles(),active=activeProfileId();
 const rows=profiles.map(p=>'<div class="profile-row"><div><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(profileSummary(p))+(p.id===active?' · ACTIVE':'')+'</small></div><button type="button" data-profile-load="'+escapeHtml(p.id)+'">Load</button><button class="profile-delete danger" type="button" data-profile-delete="'+escapeHtml(p.id)+'">Delete</button></div>').join('');
 openTitleDialog('Profile',(message?'<p class="title-dialog-note">'+escapeHtml(message)+'</p>':'')+(rows||'<p>No profiles have been created yet.</p>')+'<div class="title-dialog-actions"><button id="profileManagerNew" type="button">New Profile</button></div>');
 $('#titleDialogBody').querySelectorAll('[data-profile-load]').forEach(b=>b.onclick=()=>loadProfileById(b.dataset.profileLoad));
 $('#titleDialogBody').querySelectorAll('[data-profile-delete]').forEach(b=>b.onclick=()=>deleteProfileById(b.dataset.profileDelete));
 const add=$('#profileManagerNew');if(add)add.onclick=()=>showNewProfileForm();
}
function showNewProfileForm(){
 const profiles=readProfiles();
 if(profiles.length>=PROFILE_LIMIT){renderProfileManager('Four profiles already exist. Delete one before creating another.');return}
 openTitleDialog('New Profile','<div class="title-profile-form"><label>Profile name<input id="newProfileName" maxlength="28" autocomplete="off" placeholder="Executive name or profile name"></label><div id="titleCharacterChoices" class="title-character-choices" aria-label="Character story routes"></div><div class="title-dialog-actions"><button id="createProfileCancel" type="button">Cancel</button><button id="createProfileConfirm" type="button">Create Profile</button></div></div>');
 window.FE_CHARACTERS?.renderChoices?.();
 const input=$('#newProfileName');if(input)input.focus();
 $('#createProfileCancel').onclick=closeTitleDialog;
 $('#createProfileConfirm').onclick=()=>{const name=(input?.value||'').trim();if(!name){input?.focus();return}createProfile(name,window.FE_CHARACTERS?.selected?.()||'industrialist')};
 if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')$('#createProfileConfirm').click()});
}
function createProfile(name,routeId='industrialist'){
 const profiles=readProfiles();if(profiles.length>=PROFILE_LIMIT){renderProfileManager('Four profiles already exist. Delete one before creating another.');return}
 const id='p'+Date.now().toString(36),p={id,name:name.slice(0,28),created:Date.now(),lastPlayed:Date.now()};
 profiles.push(p);writeProfiles(profiles);setActiveProfileId(id);S=initial();S.characterRoute=window.FE_CHARACTERS?.normalize?.(routeId)||'industrialist';
 const start=window.FE_CHARACTERS?.get?.(S.characterRoute)?.startingLocationId;
 if(start){const loc=window.FederalElectricCity?.getLocation?.(start);if(loc)S.currentLocation={locationId:start,roomId:window.FE_CHARACTERS.get(S.characterRoute)?.startingRoomId||(S.characterRoute==='wardman'?'orderly-station':loc.defaultRoom)}}
 profileSaveReadBlocked=false;save(true);selectedStockTicker=null;render();closeTitleScreen();
}
function showSavedCityLocation(){
 const current=currentCityLocation();
 if(current.locationId!=='factory')openCityRoom(current.locationId,current.roomId,{dev:false,source:'resume'});
}
function loadProfileById(id){
 const p=readProfiles().find(v=>v.id===id);if(!p)return false;
 const raw=localStorage.getItem(profileSaveKey(id));
 if(!raw){
  if(activeProfileId()===id)profileSaveReadBlocked=true;
  renderProfileManager('This profile has no autosave data. Nothing was overwritten. Recover its original data before attempting to continue.');
  return false;
 }
 let candidate;
 try{candidate=migrate(JSON.parse(raw))}
 catch(e){
  if(activeProfileId()===id)profileSaveReadBlocked=true;
  renderProfileManager('The selected profile autosave cannot be read. Its original bytes are preserved, and autosaving into that profile is blocked. Choose another valid profile or recover your save.');
  return false;
 }
 setActiveProfileId(id);S=candidate;profileSaveReadBlocked=false;
 selectedStockTicker=null;save(true);render();closeTitleScreen();showSavedCityLocation();
 return true;
}
function deleteProfileById(id){
 const profiles=readProfiles(),p=profiles.find(v=>v.id===id);if(!p)return;
 if(!confirm('Delete profile "'+p.name+'" and all of its saved Federal Electric progress?'))return;
 localStorage.removeItem(profileSaveKey(id));
 enqueueDiskDelete(id);
 const next=profiles.filter(v=>v.id!==id);writeProfiles(next);
 let warning='';
 if(activeProfileId()===id){
  setActiveProfileId('');profileSaveReadBlocked=false;S=initial();
  if(next.length){
   const candidate=next[0],raw=localStorage.getItem(profileSaveKey(candidate.id));
   try{
    if(!raw)throw new Error('No autosave present');
    const restored=migrate(JSON.parse(raw));
    setActiveProfileId(candidate.id);S=restored;render();
   }catch(e){
    profileSaveReadBlocked=true;
    warning='The remaining profile has missing or unreadable save data. Its original bytes are preserved. Select another valid profile or recover its data.';
   }
  }
 }
 renderProfileManager(warning);
}
function continueFromTitle(){
 if(profileSaveReadBlocked){renderProfileManager('This saved game could not be read. The existing autosave is protected from being overwritten. Select a valid profile or recover this save.');return}
 if(titleScreenDeskBreak){
  titleScreenDeskBreak=false;
  closeTitleScreen();
  render();
  showSavedCityLocation();
  return;
 }
 const profiles=readProfiles(),active=activeProfileId();
 if(active&&profiles.some(p=>p.id===active)){loadProfileById(active);return}
 if(profiles.length){loadProfileById(profiles[0].id);return}
 showNewProfileForm();
}

const TITLE_CLOCK_TIME_ZONE='America/New_York';
const TITLE_DC_LAT=38.9072;
const TITLE_DC_LON=-77.0369;
const TITLE_OFFICE_IMAGES={
 day:'assets/artwork/locations/offices/federal-electric-office-day.webp?v=20261003-dc1',
 night:'assets/artwork/locations/offices/federal-electric-office-night.png?v=20261004-approved3'
};
const titleClockFormatter=new Intl.DateTimeFormat('en-US',{
 timeZone:TITLE_CLOCK_TIME_ZONE,
 hourCycle:'h23',
 hour:'2-digit',
 minute:'2-digit',
 second:'2-digit'
});
const titleEnvironmentFormatter=new Intl.DateTimeFormat('en-US',{
 timeZone:TITLE_CLOCK_TIME_ZONE,
 hourCycle:'h23',
 year:'numeric',
 month:'2-digit',
 day:'2-digit',
 hour:'2-digit',
 minute:'2-digit',
 second:'2-digit'
});
function titleZoneParts(date){
 const out={};
 titleEnvironmentFormatter.formatToParts(date).forEach(p=>{
  if(['year','month','day','hour','minute','second'].includes(p.type))out[p.type]=Number(p.value);
 });
 return out;
}
function titleZoneOffsetHours(date){
 const p=titleZoneParts(date);
 const represented=Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
 return (represented-date.getTime())/3600000;
}
function titleDayOfYear(year,month,day){
 return Math.floor((Date.UTC(year,month-1,day)-Date.UTC(year,0,0))/86400000);
}
function titleDCSunTimes(date){
 const p=titleZoneParts(date);
 const n=titleDayOfYear(p.year,p.month,p.day);
 const gamma=2*Math.PI/365*(n-1);
 const eq=229.18*(0.000075+0.001868*Math.cos(gamma)-0.032077*Math.sin(gamma)-0.014615*Math.cos(2*gamma)-0.040849*Math.sin(2*gamma));
 const decl=0.006918-0.399912*Math.cos(gamma)+0.070257*Math.sin(gamma)-0.006758*Math.cos(2*gamma)+0.000907*Math.sin(2*gamma)-0.002697*Math.cos(3*gamma)+0.00148*Math.sin(3*gamma);
 const lat=TITLE_DC_LAT*Math.PI/180;
 const zenith=90.833*Math.PI/180;
 const cosHour=(Math.cos(zenith)/(Math.cos(lat)*Math.cos(decl)))-Math.tan(lat)*Math.tan(decl);
 const hourAngle=Math.acos(Math.max(-1,Math.min(1,cosHour)))*180/Math.PI;
 const offset=titleZoneOffsetHours(date);
 const solarNoon=720-4*TITLE_DC_LON-eq+offset*60;
 return {sunrise:solarNoon-hourAngle*4,sunset:solarNoon+hourAngle*4};
}
let titleEnvironmentDevOverride=null;
let titleDevInfiniteMoney=false,titleDevMoneySnapshot=null,titleDevUnlockAllRooms=false,titleDevFreezeTime=false,titleDevShowHotspots=false,titleDevEditHotspots=false,titleDevOutsideNoise=true;
const TITLE_DEV_MONEY=999999999;

let cityRoomSession={locationId:null,roomId:null,dev:false,source:'dev'};

function federalCity(){return window.FederalElectricCity||null}
function cityLocation(locationId){return federalCity()?.getLocation?.(locationId)||null}
function cityRoom(locationId,roomId){return federalCity()?.getRoom?.(locationId,roomId)||null}
function normalizeCurrentLocation(value){
 const fallback={locationId:'factory',roomId:'executive-office'};
 const location=cityLocation(value?.locationId||fallback.locationId)||cityLocation(fallback.locationId);
 if(!location)return fallback;
 const room=cityRoom(location.id,value?.roomId||location.defaultRoom);
 return {locationId:location.id,roomId:room?.id||location.defaultRoom||location.rooms?.[0]?.id||''};
}
function currentCityLocation(){return normalizeCurrentLocation(S.currentLocation)}

function titleDevPopulateRooms(locationId,preferredRoomId=''){
 const roomSelect=document.getElementById('titleDevRoomSelect');
 const location=cityLocation(locationId);
 if(!roomSelect)return;
 roomSelect.innerHTML='';
 if(!location||!location.rooms.length){
  const option=document.createElement('option');option.value='';option.textContent='NO ROOMS';roomSelect.appendChild(option);roomSelect.disabled=true;return;
 }
 roomSelect.disabled=false;
 for(const room of location.rooms){
  const option=document.createElement('option');option.value=room.id;option.textContent=room.name;roomSelect.appendChild(option);
 }
 const wanted=preferredRoomId&&location.rooms.some(v=>v.id===preferredRoomId)?preferredRoomId:location.defaultRoom;
 if(wanted)roomSelect.value=wanted;
}
function titleDevPopulateLocations(){
 const select=document.getElementById('titleDevLocationSelect'),city=federalCity();if(!select||!city)return;
 const previous=select.value;
 select.innerHTML='';
 for(const location of city.listLocations()){
  const option=document.createElement('option');option.value=location.id;option.textContent=location.name;select.appendChild(option);
 }
 const current=currentCityLocation();
 if(previous&&cityLocation(previous))select.value=previous;
 else if(cityRoomSession.locationId&&cityLocation(cityRoomSession.locationId))select.value=cityRoomSession.locationId;
 else if(cityLocation(current.locationId))select.value=current.locationId;
 else select.value='factory';
 titleDevPopulateRooms(select.value,cityRoomSession.locationId===select.value?cityRoomSession.roomId:(current.locationId===select.value?current.roomId:''));
}
function updateTitleDevCityControls(){
 const status=document.getElementById('titleDevRoomStatus');
 if(!status)return;
 const current=currentCityLocation();
 if(cityRoomSession.locationId){
  const location=cityLocation(cityRoomSession.locationId),room=cityRoom(cityRoomSession.locationId,cityRoomSession.roomId);
  status.textContent=(cityRoomSession.dev?'DEV · ':'')+(location?.name||cityRoomSession.locationId)+' · '+(room?.name||cityRoomSession.roomId||'room');
  return;
 }
 const location=cityLocation(current.locationId),room=cityRoom(current.locationId,current.roomId);
 status.textContent='Saved · '+(location?.name||current.locationId)+' · '+(room?.name||current.roomId);
}
function renderCityRoomDirectory(location,activeRoomId){
 const directory=document.getElementById('cityRoomDirectory');if(!directory)return;
 directory.innerHTML='';
 const rooms=Array.isArray(location?.rooms)?location.rooms:[];
 directory.hidden=rooms.length<=1;
 if(rooms.length<=1)return;
 for(const room of rooms){
  const button=document.createElement('button');
  button.type='button';
  button.textContent=room.name;
  button.disabled=!!room.restricted&&!cityRoomSession.dev&&!titleDevUnlockAllRooms&&!window.FE_CITY_ACCESS?.canRoom?.(window.FederalElectricCity,{kind:'player',route:S.characterRoute},location.id,room.id,S.gameDate).ok;
  if(button.disabled)button.title='Restricted room: authorization required.';
  button.classList.toggle('active',room.id===activeRoomId);
  button.onclick=()=>openCityRoom(location.id,room.id,{dev:cityRoomSession.dev,source:cityRoomSession.source});
  directory.appendChild(button);
 }
}
// Map travel enters the destination's default room; never commit a bad destination to the autosave.
function recordLiveryPurchase(){save(true);window.FE_TRANSPORT?.renderRegister?.()}
function openCityRoom(locationId,roomId,options={}){
 const location=cityLocation(locationId);
 if(!location){console.error('Federal Electric: unknown destination',locationId);return false;}
 const dev=!!options.dev,source=options.source||'dev';
 if(!dev&&!titleDevUnlockAllRooms&&!window.FE_PATROL?.travel?.(S,location.id)?.ok)return false;
 if(!dev&&!titleDevUnlockAllRooms&&window.FE_VENUES&&!window.FE_VENUES.canEnterLocation(location.id)){
  console.warn('Federal Electric: destination is not open',location.id,S.gameDate);return false;
 }
 if(location.id==='factory'&&!dev&&S.characterRoute==='industrialist'&&(!roomId||roomId==='executive-office')){
  returnCityRoomToOffice();closeTitleMap();return true;
 }
 const room=cityRoom(location.id,roomId||location.defaultRoom);
 if(room?.restricted&&!dev&&!titleDevUnlockAllRooms&&!window.FE_CITY_ACCESS?.canRoom?.(window.FederalElectricCity,{kind:'player',route:S.characterRoute},location.id,room.id,S.gameDate).ok){
  console.warn('Federal Electric: restricted room entry refused',location.id,room.id);
  return false;
 }
 const overlay=document.getElementById('cityRoomOverlay');
 if(!room||!overlay){console.error('Federal Electric: room or overlay missing',location.id,roomId);return false;}
 const required=['cityRoomLocationName','cityRoomArea','cityRoomName','cityRoomDescription'];
 if(required.some(id=>!document.getElementById(id))){
  console.error('Federal Electric: missing city room markup',location.id);return false;
 }
 const priorLocation=currentCityLocation();
 const priorSession=cityRoomSession;
 const priorOverlayHidden=overlay.hidden;
 const priorRoomOpen=document.body.classList.contains('city-room-open');
 // The location is provisional until room widgets successfully render. On failure
 // restore prior state rather than saving a phantom visit that blocks Go There.
 try{
  restoreLocalVenueActivity();
  cityRoomSession={locationId:location.id,roomId:room.id,dev,source};
  if(!dev)S.currentLocation={locationId:location.id,roomId:room.id};
  document.getElementById('cityRoomLocationName').textContent=location.name;
  document.getElementById('cityRoomArea').textContent=location.area||'Washington, D.C.';
  document.getElementById('cityRoomName').textContent=room.name;
  document.getElementById('cityRoomDescription').textContent=room.description||location.description||'Room shell registered.';
  setPastimeActivity('legal',null);setPastimeActivity('illicit',null);
  renderCityRoomPeople(location);
  window.FE_LIVING_CHARACTERS?.renderRoomVisitors?.(location.id);
  window.FE_NPC_AI?.renderRoomVisitors?.(location.id);
  window.FE_VENUES?.renderRoomOpportunities?.(location.id);
  window.FE_PERSONAL_EFFECTS?.renderRoomStorage?.(location.id,room.id);
  window.FE_FISHING_UI?.render?.();
  window.FE_MARKET_UI?.render?.();
  window.FE_HOUSING?.renderHouseholdRecord?.(location.id,room.id);
  renderCityRoomDirectory(location,room.id);
  window.FE_LIVERY_UI?.render?.(location.id,room.id,S,recordLiveryPurchase,!dev);
  window.FE_HORSE_STABLE_UI?.render?.(location.id,room.id,S,recordLiveryPurchase,!dev);
  const mapButton=document.getElementById('cityRoomReturnMap');
  if(mapButton){mapButton.disabled=false;mapButton.textContent='Return to Map';}
  const returnDesk=document.getElementById('cityRoomReturnOffice');if(returnDesk)returnDesk.textContent=S.characterRoute==='industrialist'?'Return to Executive Desk':'Return to Personal Desk';
  overlay.hidden=false;
  document.body.classList.add('city-room-open');
  window.FE_PATROL_UI?.refresh?.();window.FE_DOORMAN_UI?.refresh?.();window.FE_ORDERLY_UI?.refresh?.();
  setRadioLocationContext(location.radioContext||'office');
  updateTitleDevCityControls();
 }catch(err){
  if(!dev)S.currentLocation=priorLocation;
  cityRoomSession=priorSession;
  overlay.hidden=priorOverlayHidden;
  document.body.classList.toggle('city-room-open',priorRoomOpen);
  console.error('Federal Electric: could not enter '+location.name,err);
  return false;
 }
 // All room content is ready. Record movement only after success.
 if(!dev){
  if(location.id==='brokerOffice'){
   window.FE_BROKER?.visit?.(S,S.gameDate);
   const advice=window.FE_BROKER?.recordObservation?.(S,S.gameDate,S.stocks,S.portfolio);
   if(advice)S.notes.push({date:displayDate(),source:'stockbroker consultation',text:advice.text});
   renderBrokerOffice();
  }
  else{const panel=document.getElementById('cityRoomBrokerage');if(panel)panel.hidden=true}
  if(priorLocation.locationId!==location.id){
   const journeyPaid=window.FE_TRAVEL?.recordProvisional?.(priorLocation.locationId,location.id);
   window.FE_HORSE_CUSTODY?.onArrival?.(S,priorLocation.locationId,location.id,!!journeyPaid);
   window.FE_HORSE_STABLE_UI?.render?.(location.id,room.id,S,recordLiveryPurchase,true);
  }
  window.FE_MAP_LEADS?.visit?.(S,location.id);
  save(true);
  window.FE_NPC_AI?.syncClock?.();
  const encounter=document.getElementById('cityRoomEncounter');
  if(encounter)encounter.textContent=checkCityOpportunity(location.id);
 }else{
  const encounter=document.getElementById('cityRoomEncounter');if(encounter)encounter.textContent='';
 }
 closeTitleDialog();closeTitleMap();
 return true;
}
function closeCityRoom(){
 restoreLocalVenueActivity();
 const overlay=document.getElementById('cityRoomOverlay');if(overlay)overlay.hidden=true;
 document.body.classList.remove('city-room-open');
 cityRoomSession={locationId:null,roomId:null,dev:false,source:'dev'};
 window.FE_PATROL_UI?.refresh?.();window.FE_DOORMAN_UI?.refresh?.();window.FE_ORDERLY_UI?.refresh?.();
 setRadioLocationContext('office');
 updateTitleDevCityControls();
}
function returnCityRoomToMap(){
 const locationId=cityRoomSession.locationId;
 if(!locationId)return;
 closeCityRoom();
 openTitleMap();
 if(TITLE_MAP_LOCATIONS.some(v=>v.id===locationId))requestAnimationFrame(()=>openTitleMapLocation(locationId));
}
function returnCityRoomToOffice(){
 // Return to the current character's personal desk, not the old title office.
 // Only the Businessman actually owns the Federal Electric executive office.
 if(!cityRoomSession.dev&&S.characterRoute==='industrialist'){
  const previous=currentCityLocation();
  S.currentLocation={locationId:'factory',roomId:'executive-office'};
  if(previous.locationId!=='factory'){
   const journeyPaid=window.FE_TRAVEL?.recordProvisional?.(previous.locationId,'factory');
   window.FE_HORSE_CUSTODY?.onArrival?.(S,previous.locationId,'factory',!!journeyPaid);
  }
  window.FE_NPC_AI?.syncClock?.();
  save(true);
 }
 closeCityRoom();
 closeTitleMap();
 showTab('desk');
 window.FE_CAREER_SHELL?.refreshDesk?.();
}
function openSelectedTitleDevRoom(){
 const locationId=document.getElementById('titleDevLocationSelect')?.value;
 const roomId=document.getElementById('titleDevRoomSelect')?.value;
 if(locationId)openCityRoom(locationId,roomId,{dev:true,source:'dev'});
}
function initCityRoomUI(){
 const overlay=document.getElementById('cityRoomOverlay');if(!overlay)return;
 const closePlayerRoom=()=>cityRoomSession.dev?closeCityRoom():returnCityRoomToMap();
 document.getElementById('cityRoomClose').onclick=closePlayerRoom;
 document.getElementById('cityRoomReturnMap').onclick=returnCityRoomToMap;
 document.getElementById('cityRoomReturnOffice').onclick=returnCityRoomToOffice;
 const mainMenuButton=document.getElementById('cityRoomMainMenu');if(mainMenuButton)mainMenuButton.onclick=()=>window.FE_CAREER_SHELL?.open?.();
 const buy=document.getElementById('brokerBuy'),sell=document.getElementById('brokerSell');
 if(buy)buy.onclick=()=>brokerPlaceOrder(1);
 if(sell)sell.onclick=()=>brokerPlaceOrder(-1);
 overlay.addEventListener('click',e=>{if(e.target===overlay)closePlayerRoom()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closePlayerRoom()});
}
// Each pastime lives in its actual room. Existing module DOM is reused rather than duplicated.
const localActivityHomes=new Map();
let localActivityOpenId=null;
function restoreLocalVenueActivity(){
 for(const [panel,anchor] of localActivityHomes){
  if(anchor.parentNode)anchor.parentNode.insertBefore(panel,anchor);
  anchor.remove();
  panel.hidden=true;
 }
 localActivityHomes.clear();
 localActivityOpenId=null;
 const host=document.getElementById('cityRoomActivityHost');
 if(host){host.replaceChildren();host.hidden=true}
}
function openLocalVenueActivity(id){
 const v=window.FE_VENUES?.get?.(id);
 if(!v||!window.FE_VENUES.canUse(id)||!v.group||!v.panel||cityRoomSession.dev)return false;
 const panel=document.querySelector('[data-activity-panel="'+v.group+'"][data-activity-name="'+v.panel+'"]');
 const host=document.getElementById('cityRoomActivityHost');
 if(!panel||!host)return false;
 restoreLocalVenueActivity();
 const anchor=document.createComment('Original '+id+' activity position');
 panel.parentNode.insertBefore(anchor,panel);
 localActivityHomes.set(panel,anchor);
 host.appendChild(panel);
 host.hidden=false;panel.hidden=false;
 localActivityOpenId=id;
 // Poker circles share one legacy panel: the local room only exposes its own table.
 panel.querySelectorAll('.poker-circles article').forEach((article,i)=>{
  article.hidden=v.panel==='poker'&&i!==({'working-poker':0,'commerce-poker':1,'embassy-poker':2}[id]);
 });
 if(v.panel==='poker')renderWashington();
 panel.querySelectorAll('[data-activity-close]').forEach(btn=>{
  btn.onclick=event=>{event.stopImmediatePropagation();restoreLocalVenueActivity();window.FE_VENUES?.renderRoomOpportunities?.(currentCityLocation().locationId)};
 });
 window.FE_VENUES.renderRoomOpportunities(currentCityLocation().locationId);
 return true;
}
window.FE_CITY={
 openLocalActivity:openLocalVenueActivity,
 isDevRoom:()=>!!cityRoomSession.dev,
 openRoom:(locationId,roomId)=>openCityRoom(locationId,roomId,{dev:false,source:'game'}),
 closeRoom:returnCityRoomToMap,
 currentLocation:()=>currentCityLocation(),
 listLocations:()=>federalCity()?.listLocations?.()||[],
 refreshRoomPeople:()=>{if(cityRoomSession.locationId){const place=cityLocation(cityRoomSession.locationId);if(place)renderCityRoomPeople(place)}}
};

const TITLE_HOTSPOT_LAYOUT_KEY='federalElectricTitleHotspotsV1';
const TITLE_HOTSPOT_IDS=['titleContinue','titleProfile','titleOptions','titleArchives'];
const titleHotspotDefaults=Object.create(null);
let titleHotspotDrafts=Object.create(null),titleHotspotSelected='titleContinue',titleHotspotGesture=null;

function titleHotspotElement(id){return TITLE_HOTSPOT_IDS.includes(id)?document.getElementById(id):null}
function titleHotspotGeometry(id){
 const el=titleHotspotElement(id),frame=el?.closest('.title-screen-frame');if(!el||!frame)return null;
 if(titleHotspotDrafts[id])return Object.assign({},titleHotspotDrafts[id]);
 const er=el.getBoundingClientRect(),fr=frame.getBoundingClientRect();
 return {left:(er.left-fr.left)/fr.width*100,top:(er.top-fr.top)/fr.height*100,width:er.width/fr.width*100,height:er.height/fr.height*100};
}
function normalizeTitleHotspotGeometry(g){
 const width=clamp(+g.width||2,2,40),height=clamp(+g.height||2,2,25);
 return {left:clamp(+g.left||0,0,100-width),top:clamp(+g.top||0,0,100-height),width,height};
}
function applyTitleHotspotGeometry(id,g){
 const el=titleHotspotElement(id);if(!el||!g)return;
 const n=normalizeTitleHotspotGeometry(g);titleHotspotDrafts[id]=n;
 el.style.left=n.left+'%';el.style.top=n.top+'%';el.style.width=n.width+'%';el.style.height=n.height+'%';el.style.transform='none';
}
function clearTitleHotspotInline(id){
 const el=titleHotspotElement(id);if(!el)return;
 for(const prop of ['left','top','width','height','transform'])el.style.removeProperty(prop);
}
function captureTitleHotspotDefaults(){
 for(const id of TITLE_HOTSPOT_IDS){if(!titleHotspotDefaults[id])titleHotspotDefaults[id]=titleHotspotGeometry(id)}
}
function loadTitleHotspotLayout(){
 captureTitleHotspotDefaults();
 let saved=null;try{saved=JSON.parse(localStorage.getItem(TITLE_HOTSPOT_LAYOUT_KEY)||'null')}catch(e){}
 if(!saved||typeof saved!=='object')return;
 for(const id of TITLE_HOTSPOT_IDS){if(saved[id])applyTitleHotspotGeometry(id,saved[id])}
}
function saveTitleHotspotLayout(){
 const payload={};
 for(const id of TITLE_HOTSPOT_IDS){if(titleHotspotDrafts[id])payload[id]=normalizeTitleHotspotGeometry(titleHotspotDrafts[id])}
 localStorage.setItem(TITLE_HOTSPOT_LAYOUT_KEY,JSON.stringify(payload));
 const out=document.getElementById('titleDevHotspotReadout');if(out)out.dataset.saved='1';
}
function selectTitleHotspot(id){
 if(!TITLE_HOTSPOT_IDS.includes(id))return;
 titleHotspotSelected=id;
 const select=document.getElementById('titleDevHotspotSelect');if(select&&select.value!==id)select.value=id;
 document.querySelectorAll('.title-hotspot').forEach(el=>el.classList.toggle('title-dev-selected-hotspot',el.id===id));
 updateTitleHotspotReadout();
}
function updateTitleHotspotReadout(){
 const out=document.getElementById('titleDevHotspotReadout'),g=titleHotspotGeometry(titleHotspotSelected);if(!out||!g)return;
 out.textContent='L '+g.left.toFixed(2)+' · T '+g.top.toFixed(2)+' · W '+g.width.toFixed(2)+' · H '+g.height.toFixed(2);
}
function adjustTitleHotspot(dx=0,dy=0,dw=0,dh=0){
 const g=titleHotspotGeometry(titleHotspotSelected);if(!g)return;
 applyTitleHotspotGeometry(titleHotspotSelected,{left:g.left+dx,top:g.top+dy,width:g.width+dw,height:g.height+dh});
 updateTitleHotspotReadout();
}
function resetSelectedTitleHotspot(){
 const id=titleHotspotSelected;delete titleHotspotDrafts[id];clearTitleHotspotInline(id);
 updateTitleHotspotReadout();
}
function resetAllTitleHotspots(){
 localStorage.removeItem(TITLE_HOTSPOT_LAYOUT_KEY);
 titleHotspotDrafts=Object.create(null);
 for(const id of TITLE_HOTSPOT_IDS)clearTitleHotspotInline(id);
 updateTitleHotspotReadout();
}
function setTitleHotspotEditMode(on){
 titleDevEditHotspots=!!on;
 const screen=document.getElementById('titleScreen');
 if(screen){screen.classList.toggle('title-dev-edit-hotspots',titleDevEditHotspots);if(titleDevEditHotspots)screen.classList.add('title-dev-show-hotspots')}
 if(titleDevEditHotspots)titleDevShowHotspots=true;
 selectTitleHotspot(titleHotspotSelected);
 updateTitleDevPanel();
}
function initTitleHotspotEditor(){
 loadTitleHotspotLayout();
 for(const id of TITLE_HOTSPOT_IDS){
  const el=titleHotspotElement(id);if(!el)continue;
  if(!el.querySelector('.title-hotspot-resize-handle')){const h=document.createElement('span');h.className='title-hotspot-resize-handle';h.setAttribute('aria-hidden','true');el.appendChild(h)}
  el.addEventListener('pointerdown',e=>{
   if(!titleDevEditHotspots||e.button!==0)return;
   e.preventDefault();e.stopImmediatePropagation();selectTitleHotspot(id);
   const frame=el.closest('.title-screen-frame'),fr=frame.getBoundingClientRect(),g=titleHotspotGeometry(id);if(!g)return;
   titleHotspotGesture={id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,start:g,mode:e.target.closest('.title-hotspot-resize-handle')?'resize':'move',frameW:fr.width,frameH:fr.height};
   el.setPointerCapture(e.pointerId);
  },true);
  el.addEventListener('pointermove',e=>{
   const drag=titleHotspotGesture;if(!drag||drag.id!==id||drag.pointerId!==e.pointerId)return;
   const dx=(e.clientX-drag.startX)/drag.frameW*100,dy=(e.clientY-drag.startY)/drag.frameH*100;
   if(drag.mode==='resize')applyTitleHotspotGeometry(id,{left:drag.start.left,top:drag.start.top,width:drag.start.width+dx,height:drag.start.height+dy});
   else applyTitleHotspotGeometry(id,{left:drag.start.left+dx,top:drag.start.top+dy,width:drag.start.width,height:drag.start.height});
   updateTitleHotspotReadout();e.preventDefault();
  });
  const release=e=>{
   const drag=titleHotspotGesture;if(!drag||drag.id!==id||drag.pointerId!==e.pointerId)return;
   titleHotspotGesture=null;try{el.releasePointerCapture(e.pointerId)}catch(err){}e.preventDefault();e.stopPropagation();
  };
  el.addEventListener('pointerup',release,true);el.addEventListener('pointercancel',release,true);
  el.addEventListener('click',e=>{if(titleDevEditHotspots){e.preventDefault();e.stopImmediatePropagation()}},true);
 }
 selectTitleHotspot(titleHotspotSelected);
}


function titlePlaythroughEnvironmentMode(){
 return titleEnvironmentDevOverride||(S.phase==='night'||S.phase==='report'?'night':'day');
}
function setTitleDevButtonState(id,on,label){
 const button=document.getElementById(id);
 if(!button)return;
 button.textContent=label;
 button.classList.toggle('is-on',!!on);
 button.setAttribute('aria-pressed',on?'true':'false');
}
function updateTitleDevPanel(){
 const mode=titlePlaythroughEnvironmentMode();
 setTitleDevButtonState('titleDevDayNight',titleEnvironmentDevOverride!==null,'Day / Night: '+mode.toUpperCase());
 setTitleDevButtonState('titleDevInfiniteMoney',titleDevInfiniteMoney,'Infinite Money: '+(titleDevInfiniteMoney?'ON':'OFF'));
 setTitleDevButtonState('titleDevUnlockAllRooms',titleDevUnlockAllRooms,'Unlock All Rooms: '+(titleDevUnlockAllRooms?'ON':'OFF'));
 setTitleDevButtonState('titleDevFreezeTime',titleDevFreezeTime,'Freeze Time: '+(titleDevFreezeTime?'ON':'OFF'));
 setTitleDevButtonState('titleDevHotspots',titleDevShowHotspots,'Show Hotspots: '+(titleDevShowHotspots?'ON':'OFF'));
 setTitleDevButtonState('titleDevEditHotspots',titleDevEditHotspots,'Edit Hotspots: '+(titleDevEditHotspots?'ON':'OFF'));
 setTitleDevButtonState('titleDevOutsideNoise',titleDevOutsideNoise,'Outside Noise: '+(titleDevOutsideNoise?'ON':'OFF'));
 updateTitleRadioControls();
 updateTitleHotspotReadout();
 updateTitleDevCityControls();
}
function toggleTitleEnvironmentDev(){
 const current=titlePlaythroughEnvironmentMode();
 titleEnvironmentDevOverride=current==='day'?'night':'day';
 updateTitleEnvironment();
 updateTitleDevPanel();
}
function toggleTitleDevInfiniteMoney(){
 if(!titleDevInfiniteMoney){
  titleDevMoneySnapshot={companyCash:S.companyCash,personalCash:S.personalCash};
  titleDevInfiniteMoney=true;
  S.companyCash=TITLE_DEV_MONEY;
  S.personalCash=TITLE_DEV_MONEY;
 }else{
  if(titleDevMoneySnapshot){
   S.companyCash=titleDevMoneySnapshot.companyCash;
   S.personalCash=titleDevMoneySnapshot.personalCash;
  }
  titleDevInfiniteMoney=false;
  titleDevMoneySnapshot=null;
 }
 render();
 updateTitleDevPanel();
}
// Developer room access grants no NPC permits or permanent entitlements.
function ordinaryPlayerRoomAllowed(locationId,roomId){
 const actor={kind:'player',route:S.characterRoute};
 return !!window.FE_CITY_ACCESS?.canRoom?.(window.FederalElectricCity,actor,locationId,roomId,S.gameDate).ok&&
  (!window.FE_VENUES||window.FE_VENUES.canEnterLocation(locationId))&&
  (!window.FE_PATROL?.travel||window.FE_PATROL.travel(S,locationId).ok);
}
function restoreNormalCityRoomAccess(){
 if(!activeProfileId())return;
 const current=currentCityLocation();
 if(ordinaryPlayerRoomAllowed(current.locationId,current.roomId))return;
 // Public Hillsdale remains accessible to all protagonists in the 1878 setting.
 S.currentLocation={locationId:'hillsdale',roomId:'neighborhood-street'};
 if(cityRoomSession.locationId&&!cityRoomSession.dev)closeCityRoom();
 save(true);
 window.FE_CAREER_SHELL?.refreshDesk?.();
}
function toggleTitleDevUnlockAllRooms(){
 titleDevUnlockAllRooms=!titleDevUnlockAllRooms;
 if(!titleDevUnlockAllRooms)restoreNormalCityRoomAccess();
 if(cityRoomSession.locationId){
  const location=cityLocation(cityRoomSession.locationId);
  if(location)renderCityRoomDirectory(location,cityRoomSession.roomId);
 }
 renderUnpinnedCityDirectory();
 if(titleMapSelectedLocationId)openTitleMapLocation(titleMapSelectedLocationId);
 updateTitleDevPanel();
}
function toggleTitleDevFreezeTime(){
 titleDevFreezeTime=!titleDevFreezeTime;
 updateTitleDevPanel();
}
function toggleTitleDevHotspots(){
 titleDevShowHotspots=!titleDevShowHotspots;
 const screen=document.getElementById('titleScreen');
 if(screen)screen.classList.toggle('title-dev-show-hotspots',titleDevShowHotspots);
 if(!titleDevShowHotspots&&titleDevEditHotspots)setTitleHotspotEditMode(false);
 updateTitleDevPanel();
}
function toggleTitleDevEditHotspots(){setTitleHotspotEditMode(!titleDevEditHotspots)}
function restartTitleCityAmbienceFromDev(){
 if(titleMobileRadioOnly()){stopTitleCityAmbience(false);return}
 const audio=ensureTitleCityAmbience();
 const mode=titleEnvironmentIsDay()?'day':'night';
 const src=mode==='day'?TITLE_DAY_AMBIENCE_SRC:TITLE_NIGHT_AMBIENCE_SRC;
 if(titleCityAmbienceMode!==mode||audio.src!==new URL(src,document.baseURI).href){
  audio.pause();
  titleCityAmbienceMode=mode;
  audio.src=src;
  audio.load();
  try{audio.currentTime=0}catch(e){}
 }
 audio.loop=true;
 audio.muted=false;
 audio.volume=titleCityAmbienceVolume(mode);
 if(titleScreenVisible()&&!S.paused&&titleDevOutsideNoise){
  const p=audio.play();
  if(p&&typeof p.catch==='function')p.catch(()=>{});
 }
}
function toggleTitleDevOutsideNoise(){
 titleDevOutsideNoise=!titleDevOutsideNoise;
 if(titleDevOutsideNoise)restartTitleCityAmbienceFromDev();else stopTitleCityAmbience(false);
 updateTitleDevPanel();
}
function resetTitleDevOverrides(){
 if(!confirm('Reset all developer overrides, including saved title hotspot positions and sizes?'))return;
 if(titleDevInfiniteMoney&&titleDevMoneySnapshot){
  S.companyCash=titleDevMoneySnapshot.companyCash;
  S.personalCash=titleDevMoneySnapshot.personalCash;
 }
 titleDevInfiniteMoney=false;
 titleDevMoneySnapshot=null;
 titleDevUnlockAllRooms=false;
 restoreNormalCityRoomAccess();
 renderUnpinnedCityDirectory();
 titleDevFreezeTime=false;
 titleDevShowHotspots=false;
 titleDevEditHotspots=false;
 titleDevOutsideNoise=true;
 titleRadioAutoTune=true;
 titleEnvironmentDevOverride=null;
 resetAllTitleHotspots();
 const screen=document.getElementById('titleScreen');
 if(screen){screen.classList.remove('title-dev-show-hotspots');screen.classList.remove('title-dev-edit-hotspots')}
 updateTitleEnvironment();
 render();
 updateTitleDevPanel();
}
function initTitleDevPanel(){
 const panel=document.getElementById('titleDevPanel');
 const handle=document.getElementById('titleDevPanelHandle');
 // Once moved out of the retired title, dragging uses the viewport instead.
 const frame=document.documentElement;
 if(!panel||!handle)return;
 let dragId=null,startX=0,startY=0,startLeft=0,startTop=0;
 handle.addEventListener('pointerdown',e=>{
  if(e.button!==0||e.target.closest('button'))return;
  const frameRect=frame.getBoundingClientRect(),panelRect=panel.getBoundingClientRect();
  dragId=e.pointerId;startX=e.clientX;startY=e.clientY;
  startLeft=panelRect.left-frameRect.left;startTop=panelRect.top-frameRect.top;
  panel.style.left=startLeft+'px';panel.style.top=startTop+'px';panel.style.right='auto';panel.style.bottom='auto';
  handle.setPointerCapture(e.pointerId);panel.classList.add('is-dragging');e.preventDefault();
 });
 handle.addEventListener('pointermove',e=>{
  if(dragId!==e.pointerId)return;
  const maxLeft=Math.max(0,frame.clientWidth-panel.offsetWidth);
  const maxTop=Math.max(0,frame.clientHeight-panel.offsetHeight);
  const left=Math.max(0,Math.min(maxLeft,startLeft+e.clientX-startX));
  const top=Math.max(0,Math.min(maxTop,startTop+e.clientY-startY));
  panel.style.left=left+'px';panel.style.top=top+'px';
 });
 const release=e=>{
  if(dragId!==e.pointerId)return;
  dragId=null;panel.classList.remove('is-dragging');
  try{handle.releasePointerCapture(e.pointerId)}catch(err){}
 };
 handle.addEventListener('pointerup',release);
 handle.addEventListener('pointercancel',release);
 document.getElementById('titleDevCollapse')?.addEventListener('click',()=>{
  panel.classList.toggle('is-collapsed');
  const collapsed=panel.classList.contains('is-collapsed');
  document.getElementById('titleDevCollapse').textContent=collapsed?'+':'−';
  document.getElementById('titleDevCollapse').setAttribute('aria-label',collapsed?'Expand developer panel':'Collapse developer panel');
 });
 document.getElementById('titleDevDayNight').onclick=toggleTitleEnvironmentDev;
 document.getElementById('titleDevInfiniteMoney').onclick=toggleTitleDevInfiniteMoney;
 document.getElementById('titleDevUnlockAllRooms').onclick=toggleTitleDevUnlockAllRooms;
 document.getElementById('titleDevFreezeTime').onclick=toggleTitleDevFreezeTime;
 document.getElementById('titleDevHotspots').onclick=toggleTitleDevHotspots;
 document.getElementById('titleDevEditHotspots').onclick=toggleTitleDevEditHotspots;
 titleDevPopulateLocations();
 const titleDevLocationSelect=document.getElementById('titleDevLocationSelect');
 if(titleDevLocationSelect)titleDevLocationSelect.onchange=e=>titleDevPopulateRooms(e.target.value);
 const titleDevGoRoom=document.getElementById('titleDevGoRoom');
 if(titleDevGoRoom)titleDevGoRoom.onclick=openSelectedTitleDevRoom;
 document.getElementById('titleDevHotspotSelect').onchange=e=>selectTitleHotspot(e.target.value);
 document.getElementById('titleDevHotspotUp').onclick=()=>adjustTitleHotspot(0,-.2);
 document.getElementById('titleDevHotspotLeft').onclick=()=>adjustTitleHotspot(-.2,0);
 document.getElementById('titleDevHotspotDown').onclick=()=>adjustTitleHotspot(0,.2);
 document.getElementById('titleDevHotspotRight').onclick=()=>adjustTitleHotspot(.2,0);
 document.getElementById('titleDevHotspotNarrow').onclick=()=>adjustTitleHotspot(0,0,-.2,0);
 document.getElementById('titleDevHotspotWiden').onclick=()=>adjustTitleHotspot(0,0,.2,0);
 document.getElementById('titleDevHotspotShorter').onclick=()=>adjustTitleHotspot(0,0,0,-.2);
 document.getElementById('titleDevHotspotTaller').onclick=()=>adjustTitleHotspot(0,0,0,.2);
 document.getElementById('titleDevHotspotSave').onclick=saveTitleHotspotLayout;
 document.getElementById('titleDevHotspotResetSelected').onclick=resetSelectedTitleHotspot;
 document.getElementById('titleDevOutsideNoise').onclick=toggleTitleDevOutsideNoise;
 document.getElementById('titleDevReset').onclick=resetTitleDevOverrides;
 updateTitleDevPanel();
}
function updateTitleEnvironment(){
 const bg=document.getElementById('titleOfficeBackground');
 if(!bg)return;
 const mode=titlePlaythroughEnvironmentMode();
 const frame=bg.closest('.title-screen-frame');
 if(frame){
  frame.classList.toggle('title-env-day',mode==='day');
  frame.classList.toggle('title-env-night',mode==='night');
 }
 const src=TITLE_OFFICE_IMAGES[mode];
 const modeChanged=bg.dataset.mode!==mode;
 if(modeChanged){
  bg.classList.remove('is-ready');
  bg.dataset.mode=mode;
  bg.onload=()=>bg.classList.add('is-ready');
  bg.src=src;
  bg.alt=mode==='day'?'Washington, D.C. executive office by day':'Washington, D.C. executive office at night';
  if(bg.complete)bg.classList.add('is-ready');
 }else if(bg.complete){
  bg.classList.add('is-ready');
 }
 if(modeChanged){
  setTitleFanOff(mode==='night');
  if(mode==='day'&&!S.paused)startTitleRadioBackgroundFeeds();
  updateTitleRadioAudibility();
 }
 syncTitleCityAmbience();
 updateTitleDevPanel();
}
let titleEnvironmentTimer=null;
function startTitleEnvironment(){
 // Archived office title art must never preload, render or reappear in gameplay.
 if(titleEnvironmentTimer){clearInterval(titleEnvironmentTimer);titleEnvironmentTimer=null}
}
function updateTitleClock(){
 const hour=document.getElementById('titleClockHour');
 const minute=document.getElementById('titleClockMinute');
 const second=document.getElementById('titleClockSecond');
 if(!hour||!minute||!second)return;
 const parts=titleClockFormatter.formatToParts(new Date());
 const values={};
 parts.forEach(p=>{if(p.type==='hour'||p.type==='minute'||p.type==='second')values[p.type]=Number(p.value)});
 const s=values.second||0;
 const m=(values.minute||0)+s/60;
 const h=((values.hour||0)%12)+m/60;
 hour.setAttribute('transform','rotate('+(h*30)+' 50 50)');
 minute.setAttribute('transform','rotate('+(m*6)+' 50 50)');
 second.setAttribute('transform','rotate('+(s*6)+' 50 50)');
}
const TITLE_CLOCK_SOUND_SRC='assets/audio/clock-ticking-trimmed-1m58s.mp3?v=20261004-clock1';
const TITLE_CLOCK_SOUND_VOLUME=.08;
let titleClockAudio=null;
function ensureTitleClockAudio(){
 if(titleClockAudio)return titleClockAudio;
 titleClockAudio=new Audio(TITLE_CLOCK_SOUND_SRC);
 titleClockAudio.preload='auto';
 titleClockAudio.loop=true;
 titleClockAudio.volume=TITLE_CLOCK_SOUND_VOLUME;
 return titleClockAudio;
}
function stopTitleClockAudio(reset=false){
 if(!titleClockAudio)return;
 titleClockAudio.pause();
 if(reset){try{titleClockAudio.currentTime=0}catch(e){}}
}
function syncTitleClockAudio(){
 if(careerMainMenuVisible()||titleMobileRadioOnly()||!titleScreenVisible()||S.paused){stopTitleClockAudio(false);return}
 const audio=ensureTitleClockAudio();
 audio.volume=TITLE_CLOCK_SOUND_VOLUME;
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
let titleClockTimer=null;
function startTitleClock(){
 const numerals=['XII','III','VI','IX'];
 document.querySelectorAll('.title-clock-num').forEach((el,i)=>{if(numerals[i])el.textContent=numerals[i]});
 updateTitleClock();
 syncTitleClockAudio();
 if(titleClockTimer)clearInterval(titleClockTimer);
 titleClockTimer=setInterval(updateTitleClock,250);
}

const TITLE_FAN_SOUND_SRC='assets/audio/hasin2004-fan-sound-247413.mp3?v=20261004-fan1';
const TITLE_FAN_SOUND_VOLUME=.15;
let titleFanAudio=null;
function titleFanIsOff(){
 const fan=document.querySelector('.title-fan-motion');
 return !fan||fan.classList.contains('is-off');
}
function ensureTitleFanAudio(){
 if(titleFanAudio)return titleFanAudio;
 titleFanAudio=new Audio(TITLE_FAN_SOUND_SRC);
 titleFanAudio.preload='auto';
 titleFanAudio.loop=true;
 titleFanAudio.volume=TITLE_FAN_SOUND_VOLUME;
 return titleFanAudio;
}
function stopTitleFanAudio(reset=false){
 if(!titleFanAudio)return;
 titleFanAudio.pause();
 if(reset){try{titleFanAudio.currentTime=0}catch(e){}}
}
function syncTitleFanAudio(){
 if(careerMainMenuVisible()||titleMobileRadioOnly()||!titleScreenVisible()||S.paused||titleFanIsOff()){stopTitleFanAudio(false);return}
 const audio=ensureTitleFanAudio();
 audio.volume=TITLE_FAN_SOUND_VOLUME;
 const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
}
function setTitleFanOff(isOff){
 const fan=document.querySelector('.title-fan-motion');
 const button=$('#titleFanHub');
 if(!fan)return;
 fan.classList.toggle('is-off',!!isOff);
 if(button){
  button.setAttribute('aria-pressed',isOff?'true':'false');
  button.setAttribute('aria-label',isOff?'Turn fan on':'Turn fan off');
 }
 if(isOff)stopTitleFanAudio(true);else syncTitleFanAudio();
}
function toggleTitleFan(){
 const fan=document.querySelector('.title-fan-motion');
 if(!fan)return;
 setTitleFanOff(!fan.classList.contains('is-off'));
}

const titleMapState={scale:1,minScale:1,maxScale:8,x:0,y:0,pointerId:null,lastX:0,lastY:0};
// V2 intentionally restores the approved geographical defaults; stale V1 browser pin
// overrides remain untouched for recovery but must not hide the corrected placements.
const TITLE_MAP_LAYOUT_KEY='federalElectricTitleMapLocationsV2';
function titleMapStorageKey(){return TITLE_MAP_LAYOUT_KEY+':'+(activeProfileId()||'unassigned')}
// The city registry is the single source of truth; missing city.js must not
// silently fall back to six obsolete, geographically incorrect map pins.
const TITLE_MAP_LOCATION_DEFAULTS=window.FederalElectricCity.mapLocations().map(v=>Object.assign({},v));
// Previous V2 defaults were serialized even if a player only renamed one pin.
// A matching old default is not a hand-adjusted placement. Preserve different
// stored coordinates exactly, but let untouched pins adopt the reviewed map.
const TITLE_MAP_OLD_DEFAULTS=Object.freeze({
 whiteHouse:[.434,.454],washingtonAirport:[.305,.664],
 governmentHospital:[.733,.680],georgetownCanal:[.271,.475],
 easternBranchFishing:[.758,.642],star:[.400,.453],
 oldChinatown:[.508,.489],russianTradeHall:[.372,.358],
 commercePoker:[.300,.646],home:[.619,.580],
 fletchersCove:[.184,.402],chainBridgeFishing:[.139,.326],
 potomacFishingBank:[.340,.690],
 hillsdale:[.735,.762],factory:[.615,.383],races:[.811,.492],
 capitolAirport:[.814,.395],universityMaryland:[.762,.080],
 embassyPoker:[.243,.160],washingtonFairgrounds:[.470,.566],
 babcockLake:[.495,.559]
});
// Intermediate, unreleased defaults from this same guide-map alignment pass.
// Profiles are allowed to restore their actual moves, but never re-adopt one
// of these intermediate wrong-source coordinates as if the player dragged it.
const TITLE_MAP_INTERMEDIATE_DEFAULTS=Object.freeze({
 whiteHouse:[854/2048,454/1159],star:[848/2048,403/1159],
 oldChinatown:[1055/2048,480/1159],home:[1213/2048,540/1159],
 fletchersCove:[522/2048,405/1159],races:[1582/2048,340/1159],
 capitolAirport:[1585/2048,296/1159]
});
const TITLE_MAP_LOCATIONS=TITLE_MAP_LOCATION_DEFAULTS.map(v=>Object.assign({},v));
let titleMapPinEdit=false,titleMapPinDrag=null,titleMapSelectedLocationId=null;
let titleMapOpenedFromGame=false;
let titleMapShowNames=false,titleMapCategory='all',titleMapOrigin='all',titleMapSearchQuery='';
const TITLE_MAP_CATEGORY_LABELS=Object.freeze({
 company:'Company & Industry',neighborhood:'Neighborhoods',social:'Clubs & Society',
 sport:'Recreation & Competition',leisure:'Leisure & Outdoors',fair:'Fairgrounds',transport:'Transportation',
 finance:'Financial Offices',education:'Education',residence:'Residences',government:'Government',institution:'Hospitals & Institutions',gaming:'Gambling & Games',underground:'Underground',religious:'Religious Sites',commerce:'Markets & Repairs'
});
// Printed Washington In and Out Guide raster: grid 1-30 / A-R.
function titleMapGridAt(x,y){
 const px=x*2048,py=y*1159;
 if(px<286||px>1778||py<30||py>864)return 'Outside map';
 const col=Math.max(1,Math.min(30,Math.round((px-323)/48.5)+1));
 const row=Math.max(0,Math.min(17,Math.round((py-59)/45.55)));
 return col+'-'+String.fromCharCode(65+row);
}
function titleMapMatchesSearch(location){
 if(!titleMapSearchQuery)return true;
 return [pinDisplayName(location),location.name,location.area,location.id,
  titleMapGridAt(location.x,location.y),String(location.n)]
  .some(v=>String(v||'').toLocaleLowerCase().includes(titleMapSearchQuery));
}
function titleMapMatchesFilters(location){
 return !!location&&(titleMapCategory==='all'||location.category===titleMapCategory)&&
  (titleMapOrigin==='all'||location.origin===titleMapOrigin)&&titleMapMatchesSearch(location);
}
function focusTitleMapDirectoryLocation(id){
 const location=TITLE_MAP_LOCATIONS.find(v=>v.id===id);if(!location)return;
 const viewport=$('#titleMapViewport'),img=$('#titleMapImage');
 if(viewport&&img&&img.naturalWidth){
  const desired=Math.min(titleMapState.maxScale,Math.max(titleMapState.scale,titleMapState.minScale*2));
  // Do not pan to the printed index if the pin has no in-map position.
  if(titleMapGridAt(location.x,location.y)!=='Outside map'&&
   (location.placement!=='unverified'||location.userPlaced)){
   titleMapState.scale=desired;
   titleMapState.x=viewport.clientWidth/2-location.x*img.naturalWidth*desired;
   titleMapState.y=viewport.clientHeight/2-location.y*img.naturalHeight*desired;
   titleMapClamp();titleMapApply();
  }
 }
 openTitleMapLocation(id);
}
function renderTitleMapDirectory(){
 const out=$('#titleMapDirectory'),count=$('#titleMapDirectoryCount');if(!out)return;
 out.replaceChildren();
 const filtered=TITLE_MAP_LOCATIONS.filter(titleMapMatchesFilters).sort((a,b)=>a.n-b.n);
 if(count)count.textContent='('+filtered.length+'/'+TITLE_MAP_LOCATIONS.length+')';
 for(const location of filtered){
  const b=document.createElement('button');b.type='button';
  b.className='title-map-directory-item';
  b.dataset.origin=location.origin;
  const grid=titleMapGridAt(location.x,location.y);
  const reviewed=location.placement==='map-anchored';
  b.textContent=location.n+'. '+pinDisplayName(location)+' · '+grid+
   (reviewed?'':location.userPlaced?' · placed in your profile':location.placement==='area-located'?' · proposed address/area':' · site not established');
  b.title=location.area+(location.evidence?' · '+location.evidence:' · position pending confirmation');
  b.addEventListener('click',()=>focusTitleMapDirectoryLocation(location.id));
  out.appendChild(b);
 }
 if(!filtered.length){const p=document.createElement('p');p.textContent='No locations match these filters.';out.appendChild(p)}
}
function exportTitleMapPins(){
 const profile=String(activeProfileId()||'unassigned');
 const data={
  format:'capital-consequence-map-pins',version:1,profile,
  map:'Washington In and Out Guide (fixed artwork, 2048 × 1159)',grid:'1-30 / A-R',
  locations:TITLE_MAP_LOCATIONS.map(v=>({
   id:v.id,n:v.n,name:pinDisplayName(v),originalName:v.name,origin:v.origin,
   positionStatus:v.placement,grid:titleMapGridAt(v.x,v.y),
   x:+v.x.toFixed(6),y:+v.y.toFixed(6),userPlaced:!!v.userPlaced,evidence:v.evidence||''
  }))
 };
 const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='capital-consequence-map-pins.json';
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function syncTitleMapFilters(){
 const layer=document.getElementById('titleMapMarkers'),show=document.getElementById('titleMapShowNames');
 const select=document.getElementById('titleMapCategory'),origin=document.getElementById('titleMapOrigin');
 if(show){show.checked=titleMapShowNames;show.setAttribute('aria-checked',String(titleMapShowNames))}
 if(select)select.value=titleMapCategory;
 if(origin)origin.value=titleMapOrigin;
 if(!layer)return;
 layer.classList.toggle('show-all-names',titleMapShowNames);
 for(const marker of layer.querySelectorAll('[data-map-location]')){
  const location=TITLE_MAP_LOCATIONS.find(v=>v.id===marker.dataset.mapLocation);
  marker.hidden=!location||(titleMapCategory!=='all'&&location.category!==titleMapCategory)||
   (titleMapOrigin!=='all'&&location.origin!==titleMapOrigin)||!titleMapMatchesSearch(location)||
   ((titleMapGridAt(location.x,location.y)==='Outside map'||
     (location.placement==='unverified'&&!location.userPlaced))&&!titleMapPinEdit);
  marker.classList.toggle('is-selected',!!location&&titleMapSelectedLocationId===location.id);
  marker.classList.toggle('is-priority',!!location&&!!window.FE_MAP_LEADS?.highlighted?.(S,location.id));
 }
 if(titleMapSelectedLocationId&&!TITLE_MAP_LOCATIONS.some(v=>v.id===titleMapSelectedLocationId&&titleMapMatchesFilters(v)))closeTitleMapLocation();
 renderTitleMapDirectory();
}
function initTitleMapFilters(){
 const select=document.getElementById('titleMapCategory'),names=document.getElementById('titleMapShowNames');
 const search=$('#titleMapSearch'),origin=$('#titleMapOrigin');
 if(!select||!names||!search||!origin)return;
 // Filter only the known mapped locations. Empty government category will become
 // available when historically vetted government pins are placed on this map.
 const categories=[...new Set(TITLE_MAP_LOCATIONS.map(v=>v.category))].sort((a,b)=>
  (TITLE_MAP_CATEGORY_LABELS[a]||a).localeCompare(TITLE_MAP_CATEGORY_LABELS[b]||b));
 select.replaceChildren(new Option('All categories','all'));
 for(const category of categories)select.add(new Option(TITLE_MAP_CATEGORY_LABELS[category]||category,category));
 select.onchange=()=>{titleMapCategory=select.value;syncTitleMapFilters()};
 names.onchange=()=>{titleMapShowNames=names.checked;syncTitleMapFilters()};
 origin.onchange=()=>{titleMapOrigin=origin.value;syncTitleMapFilters()};
 search.addEventListener('input',()=>{
  titleMapSearchQuery=search.value.trim().toLocaleLowerCase();
  const directory=$('#titleMapDirectory')?.closest('details');
  if(directory&&titleMapSearchQuery)directory.open=true;
  syncTitleMapFilters();
 });
 syncTitleMapFilters();
}

function loadTitleMapLocationLayout(){
 // Start from fixed defaults so each profile has independent, predictable pin positions.
 TITLE_MAP_LOCATIONS.forEach((location,i)=>{
  location.x=TITLE_MAP_LOCATION_DEFAULTS[i].x;
  location.y=TITLE_MAP_LOCATION_DEFAULTS[i].y;
  location.pinLabel='';
  location.userPlaced=false;
 });
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(titleMapStorageKey())||'null')}catch(e){}
 if(!saved||typeof saved!=='object'){updateTitleMapPinLabels();return}
 for(const location of TITLE_MAP_LOCATIONS){
  const p=saved[location.id];
  if(!p||typeof p!=='object')continue;
  if(Number.isFinite(+p.x)&&Number.isFinite(+p.y)){
   const legacy=TITLE_MAP_OLD_DEFAULTS[location.id];
   const intermediate=TITLE_MAP_INTERMEDIATE_DEFAULTS[location.id];
   const isSamePosition=pair=>!!pair&&
    Math.abs(+p.x-pair[0])<0.000002&&Math.abs(+p.y-pair[1])<0.000002;
   const wasUntouchedOldDefault=isSamePosition(legacy)||isSamePosition(intermediate);
   if(!wasUntouchedOldDefault){
    location.x=Math.max(0,Math.min(1,+p.x));
    location.y=Math.max(0,Math.min(1,+p.y));
    const base=TITLE_MAP_LOCATION_DEFAULTS.find(v=>v.id===location.id);
    location.userPlaced=!!base&&(Math.abs(location.x-base.x)>0.000002||Math.abs(location.y-base.y)>0.000002);
   }
  }
  if(typeof p.label==='string'&&p.label.trim()&&p.label.trim().length<=64)
   location.pinLabel=p.label.trim();
 }
 updateTitleMapPinLabels();
}
function pinDisplayName(location){return location.pinLabel||location.name}
function updateTitleMapPinLabels(){
 for(const location of TITLE_MAP_LOCATIONS){
  const marker=[...document.querySelectorAll('[data-map-location]')].find(e=>e.dataset.mapLocation===location.id);
  if(!marker)continue;
  const label=marker.querySelector('.title-map-marker-label');
  if(label)label.textContent=pinDisplayName(location);
  marker.setAttribute('aria-label',pinDisplayName(location)+' — '+location.area);
 }
 if(titleMapSelectedLocationId){
  const location=TITLE_MAP_LOCATIONS.find(v=>v.id===titleMapSelectedLocationId);
  if(location){const title=$('#titleMapLocationName');if(title)title.textContent=pinDisplayName(location)}
 }
 renderTitleMapDirectory();
}
function saveTitleMapLocationLayout(){
 const saved={};
 for(const location of TITLE_MAP_LOCATIONS)saved[location.id]={x:+location.x.toFixed(6),y:+location.y.toFixed(6),...(location.pinLabel?{label:location.pinLabel}:{})};
 localStorage.setItem(titleMapStorageKey(),JSON.stringify(saved));
}
function resetTitleMapLocationLayout(){
 TITLE_MAP_LOCATIONS.forEach((location,i)=>{
  location.x=TITLE_MAP_LOCATION_DEFAULTS[i].x;
  location.y=TITLE_MAP_LOCATION_DEFAULTS[i].y;
  location.userPlaced=false;
 });
 // Resetting pin positions must not erase the player's saved names.
 saveTitleMapLocationLayout();
 closeTitleMapLocation();
 titleMapPositionMarkers();
 updateTitleMapPinEditor();
}
function updateTitleMapPinEditor(){
 const button=$('#titleMapEditPins'),help=$('#titleMapHelp'),viewer=$('#titleMapViewer');
 if(button){
  button.textContent=titleMapPinEdit?'Done Placing':'Edit Pins';
  button.setAttribute('aria-pressed',titleMapPinEdit?'true':'false');
  button.style.background=titleMapPinEdit?'#6d532e':'';
  button.style.color=titleMapPinEdit?'#fff0bd':'';
 }
 if(viewer)viewer.classList.toggle('is-editing-pins',titleMapPinEdit);
 if(help)help.textContent=titleMapPinEdit?'Drag pin to correct A–R / 1–30 grid position · confirm before saving; cancel restores it':'Mouse wheel to zoom · click and drag to move';
}
function toggleTitleMapPinEditor(){
 titleMapPinEdit=!titleMapPinEdit;
 titleMapPinDrag=null;
 closeTitleMapLocation();
 updateTitleMapPinEditor();
 syncTitleMapFilters();
}

function titleMapApply(){
 const img=$('#titleMapImage');if(!img)return;
 img.style.transform='translate('+titleMapState.x+'px,'+titleMapState.y+'px) scale('+titleMapState.scale+')';
 titleMapPositionMarkers();
}
function titleMapPositionMarkers(){
 const img=$('#titleMapImage'),layer=$('#titleMapMarkers');if(!img||!layer||!img.naturalWidth||!img.naturalHeight)return;
 layer.querySelectorAll('[data-map-location]').forEach(marker=>{
  const location=TITLE_MAP_LOCATIONS.find(v=>v.id===marker.dataset.mapLocation);
  if(!location)return;
  marker.style.left=(titleMapState.x+location.x*img.naturalWidth*titleMapState.scale)+'px';
  marker.style.top=(titleMapState.y+location.y*img.naturalHeight*titleMapState.scale)+'px';
 });
}
function closeTitleMapLocation(){
 const card=$('#titleMapLocationCard');if(card)card.hidden=true;
 titleMapSelectedLocationId=null;
 syncTitleMapFilters();
}
// Preserve a visible explanation for historically locked and undiscovered locations.
function mapTravelRestriction(location){
 if(!activeProfileId())return 'Select a player profile before traveling.';
 if(!location)return 'Unknown destination.';
 const entry=cityLocation(location.id);
 if(!entry)return 'This location has no registered entrance.';
 if(titleDevUnlockAllRooms)return '';
 if(entry.plannedOnly)return 'This location is planned but not yet open.';
 if(entry.availableFrom&&S.gameDate<entry.availableFrom)return 'Not open until '+entry.availableFrom+'.';
 if(entry.availableUntil&&S.gameDate>entry.availableUntil)return 'This historic location no longer exists after '+entry.availableUntil+'.';
 const dutyRestriction=window.FE_PATROL?.travel?.(S,entry.id);
 if(dutyRestriction&&!dutyRestriction.ok)return dutyRestriction.reason;
 if(window.FE_VENUES&&!window.FE_VENUES.canEnterLocation(entry.id))return 'This location is not yet accessible. Discover an invitation or satisfy its entry conditions.';
 return '';
}
function openTitleMapLocation(id){
 const location=TITLE_MAP_LOCATIONS.find(v=>v.id===id),card=$('#titleMapLocationCard');if(!location||!card)return;
 titleMapSelectedLocationId=id;
 syncTitleMapFilters();
 $('#titleMapLocationName').textContent=pinDisplayName(location);
 const nameField=$('#titleMapPinName');
 if(nameField)nameField.value=pinDisplayName(location);
 const nameNotice=$('#titleMapPinNameNotice');if(nameNotice)nameNotice.textContent='Original place: '+location.name;
 $('#titleMapLocationArea').textContent=location.area;
 const grid=$('#titleMapLocationGrid');
 if(grid)grid.textContent='Map grid: '+titleMapGridAt(location.x,location.y)+' · '+
  (location.origin==='historical'?'Historical (red)':'Fictional (blue)')+' · '+
  (location.placement==='map-anchored'?'Map-anchored placement':'Placement not independently verified');
 $('#titleMapLocationDescription').textContent=location.description;
 const reason=mapTravelRestriction(location);
 const journeyNotice=document.getElementById('titleMapTravelNote');
 if(journeyNotice)journeyNotice.textContent=(location.provisional?'PROVISIONAL PIN · historical placement pending. ':'')+(reason||window.FE_TRAVEL?.notice?.(currentCityLocation().locationId,id)||'Travel times not yet surveyed; direct movement is provisional.');
 const travel=$('#titleMapLocationTravel');
 if(travel){
  const alreadyHere=!!activeProfileId()&&currentCityLocation()?.locationId===id;
  travel.hidden=alreadyHere;
  travel.disabled=!!reason||alreadyHere;
  travel.textContent=reason?'Unavailable':alreadyHere?'Already Here':'Go There';
  travel.title=reason;
  travel.dataset.locationId=id;
 }
 card.hidden=false;
}
function renameSelectedTitleMapPin(reset=false){
 const location=TITLE_MAP_LOCATIONS.find(v=>v.id===titleMapSelectedLocationId),field=$('#titleMapPinName');
 if(!location||!field)return false;
 const label=reset?'':field.value.trim();
 if(label.length>64||(!reset&&!label)){
  const notice=$('#titleMapPinNameNotice');if(notice)notice.textContent='Use 1 to 64 characters, or choose Reset Name.';
  return false;
 }
 location.pinLabel=label&&label!==location.name?label:'';
 field.value=pinDisplayName(location);
 saveTitleMapLocationLayout();updateTitleMapPinLabels();
 const notice=$('#titleMapPinNameNotice');if(notice)notice.textContent='Saved for this profile.';
 return true;
}
function travelFromTitleMap(){
 const id=titleMapSelectedLocationId||$('#titleMapLocationTravel')?.dataset.locationId;
 const location=TITLE_MAP_LOCATIONS.find(v=>v.id===id);
 const reason=mapTravelRestriction(location);
 const message=document.getElementById('titleMapTravelNote');
 if(reason){if(message)message.textContent=reason;return false;}
 if(!id||currentCityLocation().locationId===id)return false;
 const reached=openCityRoom(id,null,{dev:false,source:'map'});
 if(reached)window.FE_CAREER_SHELL?.refreshDesk?.();
 else if(message)message.textContent='Travel failed. You remain at your previous location. Try another destination.';
 return reached;
}
function buildTitleMapMarkers(){
 const layer=$('#titleMapMarkers');if(!layer)return;
 layer.innerHTML='';
 for(const location of TITLE_MAP_LOCATIONS){
  const marker=document.createElement('button');
  marker.type='button';
  marker.className='title-map-marker';
  marker.dataset.origin=location.origin;
  marker.classList.toggle('is-unverified',location.placement!=='map-anchored');
  marker.dataset.mapLocation=location.id;
  marker.title=(location.origin==='historical'?'Historical':'Fictional')+' · '+titleMapGridAt(location.x,location.y)+
   (location.placement==='map-anchored'?' · map-anchored':' · location pending verification');
  marker.setAttribute('aria-label',pinDisplayName(location)+' — '+location.area);
  marker.innerHTML='<span class="title-map-marker-pin"><b>'+location.n+'</b></span><span class="title-map-marker-label"></span>';
 marker.querySelector('.title-map-marker-label').textContent=pinDisplayName(location);
  marker.addEventListener('pointerdown',e=>{
   e.stopPropagation();
   if(!titleMapPinEdit||e.button!==0)return;
   titleMapPinDrag={id:location.id,pointerId:e.pointerId,
    before:{x:location.x,y:location.y,userPlaced:!!location.userPlaced}};
   marker.setPointerCapture(e.pointerId);
   marker.style.zIndex='9';
   marker.style.cursor='grabbing';
   e.preventDefault();
  });
  marker.addEventListener('pointermove',e=>{
   if(!titleMapPinDrag||titleMapPinDrag.id!==location.id||titleMapPinDrag.pointerId!==e.pointerId)return;
   const img=$('#titleMapImage'),viewport=$('#titleMapViewport');if(!img||!viewport||!img.naturalWidth)return;
   const rect=viewport.getBoundingClientRect();
   const localX=e.clientX-rect.left,localY=e.clientY-rect.top;
   location.x=Math.max(0,Math.min(1,(localX-titleMapState.x)/(img.naturalWidth*titleMapState.scale)));
   location.y=Math.max(0,Math.min(1,(localY-titleMapState.y)/(img.naturalHeight*titleMapState.scale)));
   location.userPlaced=true;
   titleMapPositionMarkers();
   e.preventDefault();
  });
  const finish=e=>{
   if(!titleMapPinDrag||titleMapPinDrag.id!==location.id||titleMapPinDrag.pointerId!==e.pointerId)return;
   const {before}=titleMapPinDrag;
   try{marker.releasePointerCapture(e.pointerId)}catch(err){}
   marker.style.zIndex='';
   marker.style.cursor='';
   titleMapPinDrag=null;
   const moved=Math.abs(location.x-before.x)>0.0000005||Math.abs(location.y-before.y)>0.0000005;
   const onPrintedMap=titleMapGridAt(location.x,location.y)!=='Outside map';
   // Never persist a drop automatically. The user must check the actual
   // numbered / lettered printed map and explicitly confirm the new place.
   // There is no fictitious "auto-geographic verifier" for invented addresses.
   const approved=e.type==='pointerup'&&moved&&onPrintedMap&&
    confirm('Save pin '+location.n+' · '+pinDisplayName(location)+' at map grid '+
     titleMapGridAt(location.x,location.y)+'? Confirm ONLY if this is the correct location on the printed map and its index.');
   if(!approved){
    location.x=before.x;location.y=before.y;location.userPlaced=before.userPlaced;
    if(moved&&!onPrintedMap)alert('This pin is outside the printed map. Its position was not saved.');
   }else{
    location.userPlaced=true;
    saveTitleMapLocationLayout();
   }
   titleMapPositionMarkers();
   syncTitleMapFilters();
   e.stopPropagation();
  };
  marker.addEventListener('pointerup',finish);
  marker.addEventListener('pointercancel',finish);
  marker.addEventListener('click',e=>{
   e.stopPropagation();
   if(titleMapPinEdit)return;
   openTitleMapLocation(location.id);
  });
  layer.appendChild(marker);
 }
 titleMapPositionMarkers();
 syncTitleMapFilters();
}
function titleMapClamp(){
 const viewport=$('#titleMapViewport'),img=$('#titleMapImage');if(!viewport||!img||!img.naturalWidth||!img.naturalHeight)return;
 const vw=viewport.clientWidth,vh=viewport.clientHeight;
 const w=img.naturalWidth*titleMapState.scale,h=img.naturalHeight*titleMapState.scale;
 titleMapState.x=w<=vw?(vw-w)/2:Math.min(0,Math.max(vw-w,titleMapState.x));
 titleMapState.y=h<=vh?(vh-h)/2:Math.min(0,Math.max(vh-h,titleMapState.y));
}
function titleMapReset(){
 const viewport=$('#titleMapViewport'),img=$('#titleMapImage');if(!viewport||!img||!img.naturalWidth||!img.naturalHeight)return;
 const fit=Math.min(viewport.clientWidth/img.naturalWidth,viewport.clientHeight/img.naturalHeight);
 titleMapState.minScale=fit;
 titleMapState.maxScale=Math.max(fit*12,2);
 titleMapState.scale=fit;
 titleMapState.x=(viewport.clientWidth-img.naturalWidth*fit)/2;
 titleMapState.y=(viewport.clientHeight-img.naturalHeight*fit)/2;
 titleMapApply();
}
function titleMapZoom(factor,clientX,clientY){
 const viewport=$('#titleMapViewport'),img=$('#titleMapImage');if(!viewport||!img||!img.naturalWidth)return;
 const rect=viewport.getBoundingClientRect();
 const localX=Number.isFinite(clientX)?clientX-rect.left:viewport.clientWidth/2;
 const localY=Number.isFinite(clientY)?clientY-rect.top:viewport.clientHeight/2;
 const oldScale=titleMapState.scale;
 const next=Math.max(titleMapState.minScale,Math.min(titleMapState.maxScale,oldScale*factor));
 if(Math.abs(next-oldScale)<1e-7)return;
 const imageX=(localX-titleMapState.x)/oldScale;
 const imageY=(localY-titleMapState.y)/oldScale;
 titleMapState.scale=next;
 titleMapState.x=localX-imageX*next;
 titleMapState.y=localY-imageY*next;
 titleMapClamp();titleMapApply();
}
function openTitleMap(){
 // The map is a standalone overlay. Never reveal or depend on the old title.
 const viewer=$('#titleMapViewer');
 if(!viewer||careerMainMenuVisible())return;
 if(viewer.hidden)titleMapOpenedFromGame=true;
 loadTitleMapLocationLayout();
 renderUnpinnedCityDirectory();
 syncTitleMapFilters();
 const viewport=$('#titleMapViewport'),img=$('#titleMapImage');if(!viewport||!img)return;
 viewer.hidden=false;
 document.body.classList.add('title-map-open');
 const ready=()=>requestAnimationFrame(()=>{titleMapReset();viewport.focus()});
 if(img.complete&&img.naturalWidth)ready();else img.addEventListener('load',ready,{once:true});
}
function closeTitleMap(){
 const viewer=$('#titleMapViewer');if(viewer)viewer.hidden=true;
 titleMapOpenedFromGame=false;
 closeTitleMapLocation();
 document.body.classList.remove('title-map-open');
 titleMapState.pointerId=null;
 const viewport=$('#titleMapViewport');if(viewport)viewport.classList.remove('is-dragging');
}
// The map is not a teleport: closing it away from Federal Electric returns to
// the location where the player is standing, rather than exposing the office.
function closeTitleMapOrReturnToLocation(){
 // Close over the active personal desk or restore the visited city room.
 const restoreGame=titleMapOpenedFromGame;
 closeTitleMap();
 if(!restoreGame||careerMainMenuVisible())return;
 const current=currentCityLocation();
 if(activeProfileId()&&current.locationId!=='factory'){
  const restored=openCityRoom(current.locationId,current.roomId,{dev:false,source:'resume'});
  if(restored)return;
 }
 // This is a career desk, never the retired illustrated office title.
 showTab('desk');
 window.FE_CAREER_SHELL?.refreshDesk?.();
}
function toggleTitleMapShortcut(){
 if(careerMainMenuVisible())return;
 const viewer=$('#titleMapViewer');
 if(!viewer)return;
 if(!viewer.hidden){closeTitleMapOrReturnToLocation();return;}
 const room=$('#cityRoomOverlay');
 if(room&&!room.hidden){
  if(cityRoomSession.dev){closeCityRoom();openTitleMap();}
  else returnCityRoomToMap();
  return;
 }
 openTitleMap();
}
function isMapShortcutTyping(target){
 return !!(target?.closest?.('input, textarea, select, [contenteditable], [role="textbox"]'));
}
function initMapShortcut(){
 document.addEventListener('keydown',event=>{
  if(event.code!=='KeyM'&&String(event.key).toLowerCase()!=='m')return;
  if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||isMapShortcutTyping(event.target))return;
  if(window.FE_PAPER_DOLL?.isOpen?.())return;
  if(!$('#titleDialog')?.hidden||!$('#dailyReportOverlay')?.hidden||!$('#campaignEndOverlay')?.hidden)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  toggleTitleMapShortcut();
 },true);
}
function renderUnpinnedCityDirectory(){
 const out=document.getElementById('titleMapUnpinnedDirectory'),city=federalCity();if(!out||!city)return;
 out.innerHTML='';
 const active=!!activeProfileId(),year=S.gameDate;
 for(const loc of city.listLocations().filter(loc=>!loc.map&&(titleDevUnlockAllRooms||(!loc.plannedOnly&&(!loc.hiddenFromDirectory||window.FE_VENUES?.canEnterLocation?.(loc.id))&&(!loc.availableFrom||year>=loc.availableFrom))))){
  const button=document.createElement('button');button.type='button';button.textContent=loc.name;button.disabled=!active;
  button.title=active?'Visit '+loc.name:'Create or load a profile to visit';
  button.onclick=()=>openCityRoom(loc.id,null,{dev:false,source:'map'});
  out.appendChild(button);
 }
}
let conversationPage=0;
function renderCityRoomPeople(location){
 const panel=document.getElementById('cityRoomPeople'),output=document.getElementById('cityRoomDialogue');
 if(!panel||!output)return;
 panel.innerHTML='';output.innerHTML='';
 for(const npc of location.people||[]){
  const resident=window.FE_NPC_AI?.list?.().find(v=>v.name===npc.name)||null;
  // The authored Chinatown and Russian Hall conversations are unavailable
  // when their scheduled speaker is somewhere else or off duty.
  const physicallyPresent=()=>!resident||!!window.FE_NPC_AI?.visibleAt?.(location.id)?.some(v=>v.id===resident.id);
  if(!physicallyPresent())continue;
  const button=document.createElement('button');button.type='button';button.textContent=npc.name;
  button.onclick=()=>{
   if(!physicallyPresent()){output.textContent=npc.name+' has left this location.';return}
   if(resident){
    const route=S.characterRoute||'industrialist';
    const previous=window.FE_NPC_AI?.inspect?.(resident.id)?.memories||[];
    const metToday=previous.some(m=>m.key==='authored-conversation'&&m.withId===route&&m.date===S.gameDate);
    if(!metToday){
     window.FE_NPC_AI?.recordInteraction?.(resident.id,route,'authored-conversation',0);
     if(Array.isArray(S.notes))S.notes.push({date:displayDate(),text:'Spoke with '+npc.name+' at '+location.name+'.',source:'personal recollection'});
     save(true);
    }
   }
   conversationPage=0;output.innerHTML='';
   const article=document.createElement('article');article.lang=npc.language||'en';
   const paragraph=document.createElement('p');article.appendChild(paragraph);
   const next=document.createElement('button');next.type='button';article.appendChild(next);
   const lines=npc.dialogue||[];
   const draw=()=>{paragraph.textContent=lines[conversationPage]||'';next.textContent=conversationPage+1>=lines.length?'End Conversation':'Continue'};
   next.onclick=()=>{if(conversationPage+1>=lines.length){output.innerHTML='';return}conversationPage++;draw()};
   output.appendChild(article);draw();
   // Reading a paragraph never flags comprehension, records a hint or unlocks a lead.
  };
  panel.appendChild(button);
 }
}
function checkCityOpportunity(locationId){
 if(S.paused||S.phase!=='day'||S.campaignStartYear!==1890)return '';
 const opportunities=[
  {id:'russian-messenger-1890',location:'races',turn:3,earliest:1800,customer:'Volga Trade Delegation',text:'A visiting Russian merchant’s courier has arrived with a request for electric lamps.'},
  {id:'chinese-merchant-1890',location:'commercePoker',turn:4,earliest:1800,customer:'District Lantern Merchants',text:'A Chinese-American merchant is seeking a lighting supplier before departing.'}
 ];
 const event=opportunities.find(v=>v.location===locationId&&v.turn===S.turnSerial&&window.FE_WASHINGTON_TIME.available(S)>=v.earliest);
 if(!event||S.cityOpportunities?.includes(event.id))return '';
 if(!Array.isArray(S.cityOpportunities))S.cityOpportunities=[];
 S.cityOpportunities.push(event.id);
 const offer=makeContractOffer();offer.id='FE-'+String(nextContractNumber()+100).padStart(3,'0');
 offer.customer=event.customer;offer.relationship='Introduced in person';offer.customerTrait='balanced';
 S.contractOffers.push(offer);
 S.notes.push({date:displayDate(),source:'business introduction',text:event.text+' An offer was left with the Contracts Department.'});
 save(true);
 return event.text+' A new offer is waiting in Contracts.';
}
function initTitleMapViewer(){
 const open=$('#titleDcMap'),viewer=$('#titleMapViewer'),viewport=$('#titleMapViewport');
 if(!open||!viewer||!viewport)return;
 initMapShortcut();
 loadTitleMapLocationLayout();
 buildTitleMapMarkers();
 initTitleMapFilters();
 updateTitleMapPinEditor();
 open.onclick=openTitleMap;
 $('#titleMapClose').onclick=closeTitleMapOrReturnToLocation;
 $('#titleMapLocationClose').onclick=closeTitleMapLocation;
 $('#titleMapLocationTravel').onclick=travelFromTitleMap;
 $('#titleMapExportPins').onclick=exportTitleMapPins;
 // The location card contains a text field. Stop its pointerdown from reaching
 // the viewport's existing pan capture; leave the map pan/zoom code unchanged.
 $('#titleMapLocationCard').addEventListener('pointerdown',e=>e.stopPropagation());
 const rename=$('#titleMapPinRename'),resetName=$('#titleMapPinResetName'),name=$('#titleMapPinName');
 if(rename)rename.onclick=()=>renameSelectedTitleMapPin();
 if(resetName)resetName.onclick=()=>renameSelectedTitleMapPin(true);
 if(name)name.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();renameSelectedTitleMapPin()}});
 $('#titleMapEditPins').onclick=toggleTitleMapPinEditor;
 $('#titleMapResetPins').onclick=()=>{if(confirm('Reset all '+TITLE_MAP_LOCATIONS.length+' map pins to their agreed default locations for this profile?'))resetTitleMapLocationLayout()};
 $('#titleMapReset').onclick=()=>{closeTitleMapLocation();titleMapReset()};
 $('#titleMapZoomIn').onclick=()=>titleMapZoom(1.4);
 $('#titleMapZoomOut').onclick=()=>titleMapZoom(1/1.4);
 viewer.addEventListener('click',e=>{if(e.target===viewer)closeTitleMapOrReturnToLocation()});
 viewport.addEventListener('click',e=>{if(e.target===viewport)closeTitleMapLocation()});
 viewport.addEventListener('wheel',e=>{e.preventDefault();titleMapZoom(Math.exp(-e.deltaY*.0015),e.clientX,e.clientY)},{passive:false});
 viewport.addEventListener('dblclick',e=>{e.preventDefault();titleMapZoom(1.75,e.clientX,e.clientY)});
 viewport.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  titleMapState.pointerId=e.pointerId;titleMapState.lastX=e.clientX;titleMapState.lastY=e.clientY;
  viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-dragging');e.preventDefault();
 });
 viewport.addEventListener('pointermove',e=>{
  if(titleMapState.pointerId!==e.pointerId)return;
  titleMapState.x+=e.clientX-titleMapState.lastX;titleMapState.y+=e.clientY-titleMapState.lastY;
  titleMapState.lastX=e.clientX;titleMapState.lastY=e.clientY;
  titleMapClamp();titleMapApply();
 });
 const release=e=>{
  if(titleMapState.pointerId!==e.pointerId)return;
  titleMapState.pointerId=null;viewport.classList.remove('is-dragging');
  try{viewport.releasePointerCapture(e.pointerId)}catch(err){}
 };
 viewport.addEventListener('pointerup',release);
 viewport.addEventListener('pointercancel',release);
 viewport.addEventListener('keydown',e=>{
  if(e.key==='+'||e.key==='='){e.preventDefault();titleMapZoom(1.4)}
  else if(e.key==='-'||e.key==='_'){e.preventDefault();titleMapZoom(1/1.4)}
  else if(e.key==='0'){e.preventDefault();titleMapReset()}
  else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
   e.preventDefault();const step=60;
   if(e.key==='ArrowLeft')titleMapState.x+=step;
   if(e.key==='ArrowRight')titleMapState.x-=step;
   if(e.key==='ArrowUp')titleMapState.y+=step;
   if(e.key==='ArrowDown')titleMapState.y-=step;
   titleMapClamp();titleMapApply();
  }
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!viewer.hidden)closeTitleMapOrReturnToLocation()});
 window.addEventListener('resize',()=>{if(!viewer.hidden)titleMapReset()});
}

function initTitleScreen(){
 const screen=$('#titleScreen');if(!screen)return;
 screen.hidden=true;
 titleRadioStationIndex=0;titleRadioTrackIndex=0;titleRadioOff=false;titleRadioLocationContext='title';
 startTitleEnvironment();
 startTitleClock();
 preloadTitleNewspaperRustles();
 preloadTitleFilingCabinetOpen();
 titleRadioAirStartAt=Date.now();
 startTitleRadioBackgroundFeeds();
 loadTitleRadioTrack(false);
 setRadioLocationContext('title',true);
 updateTitleRadioControls();
 startTitleRadio();
 initTitleMapViewer();
 screen.addEventListener('pointerdown',startTitleRadio,{once:true});
 document.addEventListener('keydown',startTitleRadio,{once:true});
 screen.addEventListener('pointerdown',startTitleRadioBackgroundFeeds,{once:true});
 document.addEventListener('keydown',startTitleRadioBackgroundFeeds,{once:true});
 screen.addEventListener('pointerdown',syncTitleCityAmbience);
 document.addEventListener('keydown',syncTitleCityAmbience);
 screen.addEventListener('pointerdown',syncTitleFanAudio,{once:true});
 document.addEventListener('keydown',syncTitleFanAudio,{once:true});
 screen.addEventListener('pointerdown',syncTitleClockAudio,{once:true});
 document.addEventListener('keydown',syncTitleClockAudio,{once:true});
 const titleCabinetButtons=[$('#titleContinue'),$('#titleProfile'),$('#titleOptions'),$('#titleArchives')].filter(Boolean);
 titleCabinetButtons.forEach(button=>button.addEventListener('pointerdown',playTitleFilingCabinetOpen));
 initTitleHotspotEditor();
 initCityRoomUI();
 initTitleDevPanel();
 initGlobalRadioDrag();
 prewarmHeavyTitleRadioOnDesktop();
 $('#titleContinue').onclick=continueFromTitle;
 $('#titleProfile').onclick=()=>renderProfileManager();
 $('#titleOptions').onclick=()=>openTitleDialog('Options','<p>Options have not been defined yet. This drawer is reserved for future game and presentation options.</p><div class="title-dialog-actions"><button id="optionsClose" type="button">Close</button></div>');
 $('#titleArchives').onclick=renderTitleArchives;
 const titleRadioKnob=$('#titleRadioKnob');
 titleRadioKnob.addEventListener('pointerdown',cycleTitleRadioStation);
 titleRadioKnob.addEventListener('click',e=>{if(e.detail===0)cycleTitleRadioStation()});
 const globalRadioPrev=$('#globalRadioPrev'),globalRadioNext=$('#globalRadioNext'),globalRadioPower=$('#globalRadioPower'),globalRadioVolumeUp=$('#globalRadioVolumeUp'),globalRadioVolumeDown=$('#globalRadioVolumeDown');
 if(globalRadioPrev)globalRadioPrev.onclick=()=>cycleTitleRadioStation(-1);
 if(globalRadioNext)globalRadioNext.onclick=()=>cycleTitleRadioStation(1);
 if(globalRadioVolumeUp)globalRadioVolumeUp.onclick=()=>setTitleRadioVolumePercent(titleRadioVolumePercent+5);
 if(globalRadioVolumeDown)globalRadioVolumeDown.onclick=()=>setTitleRadioVolumePercent(titleRadioVolumePercent-5);
 if(globalRadioPower)globalRadioPower.onclick=toggleTitleRadioPower;
 const titleNewspaperButton=$('#titleNewspaperM');
 titleNewspaperButton.addEventListener('pointerdown',primeTitleNewspaperRustle);
 titleNewspaperButton.onclick=openTitleNewspaper;
 $('#titleFanHub').onclick=toggleTitleFan;
 $('#titleDialogClose').onclick=closeTitleDialog;
 screen.addEventListener('click',e=>{if(e.target.id==='titleDialog')closeTitleDialog()});
 document.addEventListener('click',e=>{if(e.target?.id==='optionsClose')closeTitleDialog()});
}
bootstrapProfiles();
loadInitial();render();initTitleScreen();
marketTimer=setInterval(()=>{if(!document.hidden&&!S.paused&&!titleDevFreezeTime&&!titleScreenBlocksSimulation()&&businessOpen()){moveMarket()}},MARKET_TICK_MS);
clockTimer=setInterval(()=>{if(document.hidden||S.phase==='report'||S.paused||titleDevFreezeTime||titleScreenBlocksSimulation())return;advanceWorldSimulation(1,false,'tick');$('#dayClock').textContent=clockText();$('#businessDate').textContent=displayHeaderDate()+' · '+displayHeaderTurn()},1000);
autosaveTimer=setInterval(()=>save(true),5000);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)save(true);
 else{
  updateTitleEnvironment();
  startTitleRadioBackgroundFeeds();
  updateTitleRadioAudibility();
  if(!titleRadioOff&&titleRadioStationIndex===0)startTitleRadio();
 }
});
window.addEventListener('pagehide',()=>save(true));
(()=>{
 const stamp=document.getElementById('confidentialStamp');
 const elephant=document.getElementById('bannerElephant');
 if(!stamp||!elephant)return;

 const knocks=[];
 let shockMode=false,overlay=null,rod=null,lastX=innerWidth*.72,lastY=70;
 const asset='assets/artwork/effects/elephant-shock-easter-egg.gif?v=20261003-shockrod1';

 function ensureRod(){
  if(rod)return rod;
  rod=document.createElement('div');
  rod.className='shock-rod-cursor';
  rod.setAttribute('aria-hidden','true');
  rod.innerHTML='<span class="shock-rod-handle"></span><span class="shock-rod-shaft"></span><span class="shock-rod-tip"></span><span class="shock-rod-bolt">⚡</span>';
  document.body.appendChild(rod);
  return rod;
 }
 function moveRod(x,y){
  lastX=x;lastY=y;
  const r=ensureRod();r.style.left=x+'px';r.style.top=y+'px';
 }
 function armShock(x,y){
  shockMode=true;
  document.body.classList.add('shock-mode');
  moveRod(Number.isFinite(x)?x:lastX,Number.isFinite(y)?y:lastY);
 }
 function disarmShock(){
  shockMode=false;
  document.body.classList.remove('shock-mode');
 }

 function closeEgg(){
  if(!overlay)return;
  overlay.hidden=true;
  document.body.classList.remove('elephant-easter-egg-open');
  const img=overlay.querySelector('img');
  if(img)img.removeAttribute('src');
 }
 function openEgg(){
  if(!overlay){
   overlay=document.createElement('div');
   overlay.className='elephant-easter-egg';
   overlay.hidden=true;
   overlay.setAttribute('role','dialog');
   overlay.setAttribute('aria-modal','true');
   overlay.setAttribute('aria-label','Federal Electric secret animation');
   overlay.innerHTML='<img alt=""><button class="elephant-easter-egg-close" type="button" aria-label="Close">×</button>';
   document.body.appendChild(overlay);
   overlay.querySelector('.elephant-easter-egg-close').addEventListener('click',closeEgg);
  }
  const img=overlay.querySelector('img');
  img.removeAttribute('src');
  img.src=asset+'&play='+Date.now();
  overlay.hidden=false;
  document.body.classList.add('elephant-easter-egg-open');
  overlay.querySelector('.elephant-easter-egg-close').focus();
 }

 stamp.addEventListener('click',e=>{
  const now=Date.now();
  knocks.push(now);
  while(knocks.length&&now-knocks[0]>5000)knocks.shift();
  if(knocks.length>=6){
   knocks.length=0;
   armShock(e.clientX,e.clientY);
  }
 });

 window.addEventListener('pointermove',e=>{if(shockMode)moveRod(e.clientX,e.clientY)},{passive:true});
 window.addEventListener('pointerdown',e=>{if(shockMode)moveRod(e.clientX,e.clientY)},{passive:true});

 elephant.addEventListener('pointerdown',e=>{
  if(!shockMode)return;
  e.preventDefault();e.stopPropagation();
  moveRod(e.clientX,e.clientY);
  elephant.classList.add('is-shocked');
  disarmShock();
  setTimeout(()=>{
   elephant.classList.remove('is-shocked');
   openEgg();
  },650);
 });

 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&shockMode){knocks.length=0;disarmShock();}
 });
})();;