const images = {
  ufo:    'https://images2.imgbox.com/90/61/bP8foIzS_o.png',
  bullet: 'https://images2.imgbox.com/6b/32/GELVjZiO_o.png',
  rocket: 'https://images2.imgbox.com/a9/ee/3de7UGDe_o.png',
};

class Ufo extends BouncingSprite {
  constructor(x, y, xSpeed, ySpeed) {
    super(images.ufo, x, y, xSpeed, ySpeed);

    // met een CSS-filter kunnen we deze versie een andere kleur geven
    this.element.style.filter = `hue-rotate( ${Math.random() * 360}deg )`;
  }
}

class Bullet extends CollidingSprite {
  constructor(x, y) {
    super(images.bullet, x, y, 0, -7);
  }

  update() {
    super.update();

    if (this.y < 0) {
      this.remove();
    }
  }

  isCollision(otherSprite) {
    return (
      this.x >= otherSprite.x &&
      this.x <= otherSprite.x + otherSprite.width &&
      this.y >= otherSprite.y &&
      this.y <= otherSprite.y + otherSprite.height
    );
  }

  handleCollisionWith(otherSprite) {
    otherSprite.remove();
  }
}

class Player extends Sprite {
  constructor() {
    super(images.rocket, 325, 400, 0, 0);
  }

  moveLeft() {
    this.xSpeed = -3;
  }

  moveRight() {
    this.xSpeed = 3;
  }
}

let player;

function createGameSprites() {
  [
    [350, 225, 1, 2],
    [350, 225, -2, 1],
    [350, 225, 2, -1],
    [350, 225, -1, -2],
    [350, 225, 2, 1],
    [350, 225, -1, 2],
    [350, 225, 1, -2],
    [350, 225, -2, -1]
  ].map(ufoData => new Ufo(...ufoData));
  // de variabele 'allUfos' bevat nu een lijst met instanties
  // van de Ufo-klasse, maar met die lijsten hoeven we niets
  // te doen, want de Sprite-klasse houdt nu ook zelf een lijst
  // bij, en gebruikt die lijst om alle Sprites periodiek een
  // update() te laten doen.

  player = new Player();
}

function installKeyboardHandler() {
  // Het 'keydown' event kan je gebruiken om alle toetsaanslagen
  // te detecteren, ook van pijltjestoetsen, functietoetsen, shift, ctrl
  // etc.
  // `event.code` zal dan een string bevatten die de ingedrukte toets
  // beschrijft. Gebruik http://keycode.info/ om achter de codenamen van
  // toetsen te komen.
  document.addEventListener('keydown', event => {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        new Bullet(player.x, player.y);
        break;
      case 'ArrowLeft':
        player.moveLeft();
        break;
      case 'ArrowRight':
        player.moveRight();
        break;
    }
  });
}

const startButton  = document.getElementById('startButton');
const titleImg     = document.getElementById('titleImage');
const animationDiv = document.getElementById('animationDiv');

startButton.addEventListener('click', () => {
  animationDiv.removeChild(startButton);
  animationDiv.removeChild(titleImg);

  createGameSprites();
  Sprite.startEngine();
  installKeyboardHandler();
});
