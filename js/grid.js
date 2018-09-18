'use strict';

class Grid {
  // tile_width refers to number of tiles across
  constructor(tile_width, tile_height, equation) {
    this.tile_width = tile_width;
    this.tile_height = tile_height;
    this.equation = equation;

    this.tiles = [];

    console.log(this);

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
    let tile;
    if (active == true) 
      tile = new createjs.Bitmap(preload.getResult('OrangePerson'));
    else
      tile = new createjs.Bitmap(preload.getResult('GreenPerson'));

    tile.x = 32 * (x + 1) * 1.1;
    tile.y = 32 * (y + 1) * 1.1;

    stage.addChild(tile);

    this.tiles.push(tile);
    
  }
}