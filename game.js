
class Game {
    constructor() {
        this.Equation = '';
        this.Correct = 0;
        this.Score = 0;
        this.ToAdd = .1;
        this.Lives = 3;

        this.createScoreText();

        // this.updateLives();
        this.updateScore();
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

}