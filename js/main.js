'use strict';

/*

Animation idea:
    Make the animation of grey people and then colorize when the timer starts

*/

var BACKGROUND_COUNT = 12;
var WIDTH = 720;
var HEIGHT = 480;
var temp = 1;

var stage;
var preload;
var pat;
var game;
var game_state = 'menu';

$(document).ready(function() {
    pat = new ProfessorPat();
});

// set up the game / load main menu
class ProfessorPat {
    constructor () {
        game_state = 'menu';

        stage = new createjs.Stage("canvas_game");

        //TODO: Upgrade to 60
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);

        this.initLoading();

        preload = new createjs.LoadQueue(true);
        // the this on the end binds the scope in the handle function later so I can use classes
        preload.on("fileload", this.handleFileLoaded, this);
        preload.on("progress", this.handleFileProgress, this);
        preload.on("error", this.handleError, this);
        preload.on("complete", this.handleComplete, this);

        let manifest = [
            { id: "MenuBackground", src:   "images/background2.png" },
            { id: "GameBackground", src:   "images/background0.png" },
            { id: "GameOverBackground", src:   "images/background10.png" },
            { id: "WinOverBackground", src:   "images/background4.png" },
            { id: "Menu", src:   "images/shit menu.png" },
            { id: "RedPerson", src:   "images/person-red.png" },
            { id: "YellowPerson", src:   "images/person-yellow.png" },
            { id: "OrangePerson", src:   "images/person-orange.png" },
            { id: "PurplePerson", src:   "images/person-purple.png" },
            { id: "GreenPerson", src:   "images/person-green.png" },
            { id: "Life", src:   "images/heart.png" },
        ];

        for (let i  = 0; i < BACKGROUND_COUNT; i++) {
            manifest.push({
                id: "Background" + i, 
                src: "images/background" + i + ".png"
            });
        }

        preload.loadManifest(manifest);
    }

    // start loading
    initLoading() {
        this.loadingScreenBackground = new createjs.Shape();
        this.loadingScreenBackground.graphics.beginFill('rgb(44, 6, 67)');
        this.loadingScreenBackground.graphics.drawRect(0, 0, WIDTH-16, HEIGHT-16);
        this.loadingScreenBackground.graphics.endFill();
        this.loadingScreenBackground.x = 8;
        this.loadingScreenBackground.y = 8;
        this.loadingScreenBackground.shadow = new createjs.Shadow("#333", 0, 0, 9);
        stage.addChild(this.loadingScreenBackground);

        this.loadingScreenText = new createjs.Text("Loading... Game... Soon...", "italic 40px Roboto", "#aa0");
        this.loadingScreenText.x = WIDTH/2;
        this.loadingScreenText.y = HEIGHT/2 - 30;
        this.loadingScreenText.textAlign = 'center';
        this.loadingScreenText.textBaseline = 'middle';   
        stage.addChild(this.loadingScreenText);
        
        this.loadingScreenProgressBarBorder = new createjs.Shape();
        this.loadingScreenProgressBarBorder.graphics.beginFill('#888');
        this.loadingScreenProgressBarBorder.graphics.drawRoundRect(0, 0, 404, 34, 6);
        this.loadingScreenProgressBarBorder.x = WIDTH/2 - 202;
        this.loadingScreenProgressBarBorder.y = HEIGHT/2 + 48 - 30;
        this.loadingScreenProgressBarBorder.graphics.endFill();
        stage.addChild(this.loadingScreenProgressBarBorder);

        this.loadingScreenProgressBar = new createjs.Shape();
        this.loadingScreenProgressBar.x = WIDTH/2 - 200;
        this.loadingScreenProgressBar.y = HEIGHT/2 + 50 - 30;
        stage.addChild(this.loadingScreenProgressBar);
    }

    destroyLoading() {
        stage.removeChild(this.loadingScreenBackground);
        stage.removeChild(this.loadingScreenText);
        stage.removeChild(this.loadingScreenProgressBar);
        stage.removeChild(this.loadingScreenText);
    }

    handleError(event) {
        console.log("ERROR:", event);
    }
  
    handleFileLoaded(event) {
        
    }
  
    handleFileProgress(event) {

        // better way to do this? solves issue with odd corners
        if (preload.progress == 0)
            return;

        this.loadingScreenProgressBar.graphics.beginFill('#00A');
        this.loadingScreenProgressBar.graphics.drawRoundRect(0, 0, 400 * preload.progress, 30, 6);
        this.loadingScreenProgressBar.graphics.endFill();

        console.log("Progress: " + preload.progress*100 + "%");
    }


    handleComplete(event) {
        
        createjs.Touch.enable(stage);
        
        this.destroyLoading();
        this.createMainMenu();

        // fuck it global scope keyboard handling. get this game out!
        window.onkeyup = keyUpHandler;
        window.onkeydown = keyDownHandler;

        stage.on("stagemousedown", function(event) {

            if (game_state == 'menu') {
                
                // start button coords
                let top_corner = [ 91, 309 ];
                let bottom_corner = [ 263, 378 ];

                if (event.rawX > top_corner[0] && event.rawX < bottom_corner[0]
                 && event.rawY > top_corner[1] && event.rawY < bottom_corner[1]) {
                    this.startGame();
                }

            } else {



            }
            // console.log(event.rawX, event.rawY);
            
        }, this);
    
    }

    tick() {
        
        stage.update();
        if (game)
            game.tick();
        
    }

    startGame() {

        // cannot create game if game is already started
        if (game_state != 'menu') 
            return;

        game_state = 'game';
        game = new Game();

        this.unloadMainMenu();

    }

    endGame(key) {
        // cannot end game if it is not started
        if (game_state != 'game') 
            return;

        // if its the spacebar then the game has to be over to go to main menu
        if (key == "space" && !game.hasEnded())
            return;

        game.destroy();
        game = undefined;
        
        // for now this is ok... 
        game_state = 'menu';
        stage.addChild(this.menu_text);
        stage.removeChild(pat.background_fade);
        this.background.image = preload.getResult('MenuBackground');
    
    }

    unloadMainMenu() {
        stage.removeChild(this.menu_text);
        this.background.image = preload.getResult('GameBackground');
    }
    
    createMainMenu() {

        this.background = new createjs.Bitmap(preload.getResult('MenuBackground'));
        this.background.x = 0;
        this.background.y = 0;
        stage.addChild(this.background);

        // used to do a fade animation in the correct location in the stack
        this.background_fade = new createjs.Bitmap(preload.getResult('GameBackground'));
        this.background_fade.x = 0;
        this.background_fade.y = 0;
        this.background_fade.alpha = 0;
        stage.addChild(this.background_fade);

        this.menu_text = new createjs.Bitmap(preload.getResult('Menu'));
        this.menu_text.x = 0;
        this.menu_text.y = 0;
        stage.addChild(this.menu_text);
    }
}

var pressed_keys = [];
function keyUpHandler(event) {
    const index = pressed_keys.indexOf(event.keyCode);
    pressed_keys.splice(index, 1);
};

function keyDownHandler (event) {
    if (pressed_keys.indexOf(event.keyCode) == -1) {
        pressed_keys.push(event.keyCode);
        // console.log(event.keyCode);

        if (game_state == 'game') {
            switch (event.keyCode) {
                case 27: pat.endGame("escape"); break;
                case 49: game.answerQuestion(1); break; // 1
                case 50: game.answerQuestion(2); break; // 2
                case 51: game.answerQuestion(3); break; // 3
                case 32: pat.endGame("space"); break; // space
            }
        }
    }
};




