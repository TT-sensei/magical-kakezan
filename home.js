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
