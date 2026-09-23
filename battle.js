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
