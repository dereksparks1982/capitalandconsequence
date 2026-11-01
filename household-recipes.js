/* Learnable period-style home cooking and bakery recipe book.
 * Every listed ingredient is a real purchasable catalog SKU. Recipe names
 * and cooking durations are fictional game-balance choices for Washington.
 */
(function(root){'use strict';
const BOOKS=Object.freeze([
 {id:'household-cookery',name:'The Practical Household Cook',cents:35,minutes:50,kind:'cooking'},
 {id:'bakers-manual',name:'Washington Baker’s Handbook',cents:80,minutes:85,kind:'baking'},
 {id:'pastry-manual',name:'The Pastry Cook’s Companion',cents:95,minutes:90,kind:'baking'},
 {id:'french-cookery',name:'French Cookery and Fine Bread',cents:110,minutes:100,kind:'baking'},
 {id:'southern-cookery',name:'Southern Cookery',cents:50,minutes:75,kind:'cooking'},
 {id:'chinese-cookery',name:'Chinese Household Cookery',cents:75,minutes:90,kind:'cooking'},
 {id:'confectionery',name:'The Confectioner’s Manual',cents:100,minutes:100,kind:'baking'},
 {id:'commercial-baking',name:'Commercial Baking and Production',cents:150,minutes:120,kind:'baking'}
].map(Object.freeze));
const RECIPES=[],ids=new Set();
function add(id,name,minutes,servings,ingredients,book=null,kind='cooking',difficulty=15){
 if(ids.has(id))throw Error('Duplicate recipe '+id);ids.add(id);
 RECIPES.push(Object.freeze({id,name,minutes,servings,ingredients:Object.freeze({...ingredients}),
  book,kind,difficulty}));
}
add('bread-and-butter','Bread and butter',3,1,{bread:1,butter:1});
add('fried-eggs','Fried eggs',10,1,{eggs:2,lard:1});
add('boiled-eggs','Boiled eggs',9,1,{eggs:2});
add('fried-potatoes','Fried potatoes',20,2,{potatoes:3,lard:1,salt:1});
add('oat-porridge','Oat porridge',18,2,{oatmeal:2,milk:1});
add('milk-rice','Rice pudding',30,3,{rice:2,milk:2,sugar:1},'household-cookery');
add('bacon-and-eggs','Bacon and eggs',15,1,{bacon:2,eggs:2});
add('cabbage-broth','Cabbage broth',38,3,{cabbage:1,onions:1,salt:1});
add('beef-stew','Beef and potato stew',90,4,{'stew-beef':3,potatoes:4,onions:2,carrots:2,salt:1},'household-cookery');
add('mutton-stew','Mutton hot pot',80,4,{mutton:3,potatoes:4,onions:2,salt:1},'household-cookery');
add('chicken-soup','Chicken vegetable soup',68,4,{'whole-chicken':1,carrots:2,onions:1,celery:1},'household-cookery');
add('pea-soup','Split pea soup',60,4,{'split-peas':3,onions:1,carrots:2,salt:1},'household-cookery');
add('bean-pot','Slow-cooked beans',95,5,{'dried-beans':3,onions:2,'salt-pork':2},'southern-cookery');
add('fried-catfish','Fried catfish',32,2,{catfish:2,cornmeal:2,lard:1},'southern-cookery');
add('turnip-mash','Mashed turnips',25,3,{turnips:3,butter:1,salt:1},'household-cookery');
add('potato-mash','Mashed potatoes',25,3,{potatoes:4,butter:1,milk:1});
add('roast-chicken','Sunday roast chicken',100,5,{'whole-chicken':1,potatoes:3,carrots:2,'dried-rosemary':1},'household-cookery');
add('rabbit-pie','Rabbit pie',85,4,{rabbit:1,'wheat-flour':2,butter:2,onions:1},'household-cookery');
add('corn-chowder','Corn chowder',48,4,{corn:4,milk:2,potatoes:2},'southern-cookery');
add('greens-and-ham','Ham and greens',35,3,{ham:2,collards:3,onions:1},'southern-cookery');
add('steamed-rice','Steamed rice',25,3,{rice:3});
add('fried-rice','Egg fried rice',25,3,{rice:3,eggs:2,'soy-sauce':1},'chinese-cookery');
add('noodle-soup','Wheat noodle soup',35,3,{'wheat-noodles':3,'bok-choy':2,'soy-sauce':1},'chinese-cookery');
add('steamed-buns','Steamed buns',80,6,{'wheat-flour':3,'brewers-yeast':1,sugar:1},'chinese-cookery');
add('vegetable-dumplings','Vegetable dumplings',55,4,{'wheat-flour':3,'chinese-cabbage':2,'ginger-root':1},'chinese-cookery');
add('meat-dumplings','Pork dumplings',65,4,{'wheat-flour':3,'pork-belly':2,'ginger-root':1},'chinese-cookery');
add('buckwheat-pancakes','Buckwheat pancakes',35,4,{'buckwheat-flour':3,milk:2,eggs:2},'household-cookery');
add('biscuits-butter','Baking powder biscuits',35,8,{'wheat-flour':4,'baking-powder':1,butter:2,milk:2},'bakers-manual','baking',15);
add('cornbread-baked','Cast-iron cornbread',40,8,{cornmeal:4,buttermilk:2,eggs:2,lard:1},'southern-cookery','baking',18);
add('white-loaf','White sandwich loaf',160,2,{'wheat-flour':5,'brewers-yeast':1,salt:1},'bakers-manual','baking',18);
add('rye-loaf','Rye bread loaf',180,2,{'rye-flour':4,'wheat-flour':2,'brewers-yeast':1,salt:1},'bakers-manual','baking',24);
add('wholemeal-loaf','Wholemeal bread loaf',160,2,{'whole-wheat-flour':5,'brewers-yeast':1,salt:1},'bakers-manual','baking',23);
add('sourdough-loaf','Sourdough country loaf',240,2,{'wheat-flour':5,'sourdough-starter':2,salt:1},'bakers-manual','baking',36);
add('french-bread','French bread',180,2,{'wheat-flour':5,'brewers-yeast':1,salt:1},'french-cookery','baking',28);
add('brioche','Butter brioche',185,6,{'wheat-flour':5,butter:3,eggs:3,'brewers-yeast':1,sugar:2},'french-cookery','baking',42);
add('dinner-rolls','Soft dinner rolls',135,8,{'wheat-flour':4,'brewers-yeast':1,butter:2,milk:2},'bakers-manual','baking',19);
add('pretzels','Soft pretzels',100,6,{'wheat-flour':4,'brewers-yeast':1,salt:1,'baking-soda':1},'bakers-manual','baking',30);
add('bagels','Boiled breakfast rings',160,6,{'wheat-flour':5,'brewers-yeast':1,sugar:1},'bakers-manual','baking',34);
add('apple-pie','Apple pie',85,6,{apples:4,'wheat-flour':3,butter:2,sugar:2,cinnamon:1},'pastry-manual','baking',25);
add('peach-pie','Peach pie',80,6,{peaches:4,'wheat-flour':3,butter:2,sugar:2},'pastry-manual','baking',27);
add('cherry-pie','Cherry pie',82,6,{cherries:5,'wheat-flour':3,butter:2,sugar:2},'pastry-manual','baking',30);
add('pumpkin-pie','Pumpkin pie',94,6,{pumpkin:1,'wheat-flour':3,eggs:2,milk:2,sugar:2},'pastry-manual','baking',28);
add('blackberry-pie','Blackberry pie',76,6,{blackberries:5,'wheat-flour':3,butter:2,sugar:2},'pastry-manual','baking',28);
add('meat-pie','Savory beef pie',85,6,{'stew-beef':3,'wheat-flour':3,butter:2,onions:1},'pastry-manual','baking',26);
add('apple-turnovers','Apple turnovers',65,6,{apples:3,'wheat-flour':3,butter:2,sugar:2},'pastry-manual','baking',31);
add('currant-buns','Currant buns',120,8,{'wheat-flour':4,currants:3,milk:2,'brewers-yeast':1},'bakers-manual','baking',22);
add('cinnamon-rolls','Cinnamon rolls',130,8,{'wheat-flour':4,butter:2,cinnamon:1,'brown-sugar':2,'brewers-yeast':1},'bakers-manual','baking',33);
add('shortbread','Scottish shortbread',55,10,{'wheat-flour':4,butter:4,sugar:2},'pastry-manual','baking',20);
add('gingerbread','Gingerbread cake',68,8,{'wheat-flour':4,molasses:2,ginger:1,'baking-soda':1},'pastry-manual','baking',27);
add('pound-cake','Rich pound cake',90,8,{'wheat-flour':4,eggs:4,butter:4,sugar:4},'pastry-manual','baking',29);
add('sponge-cake','Sponge cake',80,8,{'wheat-flour':3,eggs:5,sugar:3},'pastry-manual','baking',30);
add('chocolate-cake','Chocolate layer cake',100,8,{'wheat-flour':4,eggs:3,butter:3,cocoa:2,sugar:3},'pastry-manual','baking',39);
add('fruitcake','Fruitcake',115,12,{'wheat-flour':4,currants:4,raisins:3,eggs:4,butter:3},'pastry-manual','baking',38);
add('lemon-cake','Lemon cake',84,8,{'wheat-flour':4,lemons:2,sugar:4,eggs:3},'pastry-manual','baking',31);
add('custard-tart','Baked custard tart',65,6,{'wheat-flour':3,eggs:3,milk:2,sugar:2},'pastry-manual','baking',28);
add('cream-puffs','Cream puffs',90,8,{'wheat-flour':3,eggs:3,cream:2,butter:2},'french-cookery','baking',44);
add('eclairs','Chocolate éclairs',105,6,{'wheat-flour':3,eggs:3,cream:2,chocolate:2,butter:2},'french-cookery','baking',50);
add('croissants','Butter croissants',215,8,{'wheat-flour':5,butter:5,'brewers-yeast':1,milk:2},'french-cookery','baking',58);
add('danish-pastries','Fruit pastries',195,8,{'wheat-flour':5,butter:4,jam:2,'brewers-yeast':1},'french-cookery','baking',46);
add('macarons','Almond macaroons',80,12,{almonds:4,eggs:3,sugar:4},'french-cookery','baking',60);
add('sugar-cookies','Sugar cookies',45,12,{'wheat-flour':4,butter:2,sugar:3,eggs:2},'confectionery','baking',17);
add('gingersnaps','Gingersnap biscuits',50,12,{'wheat-flour':4,ginger:2,molasses:2,butter:2},'confectionery','baking',22);
add('oat-cookies','Oat cookies',50,12,{oatmeal:4,butter:2,eggs:2,sugar:2},'confectionery','baking',23);
add('jam-biscuits','Jam biscuits',55,12,{'wheat-flour':4,butter:2,jam:2},'confectionery','baking',27);
add('chocolate-biscuits','Chocolate biscuits',56,12,{'wheat-flour':4,cocoa:2,butter:2,sugar:2},'confectionery','baking',26);
add('caramels','Wrapped caramels',55,12,{sugar:4,cream:2,butter:2},'confectionery','baking',38);
add('fudge','Chocolate fudge',58,10,{chocolate:3,sugar:4,cream:2},'confectionery','baking',40);
add('peanut-brittle','Peanut brittle',45,12,{peanuts:3,sugar:4,butter:1},'confectionery','baking',39);
add('sugared-almonds','Sugared almonds',38,12,{almonds:3,sugar:4},'confectionery','baking',23);
add('honey-candy','Honey candy',45,12,{honey:4,sugar:2},'confectionery','baking',25);
add('wedding-cake','Three-layer wedding cake',180,18,{'wheat-flour':7,eggs:8,butter:7,sugar:7,'powdered-sugar':5},'commercial-baking','baking',65);
add('bakery-bread-batch','Commercial white-loaf batch',210,12,{'wheat-flour':24,'brewers-yeast':4,salt:3},'commercial-baking','baking',42);
add('bakery-roll-batch','Commercial dinner-roll batch',180,24,{'wheat-flour':20,butter:6,milk:8,'brewers-yeast':4},'commercial-baking','baking',46);
add('bakery-pie-batch','Commercial apple-pie batch',185,24,{apples:16,'wheat-flour':12,butter:8,sugar:8},'commercial-baking','baking',48);
add('bakery-cookies','Commercial biscuit batch',130,48,{'wheat-flour':15,butter:8,sugar:10,eggs:6},'commercial-baking','baking',38);
const api=Object.freeze({BOOKS,RECIPES:Object.freeze(RECIPES),byId:Object.freeze(Object.fromEntries(RECIPES.map(x=>[x.id,x]))),
 bookById:Object.freeze(Object.fromEntries(BOOKS.map(x=>[x.id,x])))});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_RECIPES=api;
})(typeof window!=='undefined'?window:globalThis);
