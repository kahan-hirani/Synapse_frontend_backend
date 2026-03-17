const asyncHandler = require('../utilities/asyncHandler.utility');
const ErrorHandler = require('../utilities/errorHandler.utility');
const Notebook = require('../models/notebook.model');

function toNotebookResponse(doc) {
  return {
    id: doc._id,
    title: doc.title,
    icon: doc.icon,
    isShared: Boolean(doc.isShared),
    isFavorite: Boolean(doc.isFavorite),
    featured: Boolean(doc.featured),
    createdAt: doc.createdAt,
    lastEditedAt: doc.updatedAt,
    sources: (doc.sources || []).map((source) => ({
      id: source._id,
      name: source.name,
      type: source.type || 'PDF',
      addedAt: source.addedAt,
      pdfId: source.pdfId,
    })),
  };
}

const listNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await Notebook.find({ owner: req.user.id }).sort({ updatedAt: -1 });
  return res.status(200).json({
    success: true,
    notebooks: notebooks.map(toNotebookResponse),
  });
});

const createNotebook = asyncHandler(async (req, res, next) => {
  const title = String(req.body.title || '').trim();
  const icon = String(req.body.icon || '📓').trim();

  if (!title) {
    return next(new ErrorHandler('Notebook title is required', 400));
  }

  const notebook = await Notebook.create({
    title,
    icon: icon || '📓',
    owner: req.user.id,
  });

  return res.status(201).json({
    success: true,
    notebook: toNotebookResponse(notebook),
  });
});

const updateNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.findOne({ _id: req.params.notebookId, owner: req.user.id });
  if (!notebook) {
    return next(new ErrorHandler('Notebook not found', 404));
  }

  if (typeof req.body.title === 'string') {
    const title = req.body.title.trim();
    if (!title) {
      return next(new ErrorHandler('Notebook title cannot be empty', 400));
    }
    notebook.title = title;
  }

  if (typeof req.body.icon === 'string' && req.body.icon.trim()) {
    notebook.icon = req.body.icon.trim();
  }

  if (typeof req.body.isShared === 'boolean') {
    notebook.isShared = req.body.isShared;
  }

  if (typeof req.body.isFavorite === 'boolean') {
    notebook.isFavorite = req.body.isFavorite;
  }

  if (typeof req.body.featured === 'boolean') {
    notebook.featured = req.body.featured;
  }

  await notebook.save();

  return res.status(200).json({
    success: true,
    notebook: toNotebookResponse(notebook),
  });
});

const deleteNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.findOneAndDelete({ _id: req.params.notebookId, owner: req.user.id });

  if (!notebook) {
    return next(new ErrorHandler('Notebook not found', 404));
  }

  return res.status(200).json({
    success: true,
    message: 'Notebook deleted',
    notebookId: notebook._id,
  });
});

const duplicateNotebook = asyncHandler(async (req, res, next) => {
  const sourceNotebook = await Notebook.findOne({ _id: req.params.notebookId, owner: req.user.id });

  if (!sourceNotebook) {
    return next(new ErrorHandler('Notebook not found', 404));
  }

  const copy = await Notebook.create({
    title: `${sourceNotebook.title} Copy`,
    icon: sourceNotebook.icon || '📓',
    owner: req.user.id,
    isShared: false,
    isFavorite: false,
    featured: sourceNotebook.featured,
    sources: (sourceNotebook.sources || []).map((source) => ({
      name: source.name,
      type: source.type,
      pdfId: source.pdfId,
      addedAt: new Date(),
    })),
  });

  return res.status(201).json({
    success: true,
    notebook: toNotebookResponse(copy),
  });
});

module.exports = {
  toNotebookResponse,
  listNotebooks,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  duplicateNotebook,
};
