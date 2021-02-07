import express from "express";
import morgan from "morgan";
import dbRouter from "./service/database.js";
import authenticationRouter from "./service/authentication.js";
import log from "./service/logger.js";

const app = express();
const PORT = 4000;

/*
----------- SETTING UP THE EXPRESS SERVER --------
 */
app.use(morgan("dev"));

const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
}
app.use(cors);
app.use(express.json());
app.use('/db', dbRouter);
app.use('/authentication', authenticationRouter);

app.use((req, res) => res.json({success: false, message: 'Resource not found'}));
app.use((err, req, res, next) => res.json({success: false, message: err.message}));
app.listen(PORT, () => log('Server running at port ', PORT));
