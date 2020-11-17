var scl = 10;
var grid = 0;
var tiles;
var move;
var img;
var mix = 0;
var showBox = false;
var cindex = -1;
var alowMouse = true;

function preload() {
  img = loadImage('../img/dedoBottom1160x348.jpg');
  myFont = loadFont('Raleway-Regular.ttf');
}

function setup() {
  var canvas = createCanvas(1160, 348);
  canvas.parent('sketch-holder');
  grid = width / scl; // = 116
  createTiles();
  move = new Move();
  // setTimeout(function(){
  //   mix = 1;
  // },2500);
}

function draw() {
  background(51);
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].blank === false) {
      tiles[i].show();
    }
  }
  drawDetailBox(showBox);

  if (mix < 300 && mix !== 0) {
    scramble();
  }
}

$('.filter').click(function () {
  createTiles();
  alowMouse = true;
  loop();
  var id = $(this).attr('id');
  if (id === 'all') {
    createTiles();
  } else {
    for (var i = 0; i < posts.length; i++) {
      if (tiles[i]['type'] === id) {
        tiles[i].blank = false;
      } else {
        tiles[i].blank = true;
      }
    }
  }
});

function drawDetailBox(s) {
  if (s) {
    fill(51);
    stroke(255);
    strokeWeight(1);
    rect(grid * 3 + 20, 60, grid * 4, grid * 2);
    noStroke();
    fill(255);
    textAlign(LEFT);
    textSize(26);
    textFont(myFont);
    text(tiles[cindex].title, grid * 3 + 40, 100);
    textSize(14);
    for (let i = 0; i < tiles[cindex].detail.length; i++) {
      text(tiles[cindex].detail[i], grid * 3 + 40, 140 + i * 16);
    }
  }
}

function mousePressed() {
  if (mouseY > 0 && mouseY < 349 && mouseX > 0 && mouseX < 1161) {
    cindex = floor(mouseX / grid) + floor(mouseY / grid) * 10;
    if (!showBox && alowMouse) {
      showBox = true;
    } else {
      showBox = false;
    }
  }
}

function createTiles() {
  tiles = new Array();
  for (var i = 0; i < height / grid; i++) {
    for (var j = 0; j < scl; j++) {
      var tile = new Tile();
      tile.x = j * grid;
      tile.y = i * grid;
      tile.bgimg = img.get(j * grid, i * grid, grid, grid);
      tile.blank = false;
      tiles.push(tile);
    }
  }
  tiles[tiles.length - 1].blank = true;
  for (var i = 0; i < posts.length; i++) {
    tiles[i].year = posts[i]['year'];
    tiles[i].detail = breakDetail(posts[i]['detail']);
    tiles[i].title = posts[i]['title'];
    tiles[i].type = posts[i]['type'];
    tiles[i].mainword = posts[i]['mainword'];
  }
  tiles[29].year = '3044';
  tiles[29].detail = breakDetail('Show me the money, operation cwal, power overwhelming');
  tiles[29].title = '42';
  tiles[29].type = 'null';
  tiles[29].mainword = '42';
}

function Tile() {
  this.x = 0;
  this.y = 0;
  this.bgimg = null;
  this.year = '';

  this.show = function () {
    stroke(51);
    strokeWeight(3);
    noFill();
    rect(this.x, this.y, grid, grid);
    image(this.bgimg, this.x, this.y);
    fill(255);
    textAlign(CENTER);
    textSize(28);
    textFont(myFont);
    text(this.year, this.x + grid / 2, this.y + grid / 2);
    textSize(14);
    text('[' + this.mainword + ']', this.x + grid / 2, this.y + grid / 2 + 18);
  };
}

function scramble() {
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      move.down();
      break;
    case 1:
      move.up();
      break;
    case 2:
      move.left();
      break;
    case 3:
      move.right();
      break;
  }
  mix++;
}

function Move() {
  this.down = function () {
    for (var i = scl; i < tiles.length; i++) {
      if (tiles[i].blank) {
        swapArrayElements(tiles, i, i - scl);
      }
    }
  };
  this.up = function () {
    for (var i = tiles.length - scl - 1; i >= 0; i--) {
      if (tiles[i].blank) {
        swapArrayElements(tiles, i, i + scl);
      }
    }
  };
  this.left = function () {
    for (var i = tiles.length - 1; i >= 0; i--) {
      if (tiles[i].blank && (i + 1) % scl !== 0) {
        swapArrayElements(tiles, i, i + 1);
      }
    }
  };
  this.right = function () {
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i].blank && i % scl !== 0) {
        swapArrayElements(tiles, i, i - 1);
      }
    }
  };
}

$('#menu').mouseenter(function () {
  alowMouse = false;
  noLoop();
});
$('#menu').mouseleave(function () {
  alowMouse = true;
  loop();
});

$('#scramble').one('click', scrambleStart);

function scrambleStart() {
  $('#scramble').html('RESET');
  mix = 1;
  loop();
  $(this).one('click', scrambleReset);
}
function scrambleReset() {
  mix = 0;
  createTiles();
  $('#scramble').html('SCRAMBLE');
  loop();
  $(this).one('click', scrambleStart);
}
$('#Wordcrack').bind('click', function () {
  $('#fadedBackground,#iframeWG,#closeButton').fadeIn('slow'); //css('display','block');
});

$('#Healing').bind('click', function () {
  $('#fadedBackground,#iframeHeal,#closeButton').fadeIn('slow'); //css('display','block');
});

$('#fadedBackground,#closeButton').bind('click', function () {
  $('#fadedBackground,#iframeHeal,#closeButton,#iframeWG').fadeOut('slow'); //css('display','none');
});

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    move.down();
  } else if (keyCode === RIGHT_ARROW) {
    move.right();
  } else if (keyCode === LEFT_ARROW) {
    move.left();
  } else if (keyCode === UP_ARROW) {
    move.up();
  }
}

function breakDetail(string) {
  let len = string.length;
  let box = 63;
  let arr = new Array();
  let arrSize = ceil(len / box);
  for (let i = 0; i < arrSize; i++) {
    arr.push(string.substr(i * box, box));
  }
  return arr;
}

function swapArrayElements(arr, indexA, indexB) {
  var temp = new Object();
  temp.bgimg = arr[indexA].bgimg;
  temp.blank = arr[indexA].blank;
  temp.year = arr[indexA].year;
  temp.detail = arr[indexA].detail;
  temp.type = arr[indexA].type;
  temp.title = arr[indexA].title;
  temp.mainword = arr[indexA].mainword;

  arr[indexA].bgimg = arr[indexB].bgimg;
  arr[indexA].blank = arr[indexB].blank;
  arr[indexA].year = arr[indexB].year;
  arr[indexA].detail = arr[indexB].detail;
  arr[indexA].type = arr[indexB].type;
  arr[indexA].title = arr[indexB].title;
  arr[indexA].mainword = arr[indexB].mainword;

  arr[indexB].bgimg = temp.bgimg;
  arr[indexB].blank = temp.blank;
  arr[indexB].year = temp.year;
  arr[indexB].detail = temp.detail;
  arr[indexB].type = temp.type;
  arr[indexB].title = temp.title;
  arr[indexB].mainword = temp.mainword;
}
