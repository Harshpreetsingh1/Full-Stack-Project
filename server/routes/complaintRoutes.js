const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaint,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createComplaint);
router.get('/', protect, getUserComplaints);
router.get('/all', protect, adminOnly, getAllComplaints);
router.patch('/:id', protect, adminOnly, updateComplaint);

module.exports = router;
