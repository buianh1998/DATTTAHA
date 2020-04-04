import session from "express-session";
import connectMongo from "connect-mongo";
let MongoStore = connectMongo(session);
/**
 * this validable is where session, in this case is mongodb
 */
let DB_CONNECTION = "mongodb";
let DB_HOST = "localhost";
let DB_PORT = 27017;
let DB_NAME = "H-Chat";
let DB_USERNAME = "";
let DB_PASSWORD = "";
let sessionStore = new MongoStore({
    url: `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    autoReconnect: true
    // autoRemove:"native" // khi mà session hết hạn nó sẽ tự động xóa thằng này trong database, tránh việc lưu quá nhiều
});
/**
 * config session for app
 */
let config = app => {
    app.use(
        session({
            key: "express.session",
            secret: "mySecret",
            resave: true,
            store: sessionStore,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 // thời gian tối đa 1 ngày
            }
        })
    );
};
module.exports = {
    config: config,
    sessionStore: sessionStore
};
