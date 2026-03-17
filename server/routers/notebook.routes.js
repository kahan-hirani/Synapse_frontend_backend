const express = require('express');
const isAuthenticated = require('../middlewares/auth.middlware');
const {
  listNotebooks,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  duplicateNotebook,
} = require('../controllers/notebook.controller');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', listNotebooks);
router.post('/', createNotebook);
router.patch('/:notebookId', updateNotebook);
router.delete('/:notebookId', deleteNotebook);
router.post('/:notebookId/duplicate', duplicateNotebook);

module.exports = router;
