const express = require("express");
const path = require("path");
const app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
// Start the server
const router = express.Router();
const port = process.env.PORT || 8082;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
app.use(xss());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/usuarios", require("./usuarios/api"));
app.use("/products", require("./products/api"));
//add the router
app.use("/", router);
module.exports = app;
