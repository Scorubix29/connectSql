const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Vital for parsing JSON bodies

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdb'
});

// READ (List all)
app.get('/student', (req, res) => {
    const query = 'SELECT * FROM student';
    db.query(query, (err, data) => {
        if (err) return res.status(500).json(err);
        res.send(data);
    });
});

// CREATE
app.post('/student', (req, res) => {
    const query = "INSERT INTO student (`name`, `phone`, `email`) VALUES (?)";
    const values = [req.body.name, req.body.phone, req.body.email];
    db.query(query, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Student created successfully");
    });
});

// UPDATE
app.put('/student/:id', (req, res) => {
    const id = req.params.id;
    const query = "UPDATE student SET `name` = ?, `phone` = ?, `email` = ? WHERE id = ?";
    const values = [req.body.name, req.body.phone, req.body.email];
    db.query(query, [...values, id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Student updated successfully");
    });
});

// DELETE
app.delete('/student/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM student WHERE id = ?";
    db.query(query, [id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Student deleted successfully");
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});