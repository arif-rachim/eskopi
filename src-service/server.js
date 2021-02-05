import express from "express";
import morgan from "morgan";
import routes from "./routes/database.js";

const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));
app.use(routes);
app.get('/error', () => {
    throw new Error('Yikes something went wrong');
});
app.use((req, res) => {
    res.json({success:false,message:'Resource not found'});
});
app.use((err, req, res, next) => {
    console.error(err);
    res.json({success:false,message:err.message});
});
app.listen(PORT, () => {
    console.log('Server running at port ', PORT);
});