const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();

const imageRoutes = require("./routes/image");
const adminRoutes = require('./routes/admin');
const carCategoryRoutes = require("./routes/carCategory");
const carRoutes = require("./routes/car");
const driverRoutes = require('./routes/driver');
const locationRoutes = require('./routes/location');

// app
const app = express();

// db

mongoose.connect(process.env.NODE_MONGODB_DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> {
    console.log('DATABASE connected');
    // autoIncrement.initialize(conn.connection);
    // console.log(conn.connection);
})
.catch((err)=> console.log("Error Connecting DATABASE",err));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use("/api",imageRoutes);
app.use("/api",adminRoutes);
app.use("/api",carCategoryRoutes);
app.use("/api",carRoutes);
app.use("/api", driverRoutes);
app.use("/api",locationRoutes);



const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Yatri-Cabs Server Running on ${port} - ${process.env.NODE_ENV}`);
})

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3001",
        credentials: true
    }
});

io.use(async(socket, next) => {
    try {
        const id = socket.handshake.query.id;
        socket.userId = id;
        next();
    } catch (err) {
        console.log("SOCKET: ",err);
    }
})

io.on("connection", (socket) => {
    socket.join(socket.userId);
    console.log("Connected: " + socket.userId);
  
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });


});