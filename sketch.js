let branches = [];
let maxDepth = 6;
let baseLength = 120;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  colorMode(RGB, 255);
  noFill();
  generatePlant();
}

function draw() {
  background(20, 30, 20);

  // vento oscillante
  let wind = sin(frameCount * 0.05) * 0.4;

  translate(width / 2, height);
  scale(1, -1);

  for (let b of branches) {
    // calcola lunghezza progressiva
    let t = b.growth;
    t = min(t + 0.03, 1); // cresce più velocemente
    b.growth = t;

    let dynamicAngle = b.angle + wind * (1 - b.depth / maxDepth);

    // calcola posizione finale del ramo
    let endX = b.x1 + cos(dynamicAngle) * b.len * t;
    let endY = b.y1 + sin(dynamicAngle) * b.len * t;

    // colore ramo
    let colorRatio = b.depth / maxDepth;
    let col = lerpColor(color(139, 69, 19), color(60, 180, 75), colorRatio);

    stroke(col);
    strokeWeight(map(b.depth, 0, maxDepth, 5, 1));
    line(b.x1, b.y1, endX, endY);

    // foglie
    if (b.depth === maxDepth && t >= 1) {
      push();
      translate(endX, endY);
      rotate(sin(frameCount * 0.05) + dynamicAngle);
      fill(60, 200, 90, 200);
      noStroke();
      ellipse(0, 0, 8, 12);
      pop();
    }

    // aggiorna la posizione dei figli
    for (let child of b.children) {
      child.x1 = endX;
      child.y1 = endY;
    }
  }
}

// genera la pianta
function generatePlant() {
  branches = [];
  createBranch(0, 0, -HALF_PI, baseLength, 0, null);
}

// crea i rami ricorsivamente
function createBranch(x, y, angle, len, depth, parent) {
  if (depth > maxDepth) return;

  let b = { x1: x, y1: y, angle: angle, len: len, depth: depth, growth: 0, children: [] };
  branches.push(b);

  if (parent) parent.children.push(b);

  // parametri figli
  let branchFactor = random(0.6, 0.8);
  let angleOffset = random(PI / 10, PI / 5);

  createBranch(x, y, angle + angleOffset, len * branchFactor, depth + 1, b);
  createBranch(x, y, angle - angleOffset, len * branchFactor, depth + 1, b);
}

function mousePressed() {
  generatePlant();
}