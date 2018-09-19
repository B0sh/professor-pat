'use strict';

function Equation(id, generate, is) {
  this.id = id;
  this.generate = generate;
  this.is = is;
}

var equations = {
  "single": 
    new Equation('mod', function(params) {
      this.number = getRandomInt(params[0],params[1]);
      this.offset = getRandomInt(0,this.number-1);

      this.choices = [ "Every " + (parseInt(this.number) - 2),
        "Every " + (parseInt(this.number) - 1),
        "Every " + this.number,
        "Every " + (parseInt(this.number) + 1),
        "Every " + (parseInt(this.number) + 2) ]

        return this;
    }, function (num) {
      return (num + this.offset) % this.number == 0;
    }),

  "double":
    new Equation('modmod', function() {
      this.number = [getRandomInt(2,5)];
      this.number[1] = getRandomIntNot(2,5,this.number);
      this.number = this.number.sort(function (a, b) {  return a - b;  });

      this.offset = getRandomInt(0,10);

      var recordChoices = [this.number];
      function genChoice() {
        do {
          var number = [getRandomInt(2,5)];
          number[1] = getRandomIntNot(2,5,number);
          number = number.sort(function (a, b) {  return a - b;  });
        } while (recordChoices.indexOf(number) !== -1)
        recordChoices.push(number);
        return number[0] + ", " + number[1];
      }


      this.choices = [ "Every " + genChoice(),
        "Every " + genChoice(),
        "Every " + this.number[0] + ", " + this.number[1],
        "Every " + genChoice(),
        "Every " + genChoice() ]

      this.inPattern = [];
      q = 0, n = 0;
      for (y = 1; y <= 2500; y++) {
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

    }, function (num) {
      return this.inPattern.indexOf(num + this.offset) != -1;
    }),

  "power":
    new Equation('pow', function() {
      this.number = getRandomInt(2,3);
      this.offset = getRandomInt(0,this.number-1);

      this.question = "" + this.number + "^x";

      this.inPattern = [];
      for (y = 0; y <= 10; y++) {
        this.inPattern.push(Math.pow(y, this.number));
      }

      return this;
    }, function (num) {
      return this.inPattern.indexOf(num) != -1;
    }),

  "root":
    new Equation('root', function() {
      this.number = getRandomInt(2,3);
      this.offset = getRandomInt(0,this.number-1);

      this.question = "x^" + this.number;

      return this;
    }, function (num) {
      t = Math.pow(num, 1 / this.number);
      console.log(num + " " + t)
      return Math.floor(t) == t;
    }),

};
