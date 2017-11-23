var express = require('express');
var router = express.Router();

router.post('/', authenticate);

module.exports = router;

function authenticate(req, res) {
    console.log(req.body);
    res.status(200).send();
}