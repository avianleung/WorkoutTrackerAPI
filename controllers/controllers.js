const Exercise = require("../models/exercise.model.js");
const Log = require("../models/log.model.js");

exports.allExercises = (req, res) => {
  Exercise.allExercises((err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.addExercise = (req, res) => {
  if (!req.body) res.sendStatus(400);
  Exercise.addExercise(req.body, (err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
};

exports.deleteExercise = (req, res) => {
  Exercise.deleteExercise(req.params.exerciseId, (err, data) => {
    if (err) res.sendStatus(500);
    else if (data) res.sendStatus(200);
  });
};

exports.allLogs = (req, res) => {
  Log.allLogs((err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.getLogByDate = (req, res) => {
  Log.getLogByDate(
    req.params.logYear,
    req.params.logMonth,
    req.params.logDay,
    (err, data) => {
      if (err) res.sendStatus(500);
      else res.send(data);
    }
  );
};

exports.addLog = (req, res) => {
  if (!req.body) res.sendStatus(400);
  Log.addLog(req.body, (err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
};

exports.editLog = (req, res) => {
  if (!req.body) res.sendStatus(400);
  Log.editLog(req.params.logId, req.body, (err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(200);
  });
};

exports.deleteLog = (req, res) => {
  Log.deleteLog(req.params.logId, (err, data) => {
    if (err) res.sendstatus(500);
    else res.sendStatus(200);
  });
};
