var config = require('config.json');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../tcnetParser');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('courses');

var service = {};

service.getTodaysCourseList = getTodaysCourseList;
service.initDatabase = initDatabase;

module.exports = service;

function createCourse(courseInfo) {
    var deferred = Q.defer();

    db.courses.insert(
        courseInfo,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function initDatabase() {
    var courses = tcnet2.getCourses(tcnet2.getTimeTable());
    courses.forEach(function (course) {
        createCourse(course)
    })

}

function getTodaysCourseList(userid) {
    var deferred = Q.defer();

    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    db.courses.find({date: {$gte: start, $lt: end}, profs: userid}).toArray(function (err, courses) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(courses);
    });

    return deferred.promise;
}
