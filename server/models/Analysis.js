const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  drainage: {
    type: String,
  },
  moisture: {
    type: String,
  },
  phLevel: {
    type: String,
  },
  organicMatter: {
    type: String,
  },
  compaction: {
    type: String,
  },
  erosionRisk: {
    type: String,
  },
  slopeAngle: {
    type: String,
  },
  recommendation: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;
