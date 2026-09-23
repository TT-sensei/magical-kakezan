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
