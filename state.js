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
