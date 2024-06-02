let sourceImg = null;
let maskImg = null;
let backgroundImg = null;
let renderCounter = 0;
let shimmerParticles = [];
let maxShimmerParticles = 70;

// Change these three lines as appropriate
let sourceFile = "input_6.jpg";
let maskFile = "mask_6.png";
let backgroundFile = "input_6.jpg"; // Add your background image file here
let outputFile = "output_6.png";

function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
  backgroundImg = loadImage(backgroundFile); // Load the background image
}

function setup() {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  sourceImg.loadPixels();
  maskImg.loadPixels();
  backgroundImg.loadPixels();

  imageMode(CORNER); // Change image mode to CORNER for the background image

  // Initialize shimmer particles
  for (let i = 0; i < maxShimmerParticles; i++) {
    shimmerParticles.push(createShimmerParticle());
  }
}

function draw() {
  // Draw the background image each frame to ensure it is not cleared
  image(backgroundImg, 0, 0, width, height);

  for (let i = 0; i < 4000; i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    let mask = maskImg.get(x, y);

    if (mask[0] > 128) {
      let pix = sourceImg.get(x, y);

      // Shimmer effect
      updateShimmerParticles(x, y);

      // Lens flare effect
      drawLensFlare(x, y);

      // Emboss effect
      applyEmboss(x, y);
    }
  }

  renderCounter = renderCounter + 1;
  if (renderCounter > 10) {
    console.log("Done!");
    noLoop();
    // Uncomment this to save the result
    saveArtworkImage(outputFile);
  }
}

function createShimmerParticle() {
  return {
    x: random(sourceImg.width),
    y: random(sourceImg.height),
    size: random(2, 2),
    opacity: random(50, 200),
    speed: random(0.5, 2),
  };
}

function updateShimmerParticles(x, y) {
  for (let i = 0; i < shimmerParticles.length; i++) {
    let p = shimmerParticles[i];

    // Move particle
    p.y += p.speed;
    if (p.y > height) p.y = 0;

    // Generate random color for each particle
    let shimmerColor = color(random(255), random(255), random(255), p.opacity);

    // Draw particle with random color
    fill(shimmerColor);
    ellipse(p.x, p.y, p.size);

    // Reposition particle within the jewelry area
    if (dist(p.x, p.y, x, y) < 50) {
      p.x = x + random(-50, 50);
      p.y = y + random(-50, 50);
    }
  }
}

function drawLensFlare(x, y) {
  colorMode(HSB, 360, 100, 100, 1); // Set color mode to HSB
  let numFlares = 0.01;
  for (let i = 0; i < numFlares; i++) {
    let flareSize = random(10, 30); // Adjusted the size range for more variability
    let flareOpacity = random(0.6, 1); // Ensure high opacity for brightness

    // Generate random bright color within the rainbow spectrum
    let hue = random(0, 360); // Hue from 0 to 360 for full spectrum
    let flareColor = color(hue, 100, 100, flareOpacity); // Full saturation and brightness

    // Draw main flare ellipse with solid color
    noStroke();
    fill(flareColor);
    ellipse(x, y, flareSize);

    // Additional smaller circles for a more complex flare effect
    let smallFlareSize = flareSize / 2;
    let smallFlareColor = color(hue, 100, 100, flareOpacity);
    
    fill(smallFlareColor);
    ellipse(x + random(-flareSize, flareSize), y + random(-flareSize, flareSize), smallFlareSize);
  }
  colorMode(RGB, 255); // Reset color mode to default RGB
}

function applyEmboss(x, y) {
  // Define the strength of the emboss effect
  let embossStrength = 60;

  // Apply the emboss effect to the jewelry edges
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i != 0 && j != 0) {
        let offsetX = i * embossStrength;
        let offsetY = j * embossStrength;

        // Generate random colors for the light and dark edges
        let lightColor = color(random(255), random(255), random(255));
        let darkColor = color(random(255), random(255), random(255));

        // Draw the light and dark edges with random colors
        fill(lightColor);
        rect(x + offsetX, y + offsetY, 2, 2);

        fill(darkColor);
        rect(x - offsetX, y - offsetY, 2, 2);
      }
    }
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
