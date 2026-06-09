import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#FAF9F5", card:"#FFFFFF", ink:"#0A0A0A", stone:"#3C3A36",
  muted:"#8C8A84", line:"#E4E0D6",
  accent:"#6B5FA8", accent2:"#C44FA8", gold:"#C9A227", white:"#FFFFFF",
};
const F = "'Inter', sans-serif";

// ── DATA ─────────────────────────────────────────────────────────
const BREWERS = ["Hario V60","Kalita Wave","April Brewer","Origami Dripper","Hoop by Ceado","Chemex","Orea Brewer","Fellow Stagg [X]","Sibarist FLAT","Melodrip","Tricolate","Other"];
const FILTERS = {
  "Hario V60":["Hario Tabbed (White)","Hario Tabbed (Natural)","Cafec Abaca","Cafec Light Roast","Cafec T-92","Sibarist V60 Fast","Sibarist V60 DISC"],
  "Kalita Wave":["Kalita Wave 185 (White)","Kalita Wave 185 (Natural)","Cafec Wave","Sibarist Wave Fast"],
  "April Brewer":["April Paper Filter","April Metal Filter"],
  "Origami Dripper":["Hario V60 (fits Origami)","Kalita Wave (fits Origami)","Cafec Abaca"],
  "Hoop by Ceado":["Hoop Paper Filter","Hoop Metal Filter"],
  "Chemex":["Chemex Bonded (Square)","Chemex Bonded (Circle)","Chemex Natural"],
  "Orea Brewer":["Orea x Sibarist DISC","Orea Flat White","Orea Flat Natural","Abaca Flat"],
  "Fellow Stagg [X]":["Fellow Stagg Paper","Fellow Stagg Metal"],
  "Sibarist FLAT":["Sibarist FLAT Fast","Sibarist FLAT Natural"],
  "Melodrip":["V60 Compatible","Flat Bottom Compatible"],
  "Tricolate":["Tricolate Paper Filter"],
  "Other":["Paper (White)","Paper (Natural)","Metal / Reusable","Cloth"],
};
const PROCESSES = ["Washed","Natural","Honey","Yellow Honey","Red Honey","Black Honey","Honey Fruit Fermented","Anaerobic Natural","Anaerobic Washed","Anaerobic with Fruits","Co-Fermented","Flavor Infusion","Carbonic Maceration","Nitrogen Infusion","Wet-Hulled (Giling Basah)","Double Fermented","Extended Fermentation","Experimental / Other"];
const ROASTS   = ["Light","Light-Med","Medium","Med-Dark","Dark"];
const GOALS    = ["Clarity","Sweetness","Balanced","Body","Acidity"];
const GOAL_DESC= {Clarity:"High note separation — floral, tea-like, lower TDS",Sweetness:"Round sweetness, caramelised sugars",Balanced:"Even, well-rounded — the default",Body:"Syrupy, chocolate-heavy, dense mouthfeel",Acidity:"Brighter — lifts malic & phosphoric acids"};
const NOTE_CHIPS=["Peach","Berry","Floral","Citrus","Chocolate","Caramel","Jasmine","Wine","Tropical","Nuts","Vanilla","Honey","Earthy","Stone Fruit","Blackcurrant","Tobacco"];
const ORIGIN_CHIPS=["Ethiopia","Kenya","Colombia","Brazil","Panama","Guatemala","Rwanda","Yemen","Indonesia","Costa Rica"];
const VARIETY_CHIPS=["Geisha","Pink Bourbon","SL28","Bourbon","Caturra","Typica","Pacamara","Castillo","Wush Wush","Heirloom"];

// ── BREW SCIENCE ─────────────────────────────────────────────────
const FLAT=["Kalita Wave","Sibarist FLAT","Melodrip","Tricolate","Fellow Stagg [X]"];
const bt=b=>b==="Chemex"?"chemex":FLAT.includes(b)?"flat":"conical";
const pc=p=>p==="Washed"?"washed":p==="Natural"?"natural":["Honey","Yellow Honey","Red Honey","Black Honey"].includes(p)?"honey":"fermented";
const ri=r=>({"Light":0,"Light-Med":1,"Medium":2,"Med-Dark":3,"Dark":4}[r]||0);
const alt=a=>parseInt(a)||1500;
const pRatio=s=>parseFloat(String(s).split(":")[1]);
const round5=n=>Math.round(n/5)*5;
const roundHalf=n=>Math.round(n/0.5)*0.5;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function daysOff(d){ if(!d) return null; const ms=Date.now()-new Date(d+"T12:00:00").getTime(); const v=Math.floor(ms/86400000); return v>=0?v:null; }
function roastPhase(d){ if(d===null) return "unknown"; if(d<=10) return "fresh"; if(d<=30) return "prime"; return "rested"; }
function phaseLabel(d){ const p=roastPhase(d); return p==="fresh"?"Fresh · still gassy":p==="prime"?"Prime window":p==="rested"?"Rested":"—"; }
function phaseColorFn(d){ const k=roastDatePhase(d).key; return k==="optimal"?"#6B5FA8":k==="degassing"||k==="staling"?"#C9A227":"#3C3A36"; }
function roastGrindOde(d){ return roastPhase(d)==="fresh"?0.3:roastPhase(d)==="rested"?-0.3:0; }
function roastGrindX(d){ return roastPhase(d)==="fresh"?2:roastPhase(d)==="rested"?-2:0; }
function roastTempAdj(d){ return roastPhase(d)==="rested"?1:0; }
function roastBloom(d){ return roastPhase(d)==="fresh"?8:roastPhase(d)==="rested"?-5:0; }
function goalGrindOde(g){ return {Clarity:0.3,Balanced:0,Sweetness:-0.2,Body:-0.4,Acidity:0.1}[g]||0; }
function goalGrindX(g){ return {Clarity:3,Balanced:0,Sweetness:-2,Body:-4,Acidity:1}[g]||0; }
function goalAgi(g){ return {Clarity:"Low",Balanced:"Medium",Sweetness:"Medium",Body:"High",Acidity:"Low-Med"}[g]||"Medium"; }
function goalContact(g){ return {Clarity:-0.05,Balanced:0,Sweetness:0.05,Body:0.1,Acidity:-0.03}[g]||0; }

// ── ROAST INTELLIGENCE ENGINE v3 — TEMPERATURE (research-verified) ──
// Step 1: roast base
function baseTemp(roast){ return {Light:95,"Light-Med":93,Medium:92,"Med-Dark":89,Dark:86}[roast]||92; }
// Process class + temp adjustment
function processClass(p){
  return ({
    "Washed":"washed","Natural":"natural",
    "Honey":"honey","Yellow Honey":"honey","Red Honey":"honey","Black Honey":"honey",
    "Honey Fruit Fermented":"anaerobic","Anaerobic Natural":"anaerobic","Anaerobic Washed":"anaerobic","Anaerobic with Fruits":"anaerobic",
    "Co-Fermented":"coferment","Flavor Infusion":"coferment","Experimental / Other":"coferment",
    "Carbonic Maceration":"carbonic","Nitrogen Infusion":"nitrogen",
    "Wet-Hulled (Giling Basah)":"wethulled","Double Fermented":"extended","Extended Fermentation":"extended",
  })[p]||"washed";
}
function processTempAdj(p){ return ({washed:1,honey:-0.5,natural:-1,anaerobic:-2,extended:-3,carbonic:-1,coferment:-1,nitrogen:-0.5,wethulled:-0.5})[processClass(p)]||0; }
function isFragileFerment(p){ const x=processClass(p); return x==="anaerobic"||x==="extended"; }
// Roast date → phase, temp adj, warning
function roastDatePhase(days){
  if(days===null) return {key:"unknown",adj:0,warn:null};
  if(days<=4) return {key:"degassing",adj:0,warn:"Still heavily degassing — CO2 causes uneven, gassy, sour extraction. The fix is rest, not temperature. Wait: dark → day 3-5, medium → day 7, light → day 10-14."};
  if(days<=21) return {key:"optimal",adj:0,warn:null};
  if(days<=60) return {key:"fading",adj:0,warn:"Past peak — aromatics fading but still present. Brew soon."};
  if(days<=120) return {key:"staling",adj:1,warn:"Aging coffee. +1°C helps pull from diminishing solubles; expect a flatter cup."};
  return {key:"staling",adj:2,warn:"Quite stale. +2°C to extract what remains. Store airtight, cool, dark."};
}
// Origin adjustment (soft directional hint)
function originAdj(o){
  if(!o) return 0; const s=o.toLowerCase();
  if(s.includes("ethiopia")) return -1;
  if(s.includes("kenya")) return 1;
  if(s.includes("panama")) return -1;
  if(s.includes("rwanda")||s.includes("burundi")) return 1;
  if(s.includes("brazil")) return -1;
  if(s.includes("yemen")) return -1;
  if(s.includes("sumatra")||s.includes("java")||s.includes("indonesia")) return -1;
  return 0; // Colombia, Guatemala, Honduras, Mexico, Peru, El Salvador
}
// Elevation adjustment
function elevAdjV3(masl){ const m=parseInt(masl)||1500; if(m>=2100) return 2; if(m>=1800) return 1; if(m>=1400) return 0; return -1; }
// Variety adjustment
function varietyAdj(v){
  if(!v) return 0; const s=v.toLowerCase();
  if(s.includes("pink bourbon")) return -1;
  if(s.includes("geisha")||s.includes("gesha")) return -1;
  if(s.includes("wush")||s.includes("chiroso")||s.includes("sidra")) return -1;
  if(s.includes("sl28")||s.includes("sl 28")||s.includes("sl34")||s.includes("sl 34")) return 1;
  if(s.includes("castillo")||s.includes("marsellesa")||s.includes("caturra")) return -0.5;
  return 0; // Bourbon, Typica, Pacamara, Batian, K7, Heirloom → 0
}
function goalTempV3(g){ return {Clarity:-2,Sweetness:-1,Balanced:0,Body:1,Acidity:1}[g]||0; }
// The full engine — returns recommended temp, safe range, reasoning, warning
function tempEngine(form,iced,adj){
  const roast=form.roast||"Light", base=baseTemp(roast);
  const steps=[]; let t=base;
  const pAdj=processTempAdj(form.process);
  if(pAdj!==0) steps.push({l:(form.process||"process"),v:pAdj,a:Math.abs(pAdj)+0.001,w:pAdj>0?"a clean washed bean needs more heat to unlock varietal brightness":"fermentation raises solubility, so cooler water prevents over-extraction"});
  t+=pAdj;
  const rd=roastDatePhase(daysOff(form.roastDate));
  if(rd.adj!==0){ steps.push({l:"roast age",v:rd.adj,a:Math.abs(rd.adj),w:"aging beans lose soluble compounds, so a little more heat extracts what remains"}); t+=rd.adj; }
  const oA=originAdj(form.origin);
  if(oA!==0){ steps.push({l:(form.origin||"origin"),v:oA,a:Math.abs(oA)-0.01,w:oA>0?"dense, high-grown beans with bold acidity need extraction force":"delicate aromatics here degrade quickly at high heat"}); t+=oA; }
  const eA=elevAdjV3(form.altitude);
  if(eA!==0){ steps.push({l:(form.altitude||"")+"m",v:eA,a:Math.abs(eA)+0.005,w:eA>0?"higher elevation grows denser beans that need more energy":"lower-grown beans are porous and over-extract easily"}); t+=eA; }
  const vA=varietyAdj(form.variety);
  if(vA!==0){ steps.push({l:(form.variety||"variety"),v:vA,a:Math.abs(vA)-0.005,w:vA>0?"a large dense bean with bold acidity needs force":"this variety's florals are volatile and fade at high heat"}); t+=vA; }
  const gA=goalTempV3(form.goal);
  if(gA!==0){ steps.push({l:(form.goal||"")+" goal",v:gA,a:Math.abs(gA)-0.02,w:gA>0?"more heat lifts dissolved solids and acids":"less heat preserves sweetness and clarity, cutting bitter extraction"}); t+=gA; }
  if(iced && !isFragileFerment(form.process)){ steps.push({l:"iced flash",v:1,a:0.4,w:"pour-over loses heat to open air over a small water volume, so we start a degree higher"}); t+=1; }
  if(adj&&adj.temp) t+=adj.temp;
  const raw=Math.round(t), final=clamp(raw,84,97), clamped=raw!==final;
  const lo=clamp(final-1,84,97), hi=clamp(final+1,84,97);
  const top=steps.filter(s=>s.a>0).sort((x,y)=>y.a-x.a).slice(0,3);
  let reason=roast+" roast sets a "+base+"°C base. "+top.map(s=>s.l+" "+(s.v>0?"+":"")+s.v+"°C ("+s.w+")").join("; ")+".";
  if(clamped) reason+=" Clamped to the "+final+"°C safe limit.";
  const assumed=[];
  if(!form.process) assumed.push("washed process");
  if(!form.variety) assumed.push("Bourbon variety");
  if(!form.altitude) assumed.push("1400-1800m");
  if(!form.origin) assumed.push("Colombia origin");
  if(!form.roastDate) assumed.push("~10 days off roast");
  return {temp:final,lo,hi,reason,tip:rd.warn,assumed};
}

function calcGrindOde(brewer,roast,process,isIced,d,goal,adj){
  const base={conical:4.0,flat:5.0,chemex:6.5}[bt(brewer)];
  const a=ri(roast)*0.5+({washed:0,natural:0.2,honey:0,fermented:0.2}[pc(process)]||0);
  let g=base+a-(isIced?0.5:0)+roastGrindOde(d)+goalGrindOde(goal)+((adj&&adj.ode)||0);
  return clamp(Math.round(g*2)/2,1,11);
}
function calcGrindX(process,roast,altitude,isIced,d,goal,adj){
  const al=alt(altitude);
  // Omni is a fast-flowing flat-bottom dripper — grind slightly finer than a slow V60 so the cup isn't watery.
  let g=41+ri(roast)*2+({washed:0,honey:2,natural:4,fermented:6}[pc(process)]||0)+(al>1800?-3:al<1200?3:0)-(isIced?4:0)+roastGrindX(d)+goalGrindX(goal)+((adj&&adj.x)||0);
  return clamp(Math.round(g),20,72);
}
function xbloomMicrons(s){ return Math.round(180+s*10.9); }
function grindZone(s){ if(s<=15) return "Espresso"; if(s<=29) return "AeroPress"; if(s<=54) return "Pour Over / Filter"; if(s<=69) return "Coarse Filter"; return "French Press / Cold Brew"; }
function calcTemp(process,roast,altitude,isIced,d,adj){
  const base={washed:94,natural:91,honey:93,fermented:89}[pc(process)];
  const al=alt(altitude);
  let t=base-[0,1,2,3,4][ri(roast)]+(al>1800?1:0)-(isIced?2:0)+roastTempAdj(d)+((adj&&adj.temp)||0);
  return clamp(t,82,96);
}
function calcRPM(process,roast,goal){
  // xBloom RPM only steps in 10s (60-120). Slower RPM = more even grind, slower drawdown, fuller extraction.
  if(goal==="Clarity") return 80;
  if(goal==="Body") return 60;
  if(pc(process)==="fermented") return 60;
  if(ri(roast)>=3) return 80;
  return 70;
}
function bloomTime(process,d,goal,adj){
  // Barista Hustle / Rao: 45-60s; anaerobic & experimental get the full 60s (extra fermentation CO2).
  const x=processClass(process);
  let b=(x==="anaerobic"||x==="extended"||x==="carbonic"||x==="coferment")?60:45;
  b+=roastBloom(d)+((adj&&adj.bloom)||0);
  if(goal==="Clarity") b-=3;
  return clamp(b,40,70);
}
function calcPours(brewer,dose,hotWater,bloomWater,goal){
  const rem=hotWater-bloomWater,type=bt(brewer),fast=goal==="Clarity";
  if(type==="chemex"){
    const p1=Math.round(rem*0.40),p2=Math.round(rem*0.35),p3=rem-p1-p2;
    return[{n:1,water:p1,flow:"2-3 g/s",duration:fast?30:35,total:bloomWater+p1,notes:"Slow spiral from centre"},{n:2,water:p2,flow:"2-3 g/s",duration:26,total:bloomWater+p1+p2,notes:"Continue spiral outward"},{n:3,water:p3,flow:"2-3 g/s",duration:22,total:hotWater,notes:"Final centre pour"}];
  }
  if(type==="flat"){
    const p1=Math.round(rem*0.45),p2=Math.round(rem*0.35),p3=rem-p1-p2;
    return[{n:1,water:p1,flow:"3-4 g/s",duration:28,total:bloomWater+p1,notes:"Centre pour, let settle"},{n:2,water:p2,flow:"3-4 g/s",duration:22,total:bloomWater+p1+p2,notes:"Slow spiral"},{n:3,water:p3,flow:"3-4 g/s",duration:18,total:hotWater,notes:"Final pour"}];
  }
  if(dose<=14){const p1=Math.round(rem*0.55),p2=rem-p1;return[{n:1,water:p1,flow:"3-4 g/s",duration:28,total:bloomWater+p1,notes:"Slow spiral"},{n:2,water:p2,flow:"3-4 g/s",duration:20,total:hotWater,notes:"Final centre pour"}];}
  const p1=Math.round(rem*0.38),p2=Math.round(rem*0.32),p3=rem-p1-p2;
  return[{n:1,water:p1,flow:"3-4 g/s",duration:30,total:bloomWater+p1,notes:"Slow spiral from centre"},{n:2,water:p2,flow:"3-4 g/s",duration:24,total:bloomWater+p1+p2,notes:goal==="Clarity"?"Gentle spiral, low agitation":"Continue spiral to edge"},{n:3,water:p3,flow:"3-4 g/s",duration:18,total:hotWater,notes:"Final centre pour"}];
}
function calcXPours(dose,totalVol,temp,process,goal,bloomMult){
  const bloomVol=Math.round(dose*(bloomMult||2.5)),rem=totalVol-bloomVol;
  const cat=pc(process);
  let fr=Math.round((cat==="washed"?3.1:3.3+goalContact(goal))*10)/10;
  const pt=cat==="fermented"?"Circular":"Spiral";
  const agAfter=(cat==="fermented"||cat==="natural"||goal==="Body");
  if(rem<160){
    const p1=Math.round(rem*0.55);
    return[{n:1,volume:bloomVol,temperature:temp,flowRate:3.0,pause:40,pourType:"Spiral",agitationBefore:false,agitationAfter:agAfter,notes:"Bloom"},{n:2,volume:p1,temperature:temp,flowRate:fr,pause:12,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"Main pour"},{n:3,volume:rem-p1,temperature:temp,flowRate:fr,pause:0,pourType:"Centered",agitationBefore:false,agitationAfter:false,notes:"Final pour"}];
  }
  const p1=Math.round(rem*0.40),p2=Math.round(rem*0.35),p3=rem-p1-p2;
  return[{n:1,volume:bloomVol,temperature:temp,flowRate:3.0,pause:40,pourType:"Spiral",agitationBefore:false,agitationAfter:agAfter,notes:"Bloom"},{n:2,volume:p1,temperature:temp,flowRate:fr,pause:15,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"First pour"},{n:3,volume:p2,temperature:temp,flowRate:fr,pause:10,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"Second pour"},{n:4,volume:p3,temperature:temp,flowRate:fr,pause:0,pourType:"Centered",agitationBefore:false,agitationAfter:false,notes:"Final pour"}];
}
function flavorNote(process,roast,altitude){
  const cat=pc(process),a=alt(altitude),r=ri(roast);
  if(cat==="washed") return r<=1?(a>1700?"High clarity — floral, citrus, and stone fruit with vibrant acidity.":"Clean and bright with mild fruit sweetness and balanced acidity."):"Soft chocolate, caramel, and nutty notes.";
  if(cat==="natural") return r<=1?"Rich and fruit-forward — berry, tropical fruit, and chocolate with a full round body.":"Deep sweetness with dark fruit, chocolate, and a syrupy body.";
  if(cat==="honey") return r<=1?"Stone fruit, brown sugar, and light florals with a smooth medium body.":"Caramel, dried fruit, and a silky body.";
  return "Complex and layered — wine-like, tropical, or fruit-candy notes. Treat it with care.";
}
function brewmasterNote(process,roast,altitude,isIced,d,goal){
  const cat=pc(process),a=alt(altitude),p=roastPhase(d);
  let s="Thirty years on the bar: ";
  if(cat==="washed") s+="a clean washed lot rewards patience. Keep the kettle moving in slow circles, never let the bed go dry.";
  else if(cat==="natural") s+="naturals carry huge fruit but muddy fast if you bully them. Pour gently, protect the bed.";
  else if(cat==="honey") s+="honey sits between clean and fruity. A touch below boiling keeps the sugars round.";
  else s+="fermented lots are wild — they extract fast and turn boozy if you rush. A hair finer, a couple degrees cooler, respect the bloom.";
  if(p==="fresh") s+=" These are still gassing off — I opened the grind and stretched the bloom. No extra heat on fresh beans.";
  if(p==="rested") s+=" Past the gassy stage, so I tightened the grind and added a degree.";
  if(a>1800) s+=" High-grown and dense — a degree hotter opens it.";
  if(goal==="Clarity") s+=" You asked for clarity — coarser, faster, lower agitation.";
  if(goal==="Body") s+=" Chasing body — finer and more agitation.";
  if(goal==="Sweetness") s+=" Chasing sweetness — a touch longer contact.";
  if(isIced) s+=(isFragileFerment(process)?" Iced flash: tighter grind, brewed concentrated straight onto ice — and I held the temp steady since these ferment aromatics are fragile.":" Iced flash: tighter grind and a degree hotter to beat the heat loss over a small pour, brewed concentrated onto ice.");
  return s;
}

// ── BAG TEXT PARSER (offline, keyword matching) ──────────────────
function parseBagText(raw){
  if(!raw||!raw.trim()) return {};
  const t=" "+raw.toLowerCase().replace(/\s+/g," ")+" ";
  const out={};
  // Origin
  const origins=["Ethiopia","Kenya","Colombia","Brazil","Panama","Guatemala","Rwanda","Burundi","Yemen","Indonesia","Costa Rica","El Salvador","Honduras","Peru","Bolivia","Nicaragua","Mexico","Sumatra","Java"];
  for(const o of origins){ if(t.includes(" "+o.toLowerCase())){ out.origin=(o==="Sumatra"||o==="Java")?"Indonesia":o; break; } }
  // Process — most specific first
  const procMap=[["extended ferment","Extended Fermentation"],["double ferment","Double Fermented"],["double anaerobic","Double Fermented"],["thermal shock","Experimental / Other"],["carbonic","Carbonic Maceration"],["co-ferment","Co-Fermented"],["co ferment","Co-Fermented"],["coferment","Co-Fermented"],["nitrogen","Nitrogen Infusion"],["anaerobic natural","Anaerobic Natural"],["anaerobic washed","Anaerobic Washed"],["anaerobic","Anaerobic Natural"],["lactic","Anaerobic Washed"],["wet hulled","Wet-Hulled (Giling Basah)"],["giling","Wet-Hulled (Giling Basah)"],["black honey","Black Honey"],["red honey","Red Honey"],["yellow honey","Yellow Honey"],["white honey","Honey"],["honey","Honey"],["pulped natural","Honey"],["natural","Natural"],["dry process","Natural"],["fully washed","Washed"],["fully-washed","Washed"],["washed","Washed"],["infus","Flavor Infusion"]];
  for(const a of procMap){ if(t.includes(a[0])){ out.process=a[1]; break; } }
  // Roast — explicit "<level> roast" wins; else bare word with tasting-note false-positives stripped
  const ex=t.match(/(medium[\s-]*dark|light[\s-]*medium|medium[\s-]*light|light|medium|dark)\s*roast(?:ed)?/);
  if(ex){ const w=ex[1]; out.roast=(/med/.test(w)&&/dark/.test(w))?"Med-Dark":(/light/.test(w)&&/med/.test(w))?"Light-Med":w==="dark"?"Dark":w==="medium"?"Medium":"Light"; }
  else{
    const c=t.replace(/dark chocolate|dark fruit|dark cherr|dark berr|dark caramel|dark sugar|milk chocolate|light body|medium body|full body/g," ");
    if(/medium[\s-]*dark|med[\s-]*dark/.test(c)) out.roast="Med-Dark";
    else if(/light[\s-]*medium|medium[\s-]*light/.test(c)) out.roast="Light-Med";
    else if(/\bdark\b/.test(c)) out.roast="Dark";
    else if(/\bmedium\b/.test(c)) out.roast="Medium";
    else if(/\blight\b|filter roast|omni[\s-]*roast/.test(c)) out.roast="Light";
  }
  // Altitude (handle ranges + labels)
  let a=null;
  const rng=t.match(/(\d[\d,.]{2,4})\s*(?:to|[\u2013\u2014-])\s*(\d[\d,.]{2,4})\s*(?:masl|m\b|meters|metres|m\.a)/);
  if(rng){ const x=parseInt(rng[1].replace(/[,.]/g,"")),y=parseInt(rng[2].replace(/[,.]/g,"")); a=Math.round((x+y)/2); }
  if(!a){ const s=t.match(/(\d[\d,.]{2,4})\s*(?:masl|m\.a\.s\.l|m\.a\.s|meters|metres|m\b)/); if(s) a=parseInt(s[1].replace(/[,.]/g,"")); }
  if(!a){ const l=t.match(/(?:altitude|elevation)[:\s]*(\d[\d,.]{2,4})/); if(l) a=parseInt(l[1].replace(/[,.]/g,"")); }
  if(a&&a>=400&&a<=3000) out.altitude=String(a);
  // Variety
  const vars=["Pink Bourbon","Geisha","Gesha","SL28","SL34","Bourbon","Caturra","Catuai","Typica","Pacamara","Castillo","Wush Wush","Chiroso","Sidra","Heirloom","Batian","Maragogipe","Mundo Novo","Marsellesa","Tabi"];
  for(const v of vars){ if(t.includes(v.toLowerCase())){ out.variety=(v==="Gesha"?"Geisha":v); break; } }
  // Tasting notes — word-boundary matched (no grape⊂grapefruit, no berry⊂blueberry)
  const notes=["grapefruit","blueberry","strawberry","raspberry","blackberry","blackcurrant","berries","berry","peach","apricot","floral","jasmine","rose","bergamot","lemon","lime","orange","citrus","chocolate","cocoa","caramel","toffee","vanilla","mango","pineapple","lychee","tropical","cherry","grape","wine","winey","almond","hazelnut","nutty","tobacco","plum","melon","apple","black tea","cinnamon","honey","stone fruit"];
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const f=[];
  for(const n of notes){ if(new RegExp("\\b"+esc(n)+"\\b").test(t)) f.push(n); }
  if(f.length) out.notes=f.slice(0,8).map(w=>w.replace(/\b\w/g,ch=>ch.toUpperCase())).join(", ");
  return out;
}

function calculateManual(form,adj){
  const dose=parseFloat(form.dose)||18;
  let ratio=pRatio(form.ratio)+((adj&&adj.ratio)||0); ratio=clamp(ratio,10,20);
  const isIced=form.brewMode==="Iced",d=daysOff(form.roastDate),goal=form.goal||"Balanced";
  const totalYield=Math.round(dose*ratio);
  const iceGrams=isIced?round5(totalYield*0.4):0;   // spec: 40% ice, 60% hot
  const hotWater=totalYield-iceGrams;
  const bloomMult=form.bloomRatio==="1:2"?2:3;
  const bloomWater=Math.round(dose*bloomMult);
  const te=tempEngine(form,isIced,adj);
  const grind=calcGrindOde(form.brewer,form.roast,form.process,isIced,d,goal,adj);
  const bd=bloomTime(form.process,d,goal,adj);
  return {grindSize:grind,temperature:te.temp,tempLo:te.lo,tempHi:te.hi,tempReason:te.reason,tip:te.tip,assumed:te.assumed,totalWater:hotWater,iceGrams,coffeeDose:dose,ratio:"1:"+ratio,bloomWater,bloomDuration:bd,agitation:goalAgi(goal),pours:calcPours(form.brewer,dose,hotWater,bloomWater,goal),brewTime:(bt(form.brewer)==="chemex"?"4:00-5:00":bt(form.brewer)==="flat"?"3:30-4:30":hotWater<200?"2:30-3:00":"3:00-3:30"),brewmaster:brewmasterNote(form.process,form.roast,form.altitude,isIced,d,goal),flavor:flavorNote(form.process,form.roast,form.altitude)};
}
function calculateXbloom(form,adj){
  const dose=parseFloat(form.xDose)||18;
  let ratio=pRatio(form.xRatio)+((adj&&adj.ratio)||0); ratio=clamp(ratio,5,25);
  const isIced=form.xBrewMode==="Iced",d=daysOff(form.roastDate),goal=form.goal||"Balanced";
  const totalTarget=Math.round(dose*ratio);
  let iceGrams=0,hotWater=totalTarget,machineRatio=ratio;
  if(isIced){
    if(form.iceMode==="Manual"&&parseFloat(form.iceGrams)>0){
      iceGrams=round5(parseFloat(form.iceGrams));
      hotWater=Math.max(round5(dose*3),totalTarget-iceGrams);
      machineRatio=roundHalf(hotWater/dose);
    } else {
      machineRatio=roundHalf(ratio*0.60);   // spec: 60% hot water, 40% ice
      hotWater=Math.round(dose*machineRatio);
      iceGrams=round5(totalTarget-hotWater);
    }
  }
  const te=tempEngine(form,isIced,adj);
  const temp=te.temp;
  const grind=calcGrindX(form.process,form.roast,form.altitude,isIced,d,goal,adj);
  const rpm=calcRPM(form.process,form.roast,goal);
  const dripper=dose<=18?"Omni":"Other";
  // Omni app caps at 18g. For >18g you physically use the Omni but enter 18g in-app at an adjusted ratio.
  const over18=dose>18;
  const appDose=over18?18:dose;
  const appRatio=over18?roundHalf(hotWater/18):machineRatio;
  const bloomMult=form.bloomRatio==="1:2"?2:3;
  return {dripper,dose,over18,appDose,appRatio,grindSize:grind,grindMicrons:xbloomMicrons(grind),grindZoneLabel:grindZone(grind),rpm,ratio:"1:"+machineRatio,targetRatio:form.xRatio,totalVolume:hotWater,iceGrams,totalWithIce:totalTarget,bloomRatio:form.bloomRatio||"1:3",temperature:temp,tempLo:te.lo,tempHi:te.hi,tempReason:te.reason,tip:te.tip,assumed:te.assumed,agitation:goalAgi(goal),pours:calcXPours(dose,hotWater,temp,form.process,goal,bloomMult),brewTime:"3:00-3:30",isIced,brewmaster:brewmasterNote(form.process,form.roast,form.altitude,isIced,d,goal),flavor:flavorNote(form.process,form.roast,form.altitude)};
}

// ── COFFEE DOCTOR ────────────────────────────────────────────────
const DOC_GOALS=[
  {tag:"More sweetness",d:{ode:-0.2,x:-2,temp:0,bloom:3},why:"Slightly finer and more contact time to caramelise the sugars."},
  {tag:"More clarity",d:{ode:0.3,x:3,temp:0,bloom:-2},why:"Coarser and a cleaner faster drawdown to separate the high notes."},
  {tag:"More body",d:{ode:-0.4,x:-4,temp:0,bloom:2},why:"Finer, more agitation, longer contact for a denser cup."},
  {tag:"More acidity",d:{ode:0,x:0,temp:-1,bloom:0},why:"Drop the temperature a hair to lift and brighten the acidity."},
  {tag:"Less bitterness",d:{ode:0.3,x:3,temp:-1,bloom:0},why:"Coarser and cooler pulls the extraction back from bitter."},
];
const DOC_PROBS=[
  {tag:"Sour",d:{ode:-0.3,x:-3,temp:1,bloom:5},diag:"Under-extracted",why:"Sharp and sour means not enough was pulled. Grind finer, nudge temp up, extend the bloom."},
  {tag:"Bitter",d:{ode:0.3,x:3,temp:-1,bloom:0},diag:"Over-extracted",why:"Bitter means you pulled too much. Grind coarser and drop the temperature."},
  {tag:"Hollow",d:{ode:0,x:0,temp:1,bloom:3},diag:"Uneven extraction",why:"A hollow middle is uneven extraction. More centred pours, gentler spirals."},
  {tag:"Dry",d:{ode:0.3,x:3,temp:-1,bloom:0},diag:"Channeling",why:"Dry and astringent is channeling. Coarser grind, gentler flow, less agitation."},
  {tag:"Weak",d:{ode:-0.3,x:-3,temp:1,ratio:-1},diag:"Low strength",why:"Watery means low strength. Finer grind, a touch more concentration, hotter."},
];

// ── RECIPE TEXT (for copy) ────────────────────────────────────────
function recipeText(mode,form,r){
  const L=["POUR DECISIONS — "+(form.beanName||"Recipe")];
  if(mode==="xbloom"){
    L.push("xBloom Studio"+(r.isIced?" · Iced":""));
    L.push("Dripper: "+r.dripper+" | Dose: "+r.dose+"g | Ratio: "+r.ratio+" ("+r.totalVolume+"ml)");
    if(r.isIced) L.push("Ice: "+r.iceGrams+"g → total "+r.totalWithIce+"ml at "+r.targetRatio);
    L.push("Grind: "+r.grindSize+" ("+r.grindMicrons+"µm · "+r.grindZoneLabel+") | RPM: "+r.rpm);
    L.push("Pours:");
    (r.pours||[]).forEach((p,i)=>L.push("  "+(i===0?"Bloom":"Pour "+i)+" — "+p.volume+"ml @ "+p.temperature+"°C, "+p.flowRate+"ml/s, pause "+p.pause+"s, "+p.pourType));
  } else {
    L.push("Manual · "+form.brewer+(form.brewMode==="Iced"?" · Iced":""));
    L.push("Dose: "+r.coffeeDose+"g | Ratio: "+r.ratio+" | Temp: "+r.temperature+"°C | Grind: "+r.grindSize+" (Ode Gen 2)");
    L.push("Bloom: "+r.bloomWater+"g ("+(form.bloomRatio||"1:3")+") for "+r.bloomDuration+"s");
    L.push("Pours:");
    L.push("  Bloom — "+r.bloomWater+"g");
    (r.pours||[]).forEach(p=>L.push("  Pour "+p.n+" — "+p.water+"g (total "+p.total+"g)"));
  }
  return L.join("\n");
}

// ── LOCALSTORAGE (works everywhere — Claude, browsers, Capacitor) ─
const bkey=b=>"pd_dialin:"+(b||"x").toLowerCase().replace(/[^a-z0-9]/g,"_").slice(0,40);
function saveRec(rec){ try{ localStorage.setItem("pd_recipe:"+rec.id,JSON.stringify(rec)); return true; }catch(e){ return false; } }
function loadRecs(){ try{ return Object.keys(localStorage).filter(k=>k.startsWith("pd_recipe:")).map(k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}).filter(Boolean).sort((a,b)=>(b.ts||0)-(a.ts||0)); }catch(e){ return []; } }
function delRec(id){ try{ localStorage.removeItem("pd_recipe:"+id); }catch(e){} }
function getDial(bean){ try{ const r=localStorage.getItem(bkey(bean)); return r?JSON.parse(r):null; }catch(e){ return null; } }
function setDial(bean,data){ try{ localStorage.setItem(bkey(bean),JSON.stringify(data)); }catch(e){} }

// ── PROCESS INTELLIGENCE ─────────────────────────────────────────
function genInsights(recs){
  if(recs.length<2) return [];
  const byProc={};
  recs.forEach(r=>{
    if(!r.form||!r.form.process) return;
    const cat=pc(r.form.process);
    if(!byProc[cat]) byProc[cat]={count:0,ratings:[],goals:{}};
    byProc[cat].count++;
    if(r.rating>0) byProc[cat].ratings.push(r.rating);
    const g=r.form.goal||"Balanced";
    byProc[cat].goals[g]=(byProc[cat].goals[g]||0)+1;
  });
  const insights=[];
  Object.entries(byProc).forEach(([cat,d])=>{
    if(d.count<2) return;
    const bestGoal=Object.entries(d.goals).sort((a,b)=>b[1]-a[1])[0];
    const avgRating=d.ratings.length>0?(d.ratings.reduce((a,b)=>a+b,0)/d.ratings.length).toFixed(1):null;
    let s=d.count+" "+cat+" brews — ";
    if(bestGoal) s+=""+bestGoal[0]+" goal used most";
    if(avgRating) s+=", avg "+avgRating+"★";
    insights.push(s);
  });
  const best=recs.filter(r=>r.rating===5);
  if(best.length) insights.push("Your top-rated bean: "+best[0].name+" ("+((best[0].form&&best[0].form.process)||"")+")" );
  return insights;
}

// ── BREW TIMER helper ─────────────────────────────────────────────
function buildSteps(result,mode){
  if(mode==="manual"){
    const s=[{label:"Bloom",action:"Pour "+result.bloomWater+"g",duration:result.bloomDuration,sub:"Saturate all grounds, let bloom fully"}];
    (result.pours||[]).forEach(p=>{s.push({label:"Pour "+p.n,action:"Pour "+p.water+"g",duration:p.duration||20,sub:p.notes||""});});
    return s;
  }
  return (result.pours||[]).map((p,i)=>({
    label:i===0?"Bloom":"Pour "+i,
    action:"Pour "+p.volume+"ml",
    duration:Math.ceil(p.volume/(p.flowRate||3))+p.pause,
    sub:p.flowRate+"ml/s, "+p.pause+"s pause, "+p.pourType,
  }));
}

function ProgressSteps({current}){
  const steps=["Bean","Goal","Brew","Recipe"];
  return(
    <div style={{display:"flex",alignItems:"center",marginBottom:26}}>
      {steps.map((s,i)=>{
        const n=i+1,act=n===current,done=n<current;
        return(
          <div key={s} style={{display:"flex",alignItems:"center",flex:i<3?1:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
              <div style={{width:20,height:20,background:act||done?"#0A0A0A":"#E4E0D6",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"'Inter',sans-serif",fontWeight:800,fontSize:8,color:act||done?"#FFFFFF":"#8C8A84"}}>{"0"+n}</span>
              </div>
              <span style={{fontFamily:"'Inter',sans-serif",fontWeight:act?700:500,fontSize:9,color:act?"#0A0A0A":"#8C8A84",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s}</span>
            </div>
            {i<3&&<div style={{flex:1,height:1.5,background:done?"#0A0A0A":"#E4E0D6",margin:"0 6px",minWidth:6}}/>}
          </div>
        );
      })}
    </div>
  );
}

// ── CSS ──────────────────────────────────────────────────────────
const CSS=(
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');"+
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}"+
  "html,body{background:#FAF9F5;min-height:100vh;-webkit-font-smoothing:antialiased}"+
  "input::placeholder{color:#C0BDB7;font-family:'Inter',sans-serif;font-weight:500}"+
  "input[type=number]{-moz-appearance:textfield}"+
  "input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}"+
  "input[type=date]{font-family:'Inter',sans-serif;font-weight:600;color:#0A0A0A}"+
  "select option{background:#fff;color:#0A0A0A}"+
  "input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;background:#E4E0D6;border-radius:0;outline:none;cursor:pointer}"+
  "input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:0;background:#0A0A0A;cursor:pointer}"+
  "input[type=range]::-moz-range-thumb{width:24px;height:24px;border-radius:0;background:#0A0A0A;cursor:pointer;border:none}"+
  "@keyframes b1{0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg)}20%{transform:translate(-42%,-58%) scale(1.12) rotate(25deg)}40%{transform:translate(-56%,-42%) scale(0.9) rotate(-18deg)}60%{transform:translate(-44%,-56%) scale(1.08) rotate(35deg)}80%{transform:translate(-54%,-44%) scale(0.95) rotate(-12deg)}}"+
  "@keyframes b2{0%,100%{transform:translate(-30%,-65%) scale(0.82)}33%{transform:translate(-70%,-35%) scale(1.05)}66%{transform:translate(-50%,-50%) scale(0.9)}}"+
  "@keyframes b3{0%,100%{transform:translate(-75%,-30%) scale(0.68)}50%{transform:translate(-25%,-70%) scale(0.88)}}"+
  "@keyframes b4{0%,100%{transform:translate(-20%,-20%) scale(0.75)}40%{transform:translate(-80%,-80%) scale(0.95)}70%{transform:translate(-60%,-40%) scale(0.8)}}"+
  "@keyframes b5{0%,100%{transform:translate(-85%,-55%) scale(0.6)}50%{transform:translate(-15%,-45%) scale(0.78)}}"+
  "@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}"+
  ".anim{animation:rise 0.4s cubic-bezier(.16,1,.3,1) both}"
);

// ── BLOBS (5 colours, independent motion) ─────────────────────────
function Blobs(){
  const b={position:"absolute",borderRadius:"50%",pointerEvents:"none"};
  return(
    <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      <div style={{...b,top:"35%",left:"50%",width:580,height:580,background:"radial-gradient(circle,rgba(140,110,210,0.44) 0%,rgba(107,95,168,0.25) 40%,transparent 70%)",filter:"blur(72px)",animation:"b1 15s ease-in-out infinite"}}/>
      <div style={{...b,top:"20%",left:"70%",width:360,height:360,background:"radial-gradient(circle,rgba(255,80,160,0.36) 0%,rgba(220,60,140,0.2) 45%,transparent 70%)",filter:"blur(60px)",animation:"b2 11s ease-in-out infinite"}}/>
      <div style={{...b,top:"60%",left:"20%",width:320,height:320,background:"radial-gradient(circle,rgba(200,50,180,0.32) 0%,rgba(170,40,160,0.18) 45%,transparent 70%)",filter:"blur(56px)",animation:"b3 9s ease-in-out infinite"}}/>
      <div style={{...b,top:"15%",left:"25%",width:300,height:300,background:"radial-gradient(circle,rgba(255,200,50,0.30) 0%,rgba(230,170,30,0.16) 45%,transparent 70%)",filter:"blur(58px)",animation:"b4 13s ease-in-out infinite"}}/>
      <div style={{...b,top:"70%",left:"68%",width:260,height:260,background:"radial-gradient(circle,rgba(80,130,240,0.28) 0%,rgba(60,110,220,0.14) 45%,transparent 70%)",filter:"blur(52px)",animation:"b5 8s ease-in-out infinite"}}/>
    </div>
  );
}

// ── UI ATOMS ──────────────────────────────────────────────────────
function Lbl({c}){ return <div style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:8}}>{c}</div>; }
function TIn({value,onChange,placeholder,type}){
  const [f,sf]=useState(false);
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type||"text"}
    style={{width:"100%",background:"transparent",border:"none",borderBottom:"2px solid "+(f?C.ink:C.line),padding:"9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:C.ink,outline:"none",transition:"border-color .2s"}}
    onFocus={()=>sf(true)} onBlur={()=>sf(false)}/>;
}
function Sel({value,onChange,options,placeholder}){
  return <div style={{position:"relative"}}>
    <select value={value} onChange={onChange}
      style={{width:"100%",background:"transparent",border:"none",borderBottom:"2px solid "+(value?C.ink:C.line),padding:"9px 20px 9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:value?C.ink:C.muted,outline:"none",WebkitAppearance:"none",appearance:"none",cursor:"pointer"}}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o=><option key={o} value={o} style={{color:C.ink,background:C.card}}>{o}</option>)}
    </select>
    <span style={{position:"absolute",right:2,top:"50%",transform:"translateY(-50%)",color:C.ink,fontSize:11,pointerEvents:"none"}}>▾</span>
  </div>;
}
function Seg({options,value,onChange,small}){
  return <div style={{display:"flex",border:"2px solid "+C.ink}}>
    {options.map((o,i)=>(
      <button key={o} onClick={()=>onChange(o)}
        style={{flex:1,padding:small?"9px 4px":"11px 6px",background:value===o?C.ink:"transparent",border:"none",borderLeft:i>0?"2px solid "+C.ink:"none",fontFamily:F,fontWeight:700,fontSize:small?10:11,letterSpacing:"0.04em",textTransform:"uppercase",color:value===o?C.white:C.stone,cursor:"pointer",transition:"all .12s"}}>
        {o}
      </button>
    ))}
  </div>;
}
function Pill({active,onClick,children}){
  return <button onClick={onClick} style={{border:"2px solid "+(active?C.ink:C.line),background:active?C.ink:"transparent",padding:"7px 14px",fontFamily:F,fontWeight:600,fontSize:12,color:active?C.white:C.stone,cursor:"pointer",transition:"all .12s",whiteSpace:"nowrap"}}>{children}</button>;
}
function BtnP({onClick,disabled,children}){ return <button onClick={onClick} disabled={disabled} style={{flex:2,padding:"15px",background:disabled?C.line:C.ink,border:"none",color:disabled?C.muted:C.white,fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:disabled?"not-allowed":"pointer"}}>{children}</button>; }
function BtnG({onClick,children}){ return <button onClick={onClick} style={{flex:1,padding:"15px",background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:600,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>{children}</button>; }
function RangeField({label,value,min,max,step,unit,onChange}){
  const v=parseFloat(value)||parseFloat(min)||0,isRatio=unit==="ratio";
  return <div style={{marginBottom:24}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
      <Lbl c={label}/>
      <span style={{fontFamily:F,fontWeight:800,fontSize:22,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}>{isRatio?"1:"+v:v+(unit||"")}</span>
    </div>
    <input type="range" min={min} max={max} step={step||1} value={v} onChange={e=>onChange(e.target.value)}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
      <span style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted}}>{isRatio?"1:"+min:min+(unit||"")}</span>
      <span style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted}}>{isRatio?"1:"+max:max+(unit||"")}</span>
    </div>
  </div>;
}
function YieldBox({text}){ if(!text) return null; return <div style={{padding:"13px 16px",background:C.ink,marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:F,fontWeight:600,fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Yield Preview</span><span style={{fontFamily:F,fontWeight:800,fontSize:16,color:C.white}}>{text}</span></div>; }
function ProgressBar({progress}){
  const pct=clamp(progress,0,5),dialled=pct>=5;
  return <div style={{border:"2px solid "+C.ink,padding:"14px 16px",marginBottom:14,background:dialled?C.ink:C.card}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:dialled?C.gold:C.muted}}>{dialled?"★ Dialled In":"Dial-In Progress"}</span>
      <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:dialled?"rgba(255,255,255,0.7)":C.stone}}>{pct}/5</span>
    </div>
    <div style={{display:"flex",gap:5}}>{[0,1,2,3,4].map(i=><div key={i} style={{flex:1,height:10,background:i<pct?(dialled?C.gold:C.accent):(dialled?"rgba(255,255,255,0.15)":C.line)}}/>)}</div>
  </div>;
}
function BigN({val,top,bot,adj,onMinus,onPlus,adjustable}){
  return <div style={{textAlign:"center",flex:1,padding:"20px 4px"}}>
    <div style={{fontFamily:F,fontWeight:800,fontSize:27,color:C.ink,lineHeight:1,marginBottom:4,letterSpacing:"-0.02em"}}>{val}</div>
    {adjustable&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:2}}>
      <button onClick={onMinus} style={{width:26,height:26,background:"transparent",border:"1.5px solid "+C.line,color:C.stone,fontFamily:F,fontWeight:700,fontSize:14,cursor:"pointer",lineHeight:1}}>−</button>
      {adj!==0&&<span style={{fontFamily:F,fontWeight:600,fontSize:9,color:C.accent,alignSelf:"center"}}>{adj>0?"+":""}{adj}</span>}
      <button onClick={onPlus} style={{width:26,height:26,background:"transparent",border:"1.5px solid "+C.line,color:C.stone,fontFamily:F,fontWeight:700,fontSize:14,cursor:"pointer",lineHeight:1}}>+</button>
    </div>}
    <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",color:C.muted}}>{top}</div>
    {bot&&<div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.accent,marginTop:2}}>{bot}</div>}
  </div>;
}
function SpecRow({label,value,sub}){ return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid "+C.line}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>{label}</span><div style={{textAlign:"right"}}><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{value}</span>{sub&&<span style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.stone,marginLeft:8}}>{sub}</span>}</div></div>; }
function ICard({label,children,dark}){ return <div style={{padding:"16px 18px",background:dark?C.ink:C.card,border:"2px solid "+C.ink,marginBottom:12}}>{label&&<div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:dark?"rgba(255,255,255,0.5)":C.muted,marginBottom:7}}>{label}</div>}<p style={{fontFamily:F,fontWeight:500,fontSize:13,color:dark?"rgba(255,255,255,0.92)":C.stone,lineHeight:1.7,margin:0}}>{children}</p></div>; }

// ── POUR CARD (Xbloom style) ──────────────────────────────────────
function PourCard({p,idx}){
  return <div style={{border:"2px solid "+C.ink,marginBottom:10,background:C.card}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:C.ink}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:12,color:C.white,letterSpacing:"0.08em",textTransform:"uppercase"}}>{idx===0?"Bloom":"Pour "+idx}</span>
      <span style={{fontFamily:F,fontWeight:900,fontSize:18,color:C.white}}>{p.volume}ml</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.line}}>
      {[{l:"Temp",v:p.temperature+"°C"},{l:"Flow",v:p.flowRate+" ml/s"},{l:"Pause",v:p.pause+"s"}].map((x,i)=>(
        <div key={i} style={{background:C.card,padding:"10px 12px",textAlign:"center"}}>
          <div style={{fontFamily:F,fontWeight:600,fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:3}}>{x.l}</div>
          <div style={{fontFamily:F,fontWeight:800,fontSize:14,color:C.ink}}>{x.v}</div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderTop:"1px solid "+C.line}}>
      <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent,letterSpacing:"0.06em",textTransform:"uppercase"}}>{p.pourType}</span>
      <span style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.muted}}>Agitate: {p.agitationBefore?"Before ":""}{p.agitationAfter?"After":""}{(!p.agitationBefore&&!p.agitationAfter)?"Off":""}</span>
    </div>
  </div>;
}

// ── BREW TIMER ────────────────────────────────────────────────────
function BrewTimer({steps,onClose}){
  const [idx,setIdx]=useState(-1);
  const [left,setLeft]=useState(0);
  const [running,setRunning]=useState(false);
  const ivRef=useRef(null);
  const done=idx>=steps.length;
  const mm=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");

  function startStep(i){
    clearInterval(ivRef.current);
    if(i>=steps.length){ setIdx(i); setRunning(false); return; }
    setIdx(i); let t=steps[i].duration; setLeft(t); setRunning(true);
    ivRef.current=setInterval(()=>{
      t--; if(t<=0){ clearInterval(ivRef.current); setLeft(0); setTimeout(()=>startStep(i+1),1000); }
      else setLeft(t);
    },1000);
  }
  useEffect(()=>()=>clearInterval(ivRef.current),[]);

  const cur=steps[idx]||null;
  const nxt=steps[idx+1]||null;

  return <div className="anim">
    {idx===-1&&(
      <>
        <div style={{fontFamily:F,fontWeight:900,fontSize:28,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:24,lineHeight:1.05}}>Ready to brew?</div>
        {steps.map((s,i)=><div key={i} style={{padding:"12px 16px",border:"2px solid "+C.line,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.ink}}>{s.label}</span>
          <span style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.muted}}>{mm(s.duration)}</span>
        </div>)}
        <button onClick={()=>startStep(0)} style={{width:"100%",padding:"18px",background:C.ink,border:"none",color:C.white,fontFamily:F,fontWeight:800,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginTop:16}}>Start Brewing →</button>
      </>
    )}
    {idx>=0&&!done&&cur&&(
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.muted,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:8}}>Step {idx+1} of {steps.length}</div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:22,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:10}}>{cur.label}</div>
        <div style={{fontFamily:F,fontWeight:700,fontSize:16,color:C.accent,marginBottom:20}}>{cur.action}</div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:60,color:left<=10?C.accent2:C.ink,lineHeight:1,letterSpacing:"-0.04em",marginBottom:6}}>{mm(left)}</div>
        {cur.sub&&<div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted,marginBottom:24}}>{cur.sub}</div>}
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={()=>{clearInterval(ivRef.current);setRunning(false);}} style={{flex:1,padding:"13px",background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>Pause</button>
          {!running&&<button onClick={()=>startStep(idx)} style={{flex:1,padding:"13px",background:C.ink,border:"none",color:C.white,fontFamily:F,fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>Resume</button>}
          <button onClick={()=>startStep(idx+1)} style={{flex:1,padding:"13px",background:"transparent",border:"2px solid "+C.line,color:C.stone,fontFamily:F,fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>Skip →</button>
        </div>
        {nxt&&<div style={{padding:"10px 14px",background:C.line,marginTop:16}}><span style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.stone}}>Next: {nxt.label} — {nxt.action}</span></div>}
      </div>
    )}
    {done&&(
      <div style={{textAlign:"center",paddingTop:40}}>
        <div style={{fontFamily:F,fontWeight:900,fontSize:52,color:C.gold,marginBottom:12}}>★</div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:28,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:8}}>Enjoy your coffee.</div>
        <button onClick={onClose} style={{marginTop:20,padding:"15px 32px",background:C.ink,border:"none",color:C.white,fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Done</button>
      </div>
    )}
  </div>;
}

// ── SHARE CARD ────────────────────────────────────────────────────
function ShareCard({mode,form,result}){
  const blobBg="linear-gradient(135deg,rgba(140,110,210,0.15) 0%,rgba(255,80,160,0.1) 40%,rgba(255,200,50,0.08) 70%,rgba(80,130,240,0.1) 100%)";
  return <div style={{border:"2px solid "+C.ink,background:C.card,overflow:"hidden"}}>
    <div style={{background:C.ink,padding:"20px 22px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:4}}>Pour Decisions</div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:22,color:C.white,textTransform:"uppercase",letterSpacing:"-0.02em"}}>{form.beanName||"My Recipe"}</div>
        {form.origin&&<div style={{fontFamily:F,fontWeight:500,fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:2}}>{form.origin}{form.region?" · "+form.region:""}</div>}
      </div>
      <div style={{textAlign:"right"}}>
        <div style={{fontFamily:F,fontWeight:700,fontSize:10,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase"}}>{form.process}</div>
        <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2}}>{form.goal||"Balanced"}</div>
      </div>
    </div>
    <div style={{background:blobBg,padding:"18px 22px"}}>
      {mode==="xbloom"&&result&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          {[{l:"Grind",v:String(result.grindSize)},{l:"RPM",v:String(result.rpm)},{l:"Ratio",v:result.ratio}].map((x,i)=>(
            <div key={i} style={{textAlign:"center",border:"2px solid "+C.ink,padding:"12px 6px",background:"rgba(255,255,255,0.7)"}}>
              <div style={{fontFamily:F,fontWeight:900,fontSize:20,color:C.ink}}>{x.v}</div>
              <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>{x.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone}}>{result.grindMicrons}µm · {result.grindZoneLabel} · {result.brewTime}</div>
        {result.isIced&&<div style={{marginTop:8,fontFamily:F,fontWeight:700,fontSize:12,color:C.accent}}>Iced · {result.totalVolume}ml hot + {result.iceGrams}g ice</div>}
      </>}
      {mode==="manual"&&result&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          {[{l:"Grind",v:String(result.grindSize)},{l:"Temp",v:result.temperature+"°"},{l:"Ratio",v:result.ratio}].map((x,i)=>(
            <div key={i} style={{textAlign:"center",border:"2px solid "+C.ink,padding:"12px 6px",background:"rgba(255,255,255,0.7)"}}>
              <div style={{fontFamily:F,fontWeight:900,fontSize:20,color:C.ink}}>{x.v}</div>
              <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>{x.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone}}>Bloom {result.bloomWater}g for {result.bloomDuration}s · {result.brewTime}</div>
      </>}
      <div style={{marginTop:14,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone,lineHeight:1.6}}>{result&&result.flavor}</div>
    </div>
    <div style={{padding:"12px 22px",background:"rgba(0,0,0,0.03)",display:"flex",justifyContent:"space-between"}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:11,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.01em"}}>Pour Decisions</span>
      <span style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.muted,letterSpacing:"0.14em",textTransform:"uppercase"}}>by Ahmed Al Falahi</span>
    </div>
  </div>;
}

// ── RESULTS ──────────────────────────────────────────────────────
// ── TEMPERATURE REASONING (shared) ───────────────────────────────
function TempReason({r}){
  return <>
    <div style={{border:"2px solid "+C.ink,background:C.card,padding:"16px 18px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
        <span style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted}}>Why {r.temperature}°C</span>
        <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent}}>Safe {r.tempLo}–{r.tempHi}°C</span>
      </div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,lineHeight:1.7,margin:0}}>{r.tempReason}</p>
    </div>
    {r.tip&&<div style={{border:"2px solid "+C.gold,background:C.card,padding:"13px 16px",marginBottom:12}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gold,marginBottom:6}}>Brewer's Tip</div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>{r.tip}</p>
    </div>}
    {r.assumed&&r.assumed.length>0&&<div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.55,padding:"0 2px"}}>Assumed: {r.assumed.join(", ")} — fill these in for more precision.</div>}
  </>;
}

function ManualResult({r,brewMode,qAdj,setQAdj}){
  const gr=r.grindSize+qAdj.ode,tmp=r.temperature+qAdj.temp;
  const rows=[{sym:"◦",label:"Bloom",w:r.bloomWater,cum:r.bloomWater,flow:"2-3 g/s",dur:r.bloomDuration+"s",note:"Saturate all grounds. Wait for full bloom."},...(r.pours||[]).map(p=>({sym:String(p.n).padStart(2,"0"),label:"Pour "+p.n,w:p.water,cum:p.total,flow:p.flow,dur:p.duration+"s",note:p.notes}))];
  return <div className="anim">
    <div style={{display:"flex",background:C.card,border:"2px solid "+C.ink,marginBottom:14}}>
      <BigN val={gr} top="Grind" bot="Ode Gen 2" adjustable adj={qAdj.ode} onMinus={()=>setQAdj(q=>({...q,ode:q.ode-0.5}))} onPlus={()=>setQAdj(q=>({...q,ode:q.ode+0.5}))}/>
      <div style={{width:2,background:C.ink}}/>
      <BigN val={tmp+"°"} top="Temp" bot={r.tempLo+"-"+r.tempHi+"°C"} adjustable adj={qAdj.temp} onMinus={()=>setQAdj(q=>({...q,temp:q.temp-1}))} onPlus={()=>setQAdj(q=>({...q,temp:q.temp+1}))}/>
      <div style={{width:2,background:C.ink}}/>
      <BigN val={r.brewTime} top="Time" bot="target"/>
    </div>
    <div style={{border:"2px solid "+C.ink,marginBottom:14}}>
      <SpecRow label="Coffee" value={r.coffeeDose+"g"}/><SpecRow label="Ratio" value={r.ratio}/>
      <SpecRow label={brewMode==="Iced"?"Hot Water":"Water"} value={r.totalWater+"g"}/>
      {brewMode==="Iced"&&<SpecRow label="Ice" value={r.iceGrams+"g"} sub="in server first"/>}
      <SpecRow label="Agitation" value={r.agitation}/>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>Bloom</span><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{r.bloomWater}g · {r.bloomDuration}s</span></div>
    </div>
    <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink,marginBottom:10}}>Pour Sequence</div>
    <div style={{border:"2px solid "+C.ink,marginBottom:14}}>
      {rows.map((row,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"24px 1fr 50px 50px 56px",gap:8,padding:"12px",borderBottom:i<rows.length-1?"1px solid "+C.line:"none"}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent,paddingTop:2}}>{row.sym}</div>
          <div><div style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.ink,marginBottom:2}}>{row.label}</div><div style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted,lineHeight:1.4}}>{row.note}</div></div>
          <div style={{textAlign:"right",fontFamily:F,fontWeight:700,fontSize:12,color:C.ink,paddingTop:2}}>{row.w}g</div>
          <div style={{textAlign:"right",fontFamily:F,fontWeight:700,fontSize:12,color:C.ink,paddingTop:2}}>{row.cum}g</div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.ink}}>{row.flow}</div><div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.muted}}>{row.dur}</div></div>
        </div>
      ))}
    </div>
    <TempReason r={r}/>
    <ICard label="Brewmaster's Notes · 30 yrs" dark={true}>{r.brewmaster}</ICard>
    <ICard label="Expected Cup">{r.flavor}</ICard>
  </div>;
}
function XbloomResult({r,beanName,qAdj,setQAdj}){
  const gr=r.grindSize+qAdj.x;
  const icedTitle=(beanName?"Iced "+beanName:"Iced Recipe")+" — "+r.iceGrams+"g Ice";
  const totalPour=(r.pours||[]).reduce((s,p)=>s+p.volume,0);
  return <div className="anim">
    {r.isIced&&<div style={{padding:"16px 18px",background:C.card,border:"2px solid "+C.ink,marginBottom:14}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,color:C.accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6}}>Iced Recipe</div>
      <div style={{fontFamily:F,fontWeight:800,fontSize:16,color:C.ink,marginBottom:12}}>{icedTitle}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.line}}>
        {[{l:"Machine brews",v:r.totalVolume+"ml",s:r.ratio},{l:"Add ice",v:r.iceGrams+"g",s:"first"},{l:"Total drink",v:r.totalWithIce+"ml",s:r.targetRatio}].map((x,i)=>(
          <div key={i} style={{background:C.card,padding:"12px 10px"}}>
            <div style={{fontFamily:F,fontWeight:600,fontSize:8,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>{x.l}</div>
            <div style={{fontFamily:F,fontWeight:900,fontSize:17,color:i===1?C.accent:C.ink}}>{x.v}</div>
            <div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.stone}}>{x.s}</div>
          </div>
        ))}
      </div>
    </div>}
    <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink,marginBottom:10}}>Coffee</div>
    <div style={{border:"2px solid "+C.ink,marginBottom:r.over18?10:16}}>
      <SpecRow label="Dripper" value="Omni" sub={r.over18?"app: select Other":""}/>
      <SpecRow label="Dose" value={r.dose+"g"}/>
      <SpecRow label="Coffee : Water" value={r.ratio} sub={r.totalVolume+"ml"}/>
      <SpecRow label="Grind Size" value={gr} sub={xbloomMicrons(gr)+"µm · "+grindZone(gr)}/>
      <SpecRow label="Grinder Speed" value={r.rpm} sub="RPM"/>
      <SpecRow label="Temperature" value={r.temperature+"°C"} sub={r.tempLo+"-"+r.tempHi+"°C"}/>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>Brew Time</span><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{r.brewTime}</span></div>
    </div>
    {r.over18&&<div style={{border:"2px solid "+C.accent,padding:"13px 16px",marginBottom:16,background:C.card}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:6}}>Dose over 18g — app entry</div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>Grind the full <strong>{r.dose}g</strong> and keep using the Omni dripper. The app caps Omni at 18g, so set dose to <strong>18g</strong> at <strong>1:{r.appRatio}</strong> — that lands the same {r.totalVolume}ml of water on your {r.dose}g.</p>
    </div>}
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"baseline"}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink}}>Pours</span>
      <span style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.accent}}>{totalPour} / {r.totalVolume}ml</span>
    </div>
    {(r.pours||[]).map((p,i)=><PourCard key={i} p={p} idx={i}/>)}
    <div style={{border:"2px solid "+C.line,padding:"13px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>Quick Dial — Grind</span>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setQAdj(q=>({...q,x:q.x-1}))} style={{width:30,height:30,background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:700,fontSize:16,cursor:"pointer"}}>−</button>
        <span style={{fontFamily:F,fontWeight:900,fontSize:18,color:C.ink,minWidth:28,textAlign:"center"}}>{gr}</span>
        <button onClick={()=>setQAdj(q=>({...q,x:q.x+1}))} style={{width:30,height:30,background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:700,fontSize:16,cursor:"pointer"}}>+</button>
        {qAdj.x!==0&&<span style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.accent}}>{qAdj.x>0?"+":""}{qAdj.x}</span>}
      </div>
    </div>
    <TempReason r={r}/>
    <ICard label="Brewmaster's Notes · 30 yrs" dark={true}>{r.brewmaster}</ICard>
    <ICard label="Expected Cup">{r.flavor}</ICard>
  </div>;
}

// ── MAIN ──────────────────────────────────────────────────────────
const BLANK={beanName:"",origin:"",region:"",variety:"",process:"",altitude:"",notes:"",noteChips:[],roast:"Light",roastDate:"",goal:"Balanced",bloomRatio:"1:3",brewMode:"Hot",brewer:"",filter:"",dose:"18",ratio:"1:16",xBrewMode:"Hot",xDose:"18",xRatio:"1:16",iceMode:"Auto",iceGrams:""};

export default function App(){
  const [view,setView]=useState("landing");
  const [mode,setMode]=useState("");
  const [form,setForm]=useState(BLANK);
  const [result,setResult]=useState(null);
  const [adj,setAdj]=useState(null);
  const [rev,setRev]=useState(0);
  const [progress,setProgress]=useState(0);
  const [picked,setPicked]=useState(null);
  const [saved,setSaved]=useState([]);
  const [saveMsg,setSaveMsg]=useState("");
  const [rating,setRating]=useState(0);
  const [copyMsg,setCopyMsg]=useState("");
  const [showMore,setShowMore]=useState(false);
  const [showPaste,setShowPaste]=useState(false);
  const [pasteText,setPasteText]=useState("");
  const [parseMsg,setParseMsg]=useState("");
  const [qAdj,setQAdj]=useState({ode:0,x:0,temp:0});
  const [insights,setInsights]=useState([]);

  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleChip=chip=>{ const ch=form.noteChips||[]; upd("noteChips",ch.includes(chip)?ch.filter(c=>c!==chip):[...ch,chip]); };
  const doParse=()=>{
    const got=parseBagText(pasteText);
    const keys=Object.keys(got);
    if(keys.length===0){ setParseMsg("Couldn't read that — try pasting more of the bag text."); setTimeout(()=>setParseMsg(""),4000); return; }
    setForm(f=>({...f,...got}));
    if(got.variety||got.altitude||got.notes||got.region) setShowMore(true);
    setShowPaste(false); setPasteText("");
    const L={beanName:"Name",origin:"Origin",process:"Process",roast:"Roast",altitude:"Altitude",variety:"Variety",notes:"Notes"};
    setParseMsg("✓ Filled "+keys.map(k=>L[k]||k).join(" · ")+". Review and adjust below.");
    setTimeout(()=>setParseMsg(""),6000);
  };
  const reset=()=>{setMode("");setForm(BLANK);setResult(null);setAdj(null);setRev(0);setProgress(0);setPicked(null);setRating(0);setQAdj({ode:0,x:0,temp:0});setShowMore(false);setShowPaste(false);setPasteText("");setParseMsg("");setView("landing");setSaveMsg("");setCopyMsg("");};

  const canB1=!!form.process&&!!form.roast;
  const canManu=!!form.brewer&&!!form.filter&&!!form.dose&&!!form.ratio;
  const canXbl=!!form.xDose&&!!form.xRatio;
  const autoDripper=parseFloat(form.xDose)>18?"Other":"Omni";
  const dRoast=daysOff(form.roastDate);

  function yieldStr(){
    if(mode==="xbloom"){
      const d=parseFloat(form.xDose),r=pRatio(form.xRatio);
      if(!d||!r) return "";
      const total=Math.round(d*r);
      if(form.xBrewMode==="Iced"){
        if(form.iceMode==="Manual"&&parseFloat(form.iceGrams)>0){
          const ice=round5(parseFloat(form.iceGrams)),hot=Math.max(round5(d*3),total-ice);
          return hot+"ml hot (1:"+roundHalf(hot/d)+") + "+ice+"g ice";
        }
        const cat=pc(form.process),iceFrac=cat==="natural"?0.42:cat==="fermented"?0.38:0.40;
        const mr=roundHalf(r*(1-iceFrac)),hot=Math.round(d*mr);
        return hot+"ml hot (1:"+mr+") + "+round5(total-hot)+"g ice";
      }
      return total+"ml";
    }
    const d=parseFloat(form.dose),r=pRatio(form.ratio);
    if(!d||!r) return "";
    const t=Math.round(d*r),ice=round5(t*0.4);
    return form.brewMode==="Iced"?(t-ice)+"g hot + "+ice+"g ice":t+"g water";
  }

  function generate(){
    const r=mode==="xbloom"?calculateXbloom(form,null):calculateManual(form,null);
    setResult(r); setAdj(null); setRev(0); setPicked(null); setSaveMsg(""); setRating(0); setQAdj({ode:0,x:0,temp:0});
    const dl=getDial(form.beanName); setProgress(dl?dl.progress:0);
    setView("result");
  }

  function pickDoctor(item){ setPicked(item); }
  function generateRevision(){
    if(!picked) return;
    const merged={...(adj||{}),ode:((adj&&adj.ode)||0)+(picked.d.ode||0),x:((adj&&adj.x)||0)+(picked.d.x||0),temp:((adj&&adj.temp)||0)+(picked.d.temp||0),bloom:((adj&&adj.bloom)||0)+(picked.d.bloom||0),ratio:((adj&&adj.ratio)||0)+(picked.d.ratio||0)};
    const r=mode==="xbloom"?calculateXbloom(form,merged):calculateManual(form,merged);
    setAdj(merged); setRev(rev+1); setResult(r); setQAdj({ode:0,x:0,temp:0});
    const np=clamp(progress+1,0,5); setProgress(np); setDial(form.beanName,{progress:np,ts:Date.now()});
    setPicked(null); setView("result"); setSaveMsg("");
  }
  function markPerfect(){
    setProgress(5); setDial(form.beanName,{progress:5,dialled:true,ts:Date.now()});
    setView("result"); setSaveMsg("★ Dialled in! Save it to your Bean Journal.");
  }

  function doSave(){
    const chips=form.noteChips||[];
    const notes=[...chips,form.notes].filter(Boolean).join(", ");
    const rec={id:"r"+Date.now(),ts:Date.now(),name:form.beanName||(mode==="xbloom"?"Xbloom Recipe":"Pour Over"),mode,form:{...form,notes},result,rev,rating,goal:form.goal,daysOff:dRoast};
    const ok=saveRec(rec);
    setSaveMsg(ok?"Saved to your Bean Journal ✓":"Could not save — try refreshing");
    if(ok){ const list=loadRecs(); setSaved(list); }
  }
  function doCopy(){
    const txt=recipeText(mode,form,result);
    try{ navigator.clipboard.writeText(txt); setCopyMsg("Copied ✓"); }
    catch(e){ setCopyMsg("Copy not available"); }
    setTimeout(()=>setCopyMsg(""),2500);
  }
  function openSaved(){
    const list=loadRecs(); setSaved(list);
    setInsights(genInsights(list));
    setView("saved");
  }
  function loadSaved(rec){ setMode(rec.mode); setForm(rec.form); setResult(rec.result); setRev(rec.rev||0); setQAdj({ode:0,x:0,temp:0}); setView("result"); }
  function removeSaved(id){ delRec(id); const list=loadRecs(); setSaved(list); setInsights(genInsights(list)); }

  const W={maxWidth:600,margin:"0 auto",padding:"0 22px"};
  const headerNav=(left,right,onLeft)=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:34}}>
      <button onClick={onLeft} style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.ink,background:"none",border:"none",cursor:"pointer"}}>{left}</button>
      <div style={{fontFamily:F,fontWeight:800,fontSize:10,color:C.accent,letterSpacing:"0.16em",textTransform:"uppercase"}}>{right}</div>
    </div>
  );
  const bigHead=t=><div style={{fontFamily:F,fontWeight:800,fontSize:23,color:C.ink,lineHeight:1.1,marginBottom:26,letterSpacing:"-0.02em",whiteSpace:"pre-line"}}>{t}</div>;

  return <>
    <style>{CSS}</style>
    {/* White base — sits below blobs, guarantees white bg in any iframe */}
    <div style={{position:"fixed",inset:0,background:"#FAF9F5",zIndex:-1}}/>
    <Blobs/>
    {/* Main wrapper: transparent so blobs show through, cards have their own white fills */}
    <div style={{minHeight:"100vh",position:"relative",zIndex:1,paddingBottom:60}}>

      {/* LANDING */}
      {view==="landing"&&<div className="anim">
        <div style={{...W,textAlign:"center",paddingTop:72,paddingBottom:40}}>
          <div style={{fontFamily:F,fontWeight:900,fontSize:38,lineHeight:0.9,color:C.ink,letterSpacing:"-0.03em",textTransform:"uppercase"}}>Pour<br/>Decisions</div>
          <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.stone,marginTop:16,letterSpacing:"0.22em",textTransform:"uppercase"}}>by Ahmed Al Falahi</div>
        </div>
        <div style={{...W,display:"flex",flexDirection:"column",gap:12}}>
          <div onClick={()=>{setMode("xbloom");setView("bean");}} style={{border:"2px solid "+C.ink,background:C.card,padding:"22px 24px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{fontFamily:F,fontWeight:900,fontSize:42,color:C.ink,letterSpacing:"-0.06em",lineHeight:1}}>xb</div>
              <div style={{fontFamily:F,fontSize:21,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}><span style={{fontWeight:400}}>x</span><span style={{fontWeight:900}}>Bloom</span><span style={{fontWeight:600}}> Studio</span></div>
            </div>
            <div style={{fontFamily:F,fontWeight:800,fontSize:22,color:C.ink}}>→</div>
          </div>
          <div onClick={()=>{setMode("manual");setView("bean");}} style={{border:"2px solid "+C.ink,background:C.card,padding:"22px 24px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:F,fontWeight:900,fontSize:21,color:C.ink,letterSpacing:"-0.02em",textTransform:"uppercase"}}>Manual<br/><span style={{fontWeight:600,fontSize:15,textTransform:"none"}}>Pour-Over</span></div>
            <div style={{fontFamily:F,fontWeight:800,fontSize:22,color:C.ink}}>→</div>
          </div>
          <button onClick={openSaved} style={{marginTop:8,padding:"14px",background:"transparent",border:"2px solid "+C.line,color:C.stone,fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer"}}>☆ Bean Journal</button>
        </div>
      </div>}

      {/* BEAN JOURNAL */}
      {view==="saved"&&<div className="anim" style={{...W,paddingTop:36}}>
        {headerNav("‹ Home","Bean Journal",reset)}
        {bigHead("Bean\nJournal")}
        {insights.length>0&&<div style={{border:"2px solid "+C.accent,background:C.card,padding:"14px 16px",marginBottom:18}}>
          <div style={{fontFamily:F,fontWeight:800,fontSize:10,color:C.accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Process Intelligence</div>
          {insights.map((s,i)=><div key={i} style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,marginBottom:4}}>· {s}</div>)}
        </div>}
        {saved.length===0&&<div style={{fontFamily:F,fontWeight:500,fontSize:14,color:C.muted,padding:"20px 0"}}>No brews logged yet. Generate a recipe, dial it in, and save it here.</div>}
        {saved.map(rec=>(
          <div key={rec.id} style={{border:"2px solid "+C.ink,padding:"16px",marginBottom:10,background:C.card}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div onClick={()=>loadSaved(rec)} style={{cursor:"pointer",flex:1}}>
                <div style={{fontFamily:F,fontWeight:800,fontSize:15,color:C.ink}}>{rec.name}{rec.rev>0?" · v"+(rec.rev+1):""}</div>
                <div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted,marginTop:3}}>{rec.mode==="xbloom"?"Xbloom":"Manual"} · {rec.goal||"Balanced"} · {new Date(rec.ts).toLocaleDateString()}</div>
                {rec.rating>0&&<div style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.gold,marginTop:4}}>{"★".repeat(rec.rating)}{"☆".repeat(5-rec.rating)}</div>}
              </div>
              <button onClick={()=>removeSaved(rec.id)} style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent2,background:"none",border:"none",cursor:"pointer",padding:"6px 8px"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>}

      {/* BEAN */}
      {view==="bean"&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={1}/>
        {bigHead("Tell me about\nthe bean")}

        {/* Import shortcuts */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <button onClick={()=>alert("Bag scanner — coming in the App Store version.")} style={{padding:"13px 10px",border:"2px solid "+C.line,background:C.card,fontFamily:F,fontWeight:600,fontSize:11,color:C.muted,cursor:"pointer",letterSpacing:"0.04em"}}>📷 Scan Bag</button>
          <button onClick={()=>setShowPaste(s=>!s)} style={{padding:"13px 10px",border:"2px solid "+(showPaste?C.ink:C.ink),background:showPaste?C.ink:C.card,fontFamily:F,fontWeight:700,fontSize:11,color:showPaste?C.white:C.ink,cursor:"pointer",letterSpacing:"0.04em"}}>📋 Paste Bag Text</button>
        </div>
        {showPaste&&<div className="anim" style={{border:"2px solid "+C.ink,background:C.card,padding:16,marginBottom:14}}>
          <Lbl c="Paste the roaster's description"/>
          <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} rows={5} placeholder="Paste from the coffee bag or roaster site — origin, process, variety, altitude, roast level and tasting notes. I'll fill the form for you." style={{width:"100%",boxSizing:"border-box",background:"transparent",border:"2px solid "+C.line,padding:"10px 12px",fontFamily:F,fontWeight:500,fontSize:13,color:C.ink,outline:"none",resize:"vertical",marginTop:8,lineHeight:1.5}}/>
          <div style={{display:"flex",gap:10,marginTop:12}}>
            <button onClick={()=>{setShowPaste(false);setPasteText("");}} style={{flex:1,padding:"12px",border:"2px solid "+C.line,background:"transparent",fontFamily:F,fontWeight:700,fontSize:12,color:C.stone,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>Cancel</button>
            <button onClick={doParse} style={{flex:2,padding:"12px",border:"none",background:C.accent,color:C.white,fontFamily:F,fontWeight:800,fontSize:12,cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.08em"}}>Parse & Fill</button>
          </div>
        </div>}
        {parseMsg&&<div style={{border:"2px solid "+C.accent,background:C.card,padding:"11px 14px",marginBottom:14,fontFamily:F,fontWeight:600,fontSize:12,color:C.ink,lineHeight:1.5}}>{parseMsg}</div>}
        <div style={{textAlign:"center",fontFamily:F,fontWeight:500,fontSize:9,color:C.muted,marginBottom:24,letterSpacing:"0.1em",textTransform:"uppercase"}}>or enter manually</div>

        <div style={{marginBottom:20}}><Lbl c="Bean / Lot Name"/><TIn value={form.beanName} onChange={e=>upd("beanName",e.target.value)} placeholder="e.g. Pink Bourbon, Gesha Village"/></div>

        <div style={{marginBottom:20}}>
          <Lbl c="Origin"/>
          <input list="origin-opts" value={form.origin} onChange={e=>upd("origin",e.target.value)} placeholder="e.g. Ethiopia"
            style={{width:"100%",background:"transparent",border:"none",borderBottom:"2px solid "+(form.origin?C.ink:C.line),padding:"9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:C.ink,outline:"none"}}/>
          <datalist id="origin-opts">
            {["Ethiopia","Kenya","Colombia","Brazil","Panama","Guatemala","Rwanda","Burundi","Yemen","Indonesia","Costa Rica","El Salvador","Honduras","Peru","Bolivia","Nicaragua"].map(o=><option key={o} value={o}/>)}
          </datalist>
        </div>

        <div style={{marginBottom:20}}><Lbl c="Processing Method *"/><Sel value={form.process} onChange={e=>upd("process",e.target.value)} options={PROCESSES} placeholder="Select processing"/></div>

        <div style={{marginBottom:20}}><Lbl c="Roast Level *"/><Seg options={ROASTS} value={form.roast} onChange={v=>upd("roast",v)} small={true}/></div>

        <div style={{marginBottom:22}}>
          <Lbl c="Roast Date"/>
          <TIn type="date" value={form.roastDate} onChange={e=>upd("roastDate",e.target.value)} placeholder=""/>
          {dRoast!==null&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",border:"2px solid "+C.ink,marginTop:10}}>
              <div style={{padding:"12px 14px",borderRight:"1px solid "+C.line}}>
                <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Days Off Roast</div>
                <div style={{fontFamily:F,fontWeight:900,fontSize:28,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}>{dRoast}</div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:4}}>Status</div>
                <div style={{fontFamily:F,fontWeight:700,fontSize:13,color:phaseColorFn(dRoast)}}>{phaseLabel(dRoast)}</div>
                {roastDatePhase(dRoast).key==="degassing"&&<div style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.gold,marginTop:3,lineHeight:1.4}}>⚠ Rest before brewing</div>}
                {roastDatePhase(dRoast).key==="staling"&&<div style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.gold,marginTop:3,lineHeight:1.4}}>⚠ Brew soon</div>}
              </div>
            </div>
          )}
        </div>

        {/* More Details collapsible */}
        <button onClick={()=>setShowMore(m=>!m)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"13px 0",background:"transparent",border:"none",borderTop:"1px solid "+C.line,cursor:"pointer",marginBottom:showMore?18:0}}>
          <span style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.stone,letterSpacing:"0.06em",textTransform:"uppercase"}}>More Details</span>
          <span style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.muted,display:"inline-block",transform:showMore?"rotate(180deg)":"none",transition:"transform .2s"}}>▾</span>
        </button>
        {showMore&&<div className="anim">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 22px"}}>
            <div style={{marginBottom:18}}><Lbl c="Region"/><TIn value={form.region} onChange={e=>upd("region",e.target.value)} placeholder="e.g. Gedeo"/></div>
            <div style={{marginBottom:18}}><Lbl c="Altitude (masl)"/><TIn value={form.altitude} onChange={e=>upd("altitude",e.target.value)} placeholder="e.g. 1900"/></div>
          </div>
          <div style={{marginBottom:18}}>
            <Lbl c="Variety"/>
            <input list="variety-opts" value={form.variety} onChange={e=>upd("variety",e.target.value)} placeholder="e.g. Gesha, SL28, Pink Bourbon"
              style={{width:"100%",background:"transparent",border:"none",borderBottom:"2px solid "+(form.variety?C.ink:C.line),padding:"9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:C.ink,outline:"none"}}/>
            <datalist id="variety-opts">
              {["Geisha","Pink Bourbon","SL28","SL34","Bourbon","Caturra","Typica","Pacamara","Castillo","Wush Wush","Chiroso","Sidra","Heirloom","Batian","K7","Marsellesa"].map(o=><option key={o} value={o}/>)}
            </datalist>
          </div>
          <div style={{marginBottom:18}}><Lbl c="Tasting Notes (from bag)"/><TIn value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="e.g. peach, jasmine, lychee..."/></div>
        </div>}

        <div style={{display:"flex",gap:10,marginTop:24}}>
          <BtnG onClick={reset}>‹ Back</BtnG>
          <BtnP onClick={()=>canB1&&setView("goal")} disabled={!canB1}>Continue →</BtnP>
        </div>
      </div>}

      {/* GOAL */}
      {view==="goal"&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={2}/>
        {bigHead("What do you want\nin the cup?")}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
          {GOALS.map(g=>(
            <button key={g} onClick={()=>upd("goal",g)}
              style={{padding:"16px 18px",border:"2px solid "+(form.goal===g?C.ink:C.line),background:form.goal===g?C.ink:C.card,textAlign:"left",cursor:"pointer"}}>
              <div style={{fontFamily:F,fontWeight:700,fontSize:15,color:form.goal===g?C.white:C.ink,marginBottom:3}}>{g}</div>
              <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:form.goal===g?"rgba(255,255,255,0.65)":C.muted}}>{GOAL_DESC[g]}</div>
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          <BtnG onClick={()=>setView("bean")}>‹ Back</BtnG>
          <BtnP onClick={()=>setView("brew")}>Continue →</BtnP>
        </div>
      </div>}

      {/* BREW - XBLOOM */}
      {view==="brew"&&mode==="xbloom"&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={3}/>
        {bigHead("Configure\nthe machine")}
        <div style={{marginBottom:24}}><Lbl c="Brew Mode"/><Seg options={["Hot","Iced"]} value={form.xBrewMode} onChange={v=>upd("xBrewMode",v)}/></div>
        <RangeField label="Dose" value={form.xDose} min={8} max={25} step={1} unit="g" onChange={v=>upd("xDose",v)}/>
        <div style={{marginTop:-16,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,background:C.ink}}/>
          <span style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.stone}}>Auto dripper: <strong>{autoDripper}</strong></span>
        </div>
        <RangeField label={form.xBrewMode==="Iced"?"Target Ratio (total drink)":"Ratio"} value={pRatio(form.xRatio)||15} min={5} max={25} step={0.5} unit="ratio" onChange={v=>upd("xRatio","1:"+v)}/>
        {form.xBrewMode==="Iced"&&<div style={{marginBottom:24}}>
          <Lbl c="Ice Amount"/>
          <Seg options={["Auto","Manual"]} value={form.iceMode} onChange={v=>upd("iceMode",v)}/>
          {form.iceMode==="Auto"&&<div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone}}>Calculated from process type (Natural ~42%, Fermented ~38%, others ~40% of total).</div>}
          {form.iceMode==="Manual"&&(()=>{
            const tot=Math.round((parseFloat(form.xDose)||18)*(pRatio(form.xRatio)||15));
            const iceMin=round5(tot*0.20),iceMax=round5(tot*0.58),iceVal=parseFloat(form.iceGrams)||round5(tot*0.40);
            return <div style={{marginTop:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                <Lbl c="Ice Grams"/>
                <span style={{fontFamily:F,fontWeight:800,fontSize:22,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}>{iceVal}g</span>
              </div>
              <input type="range" min={iceMin} max={iceMax} step={5} value={iceVal} onChange={e=>upd("iceGrams",e.target.value)}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
                <span style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted}}>{iceMin}g</span>
                <span style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted}}>{iceMax}g</span>
              </div>
            </div>;
          })()}
        </div>}
        <div style={{marginBottom:24}}><Lbl c="Bloom Ratio"/><Seg options={["1:2","1:3"]} value={form.bloomRatio} onChange={v=>upd("bloomRatio",v)}/><div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone}}>{form.bloomRatio==="1:2"?("2x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*2))+"g bloom"):("3x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*3))+"g bloom")}</div></div>
        <YieldBox text={yieldStr()}/>
        <div style={{display:"flex",gap:10}}><BtnG onClick={()=>setView("goal")}>‹ Back</BtnG><BtnP onClick={generate} disabled={!canXbl}>Generate</BtnP></div>
      </div>}

      {/* BREW - MANUAL */}
      {view==="brew"&&mode==="manual"&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={3}/>
        {bigHead("How are you\nbrewing it")}
        <div style={{marginBottom:22}}><Lbl c="Brewer"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>{BREWERS.map(b=><Pill key={b} active={form.brewer===b} onClick={()=>{upd("brewer",b);upd("filter","");}}>{b}</Pill>)}</div></div>
        {form.brewer&&<div style={{marginBottom:22}}><Lbl c="Filter"/><Sel value={form.filter} onChange={e=>upd("filter",e.target.value)} options={FILTERS[form.brewer]||[]} placeholder="Select filter"/></div>}
        <div style={{marginBottom:24}}><Lbl c="Brew Mode"/><Seg options={["Hot","Iced"]} value={form.brewMode} onChange={v=>upd("brewMode",v)}/></div>
        <RangeField label="Dose" value={form.dose} min={8} max={40} step={1} unit="g" onChange={v=>upd("dose",v)}/>
        <RangeField label="Ratio" value={pRatio(form.ratio)||15} min={12} max={18} step={0.5} unit="ratio" onChange={v=>upd("ratio","1:"+v)}/>
        <div style={{marginBottom:24}}><Lbl c="Bloom Ratio"/><Seg options={["1:2","1:3"]} value={form.bloomRatio} onChange={v=>upd("bloomRatio",v)}/><div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone}}>{form.bloomRatio==="1:2"?("2x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*2))+"g bloom"):("3x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*3))+"g bloom")}</div></div>
        <YieldBox text={yieldStr()}/>
        <div style={{display:"flex",gap:10}}><BtnG onClick={()=>setView("goal")}>‹ Back</BtnG><BtnP onClick={generate} disabled={!canManu}>Generate</BtnP></div>
      </div>}

      {/* RESULT */}
      {view==="result"&&result&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontFamily:F,fontWeight:900,fontSize:22,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em"}}>Your Recipe</div>
            {rev>0&&<div style={{fontFamily:F,fontWeight:700,fontSize:10,color:C.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Revision {rev+1}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setView("brew")} style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.ink,background:"none",border:"2px solid "+C.ink,padding:"8px 14px",cursor:"pointer",textTransform:"uppercase"}}>Edit</button>
            <button onClick={reset} style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.stone,background:"none",border:"2px solid "+C.line,padding:"8px 14px",cursor:"pointer",textTransform:"uppercase"}}>New</button>
          </div>
        </div>
        {(progress>0||rev>0)&&<ProgressBar progress={progress}/>}
        {mode==="xbloom"?<XbloomResult r={result} beanName={form.beanName} qAdj={qAdj} setQAdj={setQAdj}/>:<ManualResult r={result} brewMode={form.brewMode} qAdj={qAdj} setQAdj={setQAdj}/>}
        <div style={{display:"flex",gap:10,marginTop:14,marginBottom:10}}>
          <button onClick={()=>setView("timer")} style={{flex:1,padding:"13px",background:C.ink,border:"none",color:C.white,fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>▶ Brew Timer</button>
          <button onClick={()=>setView("share")} style={{flex:1,padding:"13px",background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>Share Card</button>
          {mode==="xbloom"&&<button onClick={()=>setView("export")} style={{flex:1,padding:"13px",background:"transparent",border:"2px solid "+C.line,color:C.stone,fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer"}}>Export</button>}
        </div>
        <div style={{border:"2px solid "+C.ink,background:C.ink,padding:"18px",marginBottom:14}}>
          <div style={{fontFamily:F,fontWeight:900,fontSize:16,color:C.white,textTransform:"uppercase",letterSpacing:"-0.01em",marginBottom:6}}>Brewed it?</div>
          <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.6,marginBottom:14}}>Tell the Coffee Doctor how it tasted and it will dial in your next version.</div>
          <button onClick={()=>{setPicked(null);setView("doctor");}} style={{width:"100%",padding:"14px",background:C.white,border:"none",color:C.ink,fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Open Coffee Doctor</button>
        </div>
        <div style={{border:"2px solid "+C.line,padding:"16px",marginBottom:14,background:C.card}}>
          <Lbl c="Rate this brew"/>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} style={{flex:1,padding:"10px 0",background:n<=rating?C.gold:"transparent",border:"2px solid "+(n<=rating?C.gold:C.line),color:n<=rating?C.white:C.muted,fontFamily:F,fontWeight:800,fontSize:16,cursor:"pointer"}}>★</button>)}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={doSave} style={{flex:2,padding:"14px",background:C.accent,border:"none",color:C.white,fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Save to Journal</button>
            <button onClick={doCopy} style={{flex:1,padding:"14px",background:"transparent",border:"2px solid "+C.ink,color:C.ink,fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer"}}>Copy</button>
          </div>
          {saveMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.accent,textAlign:"center",paddingTop:12}}>{saveMsg}</div>}
          {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.stone,textAlign:"center",paddingTop:8}}>{copyMsg}</div>}
        </div>
      </div>}

      {/* BREW TIMER */}
      {view==="timer"&&result&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Brew Timer",()=>setView("result"))}
        <BrewTimer steps={buildSteps(result,mode)} onClose={()=>setView("result")}/>
      </div>}

      {/* SHARE CARD */}
      {view==="share"&&result&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Share Card",()=>setView("result"))}
        {bigHead("Share\nyour brew")}
        <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,marginBottom:20,lineHeight:1.7}}>Screenshot this card and share it anywhere.</div>
        <ShareCard mode={mode} form={form} result={result}/>
        <button onClick={doCopy} style={{width:"100%",padding:"14px",background:C.ink,border:"none",color:C.white,fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginTop:14}}>Copy Recipe Text</button>
        {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.stone,textAlign:"center",paddingTop:12}}>{copyMsg}</div>}
      </div>}

      {/* COFFEE DOCTOR */}
      {view==="doctor"&&result&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Coffee Doctor",()=>setView("result"))}
        {bigHead("How did\nit taste?")}
        {!picked&&<>
          <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.ink,marginBottom:12}}>What do you want more of?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {DOC_GOALS.map(it=><button key={it.tag} onClick={()=>pickDoctor(it)} style={{textAlign:"left",padding:"15px 16px",background:C.card,border:"2px solid "+C.ink,fontFamily:F,fontWeight:700,fontSize:14,color:C.ink,cursor:"pointer"}}>{it.tag}</button>)}
          </div>
          <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.ink,marginBottom:12}}>Or what went wrong?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
            {DOC_PROBS.map(it=><button key={it.tag} onClick={()=>pickDoctor(it)} style={{padding:"11px 16px",background:"transparent",border:"2px solid "+C.line,fontFamily:F,fontWeight:700,fontSize:13,color:C.stone,cursor:"pointer"}}>{it.tag}</button>)}
            <button onClick={markPerfect} style={{padding:"11px 16px",background:C.gold,border:"2px solid "+C.gold,fontFamily:F,fontWeight:800,fontSize:13,color:C.white,cursor:"pointer"}}>★ Perfect</button>
          </div>
        </>}
        {picked&&<div className="anim">
          <div style={{border:"2px solid "+C.ink,padding:"20px",marginBottom:16,background:C.card}}>
            <div style={{fontFamily:F,fontWeight:900,fontSize:20,color:C.ink,marginBottom:8,textTransform:"uppercase",letterSpacing:"-0.01em"}}>{picked.tag}</div>
            {picked.diag&&<div style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent2,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Diagnosis: {picked.diag}</div>}
            <p style={{fontFamily:F,fontWeight:500,fontSize:14,color:C.stone,lineHeight:1.7,margin:0}}>{picked.why}</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <BtnG onClick={()=>setPicked(null)}>‹ Back</BtnG>
            <BtnP onClick={generateRevision}>Generate Revision →</BtnP>
          </div>
        </div>}
      </div>}

      {/* EXPORT */}
      {view==="export"&&result&&mode==="xbloom"&&<div className="anim" style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Export",()=>setView("result"))}
        {bigHead("Export to\nxBloom")}
        <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,lineHeight:1.7,marginBottom:20}}>Enter these into a new recipe in the xBloom app. Tap Copy to grab the full recipe as text.</div>
        <div style={{border:"2px solid "+C.ink,marginBottom:14}}>
          <div style={{background:C.ink,padding:"12px 16px"}}><span style={{fontFamily:F,fontWeight:800,fontSize:11,color:C.white,letterSpacing:"0.1em",textTransform:"uppercase"}}>Coffee — Basic Specs</span></div>
          <SpecRow label="Dripper" value="Omni" sub={result.over18?"select Other in app":""}/>
          <SpecRow label="Dose" value={result.dose+"g"}/>
          <SpecRow label="Coffee : Water" value={result.ratio} sub={result.totalVolume+"ml"}/>
          <SpecRow label="Grind Size" value={result.grindSize+qAdj.x} sub={grindZone(result.grindSize+qAdj.x)}/>
          <SpecRow label="Grinder Speed" value={result.rpm} sub="RPM"/>
        </div>
        <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.ink,marginBottom:10}}>Pours</div>
        {(result.pours||[]).map((p,i)=><PourCard key={i} p={p} idx={i}/>)}
        {result.over18&&<div style={{border:"2px solid "+C.accent,padding:"13px 16px",marginTop:14,background:C.card}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:6}}>Dose over 18g</div>
          <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>Grind the full {result.dose}g on the Omni. In-app: set dose 18g at 1:{result.appRatio} to match the water volume.</p>
        </div>}
        <button onClick={doCopy} style={{width:"100%",padding:"15px",background:C.accent,border:"none",color:C.white,fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",marginTop:8}}>Copy Full Recipe</button>
        {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.accent,textAlign:"center",paddingTop:12}}>{copyMsg}</div>}
        <div style={{border:"2px solid "+C.line,padding:"14px 16px",marginTop:16,background:C.card}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted,marginBottom:6}}>App Store version</div>
          <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>The native iOS app writes this straight to an xBloom pod over NFC — one tap, no typing. Ratios round to whole numbers for the NFC tag format.</p>
        </div>
      </div>}

      {/* FOOTER */}
      <div style={{...W,borderTop:"2px solid "+C.ink,paddingTop:16,paddingBottom:16,marginTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",background:"transparent"}}>
        <span style={{fontFamily:F,fontWeight:900,fontSize:13,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.01em"}}>Pour Decisions</span>
        <span style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.muted}}>Ahmed Al Falahi</span>
      </div>
    </div>
  </>;
}
