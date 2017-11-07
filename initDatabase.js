var config = require('config.json');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(config.absenceDataBase, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.createCollection("Courses");
    db.close();
});
