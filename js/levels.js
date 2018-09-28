'use strict'; 

// level.generate() needs to return some set of properties
// call generate AT every new map creation

// 11x11 is the max number
var levels = {
    "level1": {
        "id": 1,
        "question_count": 5,
        "toAdd": 0.08,
        "next_level": "level2",
        "background": "Background0",
        "generate": function () {
            
            return new Grid(11, 11, 
                equations["single"].generate([3, 6]));

        },
    },
    "level2": {
        "id": 2,
        "question_count": 6,
        "toAdd": 0.1,
        "next_level": "level3",
        "background": "Background1",
        "generate": function () {

            return new Grid(getRandomInt(10, 11), getRandomInt(9, 10),
                equations["single"].generate([3, 9]));
            
        },
    },
    "level3": {
        "id": 3,
        "question_count": 8,
        "toAdd": 0.1,
        "next_level": "level4",
        "background": "Background9",
        "generate": function () {

            return new Grid(getRandomInt(4, 7), getRandomInt(4, 7),
                equations["single"].generate([3, 9]));

        },
    },
    "level4": {
        "id": 4,
        "question_count": 10,
        "toAdd": 0.12,
        "next_level": "Done",
        "background": "Background7",
        "generate": function () {
            
            return new Grid(12, 10,
                equations["double"].generate([3, 9]));
            
        },
    },
};