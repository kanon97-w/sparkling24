// チェッカー

function setup() {
  createCanvas(200, 200);
  strokeWeight(0);
  const size = width / 8;
  noFill();

  for (let i = 0; i < 9; i++) {
    let x = size * i;
    line(size * i, 0, size * i, 200);

    for (let j = 0; j < 9; j++) {
      let y = size * j;
      line(0, size * j, 200, size * j);
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 == 0) {
        fill(255);
      } else {
        fill(122);
      }
      rect(size * i, size * j, size, size);
    }
  }

  noStroke();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) 
     if ((i + j) % 2 == 1) {
      if (j<3) {
      fill(255, 0, 0);
      } else if (j >= 5) {
      fill(30, 40, 50);
       } else {
       fill(0, 0, 0); 
      }
      ellipse(
        size * i + size / 2,
        size * j + size / 2,
        size * 0.8,
        size * 0.8
      );
    }
  }
}
