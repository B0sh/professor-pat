
// level.generate() needs to return some set of properties
// call generate AT every new map creation
var levels = {
    "1": {
        "id": 1,
        "question_count": 5,
        "toAdd": 0.08,
        "generate": function () {
            
            console.log(equations["single"].generate([3, 6]));
            return new Grid(12, 10, 
                equations["single"].generate([3, 6]));

        },
    },
    "2": {
        "id": 2,
        "question_count": 6,
        "toAdd": 0.1,
        "generate": function () {

            return new Grid(getRandomInt(10, 11), getRandomInt(9, 10),
                equations["single"].generate([3, 9]));
            
        },
    },
    "3": {
        "id": 4,
        "question_count": 8,
        "toAdd": 0.1,
        "generate": function () {

            return new Grid(getRandomInt(4, 7), getRandomInt(4, 7),
                equations["single"].generate([3, 9]));

        },
    },
    "4": {
        "id": 4,
        "question_count": 10,
        "toAdd": 0.12,
        "generate": function () {
            
            return new Grid(12, 10,
                equations["double"].generate([3, 9]));
            
        },
    },
};