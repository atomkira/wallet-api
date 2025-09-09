import express from 'express';
import dotenv from "dotenv";
import {initDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './routes/transactionRoutes.js';
dotenv.config();

const app = express();

app.use(rateLimiter);
app.use(express.json()); //middleware to parse json body

const PORT = process.env.PORT || 5001;




app.use('/api/transactions', transactionRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server started at", PORT);
    });
});