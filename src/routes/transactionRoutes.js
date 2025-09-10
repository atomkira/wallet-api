import express from 'express';
import { sql } from '../config/db.js';
import { createTransaction, getTransactionsByUserId,deleteTransaction,getTransactionSummary } from '../controller/transactionsController.js';


const router = express.Router();

// Define more specific routes BEFORE parameter catch-alls
router.get('/summary/:userId', getTransactionSummary);

router.get('/:userId', getTransactionsByUserId);

router.post('/', createTransaction) 

   

router.delete('/:id', deleteTransaction)

export default router;