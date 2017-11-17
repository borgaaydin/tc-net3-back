var config = require('config.json');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../tcnetParser');
var db = mongo.db(config.absenceDataBase, { native_parser: true });
db.bind('courses');

var service = {};

service.getTodaysCourseList = getTodaysCourseList;

module.exports = service;

function createCourse(courseInfo) {
    var deferred = Q.defer();

    db.courses.insert(
        coursInfo,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function initDatabase() {
    var courses = tcnet2.getCourses(tcnet2.getTimeTable());
    courses.forEach(function (cours) {
        createCours(cours)
    })

}

function getTodaysCourseList(userid) {
    var deferred = Q.defer();

    db.courses.find({ profs : userid }, function (err, course) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (course) {
            deferred.resolve();
        } else {
            // course not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}