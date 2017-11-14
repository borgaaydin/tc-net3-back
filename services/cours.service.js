var config = require('config.json');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../textUtilities');
var db = mongo.db(config.absenceDataBase, { native_parser: true });
db.bind('courses');


function createCours(coursInfos) {
    var deferred = Q.defer();

    db.courses.insert(
        coursInfos,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function initDataBase() {
    var courses = tcnet2.getCourses(tcnet2.getTimeTable());
    courses.forEach(function (cours) {
        createCours(cours)
    })

}