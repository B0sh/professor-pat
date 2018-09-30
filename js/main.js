"use strict";

/*

Animation idea:
    Make the animation of grey people and then colorize when the timer starts

*/

var VERSION = 1;
var BACKGROUND_COUNT = 12;
var WIDTH = 720;
var HEIGHT = 480;
var temp = 1;

var stage;
var preload;
var pat;
var game;
var game_state;

$(document).ready(function() {
  pat = new ProfessorPat();
});

// set up the game / load main menu
class ProfessorPat {
  constructor() {
    this.save_file;
    this.load();

    game_state = "menu";

    stage = new createjs.Stage("canvas_game");

    //TODO: Upgrade to 60
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", this.tick);

    this.initLoading();

    preload = new createjs.LoadQueue(true);

    // https://createjs.com/tutorials/SoundJS%20and%20PreloadJS/
    preload.installPlugin(createjs.Sound);

    // the this on the end binds the scope in the handle function later so I can use classes
    preload.on("fileload", this.handleFileLoaded, this);
    preload.on("progress", this.handleFileProgress, this);
    preload.on("error", this.handleError, this);
    preload.on("complete", this.handleComplete, this);

    let manifest = [
      { id: "MenuBackground", src: "images/background2.png" },
      { id: "GameBackground", src: "images/background0.png" },
      { id: "GameOverBackground", src: "images/background10.png" },
      { id: "WinOverBackground", src: "images/background4.png" },
      { id: "Menu", src: "images/shit menu.png" },
      { id: "RedPerson", src: "images/person-red.png" },
      { id: "YellowPerson", src: "images/person-yellow.png" },
      { id: "OrangePerson", src: "images/person-orange.png" },
      { id: "PurplePerson", src: "images/person-purple.png" },
      { id: "GreenPerson", src: "images/person-green.png" },
      { id: "Life", src: "images/heart.png" },

      { id: "Soundtrack", src: "soundtrack-loopable.wav" }
    ];

    for (let i = 0; i < BACKGROUND_COUNT; i++) {
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
    this.loadingScreenBackground.graphics.beginFill("rgb(44, 6, 67)");
    this.loadingScreenBackground.graphics.drawRect(
      0,
      0,
      WIDTH - 16,
      HEIGHT - 16
    );
    this.loadingScreenBackground.graphics.endFill();
    this.loadingScreenBackground.x = 8;
    this.loadingScreenBackground.y = 8;
    this.loadingScreenBackground.shadow = new createjs.Shadow("#333", 0, 0, 9);
    stage.addChild(this.loadingScreenBackground);

    this.loadingScreenText = new createjs.Text(
      "Loading... Game... Soon...",
      "italic 40px Roboto",
      "#aa0"
    );
    this.loadingScreenText.x = WIDTH / 2;
    this.loadingScreenText.y = HEIGHT / 2 - 30;
    this.loadingScreenText.textAlign = "center";
    this.loadingScreenText.textBaseline = "middle";
    stage.addChild(this.loadingScreenText);

    this.loadingScreenProgressBarBorder = new createjs.Shape();
    this.loadingScreenProgressBarBorder.graphics.beginFill("#888");
    this.loadingScreenProgressBarBorder.graphics.drawRoundRect(
      0,
      0,
      404,
      34,
      6
    );
    this.loadingScreenProgressBarBorder.x = WIDTH / 2 - 202;
    this.loadingScreenProgressBarBorder.y = HEIGHT / 2 + 48 - 30;
    this.loadingScreenProgressBarBorder.graphics.endFill();
    stage.addChild(this.loadingScreenProgressBarBorder);

    this.loadingScreenProgressBar = new createjs.Shape();
    this.loadingScreenProgressBar.x = WIDTH / 2 - 200;
    this.loadingScreenProgressBar.y = HEIGHT / 2 + 50 - 30;
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

  handleFileLoaded(event) {}

  handleFileProgress(event) {
    // better way to do this? solves issue with odd corners
    if (preload.progress == 0) return;

    this.loadingScreenProgressBar.graphics.beginFill("#00A");
    this.loadingScreenProgressBar.graphics.drawRoundRect(
      0,
      0,
      400 * preload.progress,
      30,
      6
    );
    this.loadingScreenProgressBar.graphics.endFill();

    console.log("Progress: " + preload.progress * 100 + "%");
  }

  handleComplete(event) {
    createjs.Touch.enable(stage);

    this.destroyLoading();
    this.createMainMenu();

    // init soundtrack
    createjs.Sound.setVolume(this.save_file.volume);
    this.soundtrack = createjs.Sound.play("Soundtrack", {
      interrupt: createjs.Sound.INTERRUPT_ANY,
      loop: -1
    });

    // fuck it global scope keyboard handling. get this game out!
    window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;

    stage.on(
      "stagemousedown",
      function(event) {
        if (game_state == "menu") {
          // start button coords
          //! I can use ButtonHelper for this but I couldn't figure it out
          let top_corner = [91, 309];
          let bottom_corner = [263, 378];

          if (
            event.rawX > top_corner[0] &&
            event.rawX < bottom_corner[0] &&
            event.rawY > top_corner[1] &&
            event.rawY < bottom_corner[1]
          ) {
            this.startGame();
          }

          // mute button coords
          //! I can use ButtonHelper for this but I couldn't figure it out
          top_corner = [630, 391];
          bottom_corner = [662, 425];

          if (
            event.rawX > top_corner[0] &&
            event.rawX < bottom_corner[0] &&
            event.rawY > top_corner[1] &&
            event.rawY < bottom_corner[1]
          ) {
            if (this.save_file.volume == 0) {
              this.unmute();
            } else {
              this.mute();
            }
          }
        } else {
        }
        console.log(event.rawX, event.rawY);
      },
      this
    );
  }

  tick() {
    stage.update();
    if (game) game.tick();
  }

  startGame() {
    // cannot create game if game is already started
    if (game_state != "menu") return;

    game_state = "game";
    game = new Game();

    this.unloadMainMenu();
  }

  endGame(key) {
    // cannot end game if it is not started
    if (game_state != "game") return;

    // if its the spacebar then the game has to be over to go to main menu
    if (key == "space" && !game.hasEnded()) return;

    game.destroy();
    game = undefined;

    this.loadMainMenu();
  }

  unloadMainMenu() {
    stage.removeChild(this.highScoreMenuText);
    stage.removeChild(this.menu_text);
    stage.removeChild(this.muteButtonIsNotMuted);
    stage.removeChild(this.muteButtonIsMuted);
    this.background.image = preload.getResult("GameBackground");
  }

  loadMainMenu() {
    game_state = "menu";
    stage.addChild(this.menu_text);

    this.background.image = preload.getResult("MenuBackground");
    this.background_fade.alpha = 0;

    if (this.save_file.high_score != 0) {
      this.highScoreMenuText.text =
        "High Score: " + Format(this.save_file.high_score);
      stage.addChild(this.highScoreMenuText);
    }

    if (this.save_file.volume == 0) {
      stage.addChild(this.muteButtonIsMuted);
    } else {
      stage.addChild(this.muteButtonIsNotMuted);
    }
  }

  createMainMenu() {
    this.background = new createjs.Bitmap(preload.getResult("MenuBackground"));
    this.background.x = 0;
    this.background.y = 0;
    stage.addChild(this.background);

    // used to do a fade animation in the correct location in the stack
    this.background_fade = new createjs.Bitmap(
      preload.getResult("GameBackground")
    );
    this.background_fade.x = 0;
    this.background_fade.y = 0;
    this.background_fade.alpha = 0;
    stage.addChild(this.background_fade);

    this.menu_text = new createjs.Bitmap(preload.getResult("Menu"));
    this.menu_text.x = 0;
    this.menu_text.y = 0;
    // stage.addChild(this.menu_text);

    this.highScoreMenuText = new createjs.Text("", "30px Roboto", "black");
    this.highScoreMenuText.x = WIDTH - 20;
    this.highScoreMenuText.y = HEIGHT - 40;
    this.highScoreMenuText.textAlign = "right";
    // stage.addChild(this.highScoreMenuText);

    //TODO: create mute/unmute images
    this.muteButtonIsNotMuted = new createjs.Bitmap(preload.getResult("Life"));
    this.muteButtonIsNotMuted.x = WIDTH - 90;
    this.muteButtonIsNotMuted.y = HEIGHT - 90;
    this.muteButtonIsNotMuted.scaleX = 0.041;
    this.muteButtonIsNotMuted.scaleY = 0.041;
    // stage.addChild(this.muteButtonIsNotMuted);

    //TODO: create mute/unmute images
    this.muteButtonIsMuted = new createjs.Bitmap(preload.getResult("Life"));
    this.muteButtonIsMuted.x = WIDTH - 60;
    this.muteButtonIsMuted.y = HEIGHT - 60;
    this.muteButtonIsMuted.scaleX = -0.041;
    this.muteButtonIsMuted.scaleY = -0.041;
    // stage.addChild(this.muteButtonIsMuted);

    this.loadMainMenu();
  }

  mute() {
    // stopAudio();
    this.save_file.volume = 0;
    createjs.Sound.setVolume(this.save_file.volume);
    stage.removeChild(this.muteButtonIsNotMuted);
    stage.addChild(this.muteButtonIsMuted);

    this.save();
  }

  unmute() {
    // playAudio();
    this.save_file.volume = 1;
    this.soundtrack.position = 0;
    createjs.Sound.setVolume(this.save_file.volume);
    stage.addChild(this.muteButtonIsNotMuted);
    stage.removeChild(this.muteButtonIsMuted);

    this.save();
  }

  // Save Game.SaveFile into localStorage
  save() {
    try {
      localStorage.setItem("Professor_Pat", JSON.stringify(this.save_file));
      return true;
    } catch (e) {
      console.log(e);
      alert("Save failed to store data in local storage!");
    }

    return false;
  }

  // Load the save file from localStorage
  load() {
    let save = "Invalid";

    try {
      save = localStorage.getItem("Professor_Pat");
    } catch (e) {
      if (e instanceof SecurityError)
        alert("Browser security settings blocked access to local storage.");
      else
        alert(
          "Cannot access localStorage - browser may not support localStorage, or storage may be corrupt"
        );
      return false;
    }

    console.log(save);

    // If a save file does not exist, create a new one
    if (!save) {
      console.log("New save file");
      this.createNewSaveFile();
      this.save();
      return false;
    }

    if (save == "Invalid") {
      alert("Save file not loaded.");
      this.createNewSaveFile();
      return false;
    }

    this.save_file = JSON.parse(save);

    //version differences

    console.log("Game Loaded");
  }

  createNewSaveFile() {
    this.save_file = {
      version: VERSION,
      volume: 0.5, // assuming that i'll want this
      high_score: 0
    };

    return true;
  }
}

var pressed_keys = [];
function keyUpHandler(event) {
  const index = pressed_keys.indexOf(event.keyCode);
  pressed_keys.splice(index, 1);
}

function keyDownHandler(event) {
  if (pressed_keys.indexOf(event.keyCode) == -1) {
    pressed_keys.push(event.keyCode);
    // console.log(event.keyCode);

    if (game_state == "game") {
      switch (event.keyCode) {
        case 27:
          pat.endGame("escape");
          break;
        case 49:
          game.answerQuestion(1);
          break; // 1
        case 50:
          game.answerQuestion(2);
          break; // 2
        case 51:
          game.answerQuestion(3);
          break; // 3
        case 32:
          pat.endGame("space");
          break; // space
      }
    }
  }
}
