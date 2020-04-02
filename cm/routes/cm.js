var config = require('../config.js'),
    DB = require('../model/db'),
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    dbUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || (config.client.mongodb.uri + '/' + config.client.mongodb.database + '?' + config.client.mongodb.extraParams);

router.get('/', function (req, res) {
    res.json({
        "AppName": "CM",
        "Version": 1.0
    });
});

router.get('/points/week/:numWeek?', function (req, res) {
    var numWeek = req.params.numWeek || moment.utc().week(),
        dataBase = new DB;

    dataBase.connect(dbUrl).then(function () {
        var utcWeekMoment = moment.utc().week(numWeek),
            initialDate = utcWeekMoment.startOf('week').valueOf(),
            finalDate = utcWeekMoment.endOf('week').valueOf();
        dataBase.sumPoints("points", initialDate, finalDate).then(function (sumPointsResult) {
            dataBase.close();
            var resultTemp = [];
            sumPointsResult.forEach(function (obj) {
                obj._id.count = obj.count;
                resultTemp.push(obj._id);
            });
            sumPointsResult = resultTemp;
            res.json(sumPointsResult);
        }, function (error) {
            dataBase.close();
            res.status(500);
            res.json({
                "success": false,
                "count": 0,
                "error": "Failed to sum points: " + error
            });
        });
    }, function (error) {
        res.status(500);
        res.json({
            "success": false,
            "count": 0,
            "error": "Failed to connect to database: " + error
        });
    });
});

router.post('/points', function (req, res) {
    var dataBase = new DB;
    dataBase.connect(dbUrl).then(function () {
        dataBase.addDocument("points", req.body).then(function () {
            dataBase.close();
            res.status(201).json();
        }, function (error) {
            dataBase.close();
            res.status(500);
            res.json({
                "success": false,
                "count": 0,
                "error": "Failed to add document: " + error
            });
        });
    }, function (error) {
        res.status(500);
        res.json({
            "success": false,
            "count": 0,
            "error": "Failed to connect to database: " + error
        });
    })
});

router.get('/members', function (req, res) {
    var dataBase = new DB;
    dataBase.connect(dbUrl).then(function () {
        dataBase.sampleCollection("members", 500).then(function (names) {
            dataBase.close();
            res.json(names);
        }, function (error) {
            dataBase.close();
            res.status(500);
            res.json({
                "success": false,
                "count": 0,
                "error": "Failed to add document: " + error
            });
        });
    }, function (error) {
        res.status(500);
        res.json({
            "success": false,
            "count": 0,
            "error": "Failed to connect to database: " + error
        });
    });
});

router.get('/members/:memberNameOrID/week/:numWeek', function (req, res) {
    var dataBase = new DB;
    dataBase.connect(dbUrl).then(function () {
        var numWeek = req.params.numWeek,
            memberName = req.params.memberNameOrID,
            utcWeekMoment = moment.utc().week(numWeek),
            initialDate = utcWeekMoment.startOf('week').valueOf(),
            finalDate = utcWeekMoment.endOf('week').valueOf();
        dataBase.listPointsForMember("points", initialDate, finalDate, memberName).then(function (points) {
            dataBase.close();
            res.json(points);
        }, function (error) {
            dataBase.close();
            res.status(500);
            res.json({
                "success": false,
                "count": 0,
                "error": "Failed to list document: " + error
            });
        });
    }, function (error) {
        res.status(500);
        res.json({
            "success": false,
            "count": 0,
            "error": "Failed to connect to database: " + error
        });
    });
});

router.post('/members', function (req, res) {
    var dataBase = new DB;
    dataBase.connect(dbUrl).then(function () {
        dataBase.addDocument("members", req.body).then(function () {
            dataBase.close();
            res.status(201).json();
        }, function (error) {
            dataBase.close();
            res.status(500);
            res.json({
                "success": false,
                "count": 0,
                "error": "Failed to add document: " + error
            });
        });
    }, function (error) {
        res.status(500);
        res.json({
            "success": false,
            "count": 0,
            "error": "Failed to connect to database: " + error
        });
    })
});

module.exports = router;
