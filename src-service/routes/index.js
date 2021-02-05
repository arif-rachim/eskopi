import express from "express";
import * as users from "./users.js";

const router = express.Router();

router.get("/users", users.list);
router.get("/users/:id", users.read);
router.post("/users", users.create);
router.post("/users/:id", users.update);
router.delete("/users/:id", users.remove);

router.get('/', (req, res) => {
    res.send('Hello routes');
});

export default router;