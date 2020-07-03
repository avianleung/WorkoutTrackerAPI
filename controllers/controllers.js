const Exercise = require("../models/exercise.model.js");
const Log = require("../models/exercise.model.js")

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
  Exercise.deleteExercise((err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(200);
  });
};

exports.allLogs = (req, res) => {
  Log.allLogs((err, res) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.getLogByDate = (req, res) => {
  Log.getLogByDate((err, data) => {
    if (err) res.sendStatus(500);
    else res.send(data);
  });
};

exports.addLog = (req, res) => {
  if (!req.body) res.sendStatus(400);
  Log.addLog((err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
};

exports.editLog = (req, res) => {
  if (!req.body) res.sendStatus(400);
  Log.editLog((err, data) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(200);
  });
};

exports.deleteLog = (req, res) => {
  Log.deleteLog((err, data) => {
    if (err) res.sendstatus(500);
    else res.sendStatus(200);
  });
};
