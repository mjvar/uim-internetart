let swayFactor = 0.2;
let gravity = 0.2;
let sizeChangeSpeed = 2;

// minimum circle radius is expressed as a fraction of screen width!
// e.g. 0.1 = minimum radius is 1/10th of screen width
let minRadius = 0.02;
let maxRadius = 0.2;

let entriesCeiling = 20;

let fontLight;
let fontMedItal;

let balls = [];
let ballColors = ['#E5D1FA','#E3DFFD','#ECF2FF'];

let demoWords = [];
const gratefulFor = ["health", "family", "friends", "love", "opportunities", "learning", "nature", "laughter", "kindness", "comfort", "peace", "strength", "home", "food", "water", "job", "income", "freedom", "creativity", "inspiration", "education", "technology", "hope", "memories", "adventure", "growth", "beauty", "goodness", "spirituality", "generosity", "simplicity", "community", "gratitude", "compassion", "humor", "curiosity", "flexibility", "resilience", "empathy", "trust", "faith", "patience", "forgiveness", "positivity", "creativity", "self-care", "music", "books", "sunshine", "moonlight", "stars"];
const workingOn = ["productivity", "communication", "organization", "focus", "patience", "gratitude", "mindfulness", "consistency", "confidence", "resilience", "discipline", "creativity", "self-awareness", "kindness", "assertiveness", "health", "fitness", "diet", "sleep", "stress", "anxiety", "procrastination", "time-management", "leadership", "teamwork", "listening", "empathy", "humility", "forgiveness", "letting-go", "boundaries", "self-care", "meditation", "journaling", "learning", "problem-solving", "adaptability", "flexibility", "curiosity", "positivity", "motivation", "self-reflection", "career", "finance", "relationships", "parenting", "creativity", "inner-peace"];
const weatherFeeling = ["sunny", "breezy", "cloudy", "rainy", "thundery", "windy", "humid", "foggy", "misty", "chilly", "frosty", "freezing", "snowy", "sleety", "icy", "blustery", "gloomy", "stormy", "overcast", "damp", "drizzly", "showery", "muggy", "sweltering", "scorching", "hot", "warm", "cool", "temperate", "dry", "arid", "drought", "dusty", "smoky", "hazy", "polluted", "clear", "bright", "fresh", "crisp", "invigorating", "refreshing", "bracing", "glowing", "radiant", "balmy", "serene", "tranquil", "calm", "peaceful"];
const animalFeeling = ["lion", "gazelle", "monkey", "turtle", "dolphin", "panda", "elephant", "bird", "snake", "wolf", "fox", "kangaroo", "koala", "otter", "giraffe", "rhino", "hippo", "cheetah", "panther", "tiger", "bear", "owl", "cat", "dog", "rabbit", "hamster", "deer", "horse", "cow", "sheep", "goat", "pig", "chicken", "duck", "parrot", "crocodile", "shark", "whale", "octopus", "jellyfish", "starfish", "crab", "lobster", "snail", "butterfly", "spider", "scorpion", "ant", "bee"];
const wordLists = [["What is one thing you are grateful for today?", gratefulFor], 
  ["What is one thing you're working on improving?", workingOn], 
  ["What weather do you feel like today?", weatherFeeling],
  ["What animal do you feel like today?", animalFeeling]
];

function setup() {
  const selectedPrompt = random(wordLists);
  const question = selectedPrompt[0];
  demoWords = selectedPrompt[1];

  document.getElementById("qtext").innerHTML = question;

  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style("z-index", "-1");
  minRadius *= windowWidth;
  maxRadius *= windowWidth;

  for (i = 0; i < 15; i++) {
    balls.push(new Ball(
      createVector(width/2,0),
      p5.Vector.random2D().mult(random(0.1)),
      minRadius,
      color(random(ballColors)),
      demoWords[i],
      int(random(1, 5))
    ));
  }

  fontLight = loadFont("assets/Roboto-Light.ttf");
  fontMedItal = loadFont("assets/Roboto-MediumItalic.ttf");
}

function draw() {
  background(255, 250, 235, 50);
  
  for(let i = 0; i < balls.length; i++) {
    for(let j = 0; j < i; j++) {
      balls[i].collide(balls[j]);
    }
  }
  
  for(let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].render();
  }

  if (frameCount % 100 == 0 && random(1) > 0.2) {
    let newWord = random(demoWords);
    newEntry(newWord);
  }
}

function newEntry(word) {
  // if the word exists, we increase its bubble
  // if not, we make a new one
  for(let i = 0; i < balls.length; i++) {
    if (balls[i].matchesWord(word)) {
      balls[i].entries += 1;
      balls[i].recomputeBaseRadius();
      return;
    }
  }
  balls.push(new Ball(
    createVector(random(width),random(5*height/6,height)),
    p5.Vector.random2D().mult(random(0.1)),
    minRadius,
    color(200,200,250),
    word,
    1
  ));
}

class Ball {
  constructor(pos, vel, radius, color, word, entries) {
    this.pos = pos;
    this.vel = vel;
    this.color = color;
    this.seed = random(100);
    this.collided = false;
    this.word = word;

    this.entries = entries;
    this.baseRadius = map(this.entries, 1, entriesCeiling, minRadius, maxRadius, true);
    this.drawRadius = 0;
    this.targetRadius = this.baseRadius;

    this.recomputeBaseRadius();
  }
  collide(other) {
    if (other == this) {
      return;
    }
    let relative = p5.Vector.sub(other.pos, this.pos);
    let dist = relative.mag() - (this.drawRadius + other.drawRadius);
    if (dist < 0) {
      this.collided = true;
      other.collided = true;
      let movement = relative.copy().setMag(abs(dist/2));
      this.pos.sub(movement);
      other.pos.add(movement);
    }
  }
  move() {
    // if the bubble is floating, add some sway
    if (!this.collided) {
      this.vel.x += sin(frameCount*0.1+this.seed)*swayFactor;
    }

    // adding gravity and gradually slowing down the bubbles
    this.vel.y -= gravity;
    this.vel.x *= 0.8;
    this.vel.y *= 0.8;

    this.pos.add(this.vel);
    if (this.pos.x < this.drawRadius) {
      this.pos.x = this.drawRadius;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x > width-this.drawRadius) {
      this.pos.x = width-this.drawRadius;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y < this.drawRadius) {
      // turn off sway if we hit ceiling
      this.collided = true;
      this.pos.y = this.drawRadius;
      this.vel.y = -this.vel.y;
    }
    if (this.pos.y > height-this.drawRadius) {
      this.pos.y = height-this.drawRadius;
      this.vel.y = -this.vel.y;
    }
  }
  render() {
    this.checkMouseOver();
    
    // change the draw radius if the target radius is different
    let radiusDiff = int(this.targetRadius - this.drawRadius);

    if (abs(radiusDiff) > 1) {
      this.drawRadius += Math.sign(radiusDiff)*sizeChangeSpeed;
    }

    let opacity = (this.mouseOver) ? 255 : 200;
    this.color.setAlpha(opacity);
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.drawRadius*2);

    textFont(fontLight);
    // scaling the text if the word is too long
    let dynamicFontSize = this.drawRadius*0.6;
    dynamicFontSize *= 1-(this.word.length/25)

    textSize(dynamicFontSize);
    textAlign(CENTER, CENTER);
    fill(10,10,10);
    text(this.word, this.pos.x, this.pos.y-(this.drawRadius*0.1));

    if (this.mouseOver) {
      textSize(this.drawRadius*0.3);
      fill(10,10,10);
      let plural = (this.entries == 1) ? " entry" : " entries";
      let entryCountStr = str(this.entries) + plural;
      text(entryCountStr, this.pos.x, this.pos.y+(this.drawRadius*0.3))
    }
  }
  
  checkMouseOver() {
    let mousePos = new p5.Vector(mouseX, mouseY);
    this.mouseOver = false
    if (p5.Vector.dist(mousePos, this.pos) < this.drawRadius){
      this.mouseOver = true;
    }
    
    if (this.mouseOver) {
      this.targetRadius = max(this.baseRadius * 1.2, maxRadius/4);
    }
    else {
      this.targetRadius = this.baseRadius;
    }
  }

  matchesWord(newWord) {
    if (newWord === this.word) {
      return true;
    }
    return false;
  }

  recomputeBaseRadius(){
    // compute appropriate radius based on entries
    this.baseRadius = map(this.entries, 1, entriesCeiling, minRadius, maxRadius);
    this.targetRadius = this.baseRadius;
  }
}