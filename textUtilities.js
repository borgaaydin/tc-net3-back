function getUrlContent(url) {
    var req = new XMLHttpRequest();
    req.open("Get", url, false);
    req.send(null);
    var content = req.responseText;
    return content;
}

function getSubject(line) {
    return line.split(/^[^-]+-/)[1]
}

function getType(line){
    return line.split(/^[0-9]+_/)[1]
}

function getRoom(line) {
    return line.split(/^[0-9]+-/)[1].split(" - ")
}

function getProf(line) {
    return line.split(/[\[\]]/)[1].split(", ")
}

function getTimeTabe() {
    var url = "https://tc-net2.insa-lyon.fr/edt/ens/ExtractFaf.jsp";
    var content = getUrlContent(url);
    var pre = content.split("pre")[1];
    var time_table = pre.split("\n");
    time_table.splice(0,1);
    time_table.splice(time_table.length - 1, 1);
    return time_table;
}

function dataBaseCoursModel(time_table) {
    var coursList = [];
    time_table.forEach(function (t) {
        var elements = t.split(":");
        var cours = {
            "Year": elements[0],
            "Subject": getSubject(elements[1]),
            "Type": getType(elements[2]),
            "Number": elements[3],
            "Group": elements[4],
            "Date": elements[5],
            "BeginingHour": elements[6],
            "EndingHour": elements[7],
            "Room": getRoom(elements[8]),
            "Professor": getProf(elements[9]),
            "Absent": [],
            "Present": []
        };
        coursList.push(cours);
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
    "BeginingHour": 840,
    "EndingHour": 1080,
    "Room": [TP-INFO C, INFO D],
    "Professor": [RAG, TRI],
    "Absent": ["Toto", "Léo", "Borga"],
    "Present": ["Pierre"]
};*/
