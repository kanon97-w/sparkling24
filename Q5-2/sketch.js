// 吹き出し
function setup(){
  createCanvas(400, 400);
  textSize(16);
}

function draw(){
  background(131, 165, 191);
  balloon("関数は難しい？", 100, 100);
  balloon("関数は便利？", mouseX, mouseY);
}

function balloon(t, x, y){
  const w = textWidth(t); // テキストの幅
  const h = textAscent() + textDescent(); // テキストの高さ
  const p = 4; // 余白の大きさ (padding)

  push();

  // BLANK[1] 吹き出しの背景を先に描く
  fill(142, 230, 107);
  noStroke();
  rect(x, y, w + p * 2, h + p * 2, 5);// BLANK[2] 吹き出しの三角形を描く
  triangle(x, y + 5, x, y + 15, x - 10, y);
  // 吹き出しのテキストを次に描く
  textAlign(LEFT, CENTER);
  fill(0);
  text(t, x + p, y + h / 2 + p);
  
  pop();
}