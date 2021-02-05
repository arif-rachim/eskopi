import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.get('/error', () => {
    throw new Error('Yikes something went wrong');
});
app.use((req, res) => {
    res.status(404).send('Not Found');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});
app.listen(PORT, () => {
    console.log('Server running at port ', PORT);
});