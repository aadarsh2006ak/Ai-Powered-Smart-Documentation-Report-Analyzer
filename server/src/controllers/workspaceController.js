const Workspace = require('../models/Workspace');
const User = require('../models/User');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * @desc    Create a new team workspace
 * @route   POST /api/workspaces
 * @access  Private
 */
const createWorkspace = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Workspace name is required.' });
    }

    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      inviteCode,
      members: [
        {
          user: req.user._id,
          email: req.user.email,
          role: 'owner',
        },
      ],
    });

    logger.success(`Workspace created: ${workspace.name} (Code: ${inviteCode})`);

    res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's workspaces
 * @route   GET /api/workspaces/my
 * @access  Private
 */
const getMyWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    }).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Join workspace via invite code
 * @route   POST /api/workspaces/join
 * @access  Private
 */
const joinWorkspace = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ success: false, message: 'Invite code is required.' });
    }

    const workspace = await Workspace.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Invalid invite code.' });
    }

    // Check if user is already a member
    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this workspace.' });
    }

    workspace.members.push({
      user: req.user._id,
      email: req.user.email,
      role: 'editor',
    });

    await workspace.save();
    logger.info(`User ${req.user.email} joined workspace ${workspace.name}`);

    res.status(200).json({
      success: true,
      message: `Successfully joined ${workspace.name}`,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  joinWorkspace,
};
