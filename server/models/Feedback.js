const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Feedback must belong to a customer']
  },
  contractor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Feedback must target a contractor']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a feedback comment']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure a customer can only review a contractor once
feedbackSchema.index({ customer: 1, contractor: 1 }, { unique: true });

// Static method to calculate average ratings
feedbackSchema.statics.calcAverageRatings = async function(contractorId) {
  const stats = await this.aggregate([
    {
      $match: { contractor: contractorId }
    },
    {
      $group: {
        _id: '$contractor',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('User').findByIdAndUpdate(contractorId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await mongoose.model('User').findByIdAndUpdate(contractorId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

// Hook to call calcAverageRatings after save
feedbackSchema.post('save', function(doc, next) {
  doc.constructor.calcAverageRatings(doc.contractor)
    .then(() => next())
    .catch(next);
});

// Populate customer details when querying feedbacks
feedbackSchema.pre(/^find/, function() {
  this.populate({
    path: 'customer',
    select: 'name email role'
  });
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
