const sql = require("./db.js");
const connection = require("./db.js");

const Exercise = {};

Exercise.allExercises = (result) => {
  sql.query(
    `SELECT muscle_groups.id, exercises_id, exercises.exercise, muscle_group 
        FROM exercises
    INNER JOIN muscle_groups 
        ON muscle_groups.exercise_id = exercises.id`,
    (err, res) => {
      if (err) result(err, null);
      if (res.length) result(null, res);
    }
  );
};

Exercise.addExercise = (data, result) => {
  sql.getConnection(function (err, conn) {
    conn.beginTransaction(function (err) {
      if (err) {
        throw err;
      } else {
        conn.query(
          `INSERT INTO exercises VALUES(NULL, ?, ?)`,
          [data.exercise, 0],
          (err, res) => {
            if (err) {
              return conn.rollback(function () {
                throw err;
              });
            } else {
              const exer_id = res.insertId;
              for (let index = 0; index < data.groups.length; index++) {
                conn.query(
                  `INSERT INTO muscle_groups VALUES(null, ?, ?)`,
                  [exer_id, data.groups[index]],
                  (err, res) => {
                    if (err) {
                      return conn.rollback(function () {
                        throw error;
                      });
                    }
                    conn.commit(function (err) {
                      if (err) {
                        return connection.rollback(function () {
                          throw err;
                        });
                      }
                      result(null, res)
                    });
                  }
                );
              }
            }
          }
        );
      }
    });
  });
};

module.exports = Exercise;
