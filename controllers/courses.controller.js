var config = require('config.json');
var express = require('express');
var router = express.Router();
var guard = require('express-jwt-permissions')({
    permissionsProperty: 'scope'
});

var courseService = require('services/course.service');

// routes
router.get('/courses', guard.check(['ens']), getMyCourses);

module.exports = router;

function getMyCourses(req, res) {
    courseService.getTodaysCourseList(req.user.sub)
        .then(function (courses) {
            res.send(courses);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
