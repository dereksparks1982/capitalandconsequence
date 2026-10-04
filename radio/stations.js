/* Federal Electric fictional radio lineup.
   Audio sources may be repo-local or remotely hosted. */
(function(){
 'use strict';
 window.FEDERAL_RADIO_STATIONS=[
  {
   id:'federal-electric',
   stationNumber:1,
   dial:'610 AM',
   name:'Federal Electric Network',
   format:'Federal Electric theme',
   restartOnTune:true,
   restartOnPower:true,
   clock:[
    {id:'federal-theme',src:'assets/audio/sunflower-slow-drag.ogg?v=20261003-title2',loop:true}
   ]
  },
  {
   id:'capital-signal',
   stationNumber:2,
   dial:'540 AM',
   name:'Capital Signal',
   format:'Experimental signal',
   restartOnTune:false,
   clock:[
    {id:'day-static',src:'assets/audio/radio-static-station.mp3?v=20261004-radio1',loop:true}
   ],
   /* Night currently uses the same carrier. Replace this clock with the
      planned Morse-code program when that asset is ready. */
   nightClock:[
    {id:'night-carrier',src:'assets/audio/radio-static-station.mp3?v=20261004-radio1',loop:true}
   ]
  },
  {
   id:'capital-radio-theatre',
   stationNumber:3,
   dial:'720 AM',
   name:'Capital Radio Theatre',
   format:'Drama & talk',
   restartOnTune:false,
   clock:[
    {
     id:'war-of-the-worlds',
     src:'https://archive.org/download/OrsonWelles-MercuryTheater-1938Recordings/MercuryTheater38-10-30WarOfTheWorlds.mp3',
     duration:3084.552,
     loop:true
    }
   ]
  }
 ];
})();