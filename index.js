require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Routes = require("./src/config/routes")
const User = require("./src/models/user")

const PORT = 3000
const app = express();
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    }),
    express.json()
);
Routes(app)

app.listen(3001, () => {
    console.log(`Server running on http:127.0.0.1:3000!`);
})