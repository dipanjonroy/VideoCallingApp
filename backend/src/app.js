require("dotenv").config();

const express = require("express");
const connectToDB = require("./db/dbConfig");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToSocket = require("./controllers/socketManager");

const userRoutes = require("./routes/userRoutes");
const ExpressError = require("./utilities/ExpressError");

//DB connection
connectToDB();

const app = express();
app.set("port", (process.env.PORT || 3000))

const server = createServer(app);
const io = connectToSocket(server);


app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

//Routers
app.use("/api/users", userRoutes);

//Error handeling
app.use("*", (req, res, next) => {
  next(new ExpressError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Internal server error" } = err;
  res.status(status).json({ success: false, message });
});

server.listen(app.get("port"), () => {
  console.log("App is running")
});
