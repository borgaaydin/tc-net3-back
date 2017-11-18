const http = require('http');
var auth = require('./auth.json');
var request = require('request');

function getSubject(line) {
    return line.split(/^[^-]+-/)[1]
}

function getType(line){
    return line.split(/^[0-9]+_/)[1]
}

function getRoom(line) {
    var startWithNumberRegex =  new RegExp("^[0-9]");
    var room = "";
    if (startWithNumberRegex.test(line))
        if (line === "0000000")
            room = "undefined";
        else room = line.split(/^[0-9]+-/)[1].split(" - ");
    else room = line;

    return room
}

function getProf(line) {
    return line.split(/[\[\]]/)[1].split(", ")
}

function getYearAndGroup(yearLine, groupLine) {
    var groups = [groupLine];
    if (groupLine === "0") groups.push("1", "2", "3");
    if (yearLine.includes("A")){
        yearLine = yearLine[0];
        groups = ["A"];
    }

    return {year: yearLine, group: groups}
}

function getTimetable(content) {
    var pre = content.split("pre")[1];
    var time_table = pre.split("\n");
    time_table.splice(0,1);
    time_table.splice(time_table.length - 1, 1);
    return time_table;
}

function getCourses() {
    var content = "";
    var coursList = [];

    request.get('https://tc-net2.insa-lyon.fr/edt/ens/ExtractFaf.jsp', {
            'auth':{
                'user': auth.name, 'pass':auth.password}},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                content = body;
                var timeTable = getTimetable(String(content));

                timeTable.forEach(function (t) {
                    var elements = t.split(":");
                    var cours = {
                        "year": getYearAndGroup(elements[0], elements[4]).year,
                        "subject": getSubject(elements[1]),
                        "type": getType(elements[2]),
                        "number": elements[3],
                        "group": getYearAndGroup(elements[0], elements[4]).group,
                        "date": Date.parse(elements[5]),
                        "startTime": elements[6],
                        "endTime": elements[7],
                        "room": getRoom(elements[8]),
                        "professor": getProf(elements[9]),
                        "absent": [],
                        "present": []
                    };
                    if (cours.date > Date.now()) coursList.push(cours);
                });
            }
        });
    return coursList;
}



/*Here is the data model
cours = {
    "Year": 3,
    "Subject": AGP-17,
    "Type": TP,
    "Number": 6,
    "Group": 2,
    "Date": 2017-01-06,
    "startTime": 840,
    "endTime": 1080,
    "Room": [TP-INFO C, INFO D],
    "Professor": [RAG, TRI],
    "Absent": ["Toto", "Léo", "Borga"],
    "Present": ["Pierre"]
};*/

//Enable requiring thoses functions
module.exports = {
    getCourses: getCourses()
};