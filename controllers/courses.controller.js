var config = require('config.json');
var express = require('express');
var router = express.Router();
var guard = require('express-jwt-permissions')({
    permissionsProperty: 'scope'
});

var courseService = require('services/course.service');

// routes
router.get('/', guard.check(['ens']), getMyCourses);
router.get('/subjects', getSubjects);
router.get('/:_id', guard.check(['ens']), getById);
router.get('/:_id/students', guard.check(['ens']), getById);

module.exports = router;

function getSubjects(req, res) {
    courseService.getSubjects()
        .then(function (subjects) {
            res.send(subjects);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getMyCourses(req, res) {
    courseService.getTodaysCourseList(req.user.sub)
        .then(function (courses) {
            res.send(courses);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    courseService.getCourseById(req.params._id)
        .then(function (courses) {
            console.log(!courses);
            if(courses !== undefined) {
                res.send(courses);
            } else {
                res.status(204).send();
            }

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
