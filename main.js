'use strict';

var stage;
var preload;
var game;
var game_state = 'menu';

$(document).ready(function() {
    game = new ProfessorPat();
});

// set up the game / load main menu
class ProfessorPat {
    constructor () {
        game_state = 'menu';

        stage = new createjs.Stage("canvas_game");

        preload = new createjs.LoadQueue(true);
        // the this on the end binds the scope in the handle function later so I can use classes
        preload.on("fileload", this.handleFileLoaded, this);
        preload.on("progress", this.handleFileProgress, this);
        preload.on("error", this.handleError, this);
        preload.on("complete", this.handleComplete, this);

        let manifest = [
            { id: "Background", src:   "background2.png" },
            { id: "Menu", src:   "shit menu.png" },
            { id: "F", src:   "f.png" },
            // { id: "Paddle", src: "<?=Domain(1)?>/core/smelt_out/PalladiumBar.png" },
            // { id: "Brick", src:  "<?=Domain(1)?>/core/smelt_out/Radiator.png" },
            // { id: "Smelt0", src: "<?=Domain(1)?>/core/smelt_out/smelt00.png" },
            // { id: "Smelt1", src: "<?=Domain(1)?>/core/smelt_out/smelt01.png" },
            // { id: "Smelt2", src: "<?=Domain(1)?>/core/smelt_out/smelt02.png" },
            // { id: "Smelt3", src: "<?=Domain(1)?>/core/smelt_out/smelt03.png" },
            // { id: "Smelt4", src: "<?=Domain(1)?>/core/smelt_out/smelt04.png" },
            // { id: "Smelt5", src: "<?=Domain(1)?>/core/smelt_out/smelt05.png" },
        ];

        preload.loadManifest(manifest);
    }

    handleError() {

    }
  
    handleFileLoaded(event) {
    //   let image = preload.getResult(event.item.id);
    //   document.body.appendChild(image);
    }
  
    handleFileProgress(event) {
        console.log("Progress: " + preload.progress*100 + "%");
    }
  
    handleComplete(event) {
        
        createjs.Touch.enable(stage);
        
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this.tick);
        
        this.createMainMenu();
        // createBrickGrid();
        // createPaddle();
        // createBall();
        // createScoreText();
        // createLogoText();
        // addToScore(0);
    
        // stage.on("stagemousemove", function(event) {
        // //   paddle.x = stage.mouseX;
        // });
    
        stage.on("stagemousedown", function(event) {

            if (game_state == 'menu') {
                
                // start button coords
                let top_corner = [ 91, 309 ];
                let bottom_corner = [ 263, 378 ];

                if (event.rawX > top_corner[0] && event.rawX < bottom_corner[0]
                 && event.rawY > top_corner[1] && event.rawY < bottom_corner[1]) {
                    alert("Start Game");
                }
    
            }
            console.log(event.rawX, event.rawY);
            
        });
    
        // window.onkeyup = keyUpHandler;
        // window.onkeydown = keyDownHandler;
    
        // stage.canvas.height = window.innerHeight;
    
    }

    tick() {
        
        stage.update();
        
    }
    
    createMainMenu() {
        
        console.log("create main menu");
        this.background = new createjs.Bitmap(preload.getResult('Background'));

        // this.background = new createjs.Shape();
        // this.background.graphics.beginFill('#CFFAA5');
        // this.background.graphics.drawRect(0, 0, 135135, 151351355);
        // this.background.graphics.endFill();

        this.background.regX = 0;
        this.background.regY = 0;
        this.background.scaleX = 1;
        this.background.scaleY = 1;
        this.background.x = 0;
        this.background.y = 0;
    
        stage.addChild(this.background);

        this.menu_text = new createjs.Bitmap(preload.getResult('Menu'));

        // this.background = new createjs.Shape();
        // this.background.graphics.beginFill('#CFFAA5');
        // this.background.graphics.drawRect(0, 0, 135135, 151351355);
        // this.background.graphics.endFill();

        this.menu_text.regX = 0;
        this.menu_text.regY = 0;
        this.menu_text.scaleX = 1;
        this.menu_text.scaleY = 1;
        this.menu_text.x = 0;
        this.menu_text.y = 0;
    
        stage.addChild(this.menu_text);
        return true;
    }
}