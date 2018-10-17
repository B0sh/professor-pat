"use strict";

class Game {
  constructor() {
    this.lives = 3;
    this.score = 0;
    this.problems_correct = 0;
    this.grid;
    this.problemPoints = 999;
    this.level = levels["level1"];
    this.level_problems = 0;
    this.ticks = 0;

    this.problemPointsColorRange = [
      { color: "#88FF88", num: 800 },
      { color: "#FFFF88", num: 500 },
      { color: "#FF8888", num: 0 }
    ];

    this.problem_active = false;

    this.initalizeGui();

    this.updateLives();
    this.updateProblemScore();

    this.nextProblem();
  }

  // from stage.tick
  tick() {
    this.ticks++;
    // the problem is currently ticking
    if (this.problem_active) {
      //TODO: More interesting algorithmn
      this.problemPoints--;
      if (this.problemPoints == 0) {
        this.problem_active = false;
        this.gameOver();
      }
      this.updateProblemScore();
    }

    if (this.problem_active && this.grid && this.grid.props.colors) {
      if (this.ticks % 12 == 0) {
        // console.log(this.grid.tile_width, this.grid.tile_height);
        //! directions don't work properly
        switch (this.grid.props.colors) {
          case "down":
            this.grid.equation.offset -= this.grid.tile_width;
            break;
          case "left":
            this.grid.equation.offset++;
            break;
          case "up":
            this.grid.equation.offset += this.grid.tile_width;
            break;
          case "right":
            // this.grid.equation.offset -= this.grid.tile_width - 1;
            this.grid.equation.offset--;
            break;
        }
        this.grid.destroy();
        this.grid.render();
      }
    }
  }

  updateProblemScore() {
    this.problemScoreDisplay.text = "+" + this.problemPoints;
    this.problemScoreDisplayOutline.text = "+" + this.problemPoints;

    for (let i = 0; i < this.problemPointsColorRange.length; i++) {
      if (this.problemPoints > this.problemPointsColorRange[i].num) {
        this.problemScoreDisplay.color = this.problemPointsColorRange[i].color;
        break;
      }
    }
  }

  updateScore() {
    // maybe can do some kind of flash animation here
    this.scoreText.text = "Score: " + Format(this.score);
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
    if (!this.problem_active) return;

    // unrender for performance ofc b0sh
    this.grid.destroy();
    this.grid = undefined;

    this.problem_active = false;

    // Correct Answer
    if (answer == this.correct_answer) {
      this.score += this.problemPoints;
      this.correctAnswerScreenScoreText.text = "+" + this.problemPoints;
      this.problems_correct++;

      for (let i = 0; i < this.problemPointsColorRange.length; i++) {
        if (this.problemPoints > this.problemPointsColorRange[i].num) {
          this.correctAnswerScreenScoreText.color = this.problemPointsColorRange[
            i
          ].color;
          break;
        }
      }

      stage.addChild(this.correctAnswerScreenText);
      stage.addChild(this.correctAnswerScreenScoreText);

      this.updateScore();

      // Incorrect Answer
    } else {
      this.lives--;

      if (this.lives == 0) {
        this.gameOver();
        return;
      }

      this.updateLives();
      stage.addChild(this.incorrectAnswerScreenText);
      stage.addChild(this.incorrectAnswerScreenScoreText);
    }

    stage.removeChild(this.optionOneDisplay);
    stage.removeChild(this.optionTwoDisplay);
    stage.removeChild(this.optionThreeDisplay);

    // start the problem again
    let _this = this;
    setTimeout(function() {
      stage.removeChild(_this.correctAnswerScreenText);
      stage.removeChild(_this.correctAnswerScreenScoreText);
      stage.removeChild(_this.incorrectAnswerScreenText);
      stage.removeChild(_this.incorrectAnswerScreenScoreText);

      _this.nextProblem();
    }, 2000);
  }

  // advance to next level and perform various level animations
  nextLevel() {
    this.problemPoints = 999;

    this.level_problems = 0;
    this.level = levels[this.level.next_level];
    if (this.level.victory) {
      this.winOver();
      return;
    }

    this.levelText.text = "Level " + this.level.id;

    this.levelUpScreenText = new createjs.Text(
      "Level Up!",
      "48px Roboto",
      "black"
    );
    this.levelUpScreenText.y = 250;
    this.levelUpScreenText.x = -100;
    this.levelUpScreenText.textAlign = "center";
    this.levelUpScreenText.textBaseline = "middle";
    stage.addChild(this.levelUpScreenText);

    pat.background_fade.image = preload.getResult(this.level.background);

    createjs.Tween.get(pat.background_fade)
      .to({ alpha: 1 }, 4900)
      .call(
        function(object) {
          pat.background.image = preload.getResult(this.level.background);
          pat.background_fade.alpha = 0;

          this.nextProblem();
          stage.removeChild(this.levelUpScreenText);
        },
        [],
        this
      );

    createjs.Tween.get(this.levelUpScreenText)
      .to({ x: 900 }, 4900)
      .call(function(object) {}, [], this);
  }

  nextProblem() {
    // setTimeout delay when unloading game (not sure if req. by the end)
    if (game_state != "game") return;

    // level up!
    this.level_problems++;
    if (this.level_problems > this.level.question_count) {
      this.nextLevel();
      return; // stop the sequence for level up screen
    }

    // start ticking the problem points score down
    this.problem_active = true;

    this.grid = this.level.generate();
    this.grid.render();

    console.log(this.grid);

    // ranodmly choose a thing to guess
    let startGuess = getRandomInt(1, 3);
    switch (startGuess) {
      case 1:
        this.correct_answer = 3;
        break;
      case 2:
        this.correct_answer = 2;
        break;
      case 3:
        this.correct_answer = 1;
        break;
    }

    this.optionOneDisplay.text =
      "(1) " + this.grid.equation.choices[startGuess - 1];
    this.optionTwoDisplay.text =
      "(2) " + this.grid.equation.choices[startGuess];
    this.optionThreeDisplay.text =
      "(3) " + this.grid.equation.choices[startGuess + 1];

    stage.addChild(this.optionOneDisplay);
    stage.addChild(this.optionTwoDisplay);
    stage.addChild(this.optionThreeDisplay);
  }

  // return to main menu
  end() {
    this.destroy();
  }

  // I don't know a better way to do this...
  // not researching now though
  destroy() {
    if (this.grid) this.grid.destroy();

    // unset animations properties (and their callbacks)
    if (this.levelUpScreenText)
      createjs.Tween.removeTweens(this.levelUpScreenText);
    if (this.scoreText) createjs.Tween.removeTweens(this.scoreText);
    createjs.Tween.removeTweens(pat.background_fade);

    stage.removeChild(this.levelText);
    stage.removeChild(this.tagLineText);
    stage.removeChild(this.scoreText);
    stage.removeChild(this.livesText);
    for (let l = 0; l < 3; l++) stage.removeChild(this.lifeDispays[l]);
    stage.removeChild(this.problemScoreText);
    stage.removeChild(this.problemScoreDisplayOutline);
    stage.removeChild(this.problemScoreDisplay);
    stage.removeChild(this.optionOneDisplay);
    stage.removeChild(this.optionTwoDisplay);
    stage.removeChild(this.optionThreeDisplay);
    stage.removeChild(this.levelUpScreenText);
    stage.removeChild(this.correctAnswerScreenText);
    stage.removeChild(this.correctAnswerScreenScoreText);
    stage.removeChild(this.incorrectAnswerScreenText);
    stage.removeChild(this.incorrectAnswerScreenScoreText);
    stage.removeChild(this.gameOverTextImage);
    stage.removeChild(this.gameOverReasonText);
    stage.removeChild(this.winOverText);
  }

  hasEnded() {
    if (this.lives == 0) return true;
    if (this.level.victory) return true;
    if (this.problemPoints == 0) return true;
    return false;
  }

  gameOver() {
    this.destroy();

    // game over logic
    if (this.score > pat.save_file.high_score) {
      pat.save_file.high_score = this.score;
      pat.save();
    }

    // game over animations
    stage.addChild(this.levelText);
    stage.addChild(this.tagLineText);
    stage.addChild(this.scoreText);

    // move the score to the center... cool?
    createjs.Tween.get(this.scoreText).to(
      {
        x: WIDTH / 2,
        y: 280,
        scaleX: 1.5,
        scaleY: 1.5
      },
      1500
    );

    pat.background_fade.image = preload.getResult("GameOverBackground");

    createjs.Tween.get(pat.background_fade)
      .to({ alpha: 1 }, 1500)
      .call(
        function() {
          pat.background.image = preload.getResult("GameOverBackground");
          pat.background_fade.alpha = 0;
        },
        [],
        this
      );

    this.gameOverTextImage = new createjs.Bitmap(preload.getResult("GameOverTextImage"));
    this.gameOverTextImage.x = 0;
    this.gameOverTextImage.y = 0;
    stage.addChild(this.gameOverTextImage);

    this.gameOverReasonText = new createjs.Text(
      "You died IRL",
      "italic 20px Roboto",
      "#222"
    );

    if (this.lives == 0) this.gameOverReasonText.text = "You ran out of lives";
    if (this.problemPoints == 0)
      this.gameOverReasonText.text =
        "You ran out of time.";

    this.gameOverReasonText.y = 330;
    this.gameOverReasonText.x = WIDTH / 2;
    this.gameOverReasonText.textAlign = "center";
    this.gameOverReasonText.textBaseline = "middle";
    stage.addChild(this.gameOverReasonText);
  }

  winOver() {
    this.destroy();

    // win over logic
    if (this.score > pat.save_file.high_score) {
      pat.save_file.high_score = this.score;
      pat.save();
    }

    // win over animations
    stage.addChild(this.levelText);
    stage.addChild(this.tagLineText);
    stage.addChild(this.scoreText);

    // move the score to the center... cool?
    createjs.Tween.get(this.scoreText).to(
      {
        x: WIDTH / 2,
        y: 280,
        scaleX: 1.5,
        scaleY: 1.5
      },
      1500
    );

    pat.background_fade.image = preload.getResult("WinOverBackground");

    createjs.Tween.get(pat.background_fade)
      .to({ alpha: 1 }, 1500)
      .call(
        function() {
          pat.background.image = preload.getResult("WinOverBackground");
          pat.background_fade.alpha = 0;
        },
        [],
        this
      );

    // TODO: Maybe add an image here
    this.winOverText = new createjs.Text("", "48px Roboto", "black");
    this.winOverText.y = 220;
    this.winOverText.x = WIDTH / 2;
    this.winOverText.text = "Victory, Professor Pat!";
    this.winOverText.textAlign = "center";
    this.winOverText.textBaseline = "middle";
    stage.addChild(this.winOverText);
  }

  initalizeGui() {
    let levelTextFont = 40;
    this.levelText = new createjs.Text(
      "Level 1",
      levelTextFont + "px Roboto",
      "black"
    );
    this.levelText.y = 20;
    this.levelText.x = 20;
    this.levelText.shadow = new createjs.Shadow("#666", 1, 1, 0);
    stage.addChild(this.levelText);

    this.tagLineText = new createjs.Text("", "italic 16px Roboto", "#333");
    this.tagLineText.y = 20 + levelTextFont + 4;
    this.tagLineText.x = 40;
    this.tagLineText.text = "What's the pattern, Professor Pat?";
    stage.addChild(this.tagLineText);

    this.scoreText = new createjs.Text("Score: 0", "24px Roboto", "black");
    this.scoreText.y = 375;
    this.scoreText.x = 550;
    this.scoreText.textAlign = "center";
    this.scoreText.textBaseline = "middle";
    stage.addChild(this.scoreText);

    this.livesText = new createjs.Text("Lives:", "24px Roboto", "black");
    this.livesText.y = 400;
    this.livesText.x = 550;
    this.livesText.textAlign = "center";
    this.livesText.textBaseline = "middle";
    stage.addChild(this.livesText);

    // lifes sare complicated
    this.lifeDispays = [];
    for (let l = 0; l < 3; l++) {
      let life = new createjs.Bitmap(preload.getResult("Life"));
      life.y = 410;
      life.x = 498 + 40 * l;
      this.lifeDispays.push(life);
      stage.addChild(this.lifeDispays[l]);
    }

    this.problemScoreText = new createjs.Text("", "24px Roboto", "#333");
    this.problemScoreText.y = 65;
    this.problemScoreText.x = 550;
    this.problemScoreText.text = "Points:";
    this.problemScoreText.textAlign = "center";
    this.problemScoreText.textBaseline = "middle";
    stage.addChild(this.problemScoreText);

    this.problemScoreDisplayOutline = new createjs.Text(
      "",
      "48px Roboto",
      "black"
    );
    this.problemScoreDisplayOutline.y = 100;
    this.problemScoreDisplayOutline.x = 550;
    this.problemScoreDisplayOutline.textAlign = "center";
    this.problemScoreDisplayOutline.textBaseline = "middle";
    this.problemScoreDisplayOutline.outline = 2;
    stage.addChild(this.problemScoreDisplayOutline);

    this.problemScoreDisplay = new createjs.Text("", "48px Roboto", "green");
    this.problemScoreDisplay.y = 100;
    this.problemScoreDisplay.x = 550;
    this.problemScoreDisplay.textAlign = "center";
    this.problemScoreDisplay.textBaseline = "middle";
    stage.addChild(this.problemScoreDisplay);

    this.optionOneDisplay = new createjs.Text("", "40px Roboto", "black");
    this.optionOneDisplay.y = 200 - 20;
    this.optionOneDisplay.x = 550;
    this.optionOneDisplay.textAlign = "center";
    this.optionOneDisplay.textBaseline = "middle";
    // this.optionOneDisplay.shadow = new createjs.Shadow("#333", 1, 1, 0);
    // stage.addChild(this.optionOneDisplay);

    this.optionTwoDisplay = new createjs.Text("", "40px Roboto", "black");
    this.optionTwoDisplay.y = 250 - 5;
    this.optionTwoDisplay.x = 550;
    this.optionTwoDisplay.textAlign = "center";
    this.optionTwoDisplay.textBaseline = "middle";
    // stage.addChild(this.optionTwoDisplay);

    this.optionThreeDisplay = new createjs.Text("", "40px Roboto", "black");
    this.optionThreeDisplay.y = 300 + 10;
    this.optionThreeDisplay.x = 550;
    this.optionThreeDisplay.textAlign = "center";
    this.optionThreeDisplay.textBaseline = "middle";
    // stage.addChild(this.optionThreeDisplay);

    this.correctAnswerScreenText = new createjs.Text(
      "~~Correct~~",
      "48px Roboto",
      "black"
    );
    this.correctAnswerScreenText.y = 250;
    this.correctAnswerScreenText.x = 220;
    this.correctAnswerScreenText.textAlign = "center";
    this.correctAnswerScreenText.textBaseline = "middle";
    // stage.addChild(this.correctAnswerScreenText);

    this.correctAnswerScreenScoreText = new createjs.Text(
      "",
      "32px Roboto",
      "green"
    );
    this.correctAnswerScreenScoreText.y = 300;
    this.correctAnswerScreenScoreText.x = 220;
    this.correctAnswerScreenScoreText.textAlign = "center";
    this.correctAnswerScreenScoreText.textBaseline = "middle";
    this.correctAnswerScreenScoreText.shadow = new createjs.Shadow(
      "#333",
      1,
      1,
      0
    );
    // stage.addChild(this.correctAnswerScreenScoreText);

    this.incorrectAnswerScreenText = new createjs.Text(
      "Incorrect :(",
      "48px Roboto",
      "black"
    );
    this.incorrectAnswerScreenText.y = 250;
    this.incorrectAnswerScreenText.x = 220;
    this.incorrectAnswerScreenText.textAlign = "center";
    this.incorrectAnswerScreenText.textBaseline = "middle";
    // stage.addChild(this.incorrectAnswerScreenText);

    this.incorrectAnswerScreenScoreText = new createjs.Text(
      "-1 Life",
      "32px Roboto",
      "red"
    );
    this.incorrectAnswerScreenScoreText.y = 300;
    this.incorrectAnswerScreenScoreText.x = 220;
    this.incorrectAnswerScreenScoreText.textAlign = "center";
    this.incorrectAnswerScreenScoreText.textBaseline = "middle";
    this.incorrectAnswerScreenScoreText.shadow = new createjs.Shadow(
      "#333",
      1,
      1,
      0
    );
    // stage.addChild(this.incorrectAnswerScreenScoreText);
  }
}
