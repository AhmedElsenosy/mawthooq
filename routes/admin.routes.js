const express = require('express');
const { getAllStudents, getStudentById, deleteStudentById } = require('../controllers/student.controller');

const router = express.Router();

// GET /api/admin-dashboard - Get all students with pagination
router.get('/', getAllStudents);

// GET /api/admin-dashboard/:id - Get student by ID
router.get('/:id', getStudentById);

// DELETE /api/admin-dashboard/:id - Delete student by ID
router.delete('/:id', deleteStudentById);

module.exports = router;
