var config = require('config.json');
var mongo = require('mongoskin');
var Q = require('q');
var tcnet2 = require('../textUtilities');
var db = mongo.db(config.absenceDataBase, { native_parser: true });
db.bind('courses');

var service = {};

service.initDataBase = initDataBase();

function initDataBase() {
    var deferred = Q.defer();
    var courses = tcnet2.getCourses(tcnet2.getTimeTable());
    courses.forEach(function (cours) {
            db.courses.insert(cours, function (err, doc) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    deferred.resolve();
                });
        });

    return deferred.promise
}