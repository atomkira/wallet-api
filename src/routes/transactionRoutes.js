import express from 'express';
import { sql } from '../config/db.js';
import { createTransaction, getTransactionsByUserId,deleteTransaction,getTransactionSummary } from '../controller/transactionsController.js';


const router = express.Router();


router.get('/:userId',getTransactionsByUserId )

router.post('/', createTransaction) 

   

router.delete('/:id', deleteTransaction)


router.get('/summary/:userId',getTransactionSummary) 

export default router;