var config = require('config.json');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../tcnetParser');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('courses');
db.bind('subjects');

var service = {};

service.getTodaysCourseList = getTodaysCourseList;
service.getCourseById = getCourseById;
service.initDatabase = initDatabase;
service.updateDatabase = updateDatabase;
service.getSubjects = getSubjects;

module.exports = service;

function createCourse(courseInfo) {
    var deferred = Q.defer();

    db.courses.insert(
        courseInfo,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        }
    );

    return deferred.promise;
}

function createSubjects(subjects) {
    var deferred = Q.defer();

    subjects.forEach(function (subject) {
        db.subjects.updateOne({"subject": subject["name"], "year": subject["year"]}, {$set: {"name": subject["name"], "year": subject["year"]}}, {upsert: true},
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            }
        );
    });

    return deferred.promise;
}

function initDatabase() {
    var courses = tcnet2.getCourses()
        .then(function (courses) {
            var newSubjects = [];
            courses.forEach(function (course) {
                if (newSubjects.filter(e => e.name === course["subject"]).length <= 0) {
                    subject = {
                        "name": course["subject"],
                        "year": course["year"]
                    };
                    newSubjects.push(subject);
                }

                createCourse(course);
            });
            createSubjects(newSubjects);
        });
}

function updateDatabase() {
    db.courses.deleteMany({startTime: {$gte: Date.now()}}, function(err, obj) {
        if (err) throw err;
    });
    initDatabase();
}

function getTodaysCourseList(user) {
    console.log(user);
    var deferred = Q.defer();

    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);

    db.courses.find({date: {$gte: start.getTime(), $lt: end.getTime()}, professor: user.tri}).toArray(function (err, courses) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(courses);
    });

    return deferred.promise;
}

function getCourseById(course_id) {
    var deferred = Q.defer();

    db.courses.findById(course_id, function (err, course) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (course) {
            // return course
            deferred.resolve(course);
        } else {
            // course not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getSubjects() {
    var deferred = Q.defer();

    db.subjects.find({}).toArray(function (err, subjects) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(subjects);
    });

    return deferred.promise;
}
