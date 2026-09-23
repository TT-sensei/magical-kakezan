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
