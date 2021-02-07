import express from "express";
import {dbCreate, dbFindOne} from "./database.js";
import passwordHash from "password-hash";

const router = express.Router();

router.post('/sign-in', (req, res) => {
    const {email, password} = req.body;
    const user = dbFindOne('users', {email});
    if (user && passwordHash.verify(password, user.password)) {
        return res.json({error: false, data: user});
    }
    return res.json({error: 'Wrong password or invalid user'})
});

router.post('/register', (req, res) => {
    const {email, password, name} = req.body;
    try {
        if (dbFindOne('users', {email})) {
            return res.json({error: 'Email already registered'});
        }
    } catch (err) {
        // good we expect error due to no data
    }
    const user = dbCreate('users', {email, password: passwordHash.generate(password), name});
    return res.json({error: false, user: {...user, password: ''}});
})

export default router;