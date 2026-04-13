import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  // User Reference (Important for data isolation)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },
  cropType: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  soilType: {
    type: String,
    required: true
  },

  // Disease Detection
  disease: {
    type: String,
    default: null
  },
  confidence: {
    type: Number,
    default: 0
  },

  // Weather Data
  temperature: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  weatherCondition: {
    type: String,
    default: null
  },

  // Risk & Yield
  risk: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  yield: {
    type: String,
    default: 'Medium'
  },

  // Suggestions
  suggestions: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Scan = mongoose.model('Scan', ScanSchema);
