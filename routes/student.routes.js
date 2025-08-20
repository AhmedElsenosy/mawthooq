const express = require('express');
const { createStudent, getAllStudents } = require('../controllers/student.controller');

const router = express.Router();

// POST /api/student-form - Create new student application
router.post('/', createStudent);

// GET /api/student-form - Get all students with pagination
router.get('/', getAllStudents);

module.exports = router;
