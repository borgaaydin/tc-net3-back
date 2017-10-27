function splitResponsLine(line) {
    return line.split(/[ ]+/)
}

function getUrlContent(url) {
    var req = new XMLHttpRequest();
    req.open("Get", url, false);
    req.send(null);
    var content = req.responseText;
    return content;
}

function getTrigram(line) {
    var trigram = line.split(/[<>]/)[5];
    return trigram;
}

function getTimeTabe(trigram) {
    var url = "https://tc-net2.insa-lyon.fr/edt/std/AffichageEdtTexte.jsp?nomCourt="+trigram.toUpperCase()+
        "&dateDeb="+Date.now();
    var content = getUrlContent(url);
    var pre = content.split("pre")[1];
    var time_table = pre.split("\n");
    time_table.splice(0,1);
    time_table.splice(time_table.length - 1, 1);
    return [time_table, trigram.toUpperCase()];
}

function dataBaseCoursModel(time_table, trigram) {
    var coursList = []
    time_table.forEach(function (t) {
        var elements = splitResponsLine(t)
        var cours = {
            "Professor": trigram.toUpperCase(),
            "Date":elements[1],
            "Day": elements[0],
            "Hour": elements[2],
            "Duration": elements[6],
            "Group": elements[3],
            "Cours": elements[4]
        };
        coursList.push(cours);
    });
    return coursList;
}