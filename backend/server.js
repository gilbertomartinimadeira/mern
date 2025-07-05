import express from 'express';
import dotnev from 'dotenv';
import { connectDB } from './config/db.js';

dotnev.config(); //reads .env file and adds the keys into process.env so we can retrieve its values)

const app = express();

app.get("/products", (req, res) => {
    res.send("Server is ready! 123");
})

console.log(process.env.MONGO_URI);

const port = 5000;

app.listen(port, () => {
    connectDB();
    console.log(`App running on http://localhost:${port} hello`)
});