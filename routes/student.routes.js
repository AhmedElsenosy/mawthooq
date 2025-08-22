const express = require('express');
const { createStudent } = require('../controllers/student.controller');

const router = express.Router();

// POST /api/student-form - Create new student application
router.post('/', createStudent);

module.exports = router;
