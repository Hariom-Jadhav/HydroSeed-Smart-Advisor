const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Message = require('../models/Message');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Create a new feedback / review for a contractor
exports.createFeedback = catchAsync(async (req, res, next) => {
  const { contractorId, rating, comment } = req.body;

  // 1) Validate input fields
  if (!contractorId || !rating || !comment) {
    return next(new AppError('Please provide contractorId, rating, and comment.', 400));
  }

  // 2) Verify sender is a customer
  if (req.user.role === 'contractor') {
    return next(new AppError('Contractors cannot submit feedback.', 403));
  }

  // 3) Verify receiver is a contractor
  const contractor = await User.findById(contractorId);
  if (!contractor || contractor.role !== 'contractor') {
    return next(new AppError('Target user is not a registered contractor.', 404));
  }

  // 4) Check if feedback already exists (pre-save unique index will also catch it, but good to check)
  const existingFeedback = await Feedback.findOne({
    customer: req.user.id,
    contractor: contractorId
  });

  if (existingFeedback) {
    return next(new AppError('You have already submitted feedback for this contractor.', 400));
  }

  // 4.5) Verify they have connected (chatted) before leaving feedback
  const chatConnection = await Message.findOne({
    $or: [
      { sender: req.user.id, receiver: contractorId },
      { sender: contractorId, receiver: req.user.id }
    ]
  });

  if (!chatConnection) {
    return next(new AppError('You must connect with the contractor via messages before leaving feedback.', 400));
  }

  // 5) Create feedback
  const feedback = await Feedback.create({
    customer: req.user.id,
    contractor: contractorId,
    rating,
    comment
  });

  // 6) Send automated notification chat message from the customer to the contractor
  try {
    await Message.create({
      sender: req.user.id,
      receiver: contractorId,
      content: `⭐️ [System Notice: Review Submitted] I have rated your service ${rating}/5 stars.\nFeedback: "${comment}"`
    });
  } catch (err) {
    console.error('Failed to create automated chat notification message:', err);
  }

  res.status(201).json({
    status: 'success',
    data: {
      feedback
    }
  });
});

// Retrieve all feedbacks left for a specific contractor
exports.getContractorFeedbacks = catchAsync(async (req, res, next) => {
  const feedbacks = await Feedback.find({ contractor: req.params.contractorId })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: feedbacks.length,
    data: {
      feedbacks
    }
  });
});
