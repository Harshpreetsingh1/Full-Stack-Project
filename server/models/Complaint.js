const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    translatedText: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['billing', 'technical', 'general'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

complaintSchema.pre('save', function (next) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
