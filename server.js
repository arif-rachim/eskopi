const express = require("express");
const morgan = require("morgan");
const {router: dbRouter} = require("./service/database.js");
const authenticationRouter = require("./service/authentication.js");
const log = require("./service/logger.js");
const dotenv = require("dotenv");

const app = express();
const PORT = 4000;


/*
----------- SETTING UP THE EXPRESS SERVER --------
 */
app.use(morgan("dev"));
app.set('etag', false);
dotenv.config();

const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Cache-Control", "no-store");
    next();
}

const publicUrl = ['/authentication/sign-in', '/authentication/register'];
const token = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (publicUrl.indexOf(req.url) >= 0) {
        return next();
    }
    return next();
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]
    // if (token == null) {
    //     throw new Error('Sorry you dont have valid token, please sign in to the app first');
    // }
    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //     if (err) {
    //         throw err;
    //     }
    //     req.user = user;
    //     next();
    // })
}

app.use(cors);
app.use(express.json());
app.use(token);
app.use('/db', dbRouter);
app.use('/authentication', authenticationRouter);

app.use((req, res) => res.json({error: 'Resource not found'}));
app.use((err, req, res, next) => res.json({error: err.message}));
app.listen(PORT, () => log('Server running at port ', PORT));
