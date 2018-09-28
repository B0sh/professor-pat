'use strict';

/*

Animation idea:
    Make the animation of grey people and then colorize when the timer starts

*/

var BACKGROUND_COUNT = 12;
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

        preload = new createjs.LoadQueue(true);
        // the this on the end binds the scope in the handle function later so I can use classes
        preload.on("fileload", this.handleFileLoaded, this);
        preload.on("progress", this.handleFileProgress, this);
        preload.on("error", this.handleError, this);
        preload.on("complete", this.handleComplete, this);

        let manifest = [
            { id: "MenuBackground", src:   "images/background2.png" },
            { id: "GameBackground", src:   "images/background0.png" },
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
    
        // stage.on("stagemousemove", function(event) {
        // //   paddle.x = stage.mouseX;
        // });
    


        // fuck it global scope keyboard handling. get this game out!
        window.onkeyup = keyUpHandler;
        window.onkeydown = keyDownHandler;

        // console.log(this);
        stage.on("stagemousedown", function(event) {
            // console.log(this);

            if (game_state == 'menu') {
                
                // start button coords
                let top_corner = [ 91, 309 ];
                let bottom_corner = [ 263, 378 ];

                if (event.rawX > top_corner[0] && event.rawX < bottom_corner[0]
                 && event.rawY > top_corner[1] && event.rawY < bottom_corner[1]) {
                    this.startGame();
                }

            } else {

                // game.nextProblem();
                // let rand = getRandomInt(1, 9);
                // temp++;
                // console.log(temp);
                // this.background.image = preload.getResult('Background' + (temp % BACKGROUND_COUNT));


            }
            // console.log(event.rawX, event.rawY);
            
        }, this);
    
        // window.onkeyup = keyUpHandler;
        // window.onkeydown = keyDownHandler;
    
        // stage.canvas.height = window.innerHeight;
    
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

    endGame() {
        // cannot end game if it is not started
        if (game_state != 'game') 
            return;

        game.destroy();
        game = undefined;
        
        // for now this is ok... 
        game_state = 'menu';
        stage.addChild(this.menu_text);
        this.background.image = preload.getResult('MenuBackground');
        
    }

    unloadMainMenu() {
        stage.removeChild(this.menu_text);
        this.background.image = preload.getResult('GameBackground');
    }
    
    createMainMenu() {
        
        this.background = new createjs.Bitmap(preload.getResult('MenuBackground'));

        // this.background = new createjs.Shape();
        // this.background.graphics.beginFill('#CFFAA5');
        // this.background.graphics.drawRect(0, 0, 135135, 151351355);
        // this.background.graphics.endFill();

        this.background.x = 0;
        this.background.y = 0;
    
        stage.addChild(this.background);

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
        // console.log(event.keyCode, pat.game_state);
        if (game_state == 'game') {
            switch (event.keyCode) {
                case 27: pat.endGame(); break;
                case 49: game.answerQuestion(1); break; // 1
                case 50: game.answerQuestion(2); break; // 2
                case 51: game.answerQuestion(3); break; // 3
                case 32:  break; // space
            }
        }
        // console.log(event);

    }
};






function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomIntNot (min, max, not) {
      let randy;
      do {
        randy = Math.floor(Math.random() * (max - min + 1)) + min;
      } while (not.indexOf(randy) !== -1)
      return randy;
  }
  
  
  /* phpjs number_format */
  function Format(number, decimals, dec_point, thousands_sep) {
    //  discuss at: http://phpjs.org/functions/number_format/
  
    number = (number + '')
      .replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k)
          .toFixed(prec);
      };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }