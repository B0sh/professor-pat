"use strict";

/** * * * * * HOW TO MAKE LEVELS * * * * * * * *
 * first 2 arguments of Grid() are grid size (11x12 max)
 *
 * Then there's the animation properties
 * leave them out if does not apply. you can use multiple at once
 * {
 *   "rotation": randomly rotates things to +-input
 *   "colors": animates the accent color throughout the
 *        grid in a direction (up down left right)
 * }
 *
 * Last propety is the equation generator
 *   "single" is Every x
 *   "double" is Every x, x
 * The .generate() input is the max and min of the equation's Every x
 * * * * * * * * * * * * * * * * * * * * * * * * */

var levels = {
  level1: {
    id: 1,
    question_count: 5,
    next_level: "level2",
    background: "Background12",
    generate: function() {
      return new Grid(
        11,
        11,
        {},
        // { rotation: 30 },
        // { colors: "right", rotation: 30 },
        equations["single"].generate([3, 6])
      );
    }
  },
  level2: {
    id: 2,
    question_count: 6,
    next_level: "level3",
    background: "Background1",
    generate: function() {
      return new Grid(
        getRandomInt(10, 11),
        getRandomInt(9, 10),
        {},
        equations["single"].generate([3, 9])
      );
    }
  },
  level3: {
    id: 3,
    question_count: 8,
    next_level: "level4",
    background: "Background9",
    generate: function() {
      let directions = [ "up", "down", "left", "right" ];

      return new Grid(
        getRandomInt(6, 9),
        getRandomInt(6, 9),
        { colors: directions[getRandomInt(0, directions.length - 1)] },
        equations["single"].generate([3, 9])
      );
    }
  },
  level4: {
    id: 4,
    question_count: 8,
    next_level: "level5",
    background: "Background8",
    generate: function() {
      let directions = [ "up", "down", "left", "right" ];

      return new Grid(
        getRandomInt(10, 11),
        getRandomInt(9, 10),
        { colors: directions[getRandomInt(0, directions.length - 1)],
        rotation: 25 },
        equations["single"].generate([3, 9])
      );
    }
  },
  level5: {
    id: 5,
    question_count: 10,
    next_level: "Done",
    background: "Background7",
    generate: function() {
      return new Grid(12, 11, {}, equations["double"].generate([3, 9]));
    }
  },
  Done: {
    id: "Done",
    victory: true
  }
};
