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
router.get('/rollcall/:_id', guard.check(['ens']), getRollcallList);
router.post('/rollcall/:_id', guard.check(['ens']), rollCall);

module.exports = router;

function getSubjects(req, res) {
    courseService.getSubjects()
        .then(function (subjects) {
            res.send(subjects);
        })
        .catch(function (err) {
            res.sendStatus(400);
        });
}

function getMyCourses(req, res) {
    courseService.getTodaysCourseList(req.user)
        .then(function (courses) {
            res.send(courses);
        })
        .catch(function (err) {
            res.sendStatus(400);
        });
}

function getById(req, res) {
    courseService.getCourseById(req.params._id)
        .then(function (courses) {
            if(courses !== undefined) {
                res.send(courses);
            } else {
                res.sendStatus(204);
            }

        })
        .catch(function (err) {
            res.sendStatus(400);
        });
}

function getRollcallList(req, res) {
    courseService.getRollcallList(req.params._id)
        .then(function (courses) {
            res.send(courses);
        })
        .catch(function (err) {
            res.sendStatus(400);
        });
}

function rollCall(req, res) {
    courseService.rollCall(req.params._id, req.body, req.user)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.sendStatus(400);
        });
}
