import express from "express";
import {dbFind} from "./database.js";

const router = express.Router();

router.post('/sign-in', (req, res) => {
    const {email, password} = req.body;
    const users = dbFind('users', {email});
    if (users.length > 0 && users[0].password === password) {
        return res.json({error: false, data: users[0]});
    }
    return res.json({error: 'Wrong password or invalid user'})
});

export default router;