
Game = {};
Game.Active = false;

Game.Start = function() {
	ToggleTab('1');
	Game.Equation = '';
	Game.Correct = 0;
	Game.Score = 0;
	Game.toAdd = .1;
	Game.UpdateScore(0);
	Game.Lives = 3;
	Game.UpdateLives(0);
}

Game.ReallyStart = function() {
	Game.Next();
	Game.Active = true;
}

Game.HitSpace = function() {
	if (CurrentTab == '3' || CurrentTab == '4')
		Game.Next();
	if (CurrentTab == '1')
		Game.ReallyStart();
};

Game.GetLevel = function() {
	var levels = [5, 12, 20, 30, 44];
	for (i = 0; i < levels.length; i++) {
		if (Game.Correct < levels[i])
		{
			level = i;
			break;

		}
	}

	return level + 1;
};


Game.Next = function() {
	ToggleTab('2');

	equationType = 0;
	switch (Game.GetLevel()) {
		case 1:
			Grid.Generate(12, 10);
			Game.toAdd = 0.08;
			params = [3,6];
			break;
		case 2:
			Grid.Generate(getRandomInt(10, 11), getRandomInt(9, 10));
			Game.toAdd = 0.1;
			params = [3,9];
			break;
		case 3:
			Grid.Generate(getRandomInt(4, 7), getRandomInt(4, 7));
			Game.toAdd = 0.11;
			params = [3,9];
			break;
		case 4:
			Grid.Generate(12, 10);
			equationType = 1;
			Game.toAdd = 0.12;
			params = [3,9];
			break;
	}

	Game.Equation = equations[equationType];
	Game.Equation.generate(params);


	var startGuess = getRandomInt(1, 3);
	switch (startGuess) {
		case 1: Game.Answer = 3; break;
		case 2: Game.Answer = 2; break;
		case 3: Game.Answer = 1; break;
	}


	$("#guess_1").html("(1) "+Game.Equation.choices[startGuess-1]);
	$("#guess_2").html("(2) " + Game.Equation.choices[startGuess]);
	$("#guess_3").html("(3) " + Game.Equation.choices[startGuess+1]);

	$('.total_levels').html(Game.GetLevel());

	Grid.Populate();

	Game.StartScoreTimer(995);
	CanGuess = true;
}

Game.ScoreTimer;
// https://jsfiddle.net/joshuapinter/8uasm7ko/
Game.StartScoreTimer = function (score) {
	clearInterval(Game.ScoreTimer);

	var valueElement = $('#score');

	var start     = score;
	var end       = 0;
	var duration  = 10000; // In milliseconds (divide by 1000 to get seconds).
	var rate      = 50;    // In milliseconds (divide by 1000 to get seconds).

	var colorRange = [
		{ color: '#88FF88', num: 800 },
		{ color: '#FFFF88', num: 500 },
		{ color: '#FF8888', num: 0 }
	];

	// var toAdd = ( ( end - start ) * rate ) / duration;
	var toAdd = Game.toAdd;

	Game.currentScoreValue = score;
	Game.ScoreTimer = setInterval(function() {

		toAdd -= 0.1;

		for (y = 0; y < colorRange.length; y++) {
			if (Game.currentScoreValue > colorRange[y].num) {
				valueElement.css('color', colorRange[y].color)
				break;
			}
		}

		Game.currentScoreValue += toAdd;
		valueElement.html(parseInt(Game.currentScoreValue));
		if (Game.currentScoreValue <= end) {
			valueElement.html(0);
			ToggleTab('6');
			Game.UpdateLives(-1);
			clearInterval(Game.ScoreTimer);
			return;
		}

	}, rate);

}


Game.Guess = function(q)
{
	// Game state = tab you are on
	if (CurrentTab != 2)
		return false;

	clearInterval(Game.ScoreTimer);
	if (Game.Answer == q) {
		l = Game.GetLevel();
		Game.Correct += 1;
		$('.total_levels').html(Game.GetLevel());
		if (l != Game.GetLevel())
			ToggleTab('7');
		else
			ToggleTab('3');
		Game.UpdateScore(Game.currentScoreValue);
		$('.earned_score').html(Format(Game.currentScoreValue));
	} else {
		ToggleTab('4');
		Game.UpdateLives(-1);
	}

	return true;
}

Game.UpdateScore = function (update) {
	Game.Score += Math.floor(update);
	$('#total_score').html(Format(Game.Score));
}

Game.UpdateLives = function (update) {
	Game.Lives += Math.floor(update);
	$('#total_lives').html(Format(Game.Lives));

	if (Game.Lives == 0) {
		Game.Over();
	}
}



Game.Over = function()
{
	Game.Active = false;
	ToggleTab('5');
}
