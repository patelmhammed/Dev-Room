const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");

app.use(cors());

app.use(
    bodyParser.json({
        limit: "50mb",
    })
)

app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        parameterLimit: 100000,
        extended: true,
    })
)

dotEnv.config({path: "./.env"});

const PORT = process.env.PORT || 5000;

// Mongo DB Configuration
mongoose.connect(process.env.MONGO_DB_URL)
.then((response) => {
    console.log(`DB Connected to ${response.connection.host}`);
})
.catch((error) => {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
})

// Router Configuration
app.use("/api/users",require("./router/userRouter"));
app.use("/api/profiles",require("./router/profileRouter"));
app.use("/api/posts",require("./router/postRouter"));

app.listen(PORT, () => {
    console.log(`Express Server is started at PORT : ${PORT} `);
})

