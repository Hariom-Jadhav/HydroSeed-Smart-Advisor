const Analysis = require('../models/Analysis');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.saveAnalysis = catchAsync(async (req, res, next) => {
  const {
    imageUrl,
    score,
    soilType,
    drainage,
    moisture,
    phLevel,
    organicMatter,
    compaction,
    erosionRisk,
    slopeAngle,
    recommendation
  } = req.body;

  if (!imageUrl || !score || !soilType) {
    return next(new AppError('Please provide imageUrl, score, and soilType', 400));
  }

  const newAnalysis = await Analysis.create({
    user: req.user.id,
    imageUrl,
    score,
    soilType,
    drainage,
    moisture,
    phLevel,
    organicMatter,
    compaction,
    erosionRisk,
    slopeAngle,
    recommendation
  });

  res.status(201).json({
    status: 'success',
    data: {
      analysis: newAnalysis
    }
  });
});

exports.getAnalyses = catchAsync(async (req, res, next) => {
  const analyses = await Analysis.find({ user: req.user.id }).sort('-date');

  res.status(200).json({
    status: 'success',
    results: analyses.length,
    data: {
      analyses
    }
  });
});
