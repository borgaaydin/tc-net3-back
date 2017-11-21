require('rootpath')();
require('dotenv').config({silent: true})
var express = require('express');
var app = express();
var compression = require('compression');
var cors = require('cors');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var schedule = require('node-schedule');
var config = require('config.json');
config.connectionString = "mongodb://" + process.env.MONGO_HOST + ":27017/tc-net3-users";
var parsertcnet2 = require("./tcnetParser");
var courseService = require('services/course.service');

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  }
});

// routes
app.use('/users', require('./controllers/users.controller'));
app.use('/courses', require('./controllers/courses.controller'));

// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

var j = schedule.scheduleJob('0 1 * * *', function(){
    courseService.updateDatabase();
});

courseService.updateDatabase();
