const mongoose = require('mongoose');

const notebookSourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, default: 'PDF' },
    pdfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PDF',
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const notebookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    icon: { type: String, default: '📓' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isShared: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    sources: [notebookSourceSchema],
  },
  { timestamps: true },
);

const Notebook = mongoose.model('Notebook', notebookSchema);
module.exports = Notebook;
