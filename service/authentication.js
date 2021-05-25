const express = require("express");
const {dbCreate, dbFindOne, dbUpdate} = require("./database.js");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const {SYSTEM_USERS} = 'system-users';

const router = express.Router();

router.post('/sign-in', (req, res) => {
    const {email, password} = req.body;
    const user = dbFindOne(SYSTEM_USERS, {email});
    if (user && passwordHash.verify(password, user.password)) {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
        return res.json({error: false, data: {...user, token: token}});
    }
    return res.json({error: 'Wrong password or invalid user'})
});

router.get('/sign-out', (req, res) => {
    const user = req.user;
    return res.json({error: false, data: 'Successfully signout'});
});


router.post('/change-password', (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const {email} = req.user;
    const user = dbFindOne(SYSTEM_USERS, {email});
    if (user && passwordHash.verify(oldPassword, user.password)) {
        dbUpdate(user.id_, {password: passwordHash.generate(newPassword)});
        return res.json({error: false, data: `${user.email} password successfully updated.`});
    }
    return res.json({error: 'Unable to update user password'})
});

router.post('/register', (req, res) => {
    const {email, password, name} = req.body;
    try {
        if (dbFindOne(SYSTEM_USERS, {email})) {
            return res.json({error: 'Email already registered'});
        }
    } catch (err) {
        // good we expect error due to no data
    }
    const user = dbCreate(SYSTEM_USERS, {email, password: passwordHash.generate(password), name});
    return res.json({error: false, data: {...user, password: ''}});
})

module.exports = router;