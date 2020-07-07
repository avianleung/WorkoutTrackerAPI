const sql = require("./db.js");

const Log = {};

Log.allLogs = (result) => {
  sql.query(`SELECT date FROM log GROUP BY date`, (err, res) => {
    if (err) result(err, null);
    else if (res) {
      organizedArray = res.map(() => []);
      dateArray = res.map((object) => object.date);
      sql.query(`SELECT id, date, exercise FROM log`, (err, res) => {
        if (err) result(err, null);
        else if (res) {
          for (let index = 0; index < res.length; index++) {
            var organizedArrIndex = dateArray.indexOf(res[index].date);
            res[index]["sets"] = [];
            organizedArray[organizedArrIndex].push(res[index]);
          }
          sql.query(
            `SELECT log.id, log.date, log.exercise, rw_log.reps, rw_log.weight FROM log JOIN rw_log WHERE log.id=rw_log.log_id`,
            (err, res) => {
              if (err) result(err, null);
              else if (res) {
                for (let index = 0; index < res.length; index++) {
                  var dateIndex = dateArray.indexOf(res[index].date);
                  for (
                    let index2 = 0;
                    index2 < organizedArray[dateIndex].length;
                    index2++
                  ) {
                    if (
                      organizedArray[dateIndex][index2].exercise === res[index].exercise
                    ) {
                      organizedArray[dateIndex][index2].sets.push({
                        reps: res[index].reps,
                        weight: res[index].weight,
                      });
                    }
                  }
                }
              }
              result(null, organizedArray);
            }
          );
        }
      });
    }
  });
};

Log.getLogByDate = (year, month, day, result) => {
  var queryString;
  var queryArray;
  if (year != "null" && month != "null" && day != "null") {
    queryString = `SELECT date FROM log WHERE year=? AND month=? AND day=? GROUP BY date`;
    queryArray = [year, month, day];
  } else if (year != "null" && month != "null") {
    queryString = `SELECT date FROM log WHERE year=? AND month=? AND day=day GROUP BY date`;
    queryArray = [year, month];
  } else if (year != "null") {
    queryString = `SELECT date FROM log WHERE year=? AND month=month AND day=day GROUP BY date`;
    queryArray = [year];
  }

  var queryString2;
  if (year != "null" && month != "null" && day != "null") {
    queryString2 = `SELECT id, date, exercise FROM log WHERE year=? AND month=? AND day=?`;
    queryArray = [year, month, day];
  } else if (year != "null" && month != "null") {
    queryString2 = `SELECT id, date, exercise FROM log WHERE year=? AND month=? AND day=day`;
    queryArray = [year, month];
  } else if (year != "null") {
    queryString2 = `SELECT id, date, exercise FROM log WHERE year=? AND month=month AND day=day`;
    queryArray = [year];
  }

  var queryString3;
  if (year != "null" && month != "null" && day != "null") {
    queryString3 = `AND log.year=? AND log.month=? AND log.day=?`;
    queryArray = [year, month, day];
  } else if (year != "null" && month != "null") {
    queryString3 = `AND year=? AND month=? AND day=day`;
    queryArray = [year, month];
  } else if (year != "null") {
    queryString3 = `AND year=? AND month=month AND day=day`;
    queryArray = [year];
  }

  sql.query(queryString, queryArray, (err, res) => {
    if (err) result(err, null);
    else if (res.length) {
      organizedArray = res.map(() => []);
      dateArray = res.map((object) => object.date);
      sql.query(queryString2, queryArray, (err, res) => {
        if (err) result(err, null);
        else if (res) {
          for (let index = 0; index < res.length; index++) {
            var organizedArrIndex = dateArray.indexOf(res[index].date);
            res[index]["sets"] = [];
            organizedArray[organizedArrIndex].push(res[index]);
          }
          sql.query(
            `SELECT log.id, log.date, log.exercise, rw_log.id AS rw_log_id, rw_log.reps, rw_log.weight FROM log JOIN rw_log WHERE log.id=rw_log.log_id ` +
              queryString3,
            queryArray,
            (err, res) => {
              if (err) result(err, null);
              else if (res) {
                for (let index = 0; index < res.length; index++) {
                  var dateIndex = dateArray.indexOf(res[index].date);
                  for (
                    let index2 = 0;
                    index2 < organizedArray[dateIndex].length;
                    index2++
                  ) {
                    if (
                      organizedArray[dateIndex][index2].exercise === res[index].exercise
                    ) {
                      organizedArray[dateIndex][index2].sets.push({
                        id: res[index].rw_log_id,
                        reps: res[index].reps,
                        weight: res[index].weight,
                      });
                    }
                  }
                }
                result(null, organizedArray);
              }
            }
          );
        }
      });
    }
  });
};

Log.addLog = (data, result) => {
  var ymd = data.date.split("/");
  const year = ymd[0];
  const month = ymd[1];
  const day = ymd[2];
  sql.getConnection(function (err, conn) {
    conn.beginTransaction(function (err) {
      if (err) {
        throw err;
      } else {
        conn.query(
          `INSERT INTO log VALUES(NULL, ?, ?, ?, ?, ?)`,
          [data.date, year, month, day, data.exercise],
          (err, res) => {
            if (err) {
              return conn.rollback(function () {
                throw err;
              });
            } else {
              const log_id = res.insertId;
              for (let index = 0; index < data.sets.length; index++) {
                conn.query(
                  `INSERT INTO rw_log VALUES(null, ?, ?, ?)`,
                  [log_id, data.sets[index].reps, data.sets[index].weight],
                  (err, res) => {
                    if (err) {
                      return conn.rollback(function () {
                        throw err;
                      });
                    }
                    conn.commit(function (err) {
                      if (err) {
                        return conn.rollback(function () {
                          throw err;
                        });
                      }
                      if (index === data.sets.length - 1) result(null, res);
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

Log.editLog = (id, data, result) => {
  var ymd = data.date.split("/");
  const year = ymd[0];
  const month = ymd[1];
  const day = ymd[2];
  sql.getConnection(function (err, conn) {
    conn.beginTransaction(function (err) {
      if (err) {
        throw err;
      } else {
        conn.query(
          `UPDATE log SET date=?, year=?, month=?, day=?, exercise=? WHERE id=?`,
          [data.date, year, month, day, data.exercise, id],
          (err, res) => {
            if (err) {
              return conn.rollback(function () {
                throw err;
              });
            } else {
              for (let index = 0; index < data.sets.length; index++) {
                conn.query(
                  `UPDATE rw_log SET reps=?, weight=? WHERE id=?`,
                  [data.sets[index].reps, data.sets[index].weight, data.sets[index].id],
                  (err, res) => {
                    if (err) {
                      return conn.rollback(function () {
                        throw err;
                      });
                    }
                    conn.commit(function (err) {
                      if (err) {
                        return conn.rollback(function () {
                          throw err;
                        });
                      }
                      if (index === data.sets.length - 1) result(null, res);
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

Log.deleteLog = (id, result) => {
  sql.getConnection(function (err, conn) {
    conn.beginTransaction(function (err) {
      if (err) {
        throw err;
      } else {
        conn.query(`DELETE FROM log WHERE id=?`, id, (err, res) => {
          if (err) {
            return conn.rollback(function () {
              throw err;
            });
          } else {
            conn.query(`DELETE FROM rw_log WHERE log_id=?`, id, (err, res) => {
              if (err) {
                return conn.rollback(function () {
                  throw err;
                });
              }
              conn.commit(function (err) {
                if (err) {
                  return conn.rollback(function () {
                    throw err;
                  });
                }
                result(null, res);
              });
            });
          }
        });
      }
    });
  });
};

module.exports = Log;
