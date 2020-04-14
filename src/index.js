import express from "express";
import ConnectDB from "./Config/connectDB";
import configViewEngine from "./Config/viewEngine";
import initRouter from "./router/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import sesion from "./Config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./Config/socket.io";
// Init app
const app = express();
//Init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server);
//Connect to Mongodb

ConnectDB();
//Config Session
sesion.config(app);
//Config view engine
configViewEngine(app);
//Enable post data for request
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
//Enable flash message
app.use(connectFlash());
//User Cookieparser
app.use(cookieParser());
//Confid passportjs
app.use(passport.initialize()); //khởi tạo pasport
app.use(passport.session()); // gọi sesion
//Init all routes
initRouter(app);
//Config for socket.io
configSocketIo(io, cookieParser, sesion.sessionStore);
//Init all socket
initSockets(io);
//Config port
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log("Hello world");
});
