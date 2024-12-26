const express = require('express');
const router = express.Router();
const db = require('../db'); 
const multer = require('multer');
const upload = multer();

router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results);
        }
    });
});

router.get('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT id,name,email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching user');
        } else if (results.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.json(results[0]);
        }
    });
});

const bcrypt = require('bcrypt');

router.post('/', upload.none(), async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('Name, email, password, and confirmPassword are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format');
    }

    if (password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters long');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Password and confirm password do not match');
    }

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database query error');
            }
    
            if (results.length > 0) {
                return res.status(400).send('Email is already in use');
            }
    
            const hashedPassword = bcrypt.hashSync(password, 10);
            db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error adding user');
                    }
                    res.status(201).json({ id: result.insertId, name, email });
                }
            );
        });
    } catch (err) {
        res.status(500).send('Error hashing password');
    }
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting user');
        } else if (result.affectedRows === 0) {
            res.status(404).send('User not found');
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

module.exports = router;