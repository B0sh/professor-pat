'use strict';

class Grid {
  // tile_width refers to number of tiles across
  constructor(tile_width, tile_height, equation) {
    this.tile_width = tile_width;
    this.tile_height = tile_height;
    this.equation = equation;

    this.tiles = [];

    let colors = [
      'OrangePerson',
      'GreenPerson',
      'PurplePerson',
      'RedPerson',
      'YellowPerson',
    ];

    let rand = getRandomInt(0, colors.length - 1);
    let rand2 = getRandomIntNot(0, colors.length - 1, [ rand ] );

    this.person_inactive = colors[rand];
    this.person_active = colors[rand2];

    this.generate();
  }

  generate() {
  }

  render() {
    // loop through all tiles
    var slot = 0;
    for (let y = 0; y < this.tile_height; y++) {
      for (let x = 0; x < this.tile_width; x++) {
        slot++;
        var active = this.equation.is(slot);
        this.addTile(x, y, active);
      }
    }
  }

  addTile(x, y, active) {
    
    let person_image;
    if (active == true) 
      person_image = preload.getResult(this.person_active);
    else
      person_image = preload.getResult(this.person_inactive);

    var data = {
        images: [ person_image ],
        framerate: 5,
        frames: {
          width:32, 
          height:32
        },
        animations: {
            idle: {
              speed: 1/7,
              frames: [0, 1, 2, 1]
            },
        }
    };

    let spritesheet = new createjs.SpriteSheet(data);
    let animation = new createjs.Sprite(spritesheet, "idle");

    

    animation.x = 25 + 34 * (x) ;
    animation.y = 90 + 34 * (y) ;

    // console.log(animation, spritesheet);

    stage.addChild(animation);

    this.tiles.push(animation);
    
  }
}