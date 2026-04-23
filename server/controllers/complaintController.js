const Complaint = require('../models/Complaint');
const categorize = require('../utils/categorize');
const { translateText } = require('../utils/translate');


const createComplaint = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Complaint description must be at least 10 characters',
      });
    }

    const category = categorize(description);

    let translatedText = '';
    try {
      translatedText = await translateText(description);
    } catch (err) {
      console.error('Translation failed, continuing without translation:', err.message);
    }

    const ticketId = `TKT-${Date.now()}`;

    const complaint = await Complaint.create({
      userId: req.user._id,
      ticketId,
      description: description.trim(),
      translatedText,
      category,
      status: 'open',
    });

    const populated = await Complaint.findById(complaint._id).populate(
      'userId',
      'name email'
    );

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getUserComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (admin)
// @route   GET /api/complaints/all
const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (admin)
// @route   PATCH /api/complaints/:id
const updateComplaint = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status: open, in-progress, or resolved',
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaint,
};
