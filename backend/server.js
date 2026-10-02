const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Allowed expense categories
const ALLOWED_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// Validate ID from URL parameters
function isValidId(id) {
    if (!id || typeof id !== 'string') return false;
    const trimmed = id.trim();
    if (!/^\d+$/.test(trimmed)) return false;
    const num = Number(trimmed);
    return Number.isInteger(num) && num > 0;
}


// Validate expense payload for POST and PUT requests
function validateExpenseData(body) {
    if (!body || typeof body !== 'object') {
        return 'Request body must be a valid JSON object.';
    }

    const { title, amount, category, date } = body;

    // Check required fields
    if (title === undefined || amount === undefined || category === undefined || date === undefined) {
        return 'All fields (title, amount, category, date) are required.';
    }

    // Validate title
    if (typeof title !== 'string' || title.trim() === '') {
        return 'Title must be a non-empty string.';
    }
    if (title.trim().length > 100) {
        return 'Title must not exceed 100 characters.';
    }

    // Validate amount
    if (amount === null || typeof amount === 'boolean' || Array.isArray(amount)) {
        return 'Amount must be a number greater than 0.';
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || !isFinite(numAmount) || numAmount <= 0) {
        return 'Amount must be a number greater than 0.';
    }

    // Validate category
    if (typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category.trim())) {
        return `Category must be one of the following: ${ALLOWED_CATEGORIES.join(', ')}.`;
    }

    // Validate date format (YYYY-MM-DD)
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
        return 'Date must be in YYYY-MM-DD format.';
    }
    const parsedDate = new Date(date.trim());
    if (isNaN(parsedDate.getTime())) {
        return 'Date must be a valid calendar date.';
    }

    return null;
}

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Expense Tracker API!' });
});

// GET /api/expenses - Retrieve all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const queryText = `
            SELECT id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') AS date 
            FROM expenses 
            ORDER BY id ASC
        `;
        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ message: 'Failed to retrieve expenses' });
    }
});

// GET /api/expenses/:id - Retrieve an expense by ID
app.get('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    try {
        const queryText = `
            SELECT id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') AS date 
            FROM expenses 
            WHERE id = $1
        `;
        const result = await pool.query(queryText, [Number(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching expense by id:', err);
        res.status(500).json({ message: 'Failed to retrieve expense' });
    }
});

// POST /api/expenses - Add a new expense
app.post('/api/expenses', async (req, res) => {
    const validationError = validateExpenseData(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const { title, amount, category, date } = req.body;
    const cleanTitle = title.trim();
    const cleanCategory = category.trim();
    const cleanDate = date.trim();
    const numAmount = Number(amount);

    try {
        const queryText = `
            INSERT INTO expenses (title, amount, category, date) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') AS date
        `;
        const result = await pool.query(queryText, [cleanTitle, numAmount, cleanCategory, cleanDate]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).json({ message: 'Failed to add expense' });
    }
});

// PUT /api/expenses/:id - Update an existing expense
app.put('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    const validationError = validateExpenseData(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const { title, amount, category, date } = req.body;
    const cleanTitle = title.trim();
    const cleanCategory = category.trim();
    const cleanDate = date.trim();
    const numAmount = Number(amount);

    try {
        const queryText = `
            UPDATE expenses 
            SET title = $1, amount = $2, category = $3, date = $4 
            WHERE id = $5 
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') AS date
        `;
        const result = await pool.query(queryText, [cleanTitle, numAmount, cleanCategory, cleanDate, Number(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ message: 'Failed to update expense' });
    }
});

// DELETE /api/expenses/:id - Delete an expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    try {
        const queryText = `
            DELETE FROM expenses 
            WHERE id = $1 
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') AS date
        `;
        const result = await pool.query(queryText, [Number(id)]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({ 
            message: 'Expense deleted successfully', 
            deletedExpense: result.rows[0] 
        });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ message: 'Failed to delete expense' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
