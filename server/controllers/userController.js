const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name', 'phone', 'address', 'companyName', 'pricePerSqFt', 'role', 'userType'];
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // Securely synchronize role and userType
  if (filteredBody.role) {
    filteredBody.userType = filteredBody.role === 'contractor' ? 'service_provider' : 'customer';
  } else if (filteredBody.userType) {
    filteredBody.role = filteredBody.userType === 'service_provider' ? 'contractor' : 'user';
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.userType) filter.userType = req.query.userType;

  const users = await User.find(filter);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
