const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

/* app.use(express.static(path.join(__dirname, 'client/build'))); */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
}); */

require("./routes/routes.js")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});