'use strict';

class Game {
    constructor() {
        this.Equation = '';
        this.Correct = 0;
        this.Score = 0;
        this.ToAdd = .1;
        this.Lives = 3;

        this.problemPoints = 999;
        this.level = levels[1];

        this.createScoreText();
        this.initalizeGui();

        // this.updateLives();
        this.updateScore();

        this.nextProblem();
    }

    createScoreText() {
        this.scoreText = new createjs.Text("", "18px Arial", "black");
        this.scoreText.y = stage.canvas.height - 30+1000;
        this.scoreText.x = 15;
        stage.addChild(this.scoreText);
    }

    updateScore() {
        this.problemScoreDisplay.text = "+" + this.problemPoints;
        this.problemScoreDisplayOutline.text = "+" + this.problemPoints;

        var colorRange = [
            { color: '#88FF88', num: 800 },
            { color: '#FFFF88', num: 500 },
            { color: '#FF8888', num: 0 }
        ];
    
        for (let i = 0; i < colorRange.length; i++) {
            if (this.problemPoints > colorRange[i].num) {
                this.problemScoreDisplay.color = colorRange[i].color;
                break;
            }
        }
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

    initalizeGui() {
        let levelTextFont = 40;
        this.levelText = new createjs.Text("", levelTextFont + "px Roboto", "black");
        this.levelText.y = 20;
        this.levelText.x = 20;
        this.levelText.text = "Level 1";
        stage.addChild(this.levelText);

        this.tagLineText = new createjs.Text("", "italic 16px Roboto", "#333");
        this.tagLineText.y = 20 + levelTextFont + 4;
        this.tagLineText.x = 40;
        this.tagLineText.text = "What's the pattern, Professor Pat?";
        stage.addChild(this.tagLineText);

        this.problemScoreText = new createjs.Text("", "24px Roboto", "#333");
        this.problemScoreText.y = 65;
        this.problemScoreText.x = 550;
        this.problemScoreText.text = "Points:";
        this.problemScoreText.textAlign = 'center';
        this.problemScoreText.textBaseline = 'middle';    
        stage.addChild(this.problemScoreText);

        this.problemScoreDisplayOutline = new createjs.Text("", "48px Roboto", "black");
        this.problemScoreDisplayOutline.y = 100;
        this.problemScoreDisplayOutline.x = 550;
        this.problemScoreDisplayOutline.textAlign = 'center';
        this.problemScoreDisplayOutline.textBaseline = 'middle';      
        this.problemScoreDisplayOutline.outline = 2;
        stage.addChild(this.problemScoreDisplayOutline);

        this.problemScoreDisplay = new createjs.Text("", "48px Roboto", "green");
        this.problemScoreDisplay.y = 100;
        this.problemScoreDisplay.x = 550;
        this.problemScoreDisplay.textAlign = 'center';
        this.problemScoreDisplay.textBaseline = 'middle';      
        stage.addChild(this.problemScoreDisplay);

    }


}