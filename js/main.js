"use strict";

/*

Animation idea:
    Make the animation of grey people and then colorize when the timer starts

*/

var VERSION = 1;
var BACKGROUND_COUNT = 14;
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
      { id: "GameOverBackground", src: "images/background13.png" },
      { id: "WinOverBackground", src: "images/background4.png" },
      { id: "Menu", src: "images/cool-menu.png" },
      { id: "RedPerson", src: "images/person-red.png" },
      { id: "YellowPerson", src: "images/person-yellow.png" },
      { id: "OrangePerson", src: "images/person-orange.png" },
      { id: "PurplePerson", src: "images/person-purple.png" },
      { id: "GreenPerson", src: "images/person-green.png" },
      { id: "Life", src: "images/heart-small.png" },
      { id: "Mute", src: "images/mute-small.png" },
      { id: "Unmute", src: "images/unmute-small.png" },

      { id: "ProfessorPat", src: "images/pp-4.png" },

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
        function is(event, top_corner, bottom_corner) {
          return (
            event.rawX > top_corner[0] &&
            event.rawX < bottom_corner[0] &&
            event.rawY > top_corner[1] &&
            event.rawY < bottom_corner[1]
          );
        }

        if (game_state == "menu") {
          // start button coords
          //! I can use ButtonHelper for this but I couldn't figure it out
          if (is(event, [98, 325], [337, 394])) {
            this.startGame();
          }

          // mute button coords
          //! I can use ButtonHelper for this but I couldn't figure it out
          if (is(event, [656, 386], [702, 431])) {
            if (this.save_file.volume == 0) {
              this.unmute();
            } else {
              this.mute();
            }
          }
        } else if (game_state == "game") {
          // guess button 1
          if (is(event, [415, 145], [680, 212])) {
            game.answerQuestion(1);
            console.log("Button 1");
          }

          // guess button 2
          if (is(event, [415, 212], [680, 275])) {
            game.answerQuestion(2);
            console.log("Button 2");
          }

          // guess button 3
          if (is(event, [415, 275], [680, 337])) {
            game.answerQuestion(3);
            console.log("Button 3");
          }
        }
        console.log(event, event.rawX, event.rawY);
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
    stage.removeChild(this.professor_pat);
    this.background.image = preload.getResult("GameBackground");
  }

  loadMainMenu() {
    game_state = "menu";
    stage.addChild(this.menu_text);
    stage.addChild(this.professor_pat);

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

    var data = {
      images: [preload.getResult("ProfessorPat")],
      framerate: 8,
      frames: {
        width: 270,
        height: 270
      },
      animations: {
        idle: {
          speed: 1 / 7,
          frames: [0, 1, 2, 3, 4, 3, 2, 1]
        }
      }
    };

    let spritesheet = new createjs.SpriteSheet(data);
    this.professor_pat = new createjs.Sprite(spritesheet, "idle");

    this.professor_pat.x = 450;
    this.professor_pat.y = 175;
    // this.professor_pat.scaleX = 1.2;
    // this.professor_pat.scaleY = 1.2;
    // stage.addChild(this.professor_pat);

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
    this.muteButtonIsNotMuted = new createjs.Bitmap(
      preload.getResult("Unmute")
    );
    this.muteButtonIsNotMuted.x = WIDTH - 60;
    this.muteButtonIsNotMuted.y = HEIGHT - 90;
    // stage.addChild(this.muteButtonIsNotMuted);

    //TODO: create mute/unmute images
    this.muteButtonIsMuted = new createjs.Bitmap(preload.getResult("Mute"));
    this.muteButtonIsMuted.x = WIDTH - 60;
    this.muteButtonIsMuted.y = HEIGHT - 90;
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

// https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
function fullscreen() {
  var doc = window.document;
  var docEl = document.getElementById("canvas_game");

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

var docEl = document.getElementById("canvas_game");
var requestFullScreen =
  docEl.requestFullscreen ||
  docEl.mozRequestFullScreen ||
  docEl.webkitRequestFullScreen ||
  docEl.msRequestFullscreen;

if (typeof requestFullScreen === "undefined") {
  $("#fullscreen_toggle").css("display", "none");
} else {
  $("#fullscreen_toggle").css("display", "inline");
}
