const Message = require('../models/Message');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  if (!receiverId || !content) {
    return next(new AppError('Please provide receiverId and content', 400));
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content
  });

  res.status(201).json({
    status: 'success',
    data: {
      message
    }
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { otherUserId } = req.params;
  const currentUserId = req.user.id;

  // Mark all incoming messages from this user to me as read
  await Message.updateMany(
    { sender: otherUserId, receiver: currentUserId, isRead: false },
    { isRead: true }
  );

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId }
    ]
  }).sort('createdAt');

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages
    }
  });
});

exports.getConversations = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;

  // Find all messages involving the current user
  const messages = await Message.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }]
  }).sort('-createdAt');

  // Extract unique user IDs that the current user has chatted with
  const userIds = new Set();
  messages.forEach(msg => {
    if (msg.sender.toString() !== currentUserId.toString()) {
      userIds.add(msg.sender.toString());
    }
    if (msg.receiver.toString() !== currentUserId.toString()) {
      userIds.add(msg.receiver.toString());
    }
  });

  // Fetch user details for those IDs
  const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name userType companyName');

  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;
  const count = await Message.countDocuments({ receiver: currentUserId, isRead: false });

  res.status(200).json({
    status: 'success',
    data: {
      count
    }
  });
});
