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
