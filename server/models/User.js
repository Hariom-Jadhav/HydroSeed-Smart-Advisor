const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['user', 'contractor', 'admin'],
    default: 'user',
  },
  userType: {
    type: String,
    enum: ['customer', 'service_provider'],
    default: 'customer',
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  companyName: {
    type: String,
  },
  pricePerSqFt: {
    type: Number,
  },
  bio: {
    type: String,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above 0.0'],
    max: [5, 'Rating must be below 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
