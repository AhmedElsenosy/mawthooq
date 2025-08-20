const Student = require('../models/student.model');
const logger = require('../utils/logger');

// @desc    Create new student application
// @route   POST /api/student-form
// @access  Public
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      country,
      field,
      specialization,
      academic_qualification,
      date_of_academic_qualification
    } = req.body;

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'A student application with this email already exists'
      });
    }

    // Create new student application
    const student = await Student.create({
      name,
      email,
      phone_number,
      country,
      field,
      specialization,
      academic_qualification,
      date_of_academic_qualification
    });

    logger.info(`New student application created: ${student.name} (${student.email})`);

    res.status(201).json({
      success: true,
      message: 'Student application submitted successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        country: student.country
      }
    });

  } catch (error) {
    logger.error(`Error creating student application: ${error.message}`);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Get all students with pagination
// @route   GET /api/student-form
// @access  Public
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get students with pagination
    const students = await Student.find()
      .select('-__v') // Exclude __v field
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: -1 }); // Sort by newest first
    
    // Get total count for pagination
    const total = await Student.countDocuments();
    
    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: students
    });
    
  } catch (error) {
    logger.error(`Error fetching students: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents
};
