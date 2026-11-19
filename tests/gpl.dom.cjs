const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync(new URL('../index.html', 'file://' + __filename), 'utf8');
const events = [];
let storage = {
 'fuelcalc.vehicles.v1': JSON.stringify(['MiTo','Altra auto']),
 'fuelcalc.trips.v1': JSON.stringify([{vehicle:'MiTo',fuel:'gpl',km:50,litres:4,total:3.5,savedAt:Date.now()-3600000}])
};
let w, el;
function boot() {
 const d = new JSDOM(html, {url:'https://fuelcalc.example/',runScripts:'dangerously',beforeParse(w){
  for(const [key,value] of Object.entries(storage)) w.localStorage.setItem(key,value);
  w.matchMedia = () => ({matches:false,addEventListener(){}});
  w.fetch = async () => {throw Error('offline');};
  w.HTMLDialogElement.prototype.showModal = function(){this.open=true;};
  w.HTMLDialogElement.prototype.close = function(){this.open=false;};
  w.addEventListener('error',e=>events.push(e.error));
 }});
 w=d.window; el=id=>w.document.getElementById(id);
}
function reload() {
 storage = Object.fromEntries(Object.keys(w.localStorage).map(key=>[key,w.localStorage.getItem(key)]));
 boot();
}
function send(node,event){node.dispatchEvent(new w.Event(event,{bubbles:true,cancelable:true}));}
function option(id,value,event='change'){el(id).value=value;send(el(id),event);}
function fuel(value){const node=w.document.querySelector('[name=fuel][value='+value+']');node.checked=true;send(node,'change');}
const fill=(id,v)=>option(id,v,'input');
const check=(id,part)=>assert.ok(el(id).textContent.includes(part),id+': '+el(id).textContent+' expected '+part);
boot();
fuel('gpl'); fill('distance','100'); fill('efficiency','14,0'); fill('price','0,70');
check('total','5,00');
option('gpl-mode','board'); check('gpl-coefficient','Nessun coefficiente valido'); check('total','5,00');
option('gpl-vehicle','MiTo');option('gpl-profile','mito');
check('gpl-reading-summary','10,54');check('litres','9,48');check('total','6,64');check('per-km','0,066');check('per-100','6,64');
fill('gpl-km','300');fill('gpl-litres','25');fill('gpl-reading','15');
send(el('gpl-form'),'submit');check('total','6,25');reload();check('total','6,25');
option('gpl-vehicle','Altra auto');check('total','5,00');option('gpl-vehicle','MiTo');el('gpl-restore').click();check('total','6,64');
fill('gpl-factor','0.5');check('total','10,00');fill('gpl-factor','0');check('total','5,00');el('gpl-restore').click();
for(const next of ['benzina','diesel']){fuel(next);fill('price','1.40');check('total','10,00');assert.equal(el('gpl-settings').hidden,true);}
fuel('gpl');check('total','6,64');
for(const invalid of ['','0','a','-1','1,2.3']){fill('efficiency',invalid);check('total','—');assert.equal(el('save-trip').disabled,true);}
fill('efficiency','14');el('save-trip').click();send(el('trip-form'),'submit');reload();
check('trips','Stima GPL');check('trips','3,50');
const [recent, old] = JSON.parse(w.localStorage.getItem('fuelcalc.trips.v1'));
assert.deepEqual([recent.gpl.mode,recent.gpl.original,recent.gpl.coefficient,old.total,old.gpl==null],['board',14,6.1/8.1,3.5,true]);
assert.equal(el('distance').value,'');
assert.equal(w.document.querySelectorAll('label[for=gpl-mode]').length,1);
assert.deepEqual(events,[]);
console.log('PASS: flussi GPL, carburanti, calibrazione, ripristino, storico, dati precedenti, input e API assente');
