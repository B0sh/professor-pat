<?php
$v = "0.1";
$cache = "?" . time();
?><!DOCTYPE html>
<html>
	<head>
		<title>Proffessor Pat :: Walden's World</title>
		<link rel="shortcut icon" type="image/x-icon" href="f.png" />

    <script src='../_library/jquery.js<?=$cache?>' type='text/javascript'></script>
    <script src='../_library/rainbow.js<?=$cache?>' type='text/javascript'></script>
    <script src='../_library/numbers.js<?=$cache?>' type='text/javascript'></script>
    <script src='grid.js<?=$cache?>' type='text/javascript'></script>
    <script src='game.js<?=$cache?>' type='text/javascript'></script>
    <script src='equations.js<?=$cache?>' type='text/javascript'></script>

    <style>
      body{
				min-width: 600px;
        font-family:monospace;
        font-size:16px;
        margin:0px;
        background-color: black;
        color: white;
      }
			.grid_table {

				    border-spacing: 6px;
				    border-collapse: separate;
			}
			.person {
				border: 2px solid #990000;
				background: #220000;
				width:20px;
				height:20px;
				text-align:center;
			}
			.active {
				background: #CC0000;
			}

			#question {
				font-size:24px;
			}

			.header {
				width: 560px;
				text-align:left;
				padding: 10px;
				padding-left: 50px;
				border-bottom: 1px dotted white;
				font-size:30px;
			}

			.subtext {
				color: #AAA;
				font-size:16px;
			}

			.content {
				padding:12px;
			}

			#start_button:hover, #changelog_button:hover, #high_score_button:hover {
				cursor: pointer;
    		font-style: italic;
			}

			.guess_button {
				padding: 6px;
				font-size:16px;
				width:120px;
				border-radius: 8px;
				background-color: #AAA;
			}

			.guess_button:hover {
				background-color: #CCC;
				cursor: pointer;
			}

			.score_text {
				font-size: 20px;
			}

			.correct { color: #6aff00; }
			.incorrect { color: #eb6047; }
    </style>

<script type="text/javascript">
CurrentTab = 0;

function ToggleTab(tab){
	for (i=0;i<=12;i++) {
		$('[tab='+i+']').css('display', 'none');
		// $('[id='+i+']').attr('class', 'x');
	}
	$('[tab='+tab+']').css('display', 'inline-block');
	// $('[id='+tab+']').attr('class', 'selected');

	CurrentTab = tab;
}
$(document).ready(function() {
	// Game.Start();

	// $('#start_button').rainbow({
	//    colors: ['rgb(153, 204, 255);','rgb(173, 224, 255);','rgb(193, 244, 255);','rgb(213, 264, 255);','rgb(193, 244, 255);','rgb(173, 224, 255);','rgb(153, 204, 255);'],
	//    animate: true,
	//    animateInterval: 80,
	//    pad: false,
	//    pauseLength: 100,
	//  });
  //
 	// $('#high_score_button').rainbow({
  //   colors: ['rgb(153, 204, 255);','rgb(173, 224, 255);','rgb(193, 244, 255);','rgb(213, 264, 255);','rgb(193, 244, 255);','rgb(173, 224, 255);','rgb(153, 204, 255);'],
  //   animate: true,
  //   animateInterval: 80,
  //   pad: false,
  //   pauseLength: 100,
  // });
  //
 	// $('#changelog_button').rainbow({
  //   colors: ['rgb(153, 204, 255);','rgb(173, 224, 255);','rgb(193, 244, 255);','rgb(213, 264, 255);','rgb(193, 244, 255);','rgb(173, 224, 255);','rgb(153, 204, 255);'],
  //   animate: true,
  //   animateInterval: 80,
  //   pad: false,
  //   pauseLength: 100,
  // });

});


var CanGuess = true;
$(document).keydown(function(e) {
	var code = e.keyCode;
  // console.log(code);
  switch (code) {
    case 49: case 97: Game.Guess(1); break;
    case 50: case 98: Game.Guess(2); break;
    case 51: case 99: Game.Guess(3); break;
		case 32: Game.HitSpace(); e.preventDefault(); break;
    default: setTimeout(function(){CanGuess = true;},350); return true; break;
  }

  return true;
});

$(document).mousedown(function(e) {

	if ($('#start_button').is(":hover") && CurrentTab == '0') {
		Game.Start();
	}

	if ($('#high_score_button').is(":hover") && CurrentTab == '0') {
		Game.Start();
	}

	if ($('#changelog_button').is(":hover") && CurrentTab == '0') {
		Game.Start();
	}

});

</script>

  </head>

  <body>

		<div class="header">
			<font color="#F4F">Professor Pat</font> v0.1
			<i class="subtext">a game of patterns</i>
		</div>
		<div class="content">

			<div tab="0">
				<!-- must be tabbed down because of pre formatting --->
<pre style="font-size:32px;">
                 <span id="start_button" style="font-size:64px;">start</span>


    <span id="high_score_button">high scores</span>


            <span id="changelog_button">credits</span>
</pre>
			</div>

			<div tab="1" style="display:none;">
				Blah blah blah introduction.<br><br>
				Use popcorn js for nice faded intro. Under 15 seconds.<br><br>

				stupid story line I'm professor pat.<br><br>

				<button onclick="Game.ReallyStart();">Let's Go!</button>

			</div>

			<div tab="2" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="width:400px;height:120px;padding:10px;">

							&nbsp;&nbsp;Whats the pattern, Professor Pat?<br><br>
							<button class="guess_button" id="guess_1" onclick="Game.Guess(1);">(1)</button>
							<button class="guess_button" id="guess_2" onclick="Game.Guess(2);">(2)</button>
							<button class="guess_button" id="guess_3" onclick="Game.Guess(3);">(3)</button><br><br>

							<div class="score_text">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+<span id="score"></span> Score</div>
						</td>
						<td rowspan="2">
							<b>Score:</b> <span id="total_score">0</span><br>
							<b>Lives:</b> <span id="total_lives"></span><br>
							<b>Level:</b> <span class="total_levels"></span><br>
						</td>
					</tr>

					<tr>
						<td style="height:360px;padding:10px;" valign="top" id="where_the_grid_goes"></td>
					</tr>
				</table>
			</div>

			<div tab="3" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="text-align:center;padding:10px;">
							<span class="correct" style="font-size:32px;padding:10px;">Correct!</span><br>
							<div class="score_text">+<span class="earned_score"></span> Score</div>

							<br><button class="guess_button" onclick="Game.Next();">(Space) Next</button>
						</td>
					</tr>
				</table>
			</div>

			<div tab="7" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="text-align:center;padding:10px;">
							<span class="correct" style="font-size:32px;padding:10px;">Level Up</span><br>
							<div class="score_text">+<span class="earned_score"></span> Score</div>
							<div class="score_text">You reached Level <span class="total_levels"></span></div>

							<br><button class="guess_button" onclick="Game.Next();">Continue</button>
						</td>
					</tr>
				</table>
			</div>

			<div tab="4" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="text-align:center;padding:10px;">
							<span class="incorrect" style="font-size:32px;padding:10px;">Wrong :(</span><br>

							<br><button class="guess_button" onclick="Game.Next();">(Space) Next</button>
						</td>
					</tr>
				</table>
			</div>

			<div tab="6" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="text-align:center;padding:10px;">
							<span class="incorrect" style="font-size:32px;padding:10px;">Out of Time :(</span><br>

							<br><button class="guess_button" onclick="Game.Next();">(Space) Next</button>
						</td>
					</tr>
				</table>
			</div>

			<div tab="5" style="display:none;">
				<table style="width:600px; height: 500px; border:1px dotted white; background:#111;">
					<tr>
						<td style="text-align:center;padding:10px;">
							<span class="incorrect" style="font-size:32px;padding:10px;">Game Over.</span><br>

							<br><button class="guess_button" onclick="ToggleTab('0'); return false;">Main Menu</button>
						</td>
					</tr>
				</table>
			</div>
		</div>
  </body>
</html>
