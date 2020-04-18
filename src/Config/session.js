import session from "express-session";
import connectMongo from "connect-mongo";
let MongoStore = connectMongo(session);
/**
 * this validable is where session, in this case is mongodb
 */
require("dotenv").config();
let sessionStore = new MongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect: true,
    // autoRemove:"native" // khi mà session hết hạn nó sẽ tự động xóa thằng này trong database, tránh việc lưu quá nhiều
});
/**
 * config session for app
 */
let config = (app) => {
    app.use(
        session({
            key: "express.session",
            secret: "mySecret",
            resave: true,
            store: sessionStore,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24, // thời gian tối đa 1 ngày
            },
        })
    );
};
module.exports = {
    config: config,
    sessionStore: sessionStore,
};
