const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Allow various international phone number formats
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  
  // Country Selection
  country: {
    type: String,
    required: [true, 'Country selection is required'],
    enum: {
      values: [
        'China',
        'India', 
        'Malaysia',
        'Philippines',
        'Russia',
        'Georgia',
        'Ukraine',
        'Indonesia',
        'Rwanda',
        'Turkey',
        'Egypt'
      ],
      message: '{VALUE} is not a valid country option'
    }
  },
  
  // Academic Information
  field: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true,
    maxlength: [100, 'Field cannot exceed 100 characters']
  },
  
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  },
  
  academic_qualification: {
    type: String,
    required: [true, 'Academic qualification is required'],
    trim: true,
    maxlength: [100, 'Academic qualification cannot exceed 100 characters']
  },
  
  date_of_academic_qualification: {
    type: Date,
    required: [true, 'Date of academic qualification is required'],
    validate: {
      validator: function(v) {
        // Date should not be in the future
        return v <= new Date();
      },
      message: 'Date of academic qualification cannot be in the future'
    }
  },
  
  
});

// Indexes for better query performance
studentSchema.index({ email: 1 });
studentSchema.index({ country: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
