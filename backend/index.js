const express = require("express");
const app = express();
const mainrouter = require("./routes/index");
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.use('api/v1',mainrouter);



app.listen(3000);
