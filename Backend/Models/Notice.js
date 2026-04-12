

const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String, // Jaise: 'EXAM', 'EVENT', 'GENERAL', 'FEES_PENDING', 'ACADEMIC'
    default: 'GENERAL'
  },
  senderRole: {
    type: String,
    enum: ['admin', 'teacher', 'hod'],
    default: 'admin'
  },
  senderName: {
    type: String
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', noticeSchema);