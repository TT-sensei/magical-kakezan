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
