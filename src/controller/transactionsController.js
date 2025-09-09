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

export async function deleteTransaction(req,res) {
    try{
        const {id}=req.params;
        const result=await sql`DELETE FROM transactions WHERE user_id=${id} RETURNING *`;
        if(result.length===0){
            return res.status(404).json({message: "Transaction not found"});
        }
        res.status(200).json({message: "Transaction deleted successfully"});
    }
    catch(error){
        console.log("error deleting transaction", error);
        res.status(500).json({message: "Internal server error"});
    }   
}

export async function getTransactionSummary(req,res) {

    try{
const {userId}=req.params;
const balanceResult=await sql`
SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id=${userId}`

const incomeResult=await sql`
SELECT COALESCE(SUM(amount),0)as income FROM transactions where user_id=${userId} AND amount>0`

const expenseResult=await sql`
SELECT COALESCE(SUM(amount),0)as expenses FROM transactions where user_id=${userId} AND amount<0`

res.status(200).json({
    balance: balanceResult[0].balance,
    income: incomeResult[0].income,
    expenses: expenseResult[0].expenses
});
    }
catch(error){
    console.log("error fetching summary", error);
    res.status(500).json({message: "Internal server error"});
}
}