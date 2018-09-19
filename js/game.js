'use strict';

class Game {
    constructor() {
        this.Equation = '';
        this.Correct = 0;
        this.Score = 0;
        this.ToAdd = .1;
        this.Lives = 3;
        
        this.level = levels[1];

        this.createScoreText();

        // this.updateLives();
        this.updateScore();

        this.nextProblem();
    }

    createScoreText() {
        this.scoreText = new createjs.Text("", "18px Arial", "black");
        this.scoreText.y = stage.canvas.height - 30;
        this.scoreText.x = 15;
        stage.addChild(this.scoreText);
    }

    updateScore() {
        this.scoreText.text = "Score: " + this.Score;
    }

    nextProblem() {
        var grid = this.level.generate();
        grid.render();
        console.log(grid);

        var startGuess = getRandomInt(1, 3);
        switch (startGuess) {
            case 1: Game.Answer = 3; break;
            case 2: Game.Answer = 2; break;
            case 3: Game.Answer = 1; break;
        }
    
        // $("#guess_1").html("(1) "+Game.Equation.choices[startGuess-1]);
        // $("#guess_2").html("(2) " + Game.Equation.choices[startGuess]);
        // $("#guess_3").html("(3) " + Game.Equation.choices[startGuess+1]);
    
        // $('.total_levels').html(Game.GetLevel());
    
        // Grid.Populate();
    
        // Game.StartScoreTimer(995);
    }

    guess() {

    }


}