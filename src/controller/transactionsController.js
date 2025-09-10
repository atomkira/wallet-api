import { sql } from '../config/db.js';


export async function getTransactionsByUserId(req,res) {
    try{
        const {userId}=req.params;
        const transactions=await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;
        res.status(200).json(transactions);
    }
    catch(error){
        console.log("error fetching transactions", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function createTransaction(req,res) {

 try{
        const {user_id, amount, title, category} = req.body;

        if(!title || amount===undefined || !category || !user_id){
            return res.status(400).json({message: "All fields are required"});
        }
        const transaction=await sql`INSERT INTO transactions (user_id,amount,title,category) VALUES (${user_id}, ${amount}, ${title}, ${category})
        RETURNING *`;
        console.log("transaction created", transaction);
        res.status(201).json(transaction[0]);
    }
      
    catch(error){
console.log("error creating transaction", error);
res.status(500).json({message: "Internal server error"});
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Transaction ID is required" });
        }

        console.log("[DELETE] /api/transactions/:id ->", { id });
        const result = await sql`
            DELETE FROM transactions 
            WHERE id = ${id}
            RETURNING *
        `;

        console.log("[DELETE] result length:", result.length);
        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ 
            success: true,
            message: "Transaction deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete transaction" 
        });
    }
}

export async function getTransactionSummary(req, res) {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Get balance (sum of all transactions)
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount)::float, 0) AS balance 
            FROM transactions 
            WHERE user_id = ${userId}`;

        // Get total income (positive amounts)
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount)::float, 0) AS income 
            FROM transactions 
            WHERE user_id = ${userId} AND amount > 0`;

        // Get total expenses (negative amounts, convert to positive)
        const expenseResult = await sql`
            SELECT COALESCE(ABS(SUM(amount)::float), 0) AS expenses 
            FROM transactions 
            WHERE user_id = ${userId} AND amount < 0`;

        // Ensure we have valid numbers
        const response = {
            balance: parseFloat(balanceResult[0]?.balance || 0),
            income: parseFloat(incomeResult[0]?.income || 0),
            expenses: parseFloat(expenseResult[0]?.expenses || 0)
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getTransactionSummary:", error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch transaction summary',
            error: error.message 
        });
    }
}