/* Capital & Consequence household food catalog. Fictional 1878 prices for
 * game balance. The market ledger, shopping bag, kitchen and delivery
 * service all reference the same SKU; no second currency or item registry.
 * Each unit is the recipe unit: eggs (individual), milk (quart), etc. */
(function(root){'use strict';
const items=[],known=new Set();
function add(section,storage,vendor,rows,opts={}){
 for(const row of rows){
  const [id,label,cents,units=1,days=10]=row;
  if(known.has(id))throw Error('Duplicate food catalog ID '+id);
  if(!Number.isSafeInteger(cents)||cents<1||units<1)throw Error('Bad food price/units '+id);
  known.add(id);
  items.push(Object.freeze({id,label,cents,units,section,storage,vendor,
   shelfDays:days,perishable:days<=10,markets:opts.markets||'general'}));
 }
}
add('Bread & grain','pantry','bakery',[
 ['bread','Bread loaf',5,1,3],['white-bread','White bread',6,1,3],['rye-bread','Rye bread',7,1,4],
 ['wholemeal-bread','Wholemeal bread',6,1,4],['cornbread','Cornbread',5,1,3],['rolls','Dinner rolls',8,6,3],
 ['biscuits','Baking biscuits',7,6,3],['oatmeal','Rolled oats',14,8,180],['wheat-flour','White wheat flour',15,8,180],
 ['whole-wheat-flour','Whole wheat flour',17,8,150],['rye-flour','Rye flour',16,8,150],
 ['cornmeal','Cornmeal',12,8,150],['buckwheat-flour','Buckwheat flour',18,8,150],
 ['rice','Rice',20,8,210],['barley','Pearl barley',14,8,210],['oats','Whole oats',12,8,180],
 ['beans-grains','Beans, oats and flour',45,8,120],['dried-pasta','Dried macaroni',12,6,150],
 ['breadcrumbs','Dried breadcrumbs',8,6,60],['semolina','Semolina',16,8,180],
 ['sourdough-starter','Sourdough starter',9,4,7],['brewers-yeast','Brewers yeast',7,4,5],
 ['baking-powder','Baking powder',10,8,180],['baking-soda','Baking soda',5,8,210]
]);
add('Dairy & eggs','icebox','dairy',[
 ['milk','Quart milk bottles',16,2,2],['cream','Fresh cream',17,2,2],['buttermilk','Buttermilk',11,2,2],
 ['butter','Salted butter',20,4,12],['unsalted-butter','Fresh unsalted butter',23,4,9],
 ['cheddar','Aged cheddar cheese',25,4,16],['soft-cheese','Soft farmhouse cheese',15,3,4],
 ['cottage-cheese','Curds and whey',13,3,3],['eggs','Dozen eggs',24,12,14],
 ['duck-eggs','Duck eggs',14,6,12],['goat-milk','Goat milk',18,2,2],
 ['condensed-milk','Canned condensed milk',16,3,120],['lard','Cooking lard',13,8,40]
]);
add('Meat & poultry','icebox','butcher',[
 ['bacon','Bacon',25,4,6],['stew-beef','Beef for stew',45,4,3],['beef-steak','Beef steak',60,2,3],
 ['beef-brisket','Beef brisket',48,4,4],['beef-rib','Beef rib joint',68,4,4],
 ['ground-beef','Minced beef',42,4,2],['beef-liver','Beef liver',25,4,2],['oxtail','Oxtail',22,4,3],
 ['pork-chops','Pork chops',45,4,3],['pork-belly','Pork belly',32,4,4],
 ['ham','Salted ham',38,4,12],['sausages','Sausages',30,4,3],['salt-pork','Salt pork',30,5,35],
 ['whole-chicken','Whole chicken',58,1,3],['chicken-thighs','Chicken legs',35,4,3],
 ['whole-duck','Whole duck',65,1,3],['mutton','Mutton shoulder',40,4,4],
 ['lamb-chops','Lamb chops',59,4,3],['venison','Venison roast',60,4,3],
 ['rabbit','Dressed rabbit',28,1,3],['turkey','Dressed turkey',105,1,3],
 ['smoked-sausage','Smoked sausage',30,4,20],['pork-ribs','Pork ribs',35,4,3]
],{markets:'butcher'});
add('Fish & shellfish','icebox','fishmonger',[
 ['river-trout','River trout',28,2,2],['shad','Potomac shad',25,2,2],['catfish','Catfish',24,2,2],
 ['cod','Salt cod',30,4,35],['fresh-cod','Fresh cod',34,2,2],['herring','Herring',22,4,3],
 ['oysters','Oysters',38,12,2],['clams','Clams',25,12,2],['crab','Blue crabs',32,4,2],
 ['shrimp','River shrimp',42,8,2],['salmon','Salmon portions',50,4,2],['smoked-fish','Smoked fish',32,4,20]
]);
add('Vegetables','larder','provisions',[
 ['potatoes','Potatoes',15,8,32],['onions','Onions',4,4,30],['carrots','Carrots',10,8,20],
 ['turnips','Turnips',9,6,24],['parsnips','Parsnips',12,6,18],['cabbage','Cabbage',9,1,18],
 ['red-cabbage','Red cabbage',12,1,18],['leeks','Leeks',12,4,12],['celery','Celery',12,4,7],
 ['beets','Beets',10,6,24],['pumpkin','Pumpkin',15,1,30],['squash','Winter squash',14,1,30],
 ['sweet-potatoes','Sweet potatoes',18,6,20],['tomatoes','Tomatoes',15,6,6],
 ['green-peas','Fresh peas',12,6,5],['green-beans','Green beans',13,6,6],
 ['spinach','Spinach',10,6,4],['collards','Collard greens',9,6,5],
 ['lettuce','Lettuce',8,1,4],['cucumber','Cucumber',10,2,8],
 ['radishes','Radishes',8,6,6],['cauliflower','Cauliflower',17,1,8],
 ['mushrooms','Mushrooms',21,6,3],['garlic','Garlic bulbs',8,4,35],
 ['corn','Fresh corn',12,4,5],['produce','Seasonal produce',25,8,8],
 ['okra','Okra',15,6,5],['scallions','Green onions',10,6,5]
]);
add('Fruit','larder','provisions',[
 ['apples','Apples',15,6,14],['pears','Pears',17,6,9],['peaches','Peaches',19,6,6],
 ['cherries','Cherries',25,8,4],['plums','Plums',17,6,7],['blackberries','Blackberries',15,6,3],
 ['raspberries','Raspberries',19,6,3],['strawberries','Strawberries',20,6,3],
 ['blueberries','Blueberries',18,6,4],['grapes','Grapes',24,8,5],
 ['lemons','Lemons',14,4,16],['oranges','Oranges',24,4,13],
 ['dried-apples','Dried apples',15,8,120],['raisins','Raisins',12,8,180],
 ['currants','Dried currants',15,8,180],['dates','Dates',21,8,90],
 ['figs','Dried figs',19,8,90],['cranberries','Cranberries',15,8,14]
]);
add('Beans & nuts','pantry','provisions',[
 ['dried-beans','Dried navy beans',13,8,180],['red-beans','Dried red beans',14,8,180],
 ['lentils','Lentils',16,8,180],['split-peas','Split peas',14,8,180],
 ['chickpeas','Chickpeas',17,8,180],['peanuts','Peanuts',12,8,100],
 ['walnuts','Walnuts',22,8,100],['almonds','Almonds',25,8,120],
 ['pecans','Pecans',28,8,100],['hazelnuts','Hazelnuts',24,8,100]
]);
add('Baking & sweets','pantry','grocer',[
 ['sugar','White sugar',22,8,240],['brown-sugar','Brown sugar',20,8,240],
 ['molasses','Molasses',17,8,210],['honey','Honey',27,8,210],
 ['maple-syrup','Maple syrup',27,8,180],['cocoa','Cocoa powder',32,8,180],
 ['chocolate','Baking chocolate',39,8,140],['vanilla','Vanilla flavoring',24,8,240],
 ['almond-extract','Almond extract',25,8,210],['cornstarch','Corn starch',15,8,180],
 ['gelatin','Gelatin',25,8,180],['jam','Fruit jam',22,8,100],
 ['marmalade','Orange marmalade',25,8,100],['candied-peel','Candied citrus peel',18,8,100],
 ['treacle','Black treacle',18,8,180],['shortening','Cooking shortening',14,8,90],
 ['powdered-sugar','Powdered sugar',24,8,200],['dessert-spice','Sweet spice mix',23,8,210],
 ['cream-of-tartar','Cream of tartar',13,8,180],['pie-filling','Preserved pie filling',28,6,90]
]);
add('Seasonings','pantry','grocer',[
 ['salt','Salt',7,12,240],['black-pepper','Black pepper',14,12,240],
 ['cinnamon','Cinnamon',17,12,240],['nutmeg','Nutmeg',19,12,240],
 ['cloves','Cloves',18,12,240],['ginger','Ground ginger',17,12,240],
 ['mustard','Mustard powder',13,12,200],['vinegar','Cider vinegar',10,12,210],
 ['dried-sage','Dried sage',12,12,180],['dried-thyme','Dried thyme',12,12,180],
 ['bay-leaves','Bay leaves',10,12,180],['dried-rosemary','Rosemary',12,12,180],
 ['paprika','Paprika',17,12,180],['dill','Dried dill',12,12,180],
 ['seasoning','Salt, pepper and seasonings',15,12,180],['tea-sugar','Tea, coffee and sweetener',20,12,180]
]);
add('Preserves & canned','pantry','grocer',[
 ['tinned-peaches','Tinned peaches',20,4,180],['tinned-tomatoes','Tinned tomatoes',16,4,180],
 ['tinned-beans','Tinned beans',14,4,180],['pickles','Pickled cucumbers',18,6,90],
 ['sauerkraut','Sauerkraut',15,6,45],['apple-butter','Apple butter',19,6,90],
 ['salted-cod','Barrel salted cod',25,6,100],['dried-beef','Dried beef',32,6,90],
 ['potted-meat','Potted meat',20,4,40],['stock-bones','Soup bones',13,4,3]
]);
add('Chinese market','pantry','provisions',[
 ['rice-noodles','Rice noodles',18,8,150],['wheat-noodles','Wheat noodles',16,8,150],
 ['soy-sauce','Soy sauce',25,12,180],['dried-shiitake','Dried mushrooms',24,8,150],
 ['tofu','Fresh bean curd',17,4,3],['bok-choy','Bok choy',12,4,5],
 ['chinese-cabbage','Chinese cabbage',15,1,10],['five-spice','Five spice',22,12,200],
 ['sesame-oil','Sesame oil',29,12,150],['sesame-seeds','Sesame seeds',17,8,120],
 ['rice-vinegar','Rice vinegar',22,12,180],['dried-seaweed','Dried seaweed',19,8,160],
 ['mung-beans','Mung beans',16,8,160],['ginger-root','Fresh ginger root',11,6,14]
],{markets:'chinatown'});
add('Kitchen & household','pantry','grocer',[
 ['lamp-fuel','Lamp and heating fuel',30,1,210],['soap','Soap',10,1,240],
 ['paraffin','Paraffin wax',18,8,240],['charcoal','Charcoal fuel',20,8,240],
 ['wood-kindling','Cook stove kindling',16,12,240],['ice-block','Ice block',15,1,1]
]);
const byId=Object.freeze(Object.fromEntries(items.map(item=>[item.id,item])));
const api=Object.freeze({GOODS:Object.freeze(items),BY_ID:byId,find:id=>byId[id]||null,
 sections:Object.freeze([...new Set(items.map(x=>x.section))]),count:items.length});
if(typeof module==='object'&&module.exports)module.exports=api;
root.FE_FOOD_CATALOG=api;
})(typeof window!=='undefined'?window:globalThis);
