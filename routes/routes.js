module.exports = app => {
    const controller = require("../controllers/controllers.js");

    app.get("/exercises/all", controller.allExercises)

    app.post("/exercises/add", controller.addExercise)

    app.delete("/exercises/:exerciseId", controller.deleteExercise)

    app.get("/log/all", controller.allLogs)

    app.get("/log/:logYear/:logMonth/:logDay", controller.getLogByDate)

    app.post("/log/add", controller.addLog)

    app.put("/log/edit/:logId", controller.editLog)

    app.delete("/log/delete/:logId", controller.deleteLog)
}