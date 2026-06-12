import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

const C = {
  bg:"#FFFFFF", card:"rgba(255,255,255,0.55)", ink:"#1E0A3C", stone:"#4B4368",
  muted:"#9A8FB8", line:"#E6DFF4",
  accent:"#9333EA", accent2:"#C44FA8", gold:"#C9A227", white:"#FFFFFF",
};
const F = "'Inter', sans-serif";
// glassy lighter-purple used for primary buttons + selected toggles (was near-black C.ink)
const PSEL = "rgba(168,85,247,0.82)";
const PSEL_BD = "rgba(168,85,247,0.92)";

// ── LANGUAGE (en / ar) ───────────────────────────────────────────
let LANG="en";
const AR={
  "Taste Goal":"طابع المذاق","optional":"اختياري","Recommended":"موصى به",
  "Process":"المعالجة","Select":"اختر","Roast Level":"درجة التحميص","Altitude":"الارتفاع","masl":"متر","Tasting Notes":"إيحاءات المذاق","from the bag":"من الكيس",
  "Take a photo of the beans":"التقط صورة للبن","Reading the photo…":"جارٍ قراءة الصورة…",
  "Dial in\nthe brew":"اضبط\nالتحضير",
  "Not sure? Balanced is the safe pick — we tune everything to an even, well-rounded cup.":"غير متأكد؟ المتوازن هو الخيار الآمن — نضبط كل شيء لفنجان متوازن ومتناسق.",
  "Precision pour-over recipes":"وصفات قهوة مقطّرة بدقة",
  "☆ Bean Journal":"☆ سجلّ البن","Bean Journal":"سجلّ البن","Bean\nJournal":"سجلّ\nالبن",
  "Tell me about\nthe bean":"حدّثني عن\nالبن","Choose your\ntaste profile":"اختر\nطابع المذاق",
  "Configure\nthe machine":"جهّز\nالماكينة","How are you\nbrewing it":"كيف\nستحضّرها؟",
  "Share\nyour brew":"شارك\nقهوتك","How did\nit taste?":"كيف كان\nالطعم؟","Export to\nxBloom":"صدّر إلى\nxBloom",
  "Bean":"البن","Goal":"الهدف","Brew":"التحضير","Recipe":"الوصفة",
  "Coffee Name":"اسم القهوة","Origin":"المنشأ","Processing Method *":"طريقة المعالجة *","Roast Level *":"درجة التحميص *",
  "Roast Date":"تاريخ التحميص","Days Off Roast":"أيام منذ التحميص","Status":"الحالة","More Details":"تفاصيل إضافية",
  "Region":"المنطقة","Altitude (masl)":"الارتفاع (متر)","Variety":"السلالة","Tasting Notes (from bag)":"إيحاءات المذاق (من الكيس)",
  "or enter manually":"أو أدخل البيانات يدوياً","Paste the roaster's description":"الصق وصف المحمصة",
  "📋 Paste Bag Text — auto-fill the form":"📋 الصق نص الكيس — تعبئة تلقائية","Cancel":"إلغاء","Parse & Fill":"حلّل واملأ",
  "‹ Back":"‹ رجوع","Continue →":"متابعة ←","Generate":"أنشئ الوصفة",
  "How do you like your coffee?":"كيف تحب قهوتك؟","Hot":"ساخنة","Iced":"مثلّجة",
  "Dose":"الجرعة","Ratio":"النسبة","Target Ratio (total drink)":"النسبة المستهدفة (المشروب كاملاً)",
  "Dripper on the machine":"القمع المركّب على الماكينة","Select your dripper":"اختر القمع","Paper Filter":"ورق الفلتر","Select filter":"اختر الفلتر",
  "Ice Amount":"كمية الثلج","Auto":"تلقائي","Manual":"يدوي","Ice Grams":"غرامات الثلج","Bloom Ratio":"نسبة الإزهار","Yield Preview":"معاينة الناتج",
  "Brewer":"أداة التحضير","Filter":"الفلتر","Grinder":"المطحنة","Brew Mode":"وضع التحضير",
  "Your Recipe":"وصفتك","Edit":"تعديل","New":"جديد","Coffee":"القهوة","Pours":"الصبّات","Pour Sequence":"تسلسل الصبّات",
  "Grind":"الطحن","Temp":"الحرارة","Time":"الوقت","target":"الهدف",
  "Dripper":"القمع","Coffee : Water":"قهوة : ماء","Grind Size":"درجة الطحن","Grinder Speed":"سرعة المطحنة",
  "Temperature":"الحرارة","Expected Cup":"الفنجان المتوقع","Agitation":"التحريك","Bloom":"الإزهار","Brew Time":"وقت التحضير",
  "Water":"الماء","Hot Water":"الماء الساخن","Ice":"الثلج","Rinse & preheat":"اشطف وسخّن",
  "Share Card":"بطاقة المشاركة","Export":"تصدير","Brewed it?":"حضّرتها؟","Open Coffee Doctor":"افتح طبيب القهوة",
  "Rate this brew":"قيّم هذه القهوة","Save to Journal":"احفظ في السجل","Copy":"نسخ","Copy Full Recipe":"انسخ الوصفة كاملة","Copy Recipe Text":"انسخ نص الوصفة",
  "Brew Notes":"ملاحظات التحضير","Coffee Fact":"معلومة قهوة","Brewer's Tip":"نصيحة المحضّر",
  "Clarity":"صفاء","Sweetness":"حلاوة","Balanced":"متوازن","Body":"قوام","Acidity":"حموضة",
  "Light":"فاتح","Light-Med":"فاتح-وسط","Medium":"وسط","Med-Dark":"وسط-غامق","Dark":"غامق",
  "1:3 (recommended)":"1:3 (موصى بها)","Rinse first":"اشطفه أولاً","No rinse needed":"لا يحتاج شطفاً",
  "Calibrating":"جاري المعايرة","Reading the bean":"قراءة البن","Balancing extraction":"موازنة الاستخلاص","Locking temperature":"تثبيت الحرارة",
  "What do you want more of?":"ماذا تريد أكثر؟","Or what went wrong?":"أو ما الذي لم يعجبك؟",
  "Coffee Doctor":"طبيب القهوة","Home":"الرئيسية","Journal":"السجلّ","About":"حول","Close":"إغلاق","Delete":"حذف",
  "Select processing":"اختر طريقة المعالجة","Select brewer":"اختر الأداة","‹ Home":"‹ الرئيسية","‹ Recipe":"‹ الوصفة",
  "Pour":"صبّة","Card Dose":"جرعة البطاقة","Card Ratio":"نسبة البطاقة","Cup Type":"نوع الكوب",
  "Send to xBloom":"أرسل إلى xBloom","Show card bytes":"عرض بيانات البطاقة","Hide card bytes":"إخفاء بيانات البطاقة",
  "Same bean, different cup. Your goal tells the engine what to chase — it shifts the grind, water temperature, bloom time and agitation to steer the extraction toward the flavours you actually want.":"نفس البن، فنجان مختلف. هدفك يخبر المحرّك بما يطارده — فيغيّر الطحن وحرارة الماء وزمن الإزهار والتحريك ليوجّه الاستخلاص نحو النكهات التي تريدها فعلاً.",
  "Distinct, separated flavours — tea-like and delicate. Coarser grind, gentler pours, faster drawdown.":"نكهات واضحة ومنفصلة — شبيهة بالشاي ورقيقة. طحن أخشن وصبّ ألطف وتصفية أسرع.",
  "Round, caramel-forward sweetness. Slightly finer grind and longer contact to develop the sugars.":"حلاوة دائرية بطابع الكراميل. طحن أنعم قليلاً وتلامس أطول لتطوير السكريات.",
  "A bit of everything, nothing dominating. The safe default for a bean you don't know yet.":"القليل من كل شيء دون طغيان. الخيار الآمن لبنّ لا تعرفه بعد.",
  "Heavy, syrupy mouthfeel — chocolate and weight. Finer grind, more agitation, longer brew.":"قوام ثقيل وكثيف — شوكولاتة ووزن. طحن أنعم وتحريك أكثر وتحضير أطول.",
  "Bright and juicy — lifts the citrus and fruit acids. Cooler water and a lighter touch.":"مشرقة وعصيرية — تُبرز حموضة الحمضيات والفواكه. ماء أبرد ولمسة أخف.",
};
const t=s=>(LANG==="ar"&&typeof s==="string")?(AR[s]??s):s;

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
const PROCESSES = ["Washed","Natural","Honey","Honey Fermentation","Honey Fruit Fermented","Anaerobic Natural","Anaerobic Washed","Anaerobic with Fruits","Extended Anaerobic","Anaerobic Chocolate","Co-Fermented","Flavor Infusion","Carbonic Maceration","Thermal Shock","Koji Fermented","Nitrogen Infusion","Wet-Hulled (Giling Basah)","Double Fermented","Extended Fermentation","Experimental / Other"];
const ROASTS   = ["Light","Light-Med","Medium","Med-Dark","Dark"];
const GOALS    = ["Clarity","Sweetness","Balanced","Body","Acidity"];
const GOAL_PICK = ["Clarity","Balanced","Body"]; // the 3 shown in the dial-in (optional)
const GOAL_RECO = "Balanced";                     // badged "Recommended"

// ── GRINDER DATABASE (community-calibrated, linear micron models) ─
const odeMicrons=s=>Math.round(250+(s-1)*85);
const GRINDERS=[
  {id:"Fellow Ode Gen 2",  from:m=>Math.max(1,Math.min(11,Math.round((1+(m-250)/85)*10)/10)), fmt:v=>v.toFixed(1),               scale:"dial 1–11"},
  {id:"Comandante C40",    from:m=>Math.max(10,Math.min(40,Math.round(m/30))),                 fmt:v=>v+" clicks",                scale:"clicks from zero"},
  {id:"1Zpresso ZP6",      from:m=>Math.max(8,Math.min(55,Math.round((m-200)/12.5))),          fmt:v=>Math.floor(v/10)+"."+(v%10), scale:"rotations.clicks"},
  {id:"1Zpresso K-Ultra",  from:m=>Math.max(40,Math.min(110,Math.round(m/8.2))),               fmt:v=>Math.floor(v/10)+"."+(v%10), scale:"numbers.clicks"},
  {id:"Timemore C3",       from:m=>Math.max(8,Math.min(30,Math.round((m-100)/28))),            fmt:v=>v+" clicks",                scale:"clicks from zero"},
  {id:"Timemore Sculptor", from:m=>Math.max(30,Math.min(100,Math.round(m/9))),                 fmt:v=>String(v),                  scale:"dial"},
  {id:"DF64",              from:m=>Math.max(20,Math.min(90,Math.round(m/10.5))),               fmt:v=>String(v),                  scale:"dial"},
  {id:"EK43",              from:m=>Math.max(1,Math.min(11,Math.round((m/90)*2)/2)),            fmt:v=>v.toFixed(1),               scale:"dial"},
  {id:"Other / Microns",   from:m=>m,                                                          fmt:v=>v+" µm",                    scale:"target microns"},
];
const grinderOut=(gid,odeSetting)=>{const m=odeMicrons(odeSetting);const g=GRINDERS.find(x=>x.id===gid)||GRINDERS[0];return {name:g.id,display:g.fmt(g.from(m)),microns:m,scale:g.scale};};

// ── XBLOOM DRIPPER DATABASE (grind offsets on the 1–80 scale) ────
const XDRIPPERS=[
  {id:"Omni",            grind:0,  note:"xBloom's fast flat-bottom — the baseline"},
  {id:"Hario V60",       grind:-2, note:"fast cone — grind finer so it doesn't race"},
  {id:"Kalita Wave",     grind:1,  note:"restricted flat bed — slightly coarser"},
  {id:"Origami (cone)",  grind:-2, note:"with a cone filter it brews like a V60"},
  {id:"April Brewer",    grind:1,  note:"gentle flat bed — slightly coarser"},
  {id:"Orea",            grind:0,  note:"fast flat — behaves close to the Omni"},
  {id:"Timemore B75",    grind:0,  note:"Crystal Eye flat-bottom — fast, even and forgiving, close to the Omni"},
];

// ── XBLOOM FILTER DATABASE (researched flow + rinse behaviour) ───
const XFILTERS=[
  {id:"xBloom Standard",        rinse:true,  note:"the stock flat-bottom paper — rinse it first or you'll taste the paper"},
  {id:"xBloom Premium (flat)",  rinse:false, note:"thick food-grade paper, pleated for even flow — taste-neutral, no rinsing needed"},
  {id:"xBloom Premium Conical", rinse:false, note:"the no-rinse premium paper cut for cone drippers (V60 / Origami)"},
  {id:"Hario V60 02",           rinse:true,  note:"classic fast cone paper — rinse to kill paper taste and preheat the cone"},
  {id:"Kalita Wave 185",        rinse:true,  note:"the wave shape keeps the bed flat and slows flow slightly — rinse gently so it holds its ridges"},
  {id:"Cafec Abaca",            rinse:true,  note:"abaca fibre keeps draining fast even late in the brew — quick rinse"},
  {id:"Sibarist Fast",          rinse:true,  note:"ultra-fast specialty paper — drawdown speeds up noticeably, expect a brighter, lighter cup"},
];
const GOAL_DESC= {
  Clarity:"Distinct, separated flavours — tea-like and delicate. Coarser grind, gentler pours, faster drawdown.",
  Sweetness:"Round, caramel-forward sweetness. Slightly finer grind and longer contact to develop the sugars.",
  Balanced:"A bit of everything, nothing dominating. The safe default for a bean you don't know yet.",
  Body:"Heavy, syrupy mouthfeel — chocolate and weight. Finer grind, more agitation, longer brew.",
  Acidity:"Bright and juicy — lifts the citrus and fruit acids. Cooler water and a lighter touch.",
};
const NOTE_CHIPS=["Peach","Berry","Floral","Citrus","Chocolate","Caramel","Jasmine","Wine","Tropical","Nuts","Vanilla","Honey","Earthy","Stone Fruit","Blackcurrant","Tobacco"];
const ORIGIN_CHIPS=["Ethiopia","Kenya","Colombia","Brazil","Panama","Guatemala","Rwanda","Yemen","Indonesia","Costa Rica"];
const VARIETY_CHIPS=["Geisha","Pink Bourbon","SL28","Bourbon","Caturra","Typica","Pacamara","Castillo","Wush Wush","Heirloom"];

// ── BREW SCIENCE ─────────────────────────────────────────────────
const FLAT=["Kalita Wave","Sibarist FLAT","Melodrip","Tricolate","Fellow Stagg [X]"];
const bt=b=>b==="Chemex"?"chemex":FLAT.includes(b)?"flat":"conical";
const pc=p=>p==="Washed"?"washed":p==="Natural"?"natural":p==="Honey"?"honey":"fermented";
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
    "Carbonic Maceration":"carbonic","Thermal Shock":"anaerobic","Koji Fermented":"extended","Nitrogen Infusion":"nitrogen",
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
// xBloom scale: 180µm at 0 → 1048µm at 80, equal 10.85µm steps (official chart)
function xbloomMicrons(s){ return Math.round(180+s*10.85); }
// Zones per the official chart: Espresso 1-15, AeroPress 15-40, Pour Over 30-70, Cold Brew/French Press 55-80
function grindZone(s){ if(s<=15) return "Espresso"; if(s<30) return "AeroPress"; if(s<=40) return "AeroPress / Pour Over"; if(s<55) return "Pour Over"; if(s<=70) return "Pour Over / French Press"; return "Cold Brew / French Press"; }
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
function calcXPours(dose,totalVol,temp,process,goal,bloomMult,bloomSec){
  const bloomVol=Math.round(dose*(bloomMult||2.5)),rem=totalVol-bloomVol;
  const bs=bloomSec||45;
  const cat=pc(process);
  let fr=Math.round((cat==="washed"?3.1:3.3+goalContact(goal))*10)/10;
  const pt=cat==="fermented"?"Circular":"Spiral";
  const agAfter=(cat==="fermented"||cat==="natural"||goal==="Body");
  // Descending temperature curve: bloom hottest, each subsequent pour steps down 1°C
  const td=(i)=>Math.max(temp-i,Math.max(temp-3,84));
  if(rem<160){
    const p1=Math.round(rem*0.55);
    return[{n:1,volume:bloomVol,temperature:td(0),flowRate:3.0,pause:bs,pourType:"Spiral",agitationBefore:false,agitationAfter:agAfter,notes:"Bloom"},{n:2,volume:p1,temperature:td(1),flowRate:fr,pause:12,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"Main pour"},{n:3,volume:rem-p1,temperature:td(2),flowRate:fr,pause:0,pourType:"Centered",agitationBefore:false,agitationAfter:false,notes:"Final pour"}];
  }
  const p1=Math.round(rem*0.40),p2=Math.round(rem*0.35),p3=rem-p1-p2;
  return[{n:1,volume:bloomVol,temperature:td(0),flowRate:3.0,pause:bs,pourType:"Spiral",agitationBefore:false,agitationAfter:agAfter,notes:"Bloom"},{n:2,volume:p1,temperature:td(1),flowRate:fr,pause:15,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"First pour"},{n:3,volume:p2,temperature:td(2),flowRate:fr,pause:10,pourType:pt,agitationBefore:false,agitationAfter:false,notes:"Second pour"},{n:4,volume:p3,temperature:td(3),flowRate:fr,pause:0,pourType:"Centered",agitationBefore:false,agitationAfter:false,notes:"Final pour"}];
}
function flavorNote(form,isIced,goal){
  const cat=pc(form.process),a=alt(form.altitude),r=ri(form.roast);
  const base=
    cat==="washed"?(r<=1?(a>1700?"high clarity — floral, citrus and stone fruit riding a vibrant, sparkling acidity":"a clean, bright cup with mild fruit sweetness and balanced acidity"):"soft chocolate, caramel and toasted nuts with gentle acidity"):
    cat==="natural"?(r<=1?"a fruit-forward cup — berries, tropical fruit and chocolate over a full round body":"deep dark-fruit sweetness, chocolate and a syrupy body"):
    cat==="honey"?(r<=1?"stone fruit, brown sugar and light florals on a smooth medium body":"caramel, dried fruit and a silky body"):
    "a wild, layered cup — wine-like, tropical, fruit-candy notes that keep shifting as it cools";
  const twist={
    Clarity:"Dialled for clarity, so the high notes should ring separate and tea-like rather than blending together.",
    Sweetness:"Dialled for sweetness — the mid-tones should round out and turn caramel as the cup cools a little.",
    Body:"Dialled for body — expect it heavier and denser, more cocoa than sparkle.",
    Acidity:"Dialled bright — the acids lead, juicy and citric from the first sip.",
    Balanced:"Dialled for balance — nothing should dominate; an even, complete cup.",
  }[goal||"Balanced"];
  const bagNotes=[form.notes,...(form.noteChips||[])].filter(Boolean).join(", ");
  const noteLine=bagNotes?" The roaster promises "+bagNotes.toLowerCase()+" — listen for those around the second sip.":"";
  const iceLine=isIced?" Over ice the aromatics tighten up: more snap, less perfume.":"";
  return "Expect "+base+". "+twist+noteLine+iceLine;
}

// ── COFFEE FACTS (one per recipe, just for fun) ──────────────────
const COFFEE_FACTS=[
  "A coffee bean isn't a bean — it's the seed of a cherry. When only one seed grows instead of two, you get a rounder 'peaberry'.",
  "Roasting barely changes caffeine. Light and dark roasts carry nearly the same — dark just tastes stronger.",
  "Ethiopia is coffee's birthplace. Legend credits a goat herder named Kaldi, who noticed his goats dancing after eating the cherries.",
  "A single espresso has less caffeine than a mug of filter coffee — concentration isn't quantity.",
  "The bloom exists because roasting traps CO2 inside the bean. The fresher the coffee, the bigger the bubble dome.",
  "Researchers have identified over 1,000 aroma compounds in roasted coffee — more than in wine.",
  "Finland drinks more coffee per person than any other country — roughly four cups a day.",
  "Decaf isn't caffeine-free. A cup still carries about 2–5 mg of caffeine.",
  "Hot water pulls acids first, then sugars, then bitter compounds — every recipe is really just choosing when to stop.",
  "Coffee was controversial enough to be banned in Mecca in 1511 and attacked in a London women's petition in 1674.",
  "Instant coffee (1901) is older than the espresso machine (1906).",
  "Grind size is measured in microns — a human hair is about 70µm, your pour-over grounds are about ten times that.",
  "The world record espresso shot was pulled from beans aged over 20 years — but for pour-over, 10–21 days off roast is the sweet spot.",
  "Arabica grows best above 1,000m — altitude slows the cherry's ripening, packing in denser, sweeter sugars.",
];
const pickFact=()=>COFFEE_FACTS[Math.floor(Math.random()*COFFEE_FACTS.length)];

function brewmasterNote(process,roast,altitude,isIced,d,goal){
  const cat=pc(process),a=alt(altitude),p=roastPhase(d);
  let s="";
  if(cat==="washed") s+="A clean washed lot rewards patience. Keep the kettle moving in slow circles, never let the bed go dry.";
  else if(cat==="natural") s+="Naturals carry huge fruit but muddy fast if you bully them. Pour gently, protect the bed.";
  else if(cat==="honey") s+="Honey process sits between clean and fruity. A touch below boiling keeps the sugars round.";
  else s+="Fermented lots are wild — they extract fast and turn boozy if you rush. A hair finer, a couple degrees cooler, respect the bloom.";
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
  return {grindSize:grind,grinderId:form.grinder||"Fellow Ode Gen 2",temperature:te.temp,tempLo:te.lo,tempHi:te.hi,tempReason:te.reason,tip:te.tip,assumed:te.assumed,totalWater:hotWater,iceGrams,coffeeDose:dose,ratio:"1:"+ratio,bloomWater,bloomDuration:bd,agitation:goalAgi(goal),pours:calcPours(form.brewer,dose,hotWater,bloomWater,goal),brewTime:(bt(form.brewer)==="chemex"?"4:00-5:00":bt(form.brewer)==="flat"?"3:30-4:30":hotWater<200?"2:30-3:00":"3:00-3:30"),brewmaster:brewmasterNote(form.process,form.roast,form.altitude,isIced,d,goal),flavor:flavorNote(form,isIced,goal),fact:pickFact()};
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
      // ice fraction depends on process: Natural ~42%, Fermented ~38%, others ~40% of total
      const iceFrac=pc(form.process)==="natural"?0.42:pc(form.process)==="fermented"?0.38:0.40;
      machineRatio=roundHalf(ratio*(1-iceFrac));
      hotWater=Math.round(dose*machineRatio);
      iceGrams=round5(totalTarget-hotWater);
    }
  }
  const te=tempEngine(form,isIced,adj);
  const temp=te.temp;
  // Omni caps at 18g — at or under 18g the stock Omni is used; over 18g the user picks another dripper.
  const over18=dose>18;
  const xd=over18?(XDRIPPERS.find(z=>z.id===form.xDripper)||XDRIPPERS[0]):XDRIPPERS[0];
  const g0=calcGrindX(form.process,form.roast,form.altitude,isIced,d,goal,adj);
  const grind=clamp(g0+xd.grind,20,72);
  const rpm=calcRPM(form.process,form.roast,goal);
  const dripper=xd.id;
  const filter=XFILTERS.find(f=>f.id===form.xFilter)||null;
  const needsOther=over18||dripper!=="Omni";
  const appDose=over18?18:dose;
  const appRatio=over18?roundHalf(hotWater/18):machineRatio;
  const bloomMult=form.bloomRatio==="1:2"?2:3;
  const bd=bloomTime(form.process,d,goal,adj);
  const cupOut=Math.round((isIced?totalTarget:hotWater)-dose*2.1);
  return {dripper,filter,needsOther,dose,over18,appDose,appRatio,grindSize:grind,grindMicrons:xbloomMicrons(grind),grindZoneLabel:grindZone(grind),rpm,ratio:"1:"+machineRatio,targetRatio:form.xRatio,totalVolume:hotWater,iceGrams,totalWithIce:totalTarget,cupOut,bloomRatio:form.bloomRatio||"1:3",bloomDuration:bd,temperature:temp,tempLo:te.lo,tempHi:te.hi,tempReason:te.reason,tip:te.tip,assumed:te.assumed,agitation:goalAgi(goal),pours:calcXPours(dose,hotWater,temp,form.process,goal,bloomMult,bd),brewTime:"3:00-3:30",isIced,brewmaster:brewmasterNote(form.process,form.roast,form.altitude,isIced,d,goal),flavor:flavorNote(form,isIced,goal),fact:pickFact()};
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
  const L=["CALIBRATED POURS — "+(form.beanName||"Recipe")];
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

// ── XPOD CARD ENCODER (ported from XBRecipeWriterPlus 2.2.0) ─────
// Builds the exact byte payload an xBloom NFC card stores after its
// 32-byte signature: XID(7) · cupType(1) · pourCount<<3(1) · 8 bytes
// per pour · grind-40(1) · ratio(1) · CRC-8/MAXIM(1).
// Cards lock the machine dose to 15g and only take whole-number ratios,
// so the recipe is rescaled to 15g × integer ratio (same water, same cup).
const CRC8_TABLE=[
  0x00,0x5E,0xBC,0xE2,0x61,0x3F,0xDD,0x83,0xC2,0x9C,0x7E,0x20,0xA3,0xFD,0x1F,0x41,
  0x9D,0xC3,0x21,0x7F,0xFC,0xA2,0x40,0x1E,0x5F,0x01,0xE3,0xBD,0x3E,0x60,0x82,0xDC,
  0x23,0x7D,0x9F,0xC1,0x42,0x1C,0xFE,0xA0,0xE1,0xBF,0x5D,0x03,0x80,0xDE,0x3C,0x62,
  0xBE,0xE0,0x02,0x5C,0xDF,0x81,0x63,0x3D,0x7C,0x22,0xC0,0x9E,0x1D,0x43,0xA1,0xFF,
  0x46,0x18,0xFA,0xA4,0x27,0x79,0x9B,0xC5,0x84,0xDA,0x38,0x66,0xE5,0xBB,0x59,0x07,
  0xDB,0x85,0x67,0x39,0xBA,0xE4,0x06,0x58,0x19,0x47,0xA5,0xFB,0x78,0x26,0xC4,0x9A,
  0x65,0x3B,0xD9,0x87,0x04,0x5A,0xB8,0xE6,0xA7,0xF9,0x1B,0x45,0xC6,0x98,0x7A,0x24,
  0xF8,0xA6,0x44,0x1A,0x99,0xC7,0x25,0x7B,0x3A,0x64,0x86,0xD8,0x5B,0x05,0xE7,0xB9,
  0x8C,0xD2,0x30,0x6E,0xED,0xB3,0x51,0x0F,0x4E,0x10,0xF2,0xAC,0x2F,0x71,0x93,0xCD,
  0x11,0x4F,0xAD,0xF3,0x70,0x2E,0xCC,0x92,0xD3,0x8D,0x6F,0x31,0xB2,0xEC,0x0E,0x50,
  0xAF,0xF1,0x13,0x4D,0xCE,0x90,0x72,0x2C,0x6D,0x33,0xD1,0x8F,0x0C,0x52,0xB0,0xEE,
  0x32,0x6C,0x8E,0xD0,0x53,0x0D,0xEF,0xB1,0xF0,0xAE,0x4C,0x12,0x91,0xCF,0x2D,0x73,
  0xCA,0x94,0x76,0x28,0xAB,0xF5,0x17,0x49,0x08,0x56,0xB4,0xEA,0x69,0x37,0xD5,0x8B,
  0x57,0x09,0xEB,0xB5,0x36,0x68,0x8A,0xD4,0x95,0xCB,0x29,0x77,0xF4,0xAA,0x48,0x16,
  0xE9,0xB7,0x55,0x0B,0x88,0xD6,0x34,0x6A,0x2B,0x75,0x97,0xC9,0x4A,0x14,0xF6,0xA8,
  0x74,0x2A,0xC8,0x96,0x15,0x4B,0xA9,0xF7,0xB6,0xE8,0x0A,0x54,0xD7,0x89,0x6B,0x35,
];
const crc8=arr=>{let c=0;for(const b of arr)c=CRC8_TABLE[(c^b)&0xff];return c;};
const PATTERN_BYTE={Centered:0,Circular:1,Spiral:2};
function buildCardData(r){
  const pours=r.pours||[];
  if(!pours.length) return null;
  const cardRatio=Math.max(1,Math.round(r.totalVolume/15));
  const cardTotal=15*cardRatio;                       // machine verifies sum(pours) === 15 × ratio
  const sum=pours.reduce((s,p)=>s+p.volume,0)||1;
  const vols=pours.map(p=>Math.round(p.volume*cardTotal/sum));
  vols[vols.length-1]+=cardTotal-vols.reduce((a,b)=>a+b,0);
  const grindClamped=r.grindSize<40;
  const grindByte=clamp(r.grindSize,40,80)-40;        // card stores grind − 40 (byte 41 = grinder off)
  const data=[0,0,0,0,0,0,0];                          // XID: blank (custom recipe)
  data.push(0x01);                                     // cup type: Other (overflow protection off → no waits)
  data.push(pours.length<<3);
  pours.forEach((p,i)=>{
    data.push(vols[i]);
    data.push(p.temperature);
    data.push(PATTERN_BYTE[p.pourType]??1);
    data.push((p.agitationBefore?1:0)|(p.agitationAfter?2:0));
    const pause=Math.min(p.pause||0,255);
    data.push(pause===0?0:(256-pause)&0xFF);
    data.push(i===0?15:0);                             // dose byte lives in the first pour
    data.push(i===0?r.rpm:0);                          // RPM byte lives in the first pour
    data.push(Math.round(p.flowRate*10));              // flow stored ×10 (valid 30–35)
  });
  data.push(grindByte);
  data.push(cardRatio);
  data.push(crc8(data));
  return {bytes:data,cardRatio,cardTotal,vols,grindClamped,grindUsed:clamp(r.grindSize,40,80)};
}
const cardHex=a=>a.map(b=>(b&0xFF).toString(16).padStart(2,"0").toUpperCase()).join(" ");

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

// ── CALIBRATING TRANSITION (gooey morph through the engine's steps) ──
function Calibrating({onDone}){
  return <div style={{maxWidth:600,margin:"0 auto",padding:"150px 22px 0",textAlign:"center"}}>
    <div className="anim" style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:C.accent,marginBottom:30}}>{t("Calibrating")}</div>
    <MorphTitle fontSize={25} morphTime={0.95} hold={0.55} onDone={onDone}
      texts={[t("Reading the bean"),t("Balancing extraction"),t("Locking temperature")]}/>
  </div>;
}

// Expandable step tabs — icons in a glass pill; the active step springs open to show its name.
// Completed steps stay tappable (navigate back); future steps are locked until you reach them.
const STEP_IC={
  bean:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><ellipse cx="12" cy="12" rx="7.5" ry="10" transform="rotate(38 12 12)"/><path d="M8.5 6.5c4 3 4 8 7 11" transform="rotate(2 12 12)"/></svg>,
  goal:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/></svg>,
  brew:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h12M4 12h16M4 18h10"/><circle cx="18" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></svg>,
  recipe:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 4.5c0-1 .8-1 .8-2M12 4.5c0-1 .8-1 .8-2"/></svg>,
};
const TAB_SPRING={delay:0.05,type:"spring",bounce:0,duration:0.55};
function ProgressSteps({current,onStep}){
  const steps=[{k:"bean",label:"Bean"},{k:"brew",label:"Brew"},{k:"recipe",label:"Recipe"}];
  return(
    <div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 6px",borderRadius:999,position:"relative",isolation:"isolate",width:"fit-content",marginBottom:26}}>
      <span className="lg-lens lg-lite" style={{backgroundColor:"rgba(255,255,255,0.30)",borderRadius:999}}/>
      {steps.map((s,i)=>{
        const n=i+1,act=n===current,done=n<current;
        return(
          <motion.button key={s.k} initial={false} custom={act}
            animate={{gap:act?7:0,paddingLeft:act?13:9,paddingRight:act?13:9}}
            transition={TAB_SPRING}
            onClick={()=>done&&onStep&&onStep(s.k)}
            aria-current={act?"step":undefined}
            style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",height:34,border:"none",borderRadius:999,
              background:act?PSEL:"transparent",
              color:act?C.white:done?C.accent:C.muted,
              cursor:done?"pointer":"default",
              fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",
              boxShadow:act?"inset 1.5px 2px 0px -1px rgba(255,255,255,0.35), 0 2px 8px rgba(30,10,60,0.25)":"none"}}>
            <span style={{display:"flex"}}>{STEP_IC[s.k]}</span>
            <AnimatePresence initial={false}>
              {act&&<motion.span initial={{width:0,opacity:0}} animate={{width:"auto",opacity:1}} exit={{width:0,opacity:0}}
                transition={TAB_SPRING} style={{overflow:"hidden",whiteSpace:"nowrap"}}>{t(s.label)}</motion.span>}
            </AnimatePresence>
          </motion.button>
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
  "input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:5px;background:rgba(150,130,210,0.25);border-radius:3px;outline:none;cursor:pointer}"+
  "input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:#fff;border:1.5px solid rgba(168,85,247,0.55);box-shadow:0 2px 10px rgba(94,68,180,0.35);cursor:pointer}"+
  "input[type=range]::-moz-range-thumb{width:26px;height:26px;border-radius:50%;background:#fff;border:1.5px solid rgba(168,85,247,0.55);box-shadow:0 2px 10px rgba(94,68,180,0.35);cursor:pointer}"+
  "@keyframes b1{0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg)}20%{transform:translate(-42%,-58%) scale(1.12) rotate(25deg)}40%{transform:translate(-56%,-42%) scale(0.9) rotate(-18deg)}60%{transform:translate(-44%,-56%) scale(1.08) rotate(35deg)}80%{transform:translate(-54%,-44%) scale(0.95) rotate(-12deg)}}"+
  "@keyframes b2{0%,100%{transform:translate(-30%,-65%) scale(0.82)}33%{transform:translate(-70%,-35%) scale(1.05)}66%{transform:translate(-50%,-50%) scale(0.9)}}"+
  "@keyframes b3{0%,100%{transform:translate(-75%,-30%) scale(0.68)}50%{transform:translate(-25%,-70%) scale(0.88)}}"+
  "@keyframes b4{0%,100%{transform:translate(-20%,-20%) scale(0.75)}40%{transform:translate(-80%,-80%) scale(0.95)}70%{transform:translate(-60%,-40%) scale(0.8)}}"+
  "@keyframes b5{0%,100%{transform:translate(-85%,-55%) scale(0.6)}50%{transform:translate(-15%,-45%) scale(0.78)}}"+
  "@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}"+
  ".anim{animation:rise 0.4s cubic-bezier(.16,1,.3,1) both}"+
  /* ── liquid glass system ── */
  ".lg{position:relative;isolation:isolate;border:none;background:transparent;cursor:pointer;transition:transform .45s cubic-bezier(0.175,0.885,0.32,1.6)}"+
  ".lg:active{transform:scale(0.96)}"+
  "@media(hover:hover){.lg:not(:disabled):hover{transform:scale(1.025)}}"+
  ".lg:disabled{opacity:0.45;cursor:not-allowed}"+
  ".lg-lens{position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;"+
    "backdrop-filter:blur(8px) url(#liquid-glass) saturate(160%);"+
    "-webkit-backdrop-filter:blur(8px) saturate(160%);"+
    "box-shadow:inset 0 0 0 1px rgba(255,255,255,0.10),inset 1.8px 3px 0px -2px rgba(255,255,255,0.90),inset -2px -2px 0px -2px rgba(255,255,255,0.80),inset -3px -8px 1px -6px rgba(255,255,255,0.60),inset -0.3px -1px 4px 0px rgba(30,10,60,0.12),inset -1.5px 2.5px 0px -2px rgba(30,10,60,0.20),inset 0px 3px 4px -2px rgba(30,10,60,0.20),inset 2px -6.5px 1px -4px rgba(30,10,60,0.10),0px 1px 5px 0px rgba(30,10,60,0.10),0px 6px 16px 0px rgba(94,68,180,0.10);"+
    "transition:background-color .4s cubic-bezier(1,0,0.4,1)}"+
  ".lg-lite{backdrop-filter:blur(10px) saturate(150%);-webkit-backdrop-filter:blur(10px) saturate(150%)}"+
  ".lg-text{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;text-shadow:0 1px 2px rgba(255,255,255,0.30)}"+
  /* ── landing intro ── */
  ".intro-title{transition:transform .85s cubic-bezier(.16,1,.3,1)}"+
  ".intro-item{opacity:0;transform:translateY(22px);transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)}"+
  ".intro-item.in{opacity:1;transform:translateY(0)}"+
  ".xfade{transition:opacity .45s ease}"+
  /* ── display-card edit stack ── */
  ".dstack{display:grid;grid-template-areas:'stack';place-items:center;padding:30px 0 150px}"+
  ".dcard{grid-area:stack;width:min(300px,76vw);height:128px;border-radius:18px;position:relative;isolation:isolate;cursor:pointer;"+
    "transform:skewY(-8deg) translate(var(--dx,0px),var(--dy,0px));transition:transform .6s cubic-bezier(.16,1,.3,1)}"+
  "@media(hover:hover){.dcard:hover{transform:skewY(-8deg) translate(var(--dx,0px),calc(var(--dy,0px) - 16px))}}"+
  ".dcard:active{transform:skewY(-8deg) translate(var(--dx,0px),calc(var(--dy,0px) - 6px)) scale(0.98)}"+
  ".dcard .dveil{position:absolute;inset:0;border-radius:inherit;background:rgba(250,249,245,0.74);transition:opacity .6s ease;pointer-events:none;z-index:2}"+
  "@media(hover:hover){.dcard:hover .dveil{opacity:0}}"+
  ".dcard .dfade{position:absolute;top:-5%;height:110%;right:-4px;width:60%;background:linear-gradient(to left,#FAF9F5 8%,transparent);pointer-events:none;z-index:3}"+
  /* ── dropdown menu ── */
  "@media(hover:hover){.dd-item:hover{background:rgba(168,85,247,0.10)!important}}"+
  ".dd-item:active{background:rgba(168,85,247,0.16)!important}"+
  /* ── glass dock ── */
  ".dock-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:64px;padding:7px 10px;border-radius:999px}"+
  "@media(prefers-reduced-motion:reduce){.lg,.intro-title,.intro-item,.dcard{transition:none}.anim{animation:none}}"
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

// ── LIQUID GLASS SYSTEM ───────────────────────────────────────────
// WebP normal map — drives the SVG displacement refraction (Chrome/Edge).
// Safari falls back to plain blur via -webkit-backdrop-filter.
const LIQUID_MAP = "data:image/webp;base64,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";

function GlassFX(){
  return <svg style={{position:"absolute",width:0,height:0,overflow:"hidden",pointerEvents:"none"}} aria-hidden="true">
    <defs>
      <filter id="liquid-glass" primitiveUnits="objectBoundingBox">
        <feImage result="map" width="100%" height="100%" x="0" y="0" href={LIQUID_MAP} preserveAspectRatio="none"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur"/>
        <feDisplacementMap in="blur" in2="map" scale="0.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="threshold">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"/>
      </filter>
    </defs>
  </svg>;
}

// Liquid glass button — lens layer refracts the blobs behind it, content floats above.
function GlassBtn({onClick,disabled,children,dark,tint,lite,radius=999,style,lensStyle,className,...rest}){
  const bg=tint||(dark?PSEL:"rgba(255,255,255,0.16)");
  return <button className={"lg"+(className?" "+className:"")} onClick={onClick} disabled={disabled} style={{borderRadius:radius,...style}} {...rest}>
    <span className={"lg-lens"+(lite?" lg-lite":"")} style={{backgroundColor:bg,...lensStyle}}/>
    <span className="lg-text" style={dark?{textShadow:"0 1px 2px rgba(0,0,0,0.35)"}:undefined}>{children}</span>
  </button>;
}

// ── MORPHING TEXT (gooey blur-dissolve morph through a list of strings) ──
const MORPH_TIME=1.4, MORPH_HOLD=0.7;
function MorphTitle({texts,onDone,fontSize=46,morphTime=MORPH_TIME,hold=MORPH_HOLD}){
  const t1=useRef(null),t2=useRef(null),raf=useRef(0),done=useRef(false);
  useEffect(()=>{
    let idx=0,morph=0,cool=hold,last=Date.now();
    const setPair=()=>{ if(t1.current&&t2.current){ t1.current.textContent=texts[idx%texts.length]; t2.current.textContent=texts[(idx+1)%texts.length]; } };
    const styles=f=>{ const a=t1.current,b=t2.current; if(!a||!b) return;
      b.style.filter=`blur(${Math.min(8/f-8,100)}px)`; b.style.opacity=`${Math.pow(f,0.4)*100}%`;
      const inv=1-f;
      a.style.filter=`blur(${Math.min(8/inv-8,100)}px)`; a.style.opacity=`${Math.pow(inv,0.4)*100}%`;
    };
    const finish=()=>{ if(done.current) return; done.current=true;
      const a=t1.current,b=t2.current;
      if(a&&b){ b.style.filter="none"; b.style.opacity="100%"; a.style.filter="none"; a.style.opacity="0%"; }
      onDone&&onDone();
    };
    setPair();
    if(t1.current&&t2.current){ t1.current.style.opacity="100%"; t1.current.style.filter="none"; t2.current.style.opacity="0%"; }
    let finishId=0;
    const tick=()=>{
      raf.current=requestAnimationFrame(tick);
      const now=Date.now(),dt=(now-last)/1000; last=now;
      cool-=dt;
      if(cool>0) return;
      morph+=dt;
      let f=Math.min(morph/morphTime,1);
      styles(f);
      if(f>=1){
        if(idx>=texts.length-2){ cancelAnimationFrame(raf.current); finishId=setTimeout(finish,hold*1000); return; }
        idx++; morph=0; cool=hold; setPair();
      }
    };
    raf.current=requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(raf.current); clearTimeout(finishId); };
  },[]);
  const span={position:"absolute",left:0,right:0,top:0,margin:"auto",display:"inline-block",width:"100%",textAlign:"center",
    fontFamily:F,fontWeight:900,fontSize,lineHeight:1,color:C.ink,letterSpacing:"-0.03em",textTransform:"uppercase"};
  return <div style={{position:"relative",height:fontSize+10,width:"100%",filter:"url(#threshold) blur(0.6px)"}}>
    <span ref={t1} style={span}/>
    <span ref={t2} style={span}/>
  </div>;
}

// ── EDIT STACK (stacked display cards) ───────────────────────────
function EditStack({items,onPick}){
  const offs=[{dx:"-14px",dy:"0px"},{dx:"0px",dy:"52px"},{dx:"14px",dy:"104px"}];
  return <div className="dstack">
    {items.map((it,i)=>{
      const o=offs[i]||offs[2], front=i===items.length-1;
      return <div key={it.k} className="dcard" role="button" tabIndex={0}
        style={{"--dx":o.dx,"--dy":o.dy,zIndex:i+1}}
        onClick={()=>onPick(it.k)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onPick(it.k);}}>
        <span className="lg-lens" style={{backgroundColor:"rgba(255,255,255,0.34)",borderRadius:18}}/>
        {!front&&<span className="dveil"/>}
        <span className="dfade"/>
        <div style={{position:"relative",zIndex:1,height:"100%",padding:"14px 18px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:999,background:"rgba(30,10,60,0.9)",color:"#fff",flexShrink:0}}>{it.icon}</span>
            <span style={{fontFamily:F,fontWeight:800,fontSize:16,color:C.accent}}>{it.title}</span>
          </div>
          <div style={{fontFamily:F,fontWeight:700,fontSize:16,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{it.desc}</div>
          <div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted}}>{it.meta}</div>
        </div>
      </div>;
    })}
  </div>;
}
const Ic={
  bean:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><ellipse cx="12" cy="12" rx="7.5" ry="10" transform="rotate(38 12 12)"/><path d="M8.5 6.5c4 3 4 8 7 11" transform="rotate(2 12 12)"/></svg>,
  goal:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/></svg>,
  brew:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h12M4 12h16M4 18h10"/><circle cx="18" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></svg>,
  home:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>,
  journal:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22z"/><path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19"/><path d="M10 7h5"/></svg>,
  cup:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 4.5c0-1 .8-1 .8-2M12 4.5c0-1 .8-1 .8-2"/></svg>,
};

// ── GLASS DOCK (floating bottom nav) ─────────────────────────────
function GlassDock({view,hasRecipe,onHome,onJournal,onRecipe}){
  const recipeViews=["result","share","doctor","export","edit"];
  const items=[
    {k:"home",label:t("Home"),icon:Ic.home,on:onHome,active:view==="landing"},
    {k:"journal",label:t("Journal"),icon:Ic.journal,on:onJournal,active:view==="saved"},
    {k:"recipe",label:t("Recipe"),icon:Ic.cup,on:onRecipe,active:recipeViews.includes(view),disabled:!hasRecipe},
  ];
  return <div style={{position:"fixed",left:0,right:0,bottom:"max(14px, env(safe-area-inset-bottom))",display:"flex",justifyContent:"center",zIndex:40,pointerEvents:"none"}}>
    <div style={{pointerEvents:"auto",position:"relative",isolation:"isolate",display:"flex",gap:4,padding:"7px 9px",borderRadius:999}}>
      <span className="lg-lens" style={{backgroundColor:"rgba(255,255,255,0.34)",borderRadius:999}}/>
      {items.map(it=>(
        <button key={it.k} className="lg dock-item" onClick={it.on} disabled={it.disabled} aria-label={it.label}
          style={{color:it.active?C.white:C.stone}}>
          <span className="lg-lens lg-lite" style={{backgroundColor:it.active?"rgba(30,10,60,0.88)":"transparent",boxShadow:it.active?undefined:"none"}}/>
          <span style={{position:"relative",zIndex:1,display:"flex"}}>{it.icon}</span>
          <span style={{position:"relative",zIndex:1,fontFamily:F,fontWeight:700,fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase"}}>{it.label}</span>
        </button>
      ))}
    </div>
  </div>;
}

// ── UI ATOMS ──────────────────────────────────────────────────────
function Lbl({c}){ return <div style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:8}}>{t(c)}</div>; }
function TIn({value,onChange,placeholder,type}){
  const [f,sf]=useState(false);
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type||"text"}
    style={{width:"100%",background:"transparent",border:"none",borderBottom:"2px solid "+(f?C.ink:C.line),padding:"9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:C.ink,outline:"none",transition:"border-color .2s"}}
    onFocus={()=>sf(true)} onBlur={()=>sf(false)}/>;
}
// Custom dropdown menu — glass panel, zoom/fade in, check on the selected row.
// Same onChange shape as a native <select> so call sites don't change.
function Sel({value,onChange,options,placeholder,bare,align}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(!open) return;
    const away=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); };
    const esc=e=>{ if(e.key==="Escape") setOpen(false); };
    document.addEventListener("pointerdown",away);
    document.addEventListener("keydown",esc);
    return ()=>{ document.removeEventListener("pointerdown",away); document.removeEventListener("keydown",esc); };
  },[open]);
  const pick=o=>{ onChange({target:{value:o}}); setOpen(false); };
  return <div ref={ref} style={{position:"relative"}}>
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-haspopup="listbox" aria-expanded={open}
      style={{width:"100%",display:"flex",justifyContent:bare?"flex-end":"space-between",alignItems:"center",gap:bare?7:0,background:"transparent",border:"none",borderBottom:bare?"none":"2px solid "+(value?C.ink:C.line),padding:bare?"4px 0":"9px 2px 9px 0",fontFamily:F,fontWeight:600,fontSize:15,color:value?C.ink:C.muted,outline:"none",cursor:"pointer",textAlign:bare?"end":"start"}}>
      <span>{value||t(placeholder)}</span>
      <motion.span animate={{rotate:open?180:0}} transition={{duration:0.2}} style={{color:C.ink,fontSize:11,display:"inline-flex"}}>▾</motion.span>
    </button>
    <AnimatePresence>
      {open&&<motion.div role="listbox"
        initial={{opacity:0,scale:0.96,y:-5}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.96,y:-5}}
        transition={{duration:0.16,ease:"easeOut"}}
        style={{position:"absolute",top:"calc(100% + 7px)",insetInlineStart:align==="end"?"auto":0,insetInlineEnd:align==="end"?0:"auto",minWidth:align==="end"?260:"100%",maxHeight:284,overflowY:"auto",zIndex:60,transformOrigin:"top",
          borderRadius:14,border:"1px solid rgba(255,255,255,0.65)",background:"rgba(255,255,255,0.90)",
          backdropFilter:"blur(22px) saturate(170%)",WebkitBackdropFilter:"blur(22px) saturate(170%)",
          boxShadow:"0 14px 36px rgba(30,10,60,0.18), inset 0 1px 0 rgba(255,255,255,0.85)",padding:5}}>
        {options.map(o=>{
          const sel=o===value;
          return <button key={o} type="button" role="option" aria-selected={sel} className="dd-item" onClick={()=>pick(o)}
            style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 10px",borderRadius:9,border:"none",
              background:sel?"rgba(168,85,247,0.13)":"transparent",
              fontFamily:F,fontWeight:sel?700:500,fontSize:13,color:C.ink,cursor:"pointer",textAlign:"start"}}>
            <span style={{width:14,flexShrink:0,color:C.accent,fontWeight:800}}>{sel?"✓":""}</span>
            <span>{o}</span>
          </button>;
        })}
      </motion.div>}
    </AnimatePresence>
  </div>;
}
function Seg({options,value,onChange,small}){
  return <div style={{position:"relative",isolation:"isolate",display:"flex",borderRadius:999,overflow:"hidden"}}>
    <span className="lg-lens lg-lite" style={{backgroundColor:"rgba(255,255,255,0.20)",borderRadius:999}}/>
    {options.map((o,i)=>{
      const v=typeof o==="object"?o.value:o, l=typeof o==="object"?o.label:t(o);
      return(
      <button key={v} onClick={()=>onChange(v)}
        style={{flex:1,position:"relative",zIndex:1,padding:small?"9px 4px":"11px 6px",background:value===v?PSEL:"transparent",border:"none",borderRadius:999,fontFamily:F,fontWeight:700,fontSize:small?10:11,letterSpacing:"0.04em",textTransform:"uppercase",color:value===v?C.white:C.stone,cursor:"pointer",transition:"all .25s cubic-bezier(.16,1,.3,1)",boxShadow:value===v?"inset 1.5px 2px 0px -1px rgba(255,255,255,0.45), 0 2px 8px rgba(147,51,234,0.28)":"none"}}>
        {l}
      </button>
    );})}
  </div>;
}
function Pill({active,onClick,children}){
  return <button className="lg" onClick={onClick} style={{borderRadius:999,padding:"7px 14px",fontFamily:F,fontWeight:600,fontSize:12,color:active?C.white:C.stone,whiteSpace:"nowrap"}}>
    <span className="lg-lens lg-lite" style={{backgroundColor:active?PSEL:"rgba(255,255,255,0.14)"}}/>
    <span style={{position:"relative",zIndex:1}}>{children}</span>
  </button>;
}
function BtnP({onClick,disabled,children}){
  return <GlassBtn onClick={onClick} disabled={disabled} dark radius={18} style={{flex:2,padding:"15px",fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.white}}>
    {typeof children==="string"?t(children):children}
  </GlassBtn>;
}
function BtnG({onClick,children}){
  return <GlassBtn onClick={onClick} radius={18} style={{flex:1,padding:"15px",fontFamily:F,fontWeight:600,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:C.ink}}>
    {typeof children==="string"?t(children):children}
  </GlassBtn>;
}
// Compact label-left / control-right row for the dial-in cards (Brewmind-style density)
function BRow({label,sub,children,top,last,onClick}){
  return <div onClick={onClick} style={{display:"flex",alignItems:top?"flex-start":"center",justifyContent:"space-between",gap:14,padding:"12px 16px",borderBottom:last?"none":"1px solid "+C.line,minHeight:48,cursor:onClick?"pointer":"default"}}>
    <div style={{flexShrink:0,paddingTop:top?2:0}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>{t(label)}</div>
      {sub&&<div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.muted,marginTop:2,opacity:0.8}}>{t(sub)}</div>}
    </div>
    <div style={{flex:1,minWidth:0,display:"flex",justifyContent:"flex-end"}}>{children}</div>
  </div>;
}
// Right-aligned, borderless text input that lives inside a BRow
function RowIn({value,onChange,placeholder,type,list}){
  return <input value={value} onChange={onChange} placeholder={placeholder} type={type||"text"} list={list}
    style={{width:"100%",background:"transparent",border:"none",padding:"3px 0",fontFamily:F,fontWeight:600,fontSize:15,color:C.ink,outline:"none",textAlign:"end"}}/>;
}
// Optional taste-goal picker — 3 options, one badged Recommended. Tap a selected one to clear it.
function GoalPicker({value,onChange}){
  return <div style={{marginBottom:24}}>
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted}}>{t("Taste Goal")}</span>
      <span style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>{t("optional")}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      {GOAL_PICK.map(g=>{
        const sel=value===g, reco=g===GOAL_RECO;
        return <button key={g} onClick={()=>onChange(sel?"":g)}
          style={{position:"relative",padding:"15px 8px 13px",borderRadius:16,border:"1.5px solid "+(sel?PSEL_BD:"rgba(255,255,255,0.65)"),background:sel?PSEL:C.card,backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",boxShadow:sel?"0 6px 18px rgba(147,51,234,0.28)":"0 6px 18px rgba(94,68,180,0.10)",cursor:"pointer",textAlign:"center"}}>
          {reco&&<span style={{position:"absolute",top:-9,left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap",fontFamily:F,fontWeight:800,fontSize:8,letterSpacing:"0.06em",textTransform:"uppercase",color:"#fff",background:C.gold,padding:"2px 8px",borderRadius:999,boxShadow:"0 3px 8px rgba(201,162,39,0.40)"}}>★ {t("Recommended")}</span>}
          <div style={{fontFamily:F,fontWeight:700,fontSize:13,color:sel?C.white:C.ink}}>{t(g)}</div>
        </button>;
      })}
    </div>
    <div style={{marginTop:11,fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.55,minHeight:34}}>
      {value?t(GOAL_DESC[value]):t("Not sure? Balanced is the safe pick — we tune everything to an even, well-rounded cup.")}
    </div>
  </div>;
}
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
function YieldBox({text}){ if(!text) return null; return <div style={{padding:"13px 16px",background:C.ink,borderRadius:18,marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontFamily:F,fontWeight:600,fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Yield Preview</span><span style={{fontFamily:F,fontWeight:800,fontSize:16,color:C.white}}>{text}</span></div>; }
function ProgressBar({progress}){
  const pct=clamp(progress,0,5),dialled=pct>=5;
  return <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",padding:"14px 16px",marginBottom:14,background:dialled?C.ink:C.card}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:dialled?C.gold:C.muted}}>{dialled?"★ Dialled In":"Dial-In Progress"}</span>
      <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:dialled?"rgba(255,255,255,0.7)":C.stone}}>{pct}/5</span>
    </div>
    <div style={{display:"flex",gap:5}}>{[0,1,2,3,4].map(i=><div key={i} style={{flex:1,height:10,borderRadius:4,background:i<pct?(dialled?C.gold:C.accent):(dialled?"rgba(255,255,255,0.15)":C.line)}}/>)}</div>
  </div>;
}
function BigN({val,top,bot,adj,onMinus,onPlus,adjustable}){
  return <div style={{textAlign:"center",flex:1,padding:"20px 4px"}}>
    <div style={{fontFamily:F,fontWeight:800,fontSize:27,color:C.ink,lineHeight:1,marginBottom:4,letterSpacing:"-0.02em"}}>{val}</div>
    {adjustable&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:2}}>
      <button onClick={onMinus} style={{width:26,height:26,background:"transparent",border:"1px solid rgba(150,130,210,0.4)",borderRadius:10,color:C.stone,fontFamily:F,fontWeight:700,fontSize:14,cursor:"pointer",lineHeight:1}}>−</button>
      {adj!==0&&<span style={{fontFamily:F,fontWeight:600,fontSize:9,color:C.accent,alignSelf:"center"}}>{adj>0?"+":""}{adj}</span>}
      <button onClick={onPlus} style={{width:26,height:26,background:"transparent",border:"1px solid rgba(150,130,210,0.4)",borderRadius:10,color:C.stone,fontFamily:F,fontWeight:700,fontSize:14,cursor:"pointer",lineHeight:1}}>+</button>
    </div>}
    <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",color:C.muted}}>{t(top)}</div>
    {bot&&<div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.accent,marginTop:2}}>{bot}</div>}
  </div>;
}
function SpecRow({label,value,sub}){ return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid "+C.line}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>{t(label)}</span><div style={{textAlign:"right"}}><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{value}</span>{sub&&<span style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.stone,marginLeft:8}}>{sub}</span>}</div></div>; }
function ICard({label,children,dark}){ return <div style={{padding:"16px 18px",background:dark?C.ink:C.card,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:12}}>{label&&<div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",color:dark?"rgba(255,255,255,0.5)":C.muted,marginBottom:7}}>{t(label)}</div>}<p style={{fontFamily:F,fontWeight:500,fontSize:13,color:dark?"rgba(255,255,255,0.92)":C.stone,lineHeight:1.7,margin:0}}>{children}</p></div>; }

// ── POUR CARD (Xbloom style) ──────────────────────────────────────
function PourCard({p,idx}){
  return <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:10,background:C.card}}>
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

// ── POUR PATTERN ICONS (match xBloom app: spiral / circular / centered) ──
const POUR_IC={
  Spiral:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 12a1.6 1.6 0 1 1 1.8 1.6 a3.6 3.6 0 1 1-3.9-3.8 a5.8 5.8 0 1 1 6.2 6"/></svg>,
  Circular:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 12a8 8 0 1 1-2.7-6"/><path d="M20 4v4h-4"/></svg>,
  Centered:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>,
};
// xBloom-style pour bar chart: bar height ∝ volume, pattern icon by temp,
// brace notation around the seconds — "{" before = agitate before, "}" after = agitate after.
function PourBars({pours,total,target}){
  const list=pours||[];
  const max=Math.max(1,...list.map(p=>p.volume));
  const H=140;
  return <div style={{marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink}}>{t("Pours")}</span>
      {total!=null&&<span style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.accent}}>{total} / {target}ml</span>}
    </div>
    <div style={{display:"flex",alignItems:"flex-end",gap:8,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",background:C.card,padding:"16px 12px 14px"}}>
      {list.map((p,i)=>{
        const h=Math.max(30,Math.round(p.volume/max*H));
        const name=i===0?"Bloom":"Pour "+(i+1);
        const sec=p.pause||0;
        const before=p.agitationBefore, after=p.agitationAfter;
        const agit=(sec>0||before||after)?(before?"❴ ":"")+sec+"s"+(after?" ❵":""):"—";
        const ic=POUR_IC[p.pourType]||POUR_IC.Centered;
        return <div key={i} style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <span style={{fontFamily:F,fontWeight:800,fontSize:13,color:C.ink,marginBottom:6}}>{p.volume}ml</span>
          <div style={{width:"100%",height:h,borderRadius:"12px 12px 5px 5px",background:"linear-gradient(180deg, rgba(168,85,247,0.30), rgba(168,85,247,0.12))",border:"1px solid rgba(168,85,247,0.32)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.7)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:5,marginTop:9,color:C.accent}}>
            <span style={{display:"flex"}}>{ic}</span>
            <span style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.ink}}>{p.temperature}°C</span>
          </div>
          <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.stone,marginTop:4}}>{name}</span>
          <span style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.muted,marginTop:3,letterSpacing:"0.02em"}}>{agit}</span>
        </div>;
      })}
    </div>
  </div>;
}

// ── SHARE CARD (premium dark gradient card: 3D tilt + purple/blue glow) ──
const CARD_NOISE="url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";
function ShareCard({mode,form,result}){
  const ref=useRef(null);
  const [hov,setHov]=useState(false);
  const [rot,setRot]=useState({x:0,y:0});
  const onMove=e=>{
    const el=ref.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    setRot({x:-(y/r.height)*5, y:(x/r.width)*5});
  };
  const glow=hov
    ?"0 0 20px 4px rgba(172,92,255,0.9), 0 0 30px 6px rgba(138,58,185,0.7), 0 0 40px 8px rgba(56,189,248,0.5)"
    :"0 0 15px 3px rgba(172,92,255,0.8), 0 0 25px 5px rgba(138,58,185,0.6), 0 0 35px 7px rgba(56,189,248,0.4)";
  const stats=mode==="xbloom"
    ?[{l:t("Grind"),v:String(result.grindSize)},{l:"RPM",v:String(result.rpm)},{l:t("Ratio"),v:result.ratio}]
    :[{l:t("Grind"),v:String(result.grindSize)},{l:t("Temp"),v:result.temperature+"°"},{l:t("Ratio"),v:result.ratio}];
  const subLine=mode==="xbloom"
    ?result.grindMicrons+"µm · "+result.grindZoneLabel+" · "+result.brewTime
    :t("Bloom")+" "+result.bloomWater+"g · "+result.bloomDuration+"s · "+result.brewTime;
  return <div style={{perspective:1000}}>
    <motion.div ref={ref}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{setHov(false);setRot({x:0,y:0});}}
      onMouseMove={onMove}
      animate={{y:hov?-5:0,rotateX:rot.x,rotateY:rot.y}}
      transition={{type:"spring",stiffness:300,damping:20}}
      style={{position:"relative",overflow:"hidden",borderRadius:28,backgroundColor:"#0B0712",transformStyle:"preserve-3d",
        boxShadow:"0 -10px 90px 10px rgba(168,85,247,0.25), 0 0 10px 0 rgba(0,0,0,0.5)"}}>
      {/* noise texture */}
      <div aria-hidden="true" style={{position:"absolute",inset:0,opacity:0.3,mixBlendMode:"overlay",zIndex:1,pointerEvents:"none",backgroundImage:CARD_NOISE}}/>
      {/* purple / blue corner glows */}
      <motion.div aria-hidden="true" animate={{opacity:hov?0.9:0.8}} transition={{duration:0.4}}
        style={{position:"absolute",left:0,right:0,bottom:0,height:"66%",zIndex:2,pointerEvents:"none",filter:"blur(40px)",
          background:"radial-gradient(ellipse at bottom right, rgba(172,92,255,0.7) -10%, rgba(79,70,229,0) 70%), radial-gradient(ellipse at bottom left, rgba(56,189,248,0.7) -10%, rgba(79,70,229,0) 70%)"}}/>
      {/* central purple glow */}
      <motion.div aria-hidden="true" animate={{opacity:hov?0.85:0.75}} transition={{duration:0.4}}
        style={{position:"absolute",left:0,right:0,bottom:"-10%",height:"66%",zIndex:2,pointerEvents:"none",filter:"blur(45px)",
          background:"radial-gradient(circle at bottom center, rgba(161,58,229,0.7) -20%, rgba(79,70,229,0) 60%)"}}/>
      {/* glowing bottom edge */}
      <motion.div aria-hidden="true" animate={{boxShadow:glow,opacity:hov?1:0.9}} transition={{duration:0.4}}
        style={{position:"absolute",left:0,right:0,bottom:0,height:2,zIndex:3,pointerEvents:"none",
          background:"linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.05) 100%)"}}/>
      {/* glass reflection */}
      <div aria-hidden="true" style={{position:"absolute",inset:0,zIndex:4,pointerEvents:"none",
        background:"linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)"}}/>
      {/* content */}
      <div style={{position:"relative",zIndex:5,padding:"24px 24px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div style={{fontFamily:F,fontWeight:900,fontSize:10,color:"rgba(255,255,255,0.45)",letterSpacing:"0.22em",textTransform:"uppercase"}}>Calibrated Pours</div>
          <div style={{textAlign:"end"}}>
            <div style={{fontFamily:F,fontWeight:700,fontSize:10,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase"}}>{form.process}</div>
            <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2}}>{t(form.goal||"Balanced")}</div>
          </div>
        </div>
        <div style={{fontFamily:F,fontWeight:900,fontSize:24,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.02em",lineHeight:1.05}}>{form.beanName||"My Recipe"}</div>
        {form.origin&&<div style={{fontFamily:F,fontWeight:500,fontSize:12,color:"rgba(255,255,255,0.55)",marginTop:4}}>{form.origin}{form.region?" · "+form.region:""}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,margin:"18px 0 12px"}}>
          {stats.map((x,i)=>(
            <div key={i} style={{textAlign:"center",padding:"13px 6px",borderRadius:16,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.10)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)"}}>
              <div style={{fontFamily:F,fontWeight:900,fontSize:21,color:"#fff"}}>{x.v}</div>
              <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginTop:2}}>{x.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{subLine}</div>
        {mode==="xbloom"&&result.isIced&&<div style={{marginTop:8,fontFamily:F,fontWeight:700,fontSize:12,color:"#C9A7FF"}}>{t("Iced")} · {result.totalVolume}ml + {result.iceGrams}g {t("Ice")}</div>}
        <div style={{marginTop:14,fontFamily:F,fontWeight:450,fontSize:11.5,color:"rgba(255,255,255,0.62)",lineHeight:1.7}}>{result&&result.flavor}</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:20,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.10)"}}>
          <span style={{fontFamily:F,fontWeight:800,fontSize:11,color:"rgba(255,255,255,0.85)",textTransform:"uppercase",letterSpacing:"-0.01em"}}>Calibrated Pours</span>
          <span style={{fontFamily:F,fontWeight:500,fontSize:9,color:"rgba(255,255,255,0.4)",letterSpacing:"0.14em",textTransform:"uppercase"}}>precision pour-over</span>
        </div>
      </div>
    </motion.div>
  </div>;
}

// ── RESULTS ──────────────────────────────────────────────────────
// ── TEMPERATURE REASONING (shared) ───────────────────────────────
function TempReason({r}){
  return <>
    <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",background:C.card,padding:"16px 18px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
        <span style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted}}>Why {r.temperature}°C</span>
        <span style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent}}>Safe {r.tempLo}–{r.tempHi}°C</span>
      </div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,lineHeight:1.7,margin:0}}>{r.tempReason}</p>
    </div>
    {r.tip&&<div style={{border:"1.5px solid rgba(201,162,39,0.55)",borderRadius:20,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",background:C.card,padding:"13px 16px",marginBottom:12}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gold,marginBottom:6}}>Brewer's Tip</div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>{r.tip}</p>
    </div>}
    {r.assumed&&r.assumed.length>0&&<div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted,marginBottom:12,lineHeight:1.55,padding:"0 2px"}}>Assumed: {r.assumed.join(", ")} — fill these in for more precision.</div>}
  </>;
}

function ManualResult({r,brewMode,qAdj,setQAdj}){
  const gr=r.grindSize+qAdj.ode,tmp=r.temperature+qAdj.temp;
  const go=grinderOut(r.grinderId||"Fellow Ode Gen 2",gr);
  const rows=[{sym:"00",label:"Rinse & preheat",w:null,cum:null,flow:"—",dur:"",note:"Rinse the paper with hot water, dump it. Kills paper taste and preheats the brewer."},{sym:"◦",label:"Bloom",w:r.bloomWater,cum:r.bloomWater,flow:"2-3 g/s",dur:r.bloomDuration+"s",note:"Saturate all grounds. Wait for full bloom."},...(r.pours||[]).map(p=>({sym:String(p.n).padStart(2,"0"),label:"Pour "+p.n,w:p.water,cum:p.total,flow:p.flow,dur:p.duration+"s",note:p.notes}))];
  return <div className="anim">
    <div style={{display:"flex",background:C.card,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:6}}>
      <BigN val={go.display} top="Grind" bot={go.microns+" µm"} adjustable adj={qAdj.ode} onMinus={()=>setQAdj(q=>({...q,ode:q.ode-0.5}))} onPlus={()=>setQAdj(q=>({...q,ode:q.ode+0.5}))}/>
      <div style={{width:2,background:C.ink}}/>
      <BigN val={tmp+"°"} top="Temp" bot={r.tempLo+"-"+r.tempHi+"°C"} adjustable adj={qAdj.temp} onMinus={()=>setQAdj(q=>({...q,temp:q.temp-1}))} onPlus={()=>setQAdj(q=>({...q,temp:q.temp+1}))}/>
      <div style={{width:2,background:C.ink}}/>
      <BigN val={r.brewTime} top="Time" bot="target"/>
    </div>
    <div style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted,marginBottom:14,lineHeight:1.5}}>{go.name} · {go.scale} · community-calibrated — trust taste over numbers, adjust ±</div>
    <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:14}}>
      <SpecRow label="Coffee" value={r.coffeeDose+"g"}/><SpecRow label="Ratio" value={r.ratio}/>
      <SpecRow label={brewMode==="Iced"?"Hot Water":"Water"} value={r.totalWater+"g"}/>
      {brewMode==="Iced"&&<SpecRow label="Ice" value={r.iceGrams+"g"} sub="in server first"/>}
      <SpecRow label="Expected Cup" value={(r.totalWater+(r.iceGrams||0)-Math.round(r.coffeeDose*2.1))+"ml"} sub="grounds hold ~2.1 g/g"/>
      <SpecRow label="Agitation" value={r.agitation}/>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>Bloom</span><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{r.bloomWater}g · {r.bloomDuration}s</span></div>
    </div>
    <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.ink,marginBottom:10}}>Pour Sequence</div>
    <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:14}}>
      {rows.map((row,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"24px 1fr 50px 50px 56px",gap:8,padding:"12px",borderBottom:i<rows.length-1?"1px solid "+C.line:"none"}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent,paddingTop:2}}>{row.sym}</div>
          <div><div style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.ink,marginBottom:2}}>{row.label}</div><div style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted,lineHeight:1.4}}>{row.note}</div></div>
          <div style={{textAlign:"right",fontFamily:F,fontWeight:700,fontSize:12,color:C.ink,paddingTop:2}}>{row.w==null?"—":row.w+"g"}</div>
          <div style={{textAlign:"right",fontFamily:F,fontWeight:700,fontSize:12,color:C.ink,paddingTop:2}}>{row.cum==null?"—":row.cum+"g"}</div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.ink}}>{row.flow}</div><div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.muted}}>{row.dur}</div></div>
        </div>
      ))}
    </div>
    <TempReason r={r}/>
    <ICard label="Brew Notes" dark={true}>{r.brewmaster}</ICard>
    <ICard label="Expected Cup">{r.flavor}</ICard>
    {r.fact&&<ICard label="☕ Coffee Fact">{r.fact}</ICard>}
  </div>;
}
function XbloomResult({r,beanName}){
  const gr=r.grindSize;
  const icedTitle=(beanName?"Iced "+beanName:"Iced Recipe")+" — "+r.iceGrams+"g Ice";
  const totalPour=(r.pours||[]).reduce((s,p)=>s+p.volume,0);
  return <div className="anim">
    {r.isIced&&<div style={{padding:"16px 18px",background:C.card,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:14}}>
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
    {/* hero stat strip — Dose / Grind / RPM */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
      {[{l:"Dose",v:r.dose+"g"},{l:"Grind Size",v:gr,s:xbloomMicrons(gr)+"µm"},{l:"RPM",v:r.rpm}].map((x,i)=>(
        <div key={i} style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:18,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",background:C.card,padding:"13px 8px",textAlign:"center"}}>
          <div style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted,marginBottom:5}}>{t(x.l)}</div>
          <div style={{fontFamily:F,fontWeight:900,fontSize:24,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}>{x.v}</div>
          {x.s&&<div style={{fontFamily:F,fontWeight:500,fontSize:9,color:C.stone,marginTop:3}}>{x.s}</div>}
        </div>
      ))}
    </div>
    <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:r.over18?10:14}}>
      <SpecRow label="Dripper" value={r.dripper} sub={r.needsOther?"app: select Other":""}/>
      {r.filter&&<SpecRow label="Filter" value={r.filter.id} sub={r.filter.rinse?"rinse first":"no rinse"}/>}
      <SpecRow label="Coffee : Water" value={r.ratio} sub={r.totalVolume+"ml"}/>
      <SpecRow label="Temperature" value={r.temperature+"°C"} sub={r.tempLo+"-"+r.tempHi+"°C"}/>
      <SpecRow label="Expected Cup" value={r.cupOut+"ml"} sub={r.isIced?"after ice melts":"grounds hold ~2.1 g/g"}/>
      <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.muted}}>{t("Brew Time")}</span><span style={{fontFamily:F,fontWeight:800,fontSize:18,color:C.ink}}>{r.brewTime}</span></div>
    </div>
    {r.over18&&<div style={{border:"1.5px solid rgba(168,85,247,0.55)",borderRadius:20,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:"0 8px 24px rgba(168,85,247,0.16)",padding:"13px 16px",marginBottom:16,background:C.card}}>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:6}}>Dose over 18g — app entry</div>
      <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>Grind the full <strong>{r.dose}g</strong> and keep using the same dripper. The xBloom app caps dose at <strong>18g</strong>, so enter 18g at <strong>1:{r.appRatio}</strong> — that lands the same {r.totalVolume}ml of water on your {r.dose}g.</p>
    </div>}
    <div style={{border:"1px solid rgba(150,130,210,0.28)",borderRadius:16,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",background:C.card,padding:"11px 16px",marginBottom:12,display:"flex",gap:12,alignItems:"center"}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:13,color:C.accent}}>00</span>
      <span style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.5}}>{r.filter&&!r.filter.rinse
        ?("No rinse needed — "+r.filter.id+" paper is taste-neutral out of the box. Seat the filter and brew.")
        :((r.filter?r.filter.id+": ":"")+"Rinse the filter with hot water & dump it — kills paper taste, preheats the dripper.")}</span>
    </div>
    <PourBars pours={r.pours} total={totalPour} target={r.totalVolume}/>
    <TempReason r={r}/>
    <ICard label="Brew Notes" dark={true}>{r.brewmaster}</ICard>
    <ICard label="Expected Cup">{r.flavor}</ICard>
    {r.fact&&<ICard label="☕ Coffee Fact">{r.fact}</ICard>}
  </div>;
}

// ── XPOD CARD SECTION (Export view — tap-to-brew via XBRecipeWriter) ─
function CardSection({result,onMsg}){
  const [showBytes,setShowBytes]=useState(false);
  const card=buildCardData(result);
  if(!card) return null;
  const copyHex=()=>{try{navigator.clipboard.writeText(cardHex(card.bytes));onMsg("Card bytes copied ✓");}catch(e){onMsg("Copy not available");}setTimeout(()=>onMsg(""),2500);};
  const glass={border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden"};
  return <div style={{...glass,marginTop:16,background:C.card}}>
    <div style={{background:C.ink,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontFamily:F,fontWeight:800,fontSize:11,color:C.white,letterSpacing:"0.1em",textTransform:"uppercase"}}>xPod Card · Tap-to-Brew</span>
      <span style={{fontFamily:F,fontWeight:600,fontSize:9,color:C.gold,letterSpacing:"0.08em",textTransform:"uppercase"}}>via XBRecipeWriter</span>
    </div>
    <div style={{padding:"14px 16px"}}>
      <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.65,margin:"0 0 12px"}}>Prefer skipping the app entirely? The machine can brew straight from an NFC card — tap the card on it and it pours. Apple only lets real apps (not websites) write NFC cards, so do it once with the free <strong>XBRecipeWriter</strong> app: create a recipe there using the values below, then hold a genuine xBloom card or a used xPod to the top of your phone. After that, brewing this recipe is literally one tap.</p>
      <div style={{border:"1px solid rgba(150,130,210,0.28)",borderRadius:16,marginBottom:12}}>
        <SpecRow label="Card Dose" value="15g" sub="cards always store 15g"/>
        <SpecRow label="Card Ratio" value={"1:"+card.cardRatio} sub={card.cardTotal+"ml — same water, same cup"}/>
        <SpecRow label="Grind Size" value={card.grindUsed} sub={card.grindClamped?"card min is 40 — was "+result.grindSize:xbloomMicrons(card.grindUsed)+"µm"}/>
        <SpecRow label="RPM" value={result.rpm}/>
        <SpecRow label="Cup Type" value="Other" sub="avoids overflow waits"/>
      </div>
      <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted,marginBottom:6}}>Pour volumes on the card</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {card.vols.map((v,i)=><span key={i} style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.ink,border:"1px solid rgba(150,130,210,0.35)",borderRadius:999,padding:"6px 12px",background:"rgba(255,255,255,0.5)"}}>{i===0?t("Bloom"):t("Pour")+" "+i}: {v}ml</span>)}
      </div>
      <button onClick={()=>setShowBytes(b=>!b)} style={{background:"none",border:"none",padding:0,fontFamily:F,fontWeight:700,fontSize:11,color:C.accent,cursor:"pointer",letterSpacing:"0.04em"}}>{showBytes?t("Hide card bytes")+" ▴":t("Show card bytes")+" ▾"}</button>
      {showBytes&&<div className="anim" style={{marginTop:10}}>
        <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.muted,marginBottom:6}}>Card payload ({card.bytes.length} bytes + CRC, after the 32-byte signature)</div>
        <div style={{fontFamily:"ui-monospace,Menlo,monospace",fontSize:11,lineHeight:1.8,color:C.ink,background:"rgba(0,0,0,0.04)",border:"1px solid "+C.line,borderRadius:12,padding:"10px 12px",wordBreak:"break-all",direction:"ltr",textAlign:"left"}}>{cardHex(card.bytes)}</div>
        <button onClick={copyHex} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid rgba(150,130,210,0.4)",borderRadius:14,color:C.ink,fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",marginTop:10}}>Copy card bytes</button>
        <p style={{fontFamily:F,fontWeight:500,fontSize:10,color:C.muted,lineHeight:1.6,margin:"10px 0 0"}}>Genuine xBloom cards only — each card carries a unique signature in its first 32 bytes that can't be copied, so the writer keeps the card's signature and swaps just the recipe behind it.</p>
      </div>}
    </div>
  </div>;
}

// ── MAIN ──────────────────────────────────────────────────────────
const BLANK={beanName:"",origin:"",region:"",variety:"",process:"",altitude:"",notes:"",noteChips:[],roast:"Light",roastDate:"",goal:"",bloomRatio:"1:3",brewMode:"Hot",brewer:"",filter:"",dose:"18",ratio:"1:16",xBrewMode:"Hot",xDose:"18",xRatio:"1:16",iceMode:"Auto",iceGrams:"",grinder:"Fellow Ode Gen 2",xDripper:"Omni",xFilter:""};

// ── LANDING (cinematic intro: white → morph → rise → buttons) ────
let INTRO_PLAYED=false;
function Landing({lang,toggleLang,onMode,onSaved,onLit}){
  const reduced=typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [phase,setPhase]=useState(INTRO_PLAYED||reduced?5:0);
  useEffect(()=>{ if(phase>=1) onLit&&onLit(); if(phase>=5){ INTRO_PLAYED=true; return; } if(phase===0) return;
    const delays={1:750,2:380,3:380,4:420};
    const id=setTimeout(()=>setPhase(p=>p+1),delays[phase]||400);
    return ()=>clearTimeout(id);
  },[phase]);
  const W={maxWidth:600,margin:"0 auto",padding:"0 22px"};
  const risen=phase>=1;
  return <div>
    <div className={"intro-item"+(phase>=4?" in":"")} style={{...W,display:"flex",justifyContent:"flex-end",paddingTop:18}}>
      <GlassBtn lite onClick={toggleLang} radius={999} aria-label={lang==="en"?"التبديل إلى العربية":"Switch to English"} title={lang==="en"?"العربية":"English"}
        style={{width:40,height:40,padding:0,color:C.stone}}>
        {/* iPhone-keyboard-style globe */}
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"/>
          <path d="M3 12h18"/>
          <ellipse cx="12" cy="12" rx="4.2" ry="9"/>
        </svg>
      </GlassBtn>
    </div>
    {/* Title block — vertically centered during morph, rises to top */}
    <div className="intro-title" style={{...W,textAlign:"center",paddingTop:30,paddingBottom:34,transform:risen?"translateY(0)":"translateY(calc(44vh - 110px))"}}>
      <div style={{position:"relative",minHeight:96}}>
        <div className="xfade" style={{position:"absolute",inset:0,display:"flex",alignItems:"center",opacity:risen?0:1,pointerEvents:"none"}}>
          {phase===0&&<MorphTitle texts={["Calibrated","Pours"]} fontSize={46} onDone={()=>setPhase(1)}/>}
        </div>
        <div className="xfade" style={{opacity:risen?1:0}}>
          {/* threshold filter keeps the gooey morphed-ink look on the resting title */}
          <div style={{fontFamily:F,fontWeight:900,fontSize:38,lineHeight:0.9,color:C.ink,letterSpacing:"-0.03em",textTransform:"uppercase",filter:"url(#threshold) blur(0.6px)"}}>Calibrated<br/>Pours</div>
          <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.stone,marginTop:16,letterSpacing:"0.22em",textTransform:"uppercase"}}>{t("Precision pour-over recipes")}</div>
        </div>
      </div>
    </div>
    <div style={{...W,display:"flex",flexDirection:"column",gap:12}}>
      <button className={"lg intro-item"+(phase>=2?" in":"")} onClick={()=>onMode("xbloom")} style={{borderRadius:22,padding:"22px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"start"}}>
        <span className="lg-lens" style={{backgroundColor:"rgba(255,255,255,0.24)"}}/>
        <span style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontFamily:F,fontWeight:900,fontSize:42,color:C.ink,letterSpacing:"-0.06em",lineHeight:1}}>xb</span>
          <span style={{fontFamily:F,fontSize:21,color:C.ink,lineHeight:1,letterSpacing:"-0.02em"}}><span style={{fontWeight:400}}>x</span><span style={{fontWeight:900}}>Bloom</span><span style={{fontWeight:600}}> Studio</span></span>
        </span>
        <span style={{position:"relative",zIndex:1,fontFamily:F,fontWeight:800,fontSize:22,color:C.ink}}>→</span>
      </button>
      <button className={"lg intro-item"+(phase>=3?" in":"")} onClick={()=>onMode("manual")} style={{borderRadius:22,padding:"22px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"start"}}>
        <span className="lg-lens" style={{backgroundColor:"rgba(255,255,255,0.24)"}}/>
        <span style={{position:"relative",zIndex:1,fontFamily:F,fontWeight:900,fontSize:21,color:C.ink,letterSpacing:"-0.02em",textTransform:"uppercase"}}>Manual<br/><span style={{fontWeight:600,fontSize:15,textTransform:"none"}}>Pour-Over</span></span>
        <span style={{position:"relative",zIndex:1,fontFamily:F,fontWeight:800,fontSize:22,color:C.ink}}>→</span>
      </button>
      <div className={"intro-item"+(phase>=4?" in":"")} style={{display:"flex",marginTop:8}}>
        <GlassBtn lite onClick={onSaved} radius={16} style={{flex:1,padding:"14px",fontFamily:F,fontWeight:700,fontSize:11,color:C.stone,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t("☆ Bean Journal")}</GlassBtn>
      </div>
    </div>
  </div>;
}

export default function App(){
  const [lang,setLang]=useState(()=>{try{return localStorage.getItem("cp_lang")||"en";}catch(e){return "en";}});
  LANG=lang;
  const toggleLang=()=>{const v=lang==="en"?"ar":"en";setLang(v);try{localStorage.setItem("cp_lang",v);}catch(e){}};
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
  const [photoBusy,setPhotoBusy]=useState(false);
  const fileRef=useRef(null);
  const [qAdj,setQAdj]=useState({ode:0,x:0,temp:0});
  const [showAbout,setShowAbout]=useState(false);
  const [insights,setInsights]=useState([]);
  const [lit,setLit]=useState(INTRO_PLAYED);
  const [xbExport,setXbExport]=useState("idle"); // idle | exporting | success | error
  const [xbShareUrl,setXbShareUrl]=useState("");
  const [xbError,setXbError]=useState("");

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
  function applyFields(got){
    const keys=Object.keys(got||{});
    if(!keys.length){ setParseMsg("Couldn't read the label — try a closer, sharper photo."); setTimeout(()=>setParseMsg(""),4500); return; }
    setForm(f=>({...f,...got}));
    const L={beanName:"Name",origin:"Origin",region:"Region",process:"Process",roast:"Roast",altitude:"Altitude",variety:"Variety",notes:"Notes"};
    setParseMsg("✓ Read "+keys.map(k=>L[k]||k).join(" · ")+" from the photo. Review below.");
    setTimeout(()=>setParseMsg(""),6000);
  }
  async function doPhoto(file){
    if(!file) return;
    setPhotoBusy(true); setParseMsg("");
    try{
      const dataUrl=await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(file);});
      const resp=await fetch("/api/vision",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:dataUrl})});
      const data=await resp.json();
      if(!data.ok){ setParseMsg(data.error||"Couldn't read the photo."); setTimeout(()=>setParseMsg(""),4500); }
      else applyFields(data.fields);
    }catch(e){ setParseMsg("Photo read failed — check your connection and try again."); setTimeout(()=>setParseMsg(""),4500); }
    setPhotoBusy(false);
  }
  const reset=()=>{setMode("");setForm(BLANK);setResult(null);setAdj(null);setRev(0);setProgress(0);setPicked(null);setRating(0);setQAdj({ode:0,x:0,temp:0});setShowMore(false);setShowPaste(false);setPasteText("");setParseMsg("");setView("landing");setSaveMsg("");setCopyMsg("");};

  const canB1=!!form.process&&!!form.roast;
  const canManu=!!form.brewer&&!!form.filter&&!!form.dose&&!!form.ratio;
  const canXbl=!!form.xDose&&!!form.xRatio;
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
    setResult(r); setAdj(null); setRev(0); setPicked(null); setSaveMsg(""); setRating(0); setQAdj({ode:0,x:0,temp:0}); setXbExport("idle"); setXbShareUrl("");
    const dl=getDial(form.beanName); setProgress(dl?dl.progress:0);
    setView("calibrating");
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
  async function exportToXbloom(){
    if(!result) return;
    setXbExport("exporting");
    const r=result;
    const PATTERN={Spiral:3,Circular:2,Centered:1};
    const pourList=(r.pours||[]).map(p=>({theName:p.notes||"Pour",volume:p.volume,temperature:p.temperature,flowRate:p.flowRate,pattern:PATTERN[p.pourType]||3,pausing:p.pause||0,isEnableVibrationBefore:2,isEnableVibrationAfter:p.agitationAfter?1:2}));
    const recipe={theName:form.beanName||"CalibratedPours Recipe",dose:r.dose,grandWater:parseFloat((r.totalVolume/r.dose).toFixed(1)),grinderSize:r.grindSize,rpm:r.rpm,cupType:2,adaptedModel:1,isEnableBypassWater:2,isSetGrinderSize:1,theColor:"#9333EA",theSubsetId:0,bypassTemp:r.temperature,bypassVolume:0,pourList};
    try{
      const res=await fetch("/api/xbloom",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({recipe})});
      const data=await res.json();
      if(!data.ok){setXbExport("error");setXbError(data.error||"Export failed");return;}
      setXbShareUrl(data.shareUrl);
      setXbExport("success");
    }catch(e){setXbExport("error");setXbError(e.message||"Network error");}
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
  // Dock visibility: never during calibration; on landing only post-intro with an active recipe
  const dockOn=view!=="calibrating"&&(view!=="landing"||(lit&&!!result));
  const headerNav=(left,right,onLeft)=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:34}}>
      <button onClick={onLeft} style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.ink,background:"none",border:"none",cursor:"pointer"}}>{t(left)}</button>
      <div style={{fontFamily:F,fontWeight:800,fontSize:10,color:C.accent,letterSpacing:"0.16em",textTransform:"uppercase"}}>{t(right)}</div>
    </div>
  );
  const bigHead=txt=><div style={{fontFamily:F,fontWeight:800,fontSize:23,color:C.ink,lineHeight:1.1,marginBottom:26,letterSpacing:"-0.02em",whiteSpace:"pre-line"}}>{t(txt)}</div>;

  return <MotionConfig reducedMotion="user">
    <style>{CSS}</style>
    <GlassFX/>
    {/* White base — sits below blobs, guarantees white bg in any iframe */}
    <div style={{position:"fixed",inset:0,background:"#FAF9F5",zIndex:-1}}/>
    {/* Blobs hidden during the white intro, bleed in as the title rises */}
    <div style={{opacity:lit?1:0,transition:"opacity 1.4s ease"}}><Blobs/></div>
    {/* Main wrapper: transparent so blobs show through, cards have their own white fills */}
    <div dir={lang==="ar"?"rtl":"ltr"} style={{minHeight:"100vh",position:"relative",zIndex:1,paddingBottom:dockOn?130:60}}>

      {/* Page transitions: each view fades/blurs out, the next rises in */}
      <AnimatePresence mode="wait" initial={false}>
      <motion.div key={view}
        initial={{opacity:0,y:16,filter:"blur(8px)"}}
        animate={{opacity:1,y:0,filter:"blur(0px)"}}
        exit={{opacity:0,y:-12,filter:"blur(8px)"}}
        transition={{duration:0.3,ease:[0.16,1,0.3,1]}}>

      {/* LANDING */}
      {view==="landing"&&<Landing lang={lang} toggleLang={toggleLang} onLit={()=>setLit(true)}
        onMode={m=>{setMode(m);setView("bean");}} onSaved={openSaved}/>}

      {/* BEAN JOURNAL */}
      {view==="saved"&&<div style={{...W,paddingTop:36}}>
        {headerNav("‹ Home","Bean Journal",()=>setView("landing"))}
        {bigHead("Bean\nJournal")}
        {insights.length>0&&<div style={{border:"1.5px solid rgba(168,85,247,0.55)",borderRadius:20,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:"0 8px 24px rgba(168,85,247,0.16)",background:C.card,padding:"14px 16px",marginBottom:18}}>
          <div style={{fontFamily:F,fontWeight:800,fontSize:10,color:C.accent,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Process Intelligence</div>
          {insights.map((s,i)=><div key={i} style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,marginBottom:4}}>· {s}</div>)}
        </div>}
        {saved.length===0&&<div style={{fontFamily:F,fontWeight:500,fontSize:14,color:C.muted,padding:"20px 0"}}>No brews logged yet. Generate a recipe, dial it in, and save it here.</div>}
        {saved.map(rec=>(
          <div key={rec.id} style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",padding:"16px",marginBottom:10,background:C.card}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div onClick={()=>loadSaved(rec)} style={{cursor:"pointer",flex:1}}>
                <div style={{fontFamily:F,fontWeight:800,fontSize:15,color:C.ink}}>{rec.name}{rec.rev>0?" · v"+(rec.rev+1):""}</div>
                <div style={{fontFamily:F,fontWeight:500,fontSize:11,color:C.muted,marginTop:3}}>{rec.mode==="xbloom"?"Xbloom":"Manual"} · {rec.goal||"Balanced"} · {new Date(rec.ts).toLocaleDateString()}</div>
                {rec.rating>0&&<div style={{fontFamily:F,fontWeight:700,fontSize:13,color:C.gold,marginTop:4}}>{"★".repeat(rec.rating)}{"☆".repeat(5-rec.rating)}</div>}
              </div>
              <button onClick={()=>removeSaved(rec.id)} style={{fontFamily:F,fontWeight:700,fontSize:11,color:C.accent2,background:"none",border:"none",cursor:"pointer",padding:"6px 8px"}}>{t("Delete")}</button>
            </div>
          </div>
        ))}
      </div>}

      {/* BEAN */}
      {view==="bean"&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={1}/>
        {bigHead("Tell me about\nthe bean")}

        {/* Snap-the-bag auto-fill */}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}}
          onChange={e=>{const f=e.target.files&&e.target.files[0]; if(f) doPhoto(f); e.target.value="";}}/>
        <div style={{marginBottom:14}}>
          <GlassBtn tint="rgba(168,85,247,0.85)" disabled={photoBusy} onClick={()=>fileRef.current&&fileRef.current.click()} radius={20} style={{width:"100%",padding:"14px 10px",fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.04em",color:C.white}}>
            {photoBusy?t("Reading the photo…"):"📷 "+t("Take a photo of the beans")}
          </GlassBtn>
        </div>
        {parseMsg&&<div style={{border:"1.5px solid rgba(168,85,247,0.55)",borderRadius:20,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:"0 8px 24px rgba(168,85,247,0.16)",background:C.card,padding:"11px 14px",marginBottom:14,fontFamily:F,fontWeight:600,fontSize:12,color:C.ink,lineHeight:1.5}}>{parseMsg}</div>}
        <div style={{textAlign:"center",fontFamily:F,fontWeight:500,fontSize:9,color:C.muted,marginBottom:14,letterSpacing:"0.1em",textTransform:"uppercase"}}>{t("or enter manually")}</div>

        {/* One compact bean card — every detail, no collapsibles */}
        <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",background:C.card,overflow:"visible"}}>
          <BRow label="Coffee Name"><RowIn value={form.beanName} onChange={e=>upd("beanName",e.target.value)} placeholder="e.g. Guji — Ferm Lab"/></BRow>
          <BRow label="Origin"><RowIn value={form.origin} onChange={e=>upd("origin",e.target.value)} placeholder="e.g. Ethiopia" list="origin-opts"/></BRow>
          <BRow label="Region" sub="optional"><RowIn value={form.region} onChange={e=>upd("region",e.target.value)} placeholder="e.g. Gedeo"/></BRow>
          <BRow label="Altitude" sub="optional"><RowIn value={form.altitude} onChange={e=>upd("altitude",e.target.value)} placeholder="e.g. 1900 masl"/></BRow>
          <BRow label="Variety"><RowIn value={form.variety} onChange={e=>upd("variety",e.target.value)} placeholder="e.g. Gesha, SL28" list="variety-opts"/></BRow>
          <BRow label="Process" sub="required"><Sel bare align="end" value={form.process} onChange={e=>upd("process",e.target.value)} options={PROCESSES} placeholder="Select"/></BRow>
          <div style={{padding:"13px 16px",borderBottom:"1px solid "+C.line}}>
            <div style={{marginBottom:11}}>
              <span style={{fontFamily:F,fontWeight:700,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.muted}}>{t("Roast Level")}</span>
            </div>
            <Seg options={ROASTS} value={form.roast} onChange={v=>upd("roast",v)} small={true}/>
          </div>
          <BRow label="Roast Date" top>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,width:"100%"}}>
              <input type="date" value={form.roastDate} onChange={e=>upd("roastDate",e.target.value)}
                style={{background:"transparent",border:"none",padding:"3px 0",fontFamily:F,fontWeight:600,fontSize:15,color:form.roastDate?C.ink:C.muted,outline:"none",textAlign:"end"}}/>
              {dRoast!==null&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:F,fontWeight:800,fontSize:14,color:C.ink}}>{dRoast} days</span>
                <span style={{width:4,height:4,borderRadius:"50%",background:phaseColorFn(dRoast)}}/>
                <span style={{fontFamily:F,fontWeight:700,fontSize:12,color:phaseColorFn(dRoast)}}>{phaseLabel(dRoast)}</span>
              </div>}
            </div>
          </BRow>
          <BRow label="Tasting Notes" sub="optional" last><RowIn value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="peach, jasmine, lychee…"/></BRow>
        </div>
        {dRoast!==null&&roastDatePhase(dRoast).key==="degassing"&&<div style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.gold,marginTop:10,paddingInlineStart:4}}>⚠ Still degassing — rest it a few more days before brewing.</div>}
        {dRoast!==null&&roastDatePhase(dRoast).key==="staling"&&<div style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.gold,marginTop:10,paddingInlineStart:4}}>⚠ Getting old — brew this one soon.</div>}

        <datalist id="origin-opts">
          {["Ethiopia","Kenya","Colombia","Brazil","Panama","Guatemala","Rwanda","Burundi","Yemen","Indonesia","Costa Rica","El Salvador","Honduras","Peru","Bolivia","Nicaragua"].map(o=><option key={o} value={o}/>)}
        </datalist>
        <datalist id="variety-opts">
          {["Geisha","Pink Bourbon","SL28","SL34","Bourbon","Caturra","Typica","Pacamara","Castillo","Wush Wush","Chiroso","Sidra","Heirloom","Batian","K7","Marsellesa"].map(o=><option key={o} value={o}/>)}
        </datalist>

        <div style={{display:"flex",gap:10,marginTop:24}}>
          <BtnG onClick={reset}>‹ Back</BtnG>
          <BtnP onClick={()=>canB1&&setView("brew")} disabled={!canB1}>Continue →</BtnP>
        </div>
      </div>}

      {/* GOAL */}
      {/* BREW - XBLOOM */}
      {view==="brew"&&mode==="xbloom"&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={2} onStep={k=>setView(k)}/>
        {bigHead("Dial in\nthe brew")}
        <GoalPicker value={form.goal} onChange={v=>upd("goal",v)}/>
        <div style={{marginBottom:24}}><Lbl c="How do you like your coffee?"/><Seg options={["Hot","Iced"]} value={form.xBrewMode} onChange={v=>upd("xBrewMode",v)}/></div>
        <RangeField label="Dose" value={form.xDose} min={8} max={25} step={1} unit="g" onChange={v=>upd("xDose",v)}/>
        {parseFloat(form.xDose)>18&&<div className="anim" style={{marginTop:-12,marginBottom:20}}>
          <Lbl c="Dripper on the machine"/>
          <Sel value={form.xDripper||"Omni"} onChange={e=>upd("xDripper",e.target.value)} options={XDRIPPERS.map(dp=>dp.id)} placeholder={t("Select your dripper")}/>
          <div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone,lineHeight:1.5}}>
            {(XDRIPPERS.find(dp=>dp.id===(form.xDripper||"Omni"))||XDRIPPERS[0]).note}
            {(form.xDripper||"Omni")==="Omni"
              ?" — over 18g the basket runs full, so level the bed and pour gently."
              :" — select “Other dripper” in the xBloom app."}
          </div>
        </div>}
        <div style={{marginTop:-4,marginBottom:20}}>
          <Lbl c="Paper Filter"/>
          <Sel value={form.xFilter||""} onChange={e=>upd("xFilter",e.target.value)} options={XFILTERS.map(f=>f.id)} placeholder={t("Select filter")}/>
          {form.xFilter&&(()=>{const f=XFILTERS.find(x=>x.id===form.xFilter);return f?<div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone,lineHeight:1.5}}><span style={{fontWeight:700,color:f.rinse?C.gold:C.accent}}>{f.rinse?"Rinse first":"No rinse needed"}</span> — {f.note}</div>:null;})()}
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
        <div style={{marginBottom:24}}><Lbl c="Bloom Ratio"/><Seg options={[{value:"1:2",label:"1:2"},{value:"1:3",label:t("1:3 (recommended)")}]} value={form.bloomRatio} onChange={v=>upd("bloomRatio",v)}/><div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone}}>{form.bloomRatio==="1:2"?("2x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*2))+"g bloom"):("3x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*3))+"g bloom")}</div></div>
        <YieldBox text={yieldStr()}/>
        <div style={{display:"flex",gap:10}}><BtnG onClick={()=>setView("bean")}>‹ Back</BtnG><BtnP onClick={generate} disabled={!canXbl}>Generate</BtnP></div>
      </div>}

      {/* BREW - MANUAL */}
      {view==="brew"&&mode==="manual"&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        <ProgressSteps current={2} onStep={k=>setView(k)}/>
        {bigHead("Dial in\nthe brew")}
        <GoalPicker value={form.goal} onChange={v=>upd("goal",v)}/>
        <div style={{marginBottom:22}}><Lbl c="Brewer"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>{BREWERS.map(b=><Pill key={b} active={form.brewer===b} onClick={()=>{upd("brewer",b);upd("filter","");}}>{b}</Pill>)}</div></div>
        {form.brewer&&<div style={{marginBottom:22}}><Lbl c="Filter"/><Sel value={form.filter} onChange={e=>upd("filter",e.target.value)} options={FILTERS[form.brewer]||[]} placeholder="Select filter"/></div>}
        <div style={{marginBottom:22}}><Lbl c="Grinder"/><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>{GRINDERS.map(g=><Pill key={g.id} active={(form.grinder||"Fellow Ode Gen 2")===g.id} onClick={()=>upd("grinder",g.id)}>{g.id}</Pill>)}</div></div>
        <div style={{marginBottom:24}}><Lbl c="Brew Mode"/><Seg options={["Hot","Iced"]} value={form.brewMode} onChange={v=>upd("brewMode",v)}/></div>
        <RangeField label="Dose" value={form.dose} min={8} max={40} step={1} unit="g" onChange={v=>upd("dose",v)}/>
        <RangeField label="Ratio" value={pRatio(form.ratio)||15} min={12} max={18} step={0.5} unit="ratio" onChange={v=>upd("ratio","1:"+v)}/>
        <div style={{marginBottom:24}}><Lbl c="Bloom Ratio"/><Seg options={[{value:"1:2",label:"1:2"},{value:"1:3",label:t("1:3 (recommended)")}]} value={form.bloomRatio} onChange={v=>upd("bloomRatio",v)}/><div style={{marginTop:8,fontFamily:F,fontWeight:500,fontSize:11,color:C.stone}}>{form.bloomRatio==="1:2"?("2x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*2))+"g bloom"):("3x dose — "+(Math.round((parseFloat(mode==="xbloom"?form.xDose:form.dose)||18)*3))+"g bloom")}</div></div>
        <YieldBox text={yieldStr()}/>
        <div style={{display:"flex",gap:10}}><BtnG onClick={()=>setView("bean")}>‹ Back</BtnG><BtnP onClick={generate} disabled={!canManu}>Generate</BtnP></div>
      </div>}

      {/* CALIBRATING */}
      {view==="calibrating"&&<Calibrating onDone={()=>setView("result")}/>}

      {/* RESULT */}
      {view==="result"&&result&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontFamily:F,fontWeight:900,fontSize:22,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em"}}>{t("Your Recipe")}</div>
            {rev>0&&<div style={{fontFamily:F,fontWeight:700,fontSize:10,color:C.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:2}}>Revision {rev+1}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <GlassBtn onClick={()=>setView("edit")} style={{padding:"8px 14px",fontFamily:F,fontWeight:700,fontSize:11,color:C.ink,textTransform:"uppercase"}}>{t("Edit")}</GlassBtn>
            <GlassBtn lite onClick={reset} style={{padding:"8px 14px",fontFamily:F,fontWeight:600,fontSize:11,color:C.stone,textTransform:"uppercase"}}>{t("New")}</GlassBtn>
          </div>
        </div>
        {(progress>0||rev>0)&&<ProgressBar progress={progress}/>}
        {mode==="xbloom"?<XbloomResult r={result} beanName={form.beanName}/>:<ManualResult r={result} brewMode={form.brewMode} qAdj={qAdj} setQAdj={setQAdj}/>}
        <div style={{display:"flex",gap:10,marginTop:14,marginBottom:10}}>
          <GlassBtn onClick={()=>setView("share")} radius={18} style={{flex:1,padding:"13px",fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.ink}}>{t("Share Card")}</GlassBtn>
          {mode==="xbloom"&&<GlassBtn dark onClick={()=>setView("export")} radius={18} style={{flex:1,padding:"13px",fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.white}}>{t("Export")}</GlassBtn>}
        </div>
        <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",background:C.ink,padding:"18px",marginBottom:14}}>
          <div style={{fontFamily:F,fontWeight:900,fontSize:16,color:C.white,textTransform:"uppercase",letterSpacing:"-0.01em",marginBottom:6}}>{t("Brewed it?")}</div>
          <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.6,marginBottom:14}}>Tell the Coffee Doctor how it tasted and it will dial in your next version.</div>
          <GlassBtn tint="rgba(255,255,255,0.92)" onClick={()=>{setPicked(null);setView("doctor");}} radius={18} style={{width:"100%",padding:"14px",fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.ink}}>{t("Open Coffee Doctor")}</GlassBtn>
        </div>
        <div style={{border:"1px solid rgba(150,130,210,0.28)",borderRadius:16,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",padding:"16px",marginBottom:14,background:C.card}}>
          <Lbl c="Rate this brew"/>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} style={{flex:1,padding:"10px 0",background:n<=rating?C.gold:"transparent",border:"1.5px solid "+(n<=rating?"rgba(201,162,39,0.8)":"rgba(150,130,210,0.3)"),borderRadius:12,backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",color:n<=rating?C.white:C.muted,fontFamily:F,fontWeight:800,fontSize:16,cursor:"pointer"}}>★</button>)}
          </div>
          <div style={{display:"flex",gap:10}}>
            <GlassBtn tint="rgba(168,85,247,0.85)" onClick={doSave} radius={18} style={{flex:2,padding:"14px",fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.white}}>{t("Save to Journal")}</GlassBtn>
            <GlassBtn onClick={doCopy} radius={18} style={{flex:1,padding:"14px",fontFamily:F,fontWeight:600,fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",color:C.ink}}>{t("Copy")}</GlassBtn>
          </div>
          {saveMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.accent,textAlign:"center",paddingTop:12}}>{saveMsg}</div>}
          {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.stone,textAlign:"center",paddingTop:8}}>{copyMsg}</div>}
        </div>
      </div>}

      {/* EDIT HUB — stacked display cards */}
      {view==="edit"&&result&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Edit",()=>setView("result"))}
        {bigHead("What do you want\nto change?")}
        <EditStack onPick={k=>setView(k)} items={[
          {k:"bean",icon:Ic.bean,title:t("Bean"),desc:form.beanName||t("Coffee Name"),meta:[form.origin,form.process,form.roast].filter(Boolean).join(" · ")},
          {k:"brew",icon:Ic.brew,title:t("Brew"),desc:t(form.goal||"Balanced")+" · "+(mode==="xbloom"?"xBloom "+(form.xDose||18)+"g":(form.brewer||t("Brewer"))+" "+(form.dose||18)+"g"),meta:(mode==="xbloom"?(result.dripper||"Omni"):(form.grinder||""))+" · "+((form.brewMode==="Iced"||form.xBrewMode==="Iced")?t("Iced"):t("Hot"))},
        ]}/>
        <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.muted,textAlign:"center",marginTop:-26}}>Pick a card — change it, then generate again.</div>
      </div>}

      {/* SHARE CARD */}
      {view==="share"&&result&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Share Card",()=>setView("result"))}
        {bigHead("Share\nyour brew")}
        <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,marginBottom:20,lineHeight:1.7}}>Screenshot this card and share it anywhere.</div>
        <ShareCard mode={mode} form={form} result={result}/>
        <GlassBtn dark onClick={doCopy} radius={18} style={{width:"100%",padding:"14px",fontFamily:F,fontWeight:700,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.white,marginTop:14}}>{t("Copy Recipe Text")}</GlassBtn>
        {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.stone,textAlign:"center",paddingTop:12}}>{copyMsg}</div>}
      </div>}

      {/* COFFEE DOCTOR */}
      {view==="doctor"&&result&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Coffee Doctor",()=>setView("result"))}
        {bigHead("How did\nit taste?")}
        {!picked&&<>
          <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.ink,marginBottom:12}}>{t("What do you want more of?")}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
            {DOC_GOALS.map(it=><button key={it.tag} onClick={()=>pickDoctor(it)} style={{textAlign:"left",padding:"15px 16px",background:C.card,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",fontFamily:F,fontWeight:700,fontSize:14,color:C.ink,cursor:"pointer"}}>{it.tag}</button>)}
          </div>
          <div style={{fontFamily:F,fontWeight:800,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.ink,marginBottom:12}}>{t("Or what went wrong?")}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
            {DOC_PROBS.map(it=><button key={it.tag} onClick={()=>pickDoctor(it)} style={{padding:"11px 16px",background:"transparent",border:"1px solid rgba(150,130,210,0.28)",borderRadius:16,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",fontFamily:F,fontWeight:700,fontSize:13,color:C.stone,cursor:"pointer"}}>{it.tag}</button>)}
            <GlassBtn tint="rgba(201,162,39,0.82)" onClick={markPerfect} style={{padding:"11px 16px",fontFamily:F,fontWeight:800,fontSize:13,color:C.white}}>★ Perfect</GlassBtn>
          </div>
        </>}
        {picked&&<div className="anim">
          <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",padding:"20px",marginBottom:16,background:C.card}}>
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
      {view==="export"&&result&&mode==="xbloom"&&<div style={{...W,paddingTop:36,paddingBottom:40}}>
        {headerNav("‹ Recipe","Export",()=>setView("result"))}
        {bigHead("Export to\nxBloom")}
        {xbExport==="success"
          ?<div style={{border:"1px solid rgba(50,200,100,0.4)",borderRadius:20,background:"rgba(50,200,100,0.06)",padding:"20px 18px",marginBottom:16,textAlign:"center"}}>
            <div style={{fontFamily:F,fontWeight:800,fontSize:15,color:"#22c55e",marginBottom:6}}>Recipe exported ✓</div>
            <div style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,marginBottom:14,lineHeight:1.6}}>Open the link on your phone to load it straight into the xBloom app.</div>
            <GlassBtn tint="rgba(34,197,94,0.8)" onClick={()=>window.open(xbShareUrl,"_blank")} radius={14} style={{width:"100%",padding:"14px",fontFamily:F,fontWeight:800,fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",color:"#fff",marginBottom:8}}>📲 Open in xBloom</GlassBtn>
            <button onClick={()=>{try{navigator.clipboard.writeText(xbShareUrl);}catch(e){} setCopyMsg("Link copied ✓"); setTimeout(()=>setCopyMsg(""),2000);}} style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.accent,background:"transparent",border:"none",cursor:"pointer",padding:4}}>Copy link</button>
            {copyMsg&&<div style={{fontFamily:F,fontWeight:600,fontSize:11,color:C.accent,marginTop:4}}>{copyMsg}</div>}
            <div style={{marginTop:12}}><GlassBtn onClick={()=>{setXbExport("idle");setXbShareUrl("");}} radius={12} style={{padding:"10px 20px",fontFamily:F,fontWeight:700,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",color:C.ink}}>Export again</GlassBtn></div>
          </div>
          :<>
            <div style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,lineHeight:1.7,marginBottom:16}}>Push this recipe straight into the xBloom app — no login needed. Tap below and you'll get a link that opens it in “My Recipes” on your phone.</div>
            {xbExport==="error"&&<div style={{background:"rgba(255,60,60,0.08)",border:"1px solid rgba(255,60,60,0.3)",borderRadius:14,padding:"10px 14px",marginBottom:12,fontFamily:F,fontWeight:600,fontSize:12,color:"#ef4444",lineHeight:1.5}}>{xbError}</div>}
            <GlassBtn tint="rgba(168,85,247,0.85)" onClick={exportToXbloom} disabled={xbExport==="exporting"} radius={18} style={{width:"100%",padding:"16px",fontFamily:F,fontWeight:800,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",color:C.white,marginBottom:8}}>
              {xbExport==="exporting"?"Exporting…":"📲 "+t("Send to xBloom")}
            </GlassBtn>
          </>}
        {copyMsg&&xbExport!=="success"&&<div style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.accent,textAlign:"center",lineHeight:1.5,padding:"4px 8px 12px"}}>{copyMsg}</div>}
        <div style={{height:10}}/>
        <div style={{border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",marginBottom:14}}>
          <div style={{background:C.ink,padding:"12px 16px"}}><span style={{fontFamily:F,fontWeight:800,fontSize:11,color:C.white,letterSpacing:"0.1em",textTransform:"uppercase"}}>Coffee — Basic Specs</span></div>
          <SpecRow label="Dripper" value={result.dripper} sub={result.needsOther?"select Other in app":""}/>
          <SpecRow label="Dose" value={result.dose+"g"}/>
          <SpecRow label="Coffee : Water" value={result.ratio} sub={result.totalVolume+"ml"}/>
          <SpecRow label="Grind Size" value={result.grindSize} sub={xbloomMicrons(result.grindSize)+"µm · "+grindZone(result.grindSize)}/>
          <SpecRow label="Grinder Speed" value={result.rpm} sub="RPM"/>
        </div>
        <PourBars pours={result.pours} total={(result.pours||[]).reduce((s,p)=>s+p.volume,0)} target={result.totalVolume}/>
        {result.over18&&<div style={{border:"1.5px solid rgba(168,85,247,0.55)",borderRadius:20,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",boxShadow:"0 8px 24px rgba(168,85,247,0.16)",padding:"13px 16px",marginTop:14,background:C.card}}>
          <div style={{fontFamily:F,fontWeight:700,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.accent,marginBottom:6}}>Dose over 18g</div>
          <p style={{fontFamily:F,fontWeight:500,fontSize:12,color:C.stone,lineHeight:1.6,margin:0}}>Grind the full {result.dose}g and keep the same dripper. In-app: set dose 18g at 1:{result.appRatio} to match the water volume.</p>
        </div>}
        <GlassBtn tint="rgba(168,85,247,0.85)" onClick={doCopy} radius={18} style={{width:"100%",padding:"15px",fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.white,marginTop:8}}>{t("Copy Full Recipe")}</GlassBtn>
        {copyMsg&&<div style={{fontFamily:F,fontWeight:700,fontSize:12,color:C.accent,textAlign:"center",paddingTop:12}}>{copyMsg}</div>}
        <CardSection result={result} onMsg={setCopyMsg}/>
      </div>}

      </motion.div>
      </AnimatePresence>

      {showAbout&&<div onClick={()=>setShowAbout(false)} style={{position:"fixed",inset:0,background:"rgba(30,10,60,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:24}}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.bg,border:"1px solid rgba(255,255,255,0.65)",borderRadius:20,backdropFilter:"blur(20px) saturate(170%)",WebkitBackdropFilter:"blur(20px) saturate(170%)",boxShadow:"0 8px 28px rgba(94,68,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",overflow:"hidden",maxWidth:420,width:"100%",padding:"28px 26px"}}>
          <div style={{fontFamily:F,fontWeight:900,fontSize:24,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:6}}>Calibrated Pours</div>
          <div style={{fontFamily:F,fontWeight:600,fontSize:10,color:C.accent,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:16}}>Precision pour-over recipes</div>
          <p style={{fontFamily:F,fontWeight:500,fontSize:13,color:C.stone,lineHeight:1.7,margin:"0 0 14px"}}>Every coffee is different. Roast date, origin, variety, roast level and process all change how a bean extracts — so your recipe should change too. This app reads the bean and builds the recipe. No accounts, no cloud, everything stays on your device.</p>
          <p style={{fontFamily:F,fontWeight:600,fontSize:12,color:C.ink,margin:"0 0 18px"}}>Designed & built by Ahmed Al Falahi · UAE</p>
          <GlassBtn dark onClick={()=>setShowAbout(false)} radius={18} style={{width:"100%",padding:"13px",fontFamily:F,fontWeight:800,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:C.white}}>Close</GlassBtn>
        </div>
      </div>}

      {/* GLASS DOCK — floating nav; on landing only once a recipe exists (post-intro) */}
      {dockOn&&<GlassDock view={view} hasRecipe={!!result}
        onHome={()=>setView("landing")} onJournal={openSaved} onRecipe={()=>result&&setView("result")}/>}

      {/* FOOTER — hidden during the white intro */}
      <div style={{...W,borderTop:"1px solid rgba(120,100,190,0.25)",paddingTop:16,paddingBottom:16,marginTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",background:"transparent",opacity:lit?1:0,transition:"opacity 1s ease"}}>
        <span style={{fontFamily:F,fontWeight:900,fontSize:13,color:C.ink,textTransform:"uppercase",letterSpacing:"-0.01em"}}>Calibrated Pours</span>
        <button onClick={()=>setShowAbout(true)} style={{fontFamily:F,fontWeight:600,fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.muted,background:"none",border:"none",cursor:"pointer",padding:0}}>{t("About")}</button>
      </div>
    </div>
  </MotionConfig>;
}
