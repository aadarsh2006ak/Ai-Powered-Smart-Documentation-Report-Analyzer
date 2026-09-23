const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getMyWorkspaces,
  joinWorkspace,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createWorkspace);
router.route('/my').get(getMyWorkspaces);
router.route('/join').post(joinWorkspace);

module.exports = router;
