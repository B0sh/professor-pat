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
 *   "missing": percentage of people that become missing
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
    question_count: 4,
    next_level: "level2",
    background: "Background12",
    generate: function() {
      return new Grid(
        11,
        11,
        {},
        // { missing: 30 },
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
    question_count: 6,
    next_level: "level4",
    background: "Background9",
    generate: function() {
      let directions = ["up", "down", "left", "right"];

      return new Grid(
        7,
        7,
        { colors: directions[getRandomInt(0, directions.length - 1)] },
        equations["single"].generate([3, 6])
      );
    }
  },
  level4: {
    id: 4,
    question_count: 8,
    next_level: "level5",
    background: "Background12",
    generate: function() {
      let directions = ["up", "down", "left", "right"];

      return new Grid(
        getRandomInt(6, 10),
        getRandomInt(6, 10),
        { colors: directions[getRandomInt(0, directions.length - 1)] },
        equations["single"].generate([3, 9])
      );
    }
  },
  level5: {
    id: 5,
    question_count: 4,
    next_level: "level6",
    background: "Background8",
    generate: function() {
      return new Grid(12, 11, {}, equations["double"].generate([2, 5]));
    }
  },

  level6: {
    id: 6,
    question_count: 6,
    next_level: "level7",
    background: "Background8",
    generate: function() {
      return new Grid(
        getRandomInt(6, 10),
        getRandomInt(6, 10),
        {},
        equations["double"].generate([2, 7])
      );
    }
  },

  level7: {
    id: 7,
    question_count: 6,
    next_level: "level8",
    background: "Background8",
    generate: function() {
      return new Grid(
        getRandomInt(6, 10),
        getRandomInt(6, 10),
        { rotation: 25 },
        equations["single"].generate([3, 9])
      );
    }
  },

  level8: {
    id: 8,
    question_count: 6,
    next_level: "level9",
    background: "Background8",
    generate: function() {
      return new Grid(
        getRandomInt(6, 10),
        getRandomInt(6, 10),
        {},
        equations["double"].generate([2, 7])
      );
    }
  },
  level9: {
    id: 9,
    question_count: 8,
    next_level: "Done",
    background: "Background7",
    generate: function() {
      let directions = ["up", "down", "left", "right"];

      return new Grid(
        getRandomInt(10, 12),
        getRandomInt(8, 10),
        {
          colors: directions[getRandomInt(0, directions.length - 1)],
          rotation: 25
        },
        equations["double"].generate([3, 9])
      );
    }
  },
  Done: {
    id: "Done",
    victory: true
  }
};
