var config = require('config.json');
var mongo = require('mongoskin');
var db = mongo.db(config.absenceDataBase, { native_parser: true });
db.bind('courses');


function create(coursInfos) {

}