import mongoose from "mongoose";
import bluebird from "bluebird";
/**
 * connect to Mongodb
 */

let connectDB = () => {
    mongoose.Promise = bluebird;

    let DB_CONNECTION = "mongodb";
    let DB_HOST = "localhost";
    let DB_PORT = 27017;
    let DB_NAME = "H-Chat";
    let DB_USERNAME = "";
    let DB_PASSWORD = "";
    //mongodb://localhost:27017/H-Chat
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    return mongoose.connect(URI, { useMongoClient: true });
};
module.exports = connectDB;
