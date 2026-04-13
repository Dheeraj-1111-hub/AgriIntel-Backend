import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Auth Fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },

  // Profile Fields
  location: {
    type: String,
    default: 'Unknown'
  },
  preferredCrops: {
    type: [String],
    default: ['Rice', 'Wheat']
  },
  units: {
    type: String,
    enum: ['Celsius', 'Fahrenheit'],
    default: 'Celsius'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model('User', UserSchema);
