var config = require('config.json');
var _ = require('lodash');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../tcnetParser');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('courses');
db.bind('subjects');
db.bind('users');

var service = {};

service.getTodaysCourseList = getTodaysCourseList;
service.getCourseById = getCourseById;
service.getRollcallList = getRollcallList;
service.rollCall = rollCall;
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
        db.subjects.updateOne({"name": subject["name"], "year": subject["year"]}, {$set: {"name": subject["name"], "year": subject["year"]}}, {upsert: true},
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
    var deferred = Q.defer();

    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setDate(end.getDate()+1);
    end.setHours(23,59,59,999);

    db.courses.find({startTime: {$gte: start.getTime(), $lt: end.getTime()}, professor: {$in: [user.tri]}}).sort({ "startTime": 1 }).toArray(function (err, courses) {
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

function getRollcallList(course_id) {
    var deferred = Q.defer();

    getCourseById(course_id)
        .then(function (course) {
            if (course) {
                db.users.find({"subjects.name" : { $in : [course.subject]}}).sort({ "lastName": 1 }).toArray(function (err, students) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    students = _.map(students, function (student) {
                        return _.omit(student, ['hash', 'subjects', 'isTeacher', 'absences']);
                    });

                    deferred.resolve(students);
                });
            } else {
                deferred.resolve();
            }
        });

    return deferred.promise;
}

function rollCall(course_id, roll, user) {
    var deferred = Q.defer();

    db.courses.findById(course_id, function (err, course) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (course) {
            db.courses.updateById(course._id, {$set: {"present": roll.present, "absent": roll.absent}});
            var absence = {
                "_id": course._id,
                "subject": course.subject,
                "type": course.type,
                "startTime": course.startTime,
                "professor": course.professor
            };
            roll.absent.forEach(function (student){
                db.users.updateById(student, {$push: {"absences": absence}}, function (err) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                });
            });

            deferred.resolve();

        } else {
            deferred.reject();
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
