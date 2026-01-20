const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

// a. Get all students
app.get('/students', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tbl_student");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// b. Get a single student
app.get('/students/:id', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tbl_student WHERE id = ?", [req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// c. Add a new student
app.post('/students', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    try {
        await db.query("INSERT INTO tbl_student (firstname, lastname, gender, age, course_id, department_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [firstname, lastname, gender, age, course_id, department_id, status]);
        res.json({ message: "Student added successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// d. Update student information
app.put('/students/:id', async (req, res) => {
    const { firstname, lastname, gender, age, course_id, department_id, status } = req.body;
    try {
        await db.query("UPDATE tbl_student SET firstname=?, lastname=?, gender=?, age=?, course_id=?, department_id=?, status=? WHERE id=?", 
        [firstname, lastname, gender, age, course_id, department_id, status, req.params.id]);
        res.json({ message: "Student updated successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// e. Update student status only
app.patch('/students/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        await db.query("UPDATE tbl_student SET status = ? WHERE id = ?", [status, req.params.id]);
        res.json({ message: "Status updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// f. Delete a student record
app.delete('/students/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM tbl_student WHERE id = ?", [req.params.id]);
        res.json({ message: "Student deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => console.log('Server running on port 3000'));