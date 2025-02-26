const express = require('express');
require("dotenv").config();
const bodyParser = require("body-parser");
const database = require("./config/database");
const routeApiVer1 = require("./api/v1/routes/index.route");

const app = express();

// connect database
database.connect();

// parse application/json
app.use(bodyParser.json());

// connect route
routeApiVer1(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
