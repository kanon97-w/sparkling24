// 最終課題を制作しよう

function setup(){
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  background(160, 192, 255);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

const W = 1280;
const H = 720;
const HAND_X = 640;
const HAND_Y = 635;
const GAME_SECONDS = 30;

let people = [];
let requests = [];
let hearts = [];

let game = 0;
let frames = 0;
let spaceHeld = false;
let dragging = false;
let dragX = HAND_X;
let dragY = HAND_Y;


// 初期設定
function setup(){
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  textFont("sans-serif");
  makePeople();
}


// ウィンドウサイズに合わせる
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}


// 画面を描く
function draw(){
  push();

  // 横画面いっぱいに表示
  scale(width / W, height / H);

  drawBackground();
  drawPeople();
  drawStage();

  if(game == 1){
    frames++;
    updateRequests();
    updateHearts();

    // 30秒後に結果発表
    if(frames >= GAME_SECONDS * 60){
      game = 2;
      dragging = false;
    }
  }

  if(game == 1){
    drawRequests();
    drawFlyingHearts();
  }

  drawHand();
  drawInfo();

  // スタート画面
  if(game == 0){
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text("PRESS SPACE TO START", 640, 545);
  }

  // 結果画面
  if(game == 2){
    drawResult();
  }

  pop();
}


// 紫色の背景
function drawBackground(){
  noStroke();

  for(let y = 0; y < H; y += 8){
    let v = 42 + 5 * sin(y * 0.02);

    fill(v + 15, v - 7, v + 22);
    rect(0, y, W, 8);
  }
}


// ステージの位置を判定
function onStage(x, y){
  if(y > 295 && y < 405 && x > 470 && x < 810){
    return true;
  }

  if(y >= 385 && y < 610 && x > 535 && x < 745){
    return true;
  }

  if(y >= 605){
    return true;
  }

  return false;
}


// 灰色のファンを並べる
function makePeople(){
  people = [];
  randomSeed(42);

  for(let row = 0; row < 14; row++){
    for(let col = 0; col < 30; col++){

      let x = 23 + col * 42
            + (row % 2) * 18
            + random(-5, 5);

      let y = 52 + row * 39
            + random(-4, 4);

      if(x < W - 15 && !onStage(x, y)){
        people.push({
          x: x,
          y: y,
          s: 0.73 + row * 0.023,
          alive: true,
          busy: false,
          fade: 255
        });
      }
    }
  }
}


// 灰色の観客とペンライトを描く
function drawPeople(){

  // ペンライトの蛍光色
  let colors = [
    [255, 80, 180],   // ピンク
    [70, 180, 255],   // 青
    [80, 255, 140],   // 緑
    [255, 240, 70],   // 黄色
    [190, 100, 255],  // 紫
    [80, 255, 240]    // 水色
  ];

  for(let i = 0; i < people.length; i++){
    let p = people[i];

    if(p.fade > 0){
      push();

      translate(p.x, p.y);
      scale(p.s);

      noStroke();
      fill(173, 169, 185, p.fade);

      // 観客の頭
      ellipse(0, -8, 24, 25);

      // 観客の胴体
      arc(0, 24, 43, 38, PI, TWO_PI, CHORD);
      rect(-21, 23, 42, 8);

      // ファンサをお願いしていない人だけ
      if(p.alive && !p.busy){

        // 人ごとに色を固定
        let c = colors[i % colors.length];

        // ペンライトの黒い持ち手
        stroke(35, 35, 40, p.fade);
        strokeWeight(4);
        line(17, 18, 17, 5);

        // 蛍光色の淡い光
        stroke(c[0], c[1], c[2], p.fade * 0.3);
        strokeWeight(12);
        line(17, 5, 17, -22);

        // ペンライト本体
        stroke(c[0], c[1], c[2], p.fade);
        strokeWeight(5);
        line(17, 5, 17, -22);
      }

      pop();
    }
  }

  noStroke();
}


// ステージを薄紫に統一
function drawStage(){
  noStroke();
  fill(82, 65, 87);

  // 手前のステージ
  rect(0, 609, W, H - 609);

  // 下の辺が長い細長い花道
  quad(
    622, 380,
    658, 380,
    726, 609,
    554, 609
  );

  // 中央上方のミニステージ
  quad(
    530, 310,
    750, 310,
    785, 385,
    495, 385
  );
}


// ゲーム開始
function startGame(){
  makePeople();

  requests = [];
  hearts = [];

  frames = 0;
  dragging = false;
  game = 1;

  // 最初に7人がファンサを希望
  for(let i = 0; i < 7; i++){
    newRequest();
  }
}


// 新しいファンサ希望者
function newRequest(){
  if(requests.length >= 10){
    return;
  }

  for(let n = 0; n < 120; n++){
    let index = floor(random(people.length));
    let p = people[index];

    let x = p.x;
    let y = p.y - 26;

    let valid =
      p.alive &&
      !p.busy &&
      x > 42 &&
      x < W - 42 &&
      y > 35 &&
      y < 565 &&
      !onStage(x, y);

    // お願い同士が重ならないようにする
    for(let j = 0; j < requests.length; j++){
      if(dist(x, y, requests[j].x, requests[j].y) < 76){
        valid = false;
      }
    }

    if(valid){
      p.busy = true;

      requests.push({
        x: x,
        y: y,
        owner: index,
        kind: random(1) < 0.35 ? 1 : 2,
        wait: floor(random(170, 340))
      });

      return;
    }
  }
}


// 無視されたファンが帰る
function updateRequests(){
  let next = [];

  for(let i = 0; i < requests.length; i++){
    let r = requests[i];

    r.wait--;

    if(r.wait <= 0){
      people[r.owner].alive = false;
      people[r.owner].busy = false;
    }
    else{
      next.push(r);
    }
  }

  requests = next;

  // 帰ったファンを徐々に消す
  for(let i = 0; i < people.length; i++){
    let p = people[i];

    if(!p.alive && p.fade > 0){
      p.fade = max(0, p.fade - 8);
    }
  }

  // 次々に新しいお願いを出す
  if(frames % 30 == 0 || requests.length < 6){
    newRequest();
  }
}


// 黒い丸うちわ
function drawUchiwa(x, y){
  // うちわの棒
  stroke(0);
  strokeWeight(5);
  line(x, y + 22, x, y + 49);

  // 黒い丸
  noStroke();
  fill(0);
  ellipse(x, y, 60, 60);

  // 白い文字
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);

  text("こっち", x, y - 12);
  text("みて", x, y + 3);

  // 黄色い星2つ
  textStyle(NORMAL);
  fill(255, 213, 45);
  textSize(11);
  text("★ ★", x, y + 19);
}


// ピンクのハート
function drawHeart(x, y, size){
  push();

  translate(x, y);
  scale(size / 40);

  noStroke();
  fill(244, 78, 156);

  ellipse(-9, -6, 20, 20);
  ellipse(9, -6, 20, 20);

  triangle(-18, -2, 18, -2, 0, 23);

  pop();
}


// ファンのうちわとハートを表示
function drawRequests(){
  for(let i = 0; i < requests.length; i++){
    let r = requests[i];

    if(r.kind == 1){
      drawUchiwa(r.x, r.y);
    }
    else{
      drawHeart(r.x, r.y, 40);
    }
  }
}


// ファンサ成功
function success(i){
  // 成功したファンは帰らない
  people[requests[i].owner].busy = false;

  // 成功したお願いだけ消す
  let next = [];

  for(let j = 0; j < requests.length; j++){
    if(j != i){
      next.push(requests[j]);
    }
  }

  requests = next;

  // 次のお願いを出す
  newRequest();
}


// 観客と同じ形のピンク色の人型
function drawHand(){
  push();

  translate(HAND_X, HAND_Y);

  // 横画面でも形が崩れないようにする
  let sx = width / W;
  let sy = height / H;
  let z = min(sx, sy);

  scale(z / sx, z / sy);
  scale(2.7);

  noStroke();

  // ピンク色の頭
  fill(240, 132, 176);
  ellipse(0, -8, 24, 25);

  // ピンク色の胴体
  arc(0, 24, 43, 38, PI, TWO_PI, CHORD);
  rect(-21, 23, 42, 8);

  // 頭のてっぺんに小さな赤いリボン
  fill(220, 40, 60);

  triangle(
    0, -22,
    -8, -27,
    -8, -18
  );

  triangle(
    0, -22,
    8, -27,
    8, -18
  );

  pop();
}


// 成功したハートをランダムに動かす
function updateHearts(){
  let next = [];

  for(let i = 0; i < hearts.length; i++){
    let h = hearts[i];

    // ランダムな方向へ移動
    h.x += h.vx;
    h.y += h.vy;

    // 少しずつ小さくなる
    h.size *= 0.94;

    // 小さくなったら消す
    if(h.size > 3){
      next.push(h);
    }
  }

  hearts = next;
}


// 飛んでいくハートを描く
function drawFlyingHearts(){
  for(let i = 0; i < hearts.length; i++){
    let h = hearts[i];

    drawHeart(h.x, h.y, h.size);
  }

  // ドラッグ中の線
  if(dragging){
    stroke(255, 148, 204);
    strokeWeight(2);

    line(HAND_X, HAND_Y, dragX, dragY);

    noFill();
    stroke(255);
    ellipse(dragX, dragY, 22, 22);
  }
}


// 残っているファンを数える
function countFans(){
  let count = 0;

  for(let i = 0; i < people.length; i++){
    if(people[i].alive){
      count++;
    }
  }

  return count;
}


// ミニステージに人数と残り時間を表示
function drawInfo(){
  let seconds = max(
    0,
    GAME_SECONDS - floor(frames / 60)
  );

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(21);

  text(
    "FANS " + countFans() + " / " + people.length,
    640, 335
  );

  text(
    "TIME " + seconds + "s",
    640, 365
  );
}


// 30秒後の結果発表
function drawResult(){
  let remaining = countFans();

  // 残ったファンの割合
  let percent = floor(
    remaining / people.length * 100 + 0.5
  );

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(28);
  text("RESULT", 640, 482);

  textSize(65);
  text(percent + "%", 640, 548);

  textSize(21);
  text(
    "FANS " + remaining + " / " + people.length,
    640, 585
  );

  textSize(18);
  text("PRESS SPACE TO RESTART", 640, 622);
}


// マウスの横位置を変換
function gx(){
  return mouseX * W / width;
}


// マウスの縦位置を変換
function gy(){
  return mouseY * H / height;
}


// SPACEキーで開始・再スタート
function keyPressed(){
  if(key == " " && !spaceHeld){
    spaceHeld = true;

    if(game == 0 || game == 2){
      startGame();
    }
  }

  return false;
}


// SPACEキーを離す
function keyReleased(){
  if(key == " "){
    spaceHeld = false;
  }

  return false;
}


// マウスを押す
function mousePressed(){
  if(game != 1){
    return false;
  }

  let x = gx();
  let y = gy();

  // うちわはクリックで成功
  for(let i = requests.length - 1; i >= 0; i--){
    let r = requests[i];

    if(r.kind == 1 && dist(x, y, r.x, r.y) < 29){
      success(i);
      return false;
    }
  }

  // ハートはピンクの人型からドラッグ
  if(dist(x, y, HAND_X, HAND_Y) < 65){
    dragging = true;
    dragX = x;
    dragY = y;
  }

  return false;
}


// ドラッグ中
function mouseDragged(){
  if(dragging){
    dragX = gx();
    dragY = gy();
  }

  return false;
}


// マウスがハートの形の内側にあるか判定
function insideHeart(x, y, r){

  // 横方向の座標の差
  let dx = x - r.x;

  // 縦方向の座標の差
  let dy = y - r.y;

  // ハートの上側の丸2つ
  if(
    dist(dx, dy, -9, -6) < 10 ||
    dist(dx, dy, 9, -6) < 10
  ){
    return true;
  }

  // ハートの下側の三角形
  if(
    dy >= -2 &&
    dy <= 23 &&
    abs(dx) < 18 * (23 - dy) / 25
  ){
    return true;
  }

  return false;
}


// マウスを離す
function mouseReleased(){
  if(!dragging){
    return false;
  }

  dragging = false;

  if(game != 1){
    return false;
  }

  let x = gx();
  let y = gy();

  // ハートの中で離した場合だけ成功
  for(let i = requests.length - 1; i >= 0; i--){
    let r = requests[i];

    if(r.kind == 2 && insideHeart(x, y, r)){

      // ランダムな方向を決める
      let angle = random(TWO_PI);

      // ハートが飛んで小さくなる
      hearts.push({
        x: r.x,
        y: r.y,
        vx: cos(angle) * 4,
        vy: sin(angle) * 4,
        size: 40
      });

      success(i);
      return false;
    }
  }

  // 外したら何も起こらない
  return false;
}
