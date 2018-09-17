
// level.generate() needs to return some set of properties
var levels = {
    "1": {
        "id": 1,
        "question_count": 5,
        "generate": function () {
            Grid.Generate(12, 10);
            Game.toAdd = 0.08;
            params = [3, 6];
        },
    },
    "2": {
        "id": 2,
        "question_count": 6,
        "generate": function () {
			Grid.Generate(getRandomInt(10, 11), getRandomInt(9, 10));
			Game.toAdd = 0.1;
			params = [3,9];
        },
    },
    "3": {
        "id": 4,
        "question_count": 8,
        "generate": function () {
			Grid.Generate(getRandomInt(10, 11), getRandomInt(9, 10));
			Game.toAdd = 0.1;
			params = [3,9];
        },
    },
    "4": {
        "id": 4,
        "question_count": 10,
        "generate": function () {
			Grid.Generate(12, 10);
			equationType = 1;
			Game.toAdd = 0.12;
			params = [3,9];
        },
    },
};