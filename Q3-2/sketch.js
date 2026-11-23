
let x, y;
let vx, vy;
let zPressed = false;
let spacePressed = false;
let jumpRequested = false;
const g = 1;

function setup(){
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 1.335;
  vx = 0;
  vy = 0;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function draw(){
  background(160, 192, 255);
  const size = height * 0.1; // キャラクターのサイズ

  // 地面を描く
  const groundY = height * 0.8;
  fill(64, 192, 64);
  rect(0, groundY, width, height - groundY);

  // BLANK[1] キャラクターの左右移動
  vx = 0;

  if(keyIsDown(LEFT_ARROW)){ vx = -3; }
  if(keyIsDown(RIGHT_ARROW)){ vx = 3; }

  // Zキーを押している間は10倍速
  if(zPressed){ vx *= 10; }

  // BLANK[2] 重力とジャンプ
  if(y >= groundY - size / 2){
    y = groundY - size / 2;
    vy = 0;

    if(jumpRequested){
      vy = -20;
    }
  }

  jumpRequested = false;

  // 重力
  vy += g;

  // 速くなりすぎないように制限
  vx = constrain(vx, -50, 50);
  vy = constrain(vy, -20, 20);

  // 位置を更新
  x += vx;
  y += vy;

  // キャラクターを描く
  fill(0);
  ellipse(x, y, size, size);

  // キーが認識されているか確認
  fill(0);
  textSize(20);
  text("Z: " + zPressed, 20, 40);
  text("vx: " + vx, 20, 70);
  text("SPACE: " + spacePressed, 20, 100);
  text("vy: " + vy, 20, 130);
}

// キーを押したとき
function keyPressed(event){
  if(event.code === "KeyZ"){
    zPressed = true;
  }

  if(event.code === "Space" && !spacePressed){
    spacePressed = true;
    jumpRequested = true;
  }

  return false;
}

// キーを離したとき
function keyReleased(event){
  if(event.code === "KeyZ"){
    zPressed = false;
  }

  if(event.code === "Space"){
    spacePressed = false;
  }

  return false;
}
