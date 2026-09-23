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
