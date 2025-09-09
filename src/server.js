import express from 'express';
import dotenv from "dotenv";
import {initDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './routes/transactionRoutes.js';
import job from './config/cron.js'

dotenv.config();

const app = express();

if(process.env.NODE_ENV === "production") 
    job.start();

app.use(rateLimiter);
app.use(express.json()); //middleware to parse json body

const PORT = process.env.PORT || 5001;

app.get('/api/health', (req, res) => {
    res.status(200).json({status:"ok"});
})


app.use('/api/transactions', transactionRoutes);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("server started at", PORT);
    });
});