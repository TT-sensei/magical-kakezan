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
