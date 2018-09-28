'use strict';

class Game {
    constructor() {
        this.Correct = 0;

        this.lives = 3;
        this.score = 0;
        this.grid;
        this.problemPoints = 999;
        this.level = levels["level1"];
        this.level_problems = 0;
        this.problem_active = false;

        this.createScoreText();
        this.initalizeGui();

        this.updateLives();
        this.updateProblemScore();

        this.nextProblem();
    }

    // from stage.tick
    tick() {

        // the problem is currently ticking
        if (this.problem_active) {
            //TODO: More interesting algorithmn
            this.problemPoints--;
            this.updateProblemScore();
        }

    }

    createScoreText() {
        this.scoreText = new createjs.Text("", "18px Arial", "black");
        this.scoreText.y = stage.canvas.height - 30+1000;
        this.scoreText.x = 15;
        stage.addChild(this.scoreText);
    }

    updateProblemScore() {
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

    updateScore() {
        // maybe can do some kind of flash animation here
        this.scoreText.text = "Score: " + this.score;
    }

    updateLives() {
        // maybe can do some kind of flash animation here
        for (let l = 3; l > this.lives; l--) {
            stage.removeChild(this.lifeDispays[l - 1]);
        }
    }

    // logic on question answered
    answerQuestion(answer) {
        // cannot answer question
        if (!this.problem_active)
            return;

        // unrender for performance ofc b0sh
        this.grid.destroy();
        this.grid = undefined;

        this.problem_active = false;
        
        // Correct Answer
        if (answer == this.correct_answer) {
            this.score += this.problemPoints;
            this.correctAnswerScreenScoreText.text = "+" + this.problemPoints;
            stage.addChild(this.correctAnswerScreenText);
            stage.addChild(this.correctAnswerScreenScoreText);
            
            this.updateScore();

        // Incorrect Answer
        } else {
            this.lives --;
            this.updateLives();
            stage.addChild(this.incorrectAnswerScreenText);    
            stage.addChild(this.incorrectAnswerScreenScoreText);
        }

        stage.removeChild(this.optionOneDisplay);
        stage.removeChild(this.optionTwoDisplay);
        stage.removeChild(this.optionThreeDisplay);

        // start the problem again
        let _this = this;
        setTimeout(function () {
            stage.removeChild(_this.correctAnswerScreenText);
            stage.removeChild(_this.correctAnswerScreenScoreText);
            stage.removeChild(_this.incorrectAnswerScreenText);
            stage.removeChild(_this.incorrectAnswerScreenScoreText);

            _this.nextProblem();
        }, 2000);
    }

    nextProblem() {

        // setTimeout delay when unloading game (not sure if req. by the end)
        if (game_state != 'game')
            return;

        // start ticking the problem points score down
        this.problem_active = true;

        // level up!
        this.level_problems++;
        if (this.level_problems > this.level.question_count) {
            this.level_problems = 0;
            this.level = levels[this.level.next_level];
            this.levelText.text = "Level " + this.level.id;

            pat.background.image = preload.getResult(this.level.background);
        }

        this.grid = this.level.generate();
        this.grid.render();

        console.log(this.grid);

        // ranodmly choose a thing to guess 
        let startGuess = getRandomInt(1, 3);
        switch (startGuess) {
            case 1: this.correct_answer = 3; break;
            case 2: this.correct_answer = 2; break;
            case 3: this.correct_answer = 1; break;
        }

        this.optionOneDisplay.text   = "(1) " + this.grid.equation.choices[startGuess-1];
        this.optionTwoDisplay.text   = "(2) " + this.grid.equation.choices[startGuess];
        this.optionThreeDisplay.text = "(3) " + this.grid.equation.choices[startGuess+1];
    
        stage.addChild(this.optionOneDisplay);
        stage.addChild(this.optionTwoDisplay);
        stage.addChild(this.optionThreeDisplay);
        // Game.StartScoreTimer(995);
    }

    // return to main menu
    end() {
        this.destroy();

    }

    // I don't know a better way to do this... 
    // not researching now though
    destroy() {
        if (this.grid) 
            this.grid.destroy();

        stage.removeChild(this.levelText);
        stage.removeChild(this.tagLineText);
        stage.removeChild(this.scoreText);
        stage.removeChild(this.livesText);
        for (let l = 0; l < 3; l++)
            stage.removeChild(this.lifeDispays[l]);
        stage.removeChild(this.problemScoreText);
        stage.removeChild(this.problemScoreDisplayOutline);
        stage.removeChild(this.problemScoreDisplay);
        stage.removeChild(this.optionOneDisplay);
        stage.removeChild(this.optionTwoDisplay);
        stage.removeChild(this.optionThreeDisplay);
        stage.removeChild(this.correctAnswerScreenText);
        stage.removeChild(this.correctAnswerScreenScoreText);
        stage.removeChild(this.incorrectAnswerScreenText);
        stage.removeChild(this.incorrectAnswerScreenScoreText);
        
    }

    initalizeGui() {
        let levelTextFont = 40;
        this.levelText = new createjs.Text("", levelTextFont + "px Roboto", "black");
        this.levelText.y = 20;
        this.levelText.x = 20;
        this.levelText.text = "Level 1";
        this.levelText.shadow = new createjs.Shadow("#666", 1, 1, 0);
        stage.addChild(this.levelText);

        this.tagLineText = new createjs.Text("", "italic 16px Roboto", "#333");
        this.tagLineText.y = 20 + levelTextFont + 4;
        this.tagLineText.x = 40;
        this.tagLineText.text = "What's the pattern, Professor Pat?";
        stage.addChild(this.tagLineText);

        this.scoreText = new createjs.Text("", "24px Roboto", "black");
        this.scoreText.y = 375;
        this.scoreText.x = 550;
        this.scoreText.text = "Score: 0";
        this.scoreText.textAlign = 'center';
        this.scoreText.textBaseline = 'middle';    
        stage.addChild(this.scoreText);

        this.livesText = new createjs.Text("Lives:", "24px Roboto", "black");
        this.livesText.y = 400;
        this.livesText.x = 550;
        this.livesText.textAlign = 'center';
        this.livesText.textBaseline = 'middle';    
        stage.addChild(this.livesText);

        // lifes sare complicated
        this.lifeDispays = [];
        for (let l = 0; l < 3; l++) {
            let life = new createjs.Bitmap(preload.getResult('Life'));
            life.y = 410;
            life.x = 498 + 40 * l;
            life.scaleX = 0.0410;
            life.scaleY = 0.041;
            this.lifeDispays.push(life);
            stage.addChild(this.lifeDispays[l]);
            
        }

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

        this.optionOneDisplay = new createjs.Text("", "32px Roboto", "black");
        this.optionOneDisplay.y = 200;
        this.optionOneDisplay.x = 550;
        this.optionOneDisplay.textAlign = 'center';
        this.optionOneDisplay.textBaseline = 'middle';      
        // this.optionOneDisplay.shadow = new createjs.Shadow("#333", 1, 1, 0);
        // stage.addChild(this.optionOneDisplay);

        this.optionTwoDisplay = new createjs.Text("", "32px Roboto", "black");
        this.optionTwoDisplay.y = 250;
        this.optionTwoDisplay.x = 550;
        this.optionTwoDisplay.textAlign = 'center';
        this.optionTwoDisplay.textBaseline = 'middle';      
        // stage.addChild(this.optionTwoDisplay);

        this.optionThreeDisplay = new createjs.Text("", "32px Roboto", "black");
        this.optionThreeDisplay.y = 300;
        this.optionThreeDisplay.x = 550;
        this.optionThreeDisplay.textAlign = 'center';
        this.optionThreeDisplay.textBaseline = 'middle';      
        // stage.addChild(this.optionThreeDisplay);

        this.correctAnswerScreenText = new createjs.Text("~~Correct~~", "48px Roboto", "black");
        this.correctAnswerScreenText.y = 250;
        this.correctAnswerScreenText.x = 220;
        this.correctAnswerScreenText.textAlign = 'center';
        this.correctAnswerScreenText.textBaseline = 'middle';      
        // stage.addChild(this.correctAnswerScreenText);

        this.correctAnswerScreenScoreText = new createjs.Text("", "32px Roboto", "green");
        this.correctAnswerScreenScoreText.y = 300;
        this.correctAnswerScreenScoreText.x = 220;
        this.correctAnswerScreenScoreText.textAlign = 'center';
        this.correctAnswerScreenScoreText.textBaseline = 'middle';      
        // stage.addChild(this.correctAnswerScreenScoreText);

        this.incorrectAnswerScreenText = new createjs.Text("Incorrect :(", "48px Roboto", "black");
        this.incorrectAnswerScreenText.y = 250;
        this.incorrectAnswerScreenText.x = 220;
        this.incorrectAnswerScreenText.textAlign = 'center';
        this.incorrectAnswerScreenText.textBaseline = 'middle';      
        // stage.addChild(this.incorrectAnswerScreenText);

        this.incorrectAnswerScreenScoreText = new createjs.Text("-1 Life", "32px Roboto", "red");
        this.incorrectAnswerScreenScoreText.y = 300;
        this.incorrectAnswerScreenScoreText.x = 220;
        this.incorrectAnswerScreenScoreText.textAlign = 'center';
        this.incorrectAnswerScreenScoreText.textBaseline = 'middle';      
        // stage.addChild(this.incorrectAnswerScreenScoreText);
    }
}
