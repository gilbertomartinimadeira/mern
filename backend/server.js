import express from 'express';
import dotnev from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';

dotnev.config(); //reads .env file and adds the keys into process.env so we can retrieve its values)

const app = express();
app.use(express.json());


app.use("/api/products", productRoutes);

const port = 5000;

app.listen(port, () => {
    connectDB();
    console.log(`App running on http://localhost:${port} hello`)
});