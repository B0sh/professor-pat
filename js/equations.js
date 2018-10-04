"use strict";

function Equation(id, generate, is) {
  this.id = id;
  this.generate = generate;
  this.is = is;
}

var equations = {
  single: new Equation(
    "mod",
    function(params) {
      this.number = getRandomInt(params[0], params[1]);
      this.offset = getRandomInt(0, this.number - 1);

      this.choices = [
        "Every " + (parseInt(this.number) - 2),
        "Every " + (parseInt(this.number) - 1),
        "Every " + this.number,
        "Every " + (parseInt(this.number) + 1),
        "Every " + (parseInt(this.number) + 2)
      ];

      return this;
    },
    function(num) {
      return (num + this.offset) % this.number == 0;
    }
  ),

  double: new Equation(
    "modmod",
    function(params) {
      this.offset = getRandomInt(0, 10);

      let numbers = [];
      for (let i = params[0]; i <= params[1]; i++) {
        numbers.push(i);
      }

      // generate a ordered pair of numbers within the bounds
      function randomDouble() {
        let random = shuffle(numbers);
        let pair = [random[0], random[1]].sort(function(a, b) {
          return a - b;
        });
        return pair;
      }

      this.number = randomDouble();

      // generate 5 total choices that aren't present already
      let choices = [this.number];
      while (choices.length != 5) {
        let next_pair = randomDouble();
        if (!isItemIn2DArray(choices, next_pair)) {
          choices.push(next_pair);
        }
      }

      this.choices = [
        "Every " + choices[1][0] + ", " + choices[1][1],
        "Every " + choices[2][0] + ", " + choices[2][1],
        "Every " + this.number[0] + ", " + this.number[1],
        "Every " + choices[3][0] + ", " + choices[3][1],
        "Every " + choices[4][0] + ", " + choices[4][1]
      ];

      this.inPattern = [];

      // is there a better way to do this......
      let q = 0,
        n = 0;
      for (let y = -200; y <= 2500; y++) {
        q++;
        if (q == this.number[n]) {
          this.inPattern.push(y);
          n++;
          q = 0;
          if (n == this.number.length) {
            n = 0;
          }
        }
      }

      return this;
    },
    function(num) {
      return this.inPattern.indexOf(num + this.offset) != -1;
    }
  ),

  power: new Equation(
    "pow",
    function() {
      this.number = getRandomInt(2, 3);
      this.offset = getRandomInt(0, this.number - 1);

      this.question = "" + this.number + "^x";

      this.inPattern = [];
      for (let y = 0; y <= 10; y++) {
        this.inPattern.push(Math.pow(y, this.number));
      }

      return this;
    },
    function(num) {
      return this.inPattern.indexOf(num) != -1;
    }
  ),

  root: new Equation(
    "root",
    function() {
      this.number = getRandomInt(2, 3);
      this.offset = getRandomInt(0, this.number - 1);

      this.question = "x^" + this.number;

      return this;
    },
    function(num) {
      t = Math.pow(num, 1 / this.number);
      console.log(num + " " + t);
      return Math.floor(t) == t;
    }
  )
};
