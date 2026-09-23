const NAVI_BASE="https://tt-sensei.github.io/navi-character-/assets/web/";
const FANTASY_BASE=NAVI_BASE+"fantasy/";
const BATTLE_BACKGROUNDS=["sky-island"].map(function(n){return FANTASY_BASE+"backgrounds/"+n+".webp"});
const HEROES=[
{id:"riku",name:"りく",image:"riku-ninja"},{id:"sora",name:"そら",image:"sora-swordsman"},{id:"kai",name:"かい",image:"kai-mage"},
{id:"saku",name:"さく",image:"saku-cleric-healer"},{id:"tsuki",name:"つき",image:"tsuki-archer"},{id:"nami",name:"なみ",image:"nami-guardian-knight"}
];
const GROUP1=[
["happa-squirrel-leafy","はっぱリス"],["komorin-little-night-bat","こもりんナイトバット"],["purun-little-magic-slime","ぷるんスライム"],
["ember-frost-pup","エンバーフロストパップ"],["sakura-snow-puff","さくらスノーパフ"],["star-bat","スターバット"],
["night-snow-puff","ナイトスノーパフ"],["sunset-puru","サンセットぷる"],["mizutama-kappa","みずたまカッパ"],
["lantern-firefly","ランタンホタル"],["cloud-rain-rabbit","くもあめウサギ"],["pebble-ram","こいしラム"]
];
const LEVELS=[
{id:1,short:"LEVEL 1",name:"2けた × 1けた",description:"まずは基本の筆算",example:"24 × 6"},
{id:2,short:"LEVEL 2",name:"2けた × 2けた",description:"かんたん",example:"23 × 14"},
{id:3,short:"LEVEL 3",name:"2けた × 2けた",description:"ふつう",example:"47 × 28"},
{id:4,short:"LEVEL 4",name:"2けた × 2けた",description:"むずかしい",example:"86 × 79"},
{id:5,short:"LEVEL 5",name:"3けた × 2けた",description:"さいごの試練",example:"246 × 37"}
];
const STORAGE_KEY="mathStats",BATTLE_SETUP_KEY="magicalKakezanBattle.v1",BATTLE_RECORD_KEY="magicalKakezanBattleRecord.v1";
const titles=["魔法のたまご","見習い魔法使い","呪文の初心者","ほうき乗り志望","薬草の鑑定士","魔法の筆使い","星読みの生徒","杖の選び手","図書館の番人","【一人前魔法使い】","【筆算の神】"];
const collectionItems=[
{gems:0,icon:"🥚",name:"星のたまご",text:"最初の魔法のなかま"},{gems:3,icon:"🐣",name:"ぴよスター",text:"小さな光を集める"},
{gems:8,icon:"🐈",name:"つきねこ",text:"夜の計算がとくい"},{gems:15,icon:"🦉",name:"ものしりフクロウ",text:"筆算を見守る先生"},
{gems:25,icon:"🦊",name:"ほのおギツネ",text:"元気な魔法の案内役"},{gems:40,icon:"🐸",name:"まほうガエル",text:"こたえへ大ジャンプ"},
{gems:60,icon:"🦄",name:"にじユニコーン",text:"七色のひらめきを持つ"},{gems:85,icon:"🐲",name:"ちびドラゴン",text:"くり上がりを守る"},
{gems:115,icon:"🧚",name:"星のようせい",text:"がんばりを星に変える"},{gems:150,icon:"🐉",name:"天空ドラゴン",text:"魔法界の伝説のなかま"},
{gems:200,icon:"🪄",name:"伝説のつえ",text:"選ばれた魔法使いの証"},{gems:300,icon:"👑",name:"筆算の王冠",text:"図鑑さいごの秘宝"}
];
const eduBadges=[
{slug:"first-step",root:"common",name:"はじめの一歩",hint:"1問クリア",test:function(s){return totalSolves(s)>=1}},
{slug:"challenger",root:"common",name:"チャレンジャー",hint:"5問クリア",test:function(s){return totalSolves(s)>=5}},
{slug:"great-answer",root:"common",name:"ナイスアンサー",hint:"10問クリア",test:function(s){return totalSolves(s)>=10}},
{slug:"keep-going",root:"common",name:"継続パワー",hint:"3日以上取り組む",test:function(s){return Object.keys(s.daily||{}).length>=3}},
{slug:"practice-master",root:"common",name:"れんしゅう名人",hint:"30問クリア",test:function(s){return totalSolves(s)>=30}},
{slug:"calculation",root:"math",name:"計算マスター",hint:"計算修行を始める",test:function(s){return totalSolves(s)>=1}},
{slug:"number-sense",root:"math",name:"数となかよし",hint:"Lv1を5問クリア",test:function(s){return s.lv1.solve>=5}},
{slug:"logical-thinking",root:"math",name:"すじみち思考",hint:"全レベルに挑戦",test:function(s){return [1,2,3,4,5].every(function(l){return s["lv"+l].solve>0})}},
{slug:"strategy",root:"math",name:"作戦名人",hint:"Lv5を5問クリア",test:function(s){return s.lv5.solve>=5}},
{slug:"math-discovery",root:"math",name:"算数のひみつ",hint:"50問クリア",test:function(s){return totalSolves(s)>=50}},
{slug:"accuracy",root:"common",name:"正確チャレンジ",hint:"20問クリア",test:function(s){return totalSolves(s)>=20}},
{slug:"focus",root:"common",name:"集中タイム",hint:"Lv2を10問クリア",test:function(s){return s.lv2.solve>=10}},
{slug:"problem-solver",root:"common",name:"問題解決名人",hint:"25問クリア",test:function(s){return totalSolves(s)>=25}},
{slug:"hard-worker",root:"common",name:"努力のつみ重ね",hint:"75問クリア",test:function(s){return totalSolves(s)>=75}},
{slug:"level-up",root:"common",name:"レベルアップ",hint:"Lv3を5問クリア",test:function(s){return s.lv3.solve>=5}},
{slug:"mastery",root:"common",name:"修行マスター",hint:"150問クリア",test:function(s){return totalSolves(s)>=150}},
{slug:"never-give-up",root:"common",name:"あきらめない心",hint:"ミスのあとに20問クリア",test:function(s){return totalSolves(s)>=20&&[1,2,3,4,5].some(function(l){return s["lv"+l].miss>0})}},
{slug:"streak",root:"common",name:"連続修行",hint:"5日分のスタンプ",test:function(s){return Object.keys(s.daily||{}).length>=5}},
{slug:"independent",root:"common",name:"ひとりで挑戦",hint:"全レベルで3問以上クリア",test:function(s){return [1,2,3,4,5].every(function(l){return s["lv"+l].solve>=3})}},
{slug:"champion",root:"common",name:"筆算チャンピオン",hint:"全レベルで10問以上クリア",test:function(s){return [1,2,3,4,5].every(function(l){return s["lv"+l].solve>=10})}}
];
const eduBadgeImage=function(b){return "https://tt-sensei.github.io/edu-assets/assets/web/badges/"+b.root+"/"+b.slug+"/badge.webp"};
let stats=normalizeStats(JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"));
let battleState={mode:"battle",heroIndex:0,levelId:1,enemies:[],enemyIndex:0,mistakes:0,correct:0,combo:0,questionTotal:5,startedAt:0,timerId:null,enemyHp:0,enemyMaxHp:0,finished:false};
let n1=0,n2=0,steps=[],cur=0,currentLevel=1,currentStepMessage="",naviTimer=null,stateHintVisible=false;
const $=function(s){return document.querySelector(s)},$$=function(s){return Array.from(document.querySelectorAll(s))};

function normalizeStats(data){
  const base=data&&typeof data==="object"?data:{};
  base.totalGems=Number(base.totalGems)||0;
  [1,2,3,4,5].forEach(function(lv){const old=base["lv"+lv]||{};base["lv"+lv]={solve:Number(old.solve)||0,miss:Number(old.miss)||0}});
  base.daily=base.daily&&typeof base.daily==="object"?base.daily:{};
  return base;
}
function totalSolves(s){return [1,2,3,4,5].reduce(function(sum,lv){return sum+s["lv"+lv].solve},0)}
function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function saveStats(){localStorage.setItem(STORAGE_KEY,JSON.stringify(stats))}
function titleForGems(g){return titles[Math.min(Math.floor(g/10),titles.length-1)]}
function updateHomeStats(){$("#homeGems").textContent=stats.totalGems;$("#homeTitle").textContent=titleForGems(stats.totalGems)}
function loadBattleSetup(){
  try{
    const s=JSON.parse(localStorage.getItem(BATTLE_SETUP_KEY)||"{}");
    battleState.mode=s.mode==="time"?"time":"battle";
    battleState.heroIndex=Number.isInteger(s.heroIndex)&&s.heroIndex>=0&&s.heroIndex<HEROES.length?s.heroIndex:0;
    battleState.levelId=Number.isInteger(s.levelId)&&LEVELS.some(function(l){return l.id===s.levelId})?s.levelId:1;
  }catch(_){}
}
function saveBattleSetup(){localStorage.setItem(BATTLE_SETUP_KEY,JSON.stringify({mode:battleState.mode,heroIndex:battleState.heroIndex,levelId:battleState.levelId}))}
function battleRecord(){try{const r=JSON.parse(localStorage.getItem(BATTLE_RECORD_KEY)||"{}");return r&&typeof r==="object"?r:{}}catch{return {}}}
function saveBattleRecord(r){localStorage.setItem(BATTLE_RECORD_KEY,JSON.stringify(r))}

function playSound(type){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;const ctx=new AudioCtx();
    const recipes={correct:[659,880],wrong:[220,145],special:[523,659,784,1047],gameover:[392,330,262],clear:[523,659,784]};
    (recipes[type]||recipes.correct).forEach(function(freq,i){
      const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.10;o.type=type==="wrong"||type==="gameover"?"triangle":"sine";o.frequency.value=freq;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.10,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+.24)
    });
    setTimeout(function(){ctx.close()},700);
  }catch(_){}
}

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function generateProblem(levelId){
  let a,b;
  if(levelId===1){a=randomInt(10,99);b=randomInt(1,9)}
  else if(levelId===2){a=randomInt(1,4)*10+randomInt(0,4);b=randomInt(1,4)*10+randomInt(0,4)}
  else if(levelId===3){a=randomInt(10,99);b=randomInt(10,99)}
  else if(levelId===4){a=randomInt(10,99);b=randomInt(10,99)}
  else{a=randomInt(100,999);b=randomInt(10,99)}
  return {a:a,b:b};
}
function setupSteps(){
  const len1=String(n1).length,len2=String(n2).length;
  const cols=currentLevel===5?6:5;
  const aDigits=String(n1).split("").reverse().map(Number);
  const bDigits=String(n2).split("").reverse().map(Number);
  const pRows=[];steps=[];
  function placeName(col){
    const i=cols-1-col;
    return ["一のくらい","十のくらい","百のくらい","千のくらい","一万のくらい"][i]||"このくらい";
  }
  function addPartial(r,k,bDigit,carry,rowDigits){
    const srcCol=cols-1-k,col=srcCol-r,aDigit=aDigits[k];
    const total=aDigit*bDigit+carry,carryOut=Math.floor(total/10),resultDigit=total%10,bCol=cols-1-r;
    const expression=String(aDigit)+"×"+String(bDigit)+(carry?"＋"+String(carry):"");
    steps.push({kind:"carry-check",phase:"partial",row:r,col:col,expression:expression,fullTotal:total,carryOut:carryOut,answer:carryOut>0?"yes":"no",focusIds:["n1-c"+srcCol,"n2-c"+bCol,"p"+(r+1)+"-c"+col]});
    if(carryOut>0)steps.push({kind:"carry-input",phase:"partial",row:r,col:col,carryCol:col-1,expected:String(carryOut),expression:expression,focusIds:["c_p"+(r+1)+"-c"+(col-1)]});
    steps.push({kind:"digit-input",phase:"partial",row:r,col:col,expected:String(resultDigit),carryOut:carryOut,carryCol:col-1,place:placeName(col),expression:expression+"＝",focusIds:["n1-c"+srcCol,"n2-c"+bCol,"p"+(r+1)+"-c"+col]});
    rowDigits[col]=resultDigit;
    return carryOut;
  }
  for(let r=0;r<len2;r++){
    const rowDigits=new Array(cols).fill(null);let carry=0,bDigit=bDigits[r];
    for(let k=0;k<len1;k++)carry=addPartial(r,k,bDigit,carry,rowDigits);
    if(carry>0){
      const col=cols-1-len1-r;rowDigits[col]=carry;
      steps.push({kind:"final-carry",phase:"partial",row:r,col:col,expected:String(carry),place:placeName(col),focusIds:["c_p"+(r+1)+"-c"+col,"p"+(r+1)+"-c"+col]});
    }
    pRows.push(rowDigits);
  }
  if(len2>1){
    let carry=0;const sumStart=cols-(len1+len2);
    for(let col=cols-1;col>=sumStart;col--){
      const values=[];pRows.forEach(function(row){if(row[col]!==null)values.push(row[col])});
      if(values.length===0&&carry===0)continue;
      const total=values.reduce(function(s,v){return s+v},0)+carry,carryOut=Math.floor(total/10),resultDigit=total%10;
      const expression=(values.length?values:["0"]).map(String).join("＋")+(carry?"＋"+carry:"");
      steps.push({kind:"carry-check",phase:"sum",row:null,col:col,expression:expression,fullTotal:total,carryOut:carryOut,answer:carryOut>0?"yes":"no",focusIds:["p1-c"+col,"p2-c"+col]});
      if(carryOut>0)steps.push({kind:"carry-input",phase:"sum",row:null,col:col,carryCol:col-1,expected:String(carryOut),expression:expression,focusIds:["c_sum-c"+(col-1)]});
      steps.push({kind:"digit-input",phase:"sum",row:null,col:col,expected:String(resultDigit),carryOut:carryOut,carryCol:col-1,place:placeName(col),expression:expression+"＝",focusIds:["ans-c"+col,"p1-c"+col,"p2-c"+col]});
      carry=carryOut;
    }
    if(carry>0){
      const col=sumStart-1;
      if(col>=0)steps.push({kind:"final-sum-carry",phase:"sum",row:null,col:col,expected:String(carry),place:placeName(col),focusIds:["c_sum-c"+col,"ans-c"+col]});
    }
  }
}
function renderLevelChoice(){
  $("#levelChoice").innerHTML=LEVELS.map(function(l){return '<button type="button" class="level-card" data-level="'+l.id+'"><span class="level">'+l.short+'</span><span class="name">'+l.name+'</span><span class="desc">'+l.description+'</span><span class="example">'+l.example+'</span></button>'}).join("");
  $$(".level-card").forEach(function(btn){btn.addEventListener("click",function(){battleState.levelId=Number(btn.dataset.level);saveBattleSetup();updateHomeSelection()})});
}
function renderHeroChoice(){
  $("#heroChoice").innerHTML=HEROES.map(function(h,i){return '<button type="button" class="hero-card" data-hero="'+i+'"><img src="'+FANTASY_BASE+h.image+'.webp" alt=""><span>'+h.name+'</span></button>'}).join("");
  $$(".hero-card").forEach(function(btn){btn.addEventListener("click",function(){battleState.heroIndex=Number(btn.dataset.hero);saveBattleSetup();updateHomeSelection()})});
}
function updateHomeSelection(){
  $$(".mode-card").forEach(function(btn){btn.classList.toggle("selected",btn.dataset.mode===battleState.mode)});
  $$(".level-card").forEach(function(btn){btn.classList.toggle("selected",Number(btn.dataset.level)===battleState.levelId)});
  $$(".hero-card").forEach(function(btn){btn.classList.toggle("selected",Number(btn.dataset.hero)===battleState.heroIndex)});
  const l=LEVELS.find(function(x){return x.id===battleState.levelId});
  $("#selectedLevelLabel").textContent=l?l.name:"";$("#selectedHeroLabel").textContent=HEROES[battleState.heroIndex].name+" と いっしょに";
}
function showScreen(el){$$(".screen").forEach(function(s){s.classList.remove("active")});el.classList.add("active")}
function setBattleBackground(){const bg=BATTLE_BACKGROUNDS[randomInt(0,BATTLE_BACKGROUNDS.length-1)];$("#gameScreen").style.backgroundImage='linear-gradient(rgba(246,249,251,.23),rgba(246,249,251,.36)),url("'+bg+'")'}
function resetBattleBackground(){$("#gameScreen").style.backgroundImage=""}

function startBattle(){
  currentLevel=battleState.levelId;cur=0;steps=[];stateHintVisible=false;
  battleState.questionTotal=battleState.mode==="battle"?5:10;battleState.enemies=GROUP1.slice().sort(function(){return Math.random()-.5});
  if(battleState.mode==="time"){while(battleState.enemies.length<10)battleState.enemies.push(GROUP1[battleState.enemies.length%GROUP1.length])}
  battleState.enemyIndex=0;battleState.mistakes=0;battleState.correct=0;battleState.combo=0;battleState.finished=false;battleState.startedAt=performance.now();
  showScreen($("#gameScreen"));setBattleBackground();$("#battleModeLabel").textContent=battleState.mode==="battle"?"⚔️ ノーマル":"⏱ タイムアタック";$("#battleTimer").hidden=battleState.mode!=="time";
  startBattleClock();setupBattleEnemy(false);startQuestion();setupBattleEnemy(true);
}
function startBattleClock(){
  clearInterval(battleState.timerId);if(battleState.mode!=="time"){$("#battleTimer").textContent="";return}
  const tick=function(){const sec=(performance.now()-battleState.startedAt)/1000;$("#battleTimer").textContent=formatTime(sec)};tick();battleState.timerId=setInterval(tick,100)
}
function formatTime(sec){const m=Math.floor(sec/60).toString().padStart(2,"0"),s=Math.floor(sec%60).toString().padStart(2,"0");return m+":"+s+"."+Math.floor((sec%1)*10)}

function startQuestion(){
  const raw=generateProblem(currentLevel);n1=raw.a;n2=raw.b;setupSteps();cur=0;stateHintVisible=false;
  try{
    renderBoard();
    renderKeypad();
    updateProblemLabels();
    checkAutoSkip();
    updateCurrentStep();
  }catch(err){
    console.error("魔法のかけ算バトルの描画エラー:",err);
    try{renderKeypad()}catch(_){}
    try{updateBoardVisuals()}catch(_){}
    try{setFeedback("表示を立て直しました。もう一度ためしてみよう。","bad")}catch(_){}
  }
}
function retryQuestion(){
  const raw=generateProblem(currentLevel);n1=raw.a;n2=raw.b;setupSteps();cur=0;stateHintVisible=false;
  battleState.enemyHp=battleState.enemyMaxHp;renderBoard();updateProblemLabels();checkAutoSkip();updateCurrentStep();setFeedback("新しい問題でもう一度。","neutral");
}
function updateProblemLabels(){
  const l=LEVELS.find(function(x){return x.id===currentLevel});
  $("#gameLevelLabel").textContent=l?l.short:"LEVEL";$("#gameTitle").textContent=l?l.name:"魔法のかけ算";$("#problemLabel").textContent="問題 "+(battleState.enemyIndex+1);
  $("#problemExpression").textContent=n1+"×"+n2+"＝";$("#questionProgress").textContent=(battleState.enemyIndex+1)+" / "+battleState.questionTotal;
  $("#sessionCorrect").textContent="正解 "+battleState.correct+(battleState.combo>1?"　コンボ "+battleState.combo:"");
}
function setupBattleEnemy(updateHp){
  const enemy=battleState.enemies[battleState.enemyIndex];if(!enemy)return;
  if(updateHp!==false){
    battleState.enemyMaxHp=steps.filter(function(s){return s.kind==="digit-input"||s.kind==="final-carry"||s.kind==="final-sum-carry"}).length;
    battleState.enemyHp=battleState.enemyMaxHp;
  }
  const hero=HEROES[battleState.heroIndex];
  $("#heroBattleImage").src=FANTASY_BASE+hero.image+".webp";$("#heroBattleName").textContent=hero.name;
  $("#enemyBattleImage").src=FANTASY_BASE+"monsters/zako/"+enemy[0]+".webp";$("#enemyBattleName").textContent=enemy[1];
  $("#battleStatus").textContent=(battleState.enemyIndex+1)+"体目のナビアン！";updateBattleHud();
}
function updateBattleHud(){
  const hearts=Array.from({length:5},function(_,i){return i<battleState.mistakes?"♡":"♥"}).join(" ");
  $("#battleHearts").textContent=hearts;$("#battleHeartsSide").textContent=hearts;
  const pct=battleState.enemyMaxHp?Math.max(0,battleState.enemyHp/battleState.enemyMaxHp*100):0;$("#enemyHpFill").style.width=pct+"%";
  $("#battlePlaceProgress").textContent=battleState.enemyHp>0?"あと "+battleState.enemyHp+" くらい":"たおした！";
}
function registerMistake(){
  if(battleState.finished)return;
  battleState.mistakes=Math.min(5,battleState.mistakes+1);battleState.combo=0;stats["lv"+currentLevel].miss++;saveStats();updateHomeStats();
  playSound("wrong");playHeroAction("damage");updateBattleHud();
  if(battleState.mode==="battle"&&battleState.mistakes>=5)finishBattle(false,"ゲームオーバー");
}
const ACTION_CACHE={};
function loadHeroAction(hero,action,done){
  const key=hero.id+":"+action;if(ACTION_CACHE[key]){done(ACTION_CACHE[key]);return}
  const templates={attack:"{image}-attack.webp",damage:"{image}-damage.webp",special:"{image}-special.webp"};
  const src=FANTASY_BASE+"action/"+templates[action].replace("{image}",hero.image);const img=new Image();
  img.onload=function(){ACTION_CACHE[key]=src;done(src)};img.onerror=function(){done(null)};img.src=src;
}
function playHeroAction(action){
  const hero=HEROES[battleState.heroIndex],img=$("#heroBattleImage");
  loadHeroAction(hero,action,function(src){
    if(!src||battleState.finished)return;
    img.src=src;img.classList.remove("hero-action-pop","hero-special-pop","hero-damage-pop");void img.offsetWidth;
    img.classList.add(action==="special"?"hero-special-pop":action==="damage"?"hero-damage-pop":"hero-action-pop");
    const duration=action==="special"?900:600;setTimeout(function(){if(!battleState.finished)img.src=FANTASY_BASE+hero.image+".webp";img.classList.remove("hero-action-pop","hero-special-pop","hero-damage-pop")},duration)
  });
}
function battleAttack(){
  if(battleState.finished)return;
  battleState.enemyHp=Math.max(0,battleState.enemyHp-1);
  const special=battleState.combo>0&&battleState.combo%5===0,banner=$("#battleFieldBanner");
  $("#battleAttackMessage").textContent=special?"スペシャル！":"こうげき！";banner.hidden=false;banner.classList.remove("attack-pop","special-pop");void banner.offsetWidth;banner.classList.add(special?"special-pop":"attack-pop");
  const enemy=$("#enemyBattleImage");enemy.classList.remove("enemy-hit");void enemy.offsetWidth;enemy.classList.add("enemy-hit");
  playHeroAction(special?"special":"attack");playSound(special?"special":"correct");updateBattleHud();
  setTimeout(function(){banner.hidden=true;enemy.classList.remove("enemy-hit")},special?900:500);
}
function battlePlaceCorrect(){battleState.combo+=1;battleAttack()}

function getDigitInfo(id){
  const d10=Math.floor(n2/10),d1=n2%10,p1=n1*d1,p2=n1*d10;
  if(id.indexOf("p1_")===0){const place=id.split("_")[1],pn=place==="1"?"一の位":place==="10"?"十の位":place==="100"?"百の位":"千の位";return{title:pn+"の数字を書く",text:n1+" × "+d1+" の答えから、"+pn+"の数字を書こう。",prompt:n1+" × "+d1}}
  if(id.indexOf("p2_")===0){const place=id.split("_")[1],pn=place==="10"?"一の位":place==="100"?"十の位":place==="1000"?"百の位":"千の位";return{title:"十の位の "+pn,text:n1+" × "+d10+" の答えを、右から順に書こう。",prompt:n1+" × "+d10}}
  const place=id.split("_")[1],pn=place==="1"?"一の位":place==="10"?"十の位":place==="100"?"百の位":place==="1000"?"千の位":"一万の位";
  return{title:"答えの "+pn,text:"できた部分をたして、答えの"+pn+"を書こう。",prompt:p1+(p2?" + "+p2:"")}
}
function rightDigits(n,count){
  const arr=String(n).split("").map(Number),out=new Array(count).fill("");
  for(let i=0;i<arr.length;i++)out[count-arr.length+i]=arr[i];
  return out;
}
function appendDigitRow(prefix,rowClass,count){
  for(let i=0;i<count;i++){const cell=document.createElement("div");cell.className="cell "+rowClass;cell.id=prefix+"-c"+i;$("#board").appendChild(cell)}
}
function appendCarryRow(prefix,rowClass,count){
  for(let i=0;i<count;i++){const wrap=document.createElement("div");wrap.className="cell carry-row";const carry=document.createElement("div");carry.className="carry "+rowClass;carry.id=prefix+"-c"+i;wrap.appendChild(carry);$("#board").appendChild(wrap)}
}
function appendLine(){const line=document.createElement("div");line.className="line";$("#board").appendChild(line)}
function renderBoard(){
  const b=$("#board"),colCount=currentLevel===5?6:5;b.className="board col"+colCount;b.style.gridTemplateColumns="repeat("+colCount+",var(--cell))";b.innerHTML="";
  appendDigitRow("n1","operand",colCount);appendDigitRow("n2","operand",colCount);
  const aCols=rightDigits(n1,colCount),bCols=rightDigits(n2,colCount);
  aCols.forEach(function(v,i){if(v!=="")$("#n1-c"+i).textContent=v});bCols.forEach(function(v,i){if(v!=="")$("#n2-c"+i).textContent=v});
  const L1=String(n1).length,L2=String(n2).length,longer=Math.max(L1,L2),opCol=Math.max(0,colCount-longer-1);
  $("#n2-c"+opCol).textContent="×";$("#n2-c"+opCol).classList.add("op");
  for(let r=0;r<L2;r++){appendLine();appendCarryRow("c_p"+(r+1),"p"+(r+1)+"-carry",colCount);appendDigitRow("p"+(r+1),"p"+(r+1)+"-digit",colCount)}
  if(L2>1){appendLine();appendCarryRow("c_sum","sum-carry",colCount);appendDigitRow("ans","ans-digit",colCount)}
  Array.from(b.querySelectorAll(".cell")).forEach(function(cell){
    if(/^p\d+-c/.test(cell.id)){
      const span=document.createElement("span");span.className="num-display";cell.appendChild(span);
    }
  });
}
function activeStep(){return steps[cur]}
function clearInput(){const s=activeStep();if(!s)return;const cell=$("#"+s.id);if(cell)cell.querySelector(".num-display").textContent=""}
function checkAutoSkip(){
  while(cur<steps.length&&steps[cur].skip){const cell=$("#"+steps[cur].id);if(cell){cell.classList.remove("input","active");cell.classList.add("done");cell.style.color="#5d7b69"}cur++}
}
function setFeedback(msg,type){const el=$("#feedback");el.textContent=msg;el.className="feedback "+type}
function updateStepRail(){
  const step=activeStep(),pills=$$(".step-pill");
  pills.forEach(function(p){p.classList.remove("active","done");p.hidden=false});
  if(!step){pills.forEach(function(p){p.classList.add("done")});return}
  const place=step.place||"このくらい";
  pills[0].textContent="① くり上がり";
  pills[1].textContent="② くり上げる数";
  pills[2].textContent="③ "+place+"に入力";
  if(step.kind==="carry-check"){
    pills[0].classList.add("active");
  }else if(step.kind==="carry-input"){
    pills[0].classList.add("done");pills[1].classList.add("active");
  }else{
    pills[0].classList.add("done");pills[1].classList.add("done");pills[2].classList.add("active");
  }
}
function updateCurrentStep(){
  const step=activeStep();updateStepRail();
  if(!step){
    $("#instructionTitle").textContent="筆算完成！";$("#instructionText").textContent="くり上がりを確認しながら、筆算を完成させました。";$("#calculationPrompt").textContent=n1+"×"+n2+"＝"+(n1*n2);
    $("#answerLabel").textContent="完成";$("#answerDisplay").textContent="✓";$("#answerDisplay").style.background="#effaf4";$("#answerDisplay").style.borderColor="#67b78d";$("#numberPad").innerHTML="";return;
  }
  if(step.kind==="carry-check"){
    $("#instructionTitle").textContent="くり上がりはある？";
    $("#instructionText").textContent=step.place+"の計算をして、10以上になるか考えよう。";
    $("#calculationPrompt").textContent=stateHintVisible?step.expression+" ＝ "+step.fullTotal:step.expression;
    $("#answerLabel").textContent="くり上がり";
    $("#answerDisplay").textContent="はい？ いいえ？";
    $("#answerDisplay").style.background="#fff";
    $("#answerDisplay").style.borderColor="";
  }else if(step.kind==="carry-input"){
    $("#instructionTitle").textContent="くり上げる数は？";
    $("#instructionText").textContent="10のくらいの数を入力して、その場所にメモしよう。";
    $("#calculationPrompt").textContent=step.expression;
    $("#answerLabel").textContent="くり上げる数（10のくらい）";
    $("#answerDisplay").textContent=step.input||"＿";
    $("#answerDisplay").style.background="#fffdf0";
    $("#answerDisplay").style.borderColor="#d6b64d";
  }else if(step.kind==="final-carry"||step.kind==="final-sum-carry"){
    $("#instructionTitle").textContent="最後のくり上がり";
    $("#instructionText").textContent="最後のくり上がりを、このくらいの数字として入力しよう。";
    $("#calculationPrompt").textContent="くり上がり "+step.expected;
    $("#answerLabel").textContent=step.place+"の数字";
    $("#answerDisplay").textContent=step.input||"＿";
    $("#answerDisplay").style.background="#fffdf0";
    $("#answerDisplay").style.borderColor="#d6b64d";
  }else{
    $("#instructionTitle").textContent=step.place+"に入力";
    $("#instructionText").textContent="くり上がりを確認したら、このくらいの答えの数字を入力しよう。";
    $("#calculationPrompt").textContent=stateHintVisible?step.expression+" ＝ "+step.fullTotal:step.expression;
    $("#answerLabel").textContent=step.place+"の数字";
    $("#answerDisplay").textContent=step.input||"＿";
    $("#answerDisplay").style.background="#fff";
    $("#answerDisplay").style.borderColor="";
  }
  renderKeypad();updateBoardVisuals();
}
function renderKeypad(){
  const step=activeStep(),pad=$("#numberPad");
  if(!step){pad.innerHTML="";return}
  if(step.kind==="carry-check"){pad.innerHTML='<button type="button" class="pad-button carry-choice" data-choice="yes">はい</button><button type="button" class="pad-button carry-choice" data-choice="no">いいえ</button>';return}
  const keys=["1","2","3","4","5","6","7","8","9","⌫","0","決定"];
  pad.innerHTML=keys.map(function(k){const cls=k==="決定"?"submit":k==="⌫"?"function":"";return '<button type="button" class="pad-button '+cls+'" data-key="'+k+'">'+k+"</button>"}).join("");
}
function updateBoardVisuals(){
  const b=$("#board"),cells=Array.from(b.querySelectorAll(".cell"));cells.forEach(function(c){c.classList.remove("active","focus","wrong","active-carry")});
  const step=activeStep();if(!step)return;
  (step.focusIds||[]).forEach(function(id){const t=$("#"+id);if(t)t.classList.add(step.kind==="carry-input"?"active-carry":"focus")});
  if(step.kind==="carry-input"){const id=step.phase==="sum"?"c_sum-c"+step.carryCol:"c_p"+(step.row+1)+"-c"+step.carryCol;$("#"+id)?.classList.add("active-carry")}
  if(step.kind==="digit-input"){const id=step.phase==="sum"?"ans-c"+step.col:"p"+(step.row+1)+"-c"+step.col;$("#"+id)?.classList.add("active")}
}

function handleCarryChoice(choice){
  const step=activeStep();if(!step||step.kind!=="carry-check"||battleState.finished)return;
  if(choice!==step.answer){markCurrentStepWrong();registerMistake();setFeedback("10以上になるか、もう一度計算してみよう。","bad");return}
  playSound("correct");stateHintVisible=false;setFeedback(choice==="yes"?"くり上がりあり。いくつ上げるか入力しよう。":"くり上がりなし。答えの数字を書こう。","good");
  cur++;setTimeout(function(){updateCurrentStep()},180);
}
function checkAnswer(){
  const step=activeStep();if(!step||battleState.finished)return;

  if(step.kind==="final-carry"||step.kind==="final-sum-carry"){
    const id=step.phase==="sum"?"ans-c"+step.col:"p"+(step.row+1)+"-c"+step.col,cell=$("#"+id);
    const input=step.input||"",expected=String(step.expected);
    if(input!==expected){
      step.input="";markCurrentStepWrong();registerMistake();stateHintVisible=false;
      setFeedback("最後のくり上がりをもう一度入力しよう。","bad");return;
    }
    if(cell){
      const display=cell.querySelector(".num-display");
      if(display)display.textContent=input;else cell.textContent=input;
      cell.classList.remove("active","wrong");cell.classList.add("done");
    }
    battlePlaceCorrect();stateHintVisible=false;setFeedback("正解！最後の数字を書いたよ。","good");
    cur++;setTimeout(function(){if(cur>=steps.length)completeBattleQuestion();else updateCurrentStep()},220);return;
  }

  if(step.kind==="carry-input"){
    const id=step.phase==="sum"?"c_sum-c"+step.carryCol:"c_p"+(step.row+1)+"-c"+step.carryCol;
    const cell=$("#"+id),input=step.input||"",expected=String(step.expected);
    if(input!==expected){
      step.input="";markCurrentStepWrong();registerMistake();stateHintVisible=false;
      setFeedback("くり上げる数をもう一度考えよう。","bad");return;
    }
    if(cell)cell.textContent=input;
    cur++;setFeedback("くり上がり "+input+" をメモしたよ。","good");setTimeout(function(){updateCurrentStep()},220);return;
  }

  const id=""+(step.phase==="sum"?"ans-c"+step.col:"p"+(step.row+1)+"-c"+step.col);
  const cell=$("#"+id);if(!cell)return;
  const display=cell.querySelector(".num-display"),input=display?display.textContent:"",expected=String(step.expected);
  if(input!==expected){
    if(display)display.textContent="";step.input="";markCurrentStepWrong();registerMistake();stateHintVisible=false;
    setFeedback("もういちど。答えの数字をたしかめよう。","bad");return;
  }
  if(display)display.textContent=input;cell.classList.remove("active","wrong");cell.classList.add("done");step.input=input;
  battlePlaceCorrect();stateHintVisible=false;setFeedback("正解！つぎの計算へ。","good");cur++;
  setTimeout(function(){if(cur>=steps.length)completeBattleQuestion();else updateCurrentStep()},260);
}
function markCurrentStepWrong(){
  const step=activeStep();if(!step)return;
  (step.focusIds||[]).forEach(function(id){const cell=$("#"+id);if(cell){cell.classList.remove("wrong");void cell.offsetWidth;cell.classList.add("wrong")}})
}

function completeBattleQuestion(){
  if(battleState.finished)return;
  battleState.correct++;
  const before=eduBadges.filter(function(b){return b.test(stats)}).length,today=localDate();
  stats.totalGems+=currentLevel;stats["lv"+currentLevel].solve++;stats.daily[today]=(stats.daily[today]||0)+1;saveStats();updateHomeStats();
  const after=eduBadges.filter(function(b){return b.test(stats)}).length;if(after>before)showBadgeToast(before);
  battleState.enemyIndex++;
  if(battleState.enemyIndex>=battleState.questionTotal){finishBattle(true,battleState.mode==="battle"?"バトルクリア！":"タイムアタック終了！");return}
  startQuestion();setupBattleEnemy();updateProblemLabels();
}
function showBadgeToast(before){
  const got=eduBadges.filter(function(b){return b.test(stats)}),newly=got.slice(before).pop();if(!newly)return;
  const toast=$("#badgeToast");toast.textContent="🏅 "+newly.name+" をゲット！";toast.hidden=false;setTimeout(function(){toast.hidden=true},1900)
}
function finishBattle(won,title){
  if(battleState.finished)return;
  battleState.finished=true;clearInterval(battleState.timerId);battleState.timerId=null;
  const elapsed=(performance.now()-battleState.startedAt)/1000,record=battleRecord();let recordLine="";
  if(battleState.mode==="time"){const best=record.bestTime;if(won&&(!best||elapsed<best)){record.bestTime=elapsed;recordLine="ベストタイム更新！"}else if(best)recordLine="ベスト "+formatTime(best)}
  record.last={mode:battleState.mode,levelId:currentLevel,correct:battleState.correct,mistakes:battleState.mistakes,elapsed:elapsed,date:new Date().toISOString()};saveBattleRecord(record);
  playSound(won?"clear":"gameover");$("#resultMark").textContent=won?"✓":"×";$("#resultMark").className="result-mark"+(won?"":" fail");$("#resultKicker").textContent=battleState.mode==="battle"?"5問バトル":"10問タイムアタック";$("#resultTitle").textContent=title;
  $("#resultText").textContent=battleState.mode==="battle"?"正解 "+battleState.correct+"問　ミス "+battleState.mistakes+"回":"タイム "+formatTime(elapsed)+"\\n正解 "+battleState.correct+"問　ミス "+battleState.mistakes+"回"+(recordLine?"\\n"+recordLine:"");$("#resultOverlay").hidden=false;
}
function backHome(){clearInterval(battleState.timerId);battleState.timerId=null;battleState.finished=true;$("#resultOverlay").hidden=true;resetBattleBackground();showScreen($("#homeScreen"));updateHomeStats()}
function showRecord(){
  const earned=eduBadges.filter(function(b){return b.test(stats)}).length;let html='<div class="record-stats"><div class="record-stat"><strong>'+totalSolves(stats)+'</strong><span>クリア問題</span></div><div class="record-stat"><strong>'+stats.totalGems+'</strong><span>宝石</span></div><div class="record-stat"><strong>'+earned+'/'+eduBadges.length+'</strong><span>獲得バッジ</span></div></div><table class="record-table"><tr><th>レベル</th><th>クリア</th><th>ミス</th></tr>';
  [1,2,3,4,5].forEach(function(lv){html+='<tr><td>Lv'+lv+'</td><td>'+stats["lv"+lv].solve+'回</td><td>'+stats["lv"+lv].miss+'回</td></tr>'});html+='</table>';
  const rec=battleRecord();if(rec.bestTime)html+='<p style="font-size:12px;color:#58738a;font-weight:900">タイムアタック ベスト '+formatTime(rec.bestTime)+'</p>';
  html+='<div class="collection"><div class="collection-title">💎 宝石コレクション</div><div class="collection-grid">';
  collectionItems.forEach(function(item){const got=stats.totalGems>=item.gems;html+='<div class="collection-item '+(got?"unlocked":"")+'"><div class="icon">'+(got?item.icon:"🔒")+'</div><div class="name">'+(got?item.name:"？？？")+'</div><div class="hint">'+(got?item.text:"宝石 "+item.gems+"個")+'</div></div>'});html+='</div></div><div style="margin-top:14px;text-align:center"><button id="resetStatsButton" class="ghost-button">成績をリセットする</button></div>';
  $("#recordContent").innerHTML=html;$("#recordOverlay").hidden=false;$("#resetStatsButton").addEventListener("click",function(){if(confirm("これまでの修行の記録をすべてリセットしますか？")){stats=normalizeStats(null);saveStats();updateHomeStats();showRecord()}});
}
function showBadges(){
  const earned=eduBadges.filter(function(b){return b.test(stats)}).length;$("#badgeCount").textContent=earned+" / "+eduBadges.length;
  $("#badgeContent").innerHTML=eduBadges.map(function(b){const got=b.test(stats);return '<div class="edu-badge '+(got?"earned":"locked")+'"><img src="'+eduBadgeImage(b)+'" alt="'+(got?b.name:"未獲得バッジ")+'"><div class="name">'+(got?b.name:"？？？")+'</div><div class="hint">'+(got?b.hint:"条件： "+b.hint)+'</div></div>'}).join("");
  $("#badgeOverlay").hidden=false;
}
function numInput(v){
  const step=activeStep();if(!step||step.kind==="carry-check")return;
  if(step.kind==="carry-input"){
    if(v==="del"){step.input="";$("#answerDisplay").textContent="＿"}
    else{step.input=String(v);$("#answerDisplay").textContent=String(v)}
    stateHintVisible=false;return;
  }
  const id=step.phase==="sum"?"ans-c"+step.col:"p"+(step.row+1)+"-c"+step.col;
  const display=$("#"+id)?.querySelector(".num-display");
  if(step.kind==="final-carry"||step.kind==="final-sum-carry"){
    if(v==="del"){step.input="";$("#answerDisplay").textContent="＿"}
    else{step.input=String(v);$("#answerDisplay").textContent=String(v)}
    stateHintVisible=false;return;
  }
  if(!display)return;
  display.textContent=v==="del"?"":String(v);step.input=display.textContent;stateHintVisible=false;$("#answerDisplay").textContent=display.textContent||"＿";
}

$("#modeChoice").addEventListener("click",function(e){const btn=e.target.closest("[data-mode]");if(!btn)return;battleState.mode=btn.dataset.mode;saveBattleSetup();updateHomeSelection()});
$("#startButton").addEventListener("click",startBattle);$("#homeButton").addEventListener("click",backHome);$("#resultHome").addEventListener("click",backHome);
$("#resultAgain").addEventListener("click",function(){$("#resultOverlay").hidden=true;startBattle()});$("#retryButton").addEventListener("click",retryQuestion);
$("#hintButton").addEventListener("click",function(){if(!activeStep())return;stateHintVisible=true;updateCurrentStep();setFeedback("計算をたしかめてから、数字を書こう。","neutral")});
$("#numberPad").addEventListener("click",function(e){const choice=e.target.closest("[data-choice]");if(choice){handleCarryChoice(choice.dataset.choice);return}const btn=e.target.closest("[data-key]");if(!btn)return;btn.dataset.key==="決定"?checkAnswer():numInput(btn.dataset.key)});
$("#recordButton").addEventListener("click",showRecord);$("#recordClose").addEventListener("click",function(){$("#recordOverlay").hidden=true});$("#badgeButton").addEventListener("click",showBadges);$("#badgeClose").addEventListener("click",function(){$("#badgeOverlay").hidden=true});
$$(".overlay").forEach(function(o){o.addEventListener("click",function(e){if(e.target===o&&o.id!=="resultOverlay")o.hidden=true})});
window.addEventListener("keydown",function(e){if(!$("#gameScreen").classList.contains("active"))return;if(e.key>="0"&&e.key<="9")numInput(e.key);if(e.key==="Backspace")numInput("del");if(e.key==="Enter")checkAnswer()});
window.addEventListener("resize",function(){if(currentLevel&&$("#board").children.length)updateBoardVisuals()});

function initialize(){loadBattleSetup();renderLevelChoice();renderHeroChoice();updateHomeSelection();updateHomeStats()}
initialize();
