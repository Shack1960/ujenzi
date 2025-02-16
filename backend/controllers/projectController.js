 import Project from '../models/Project.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    ownerDetails: {
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    }
  });
  res.status(201).json(project);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const { category, skills, search } = req.query;
  const query = {};

  if (category) query.category = category;
  if (skills) query.$or = [
    { skillsNeeded: { $in: skills.split(',') } },
    { skillsOffered: { $in: skills.split(',') } }
  ];
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const projects = await Project.find(query)
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort('-createdAt');
  res.json(projects);
});

// @desc    Get user projects
// @route   GET /api/projects/myprojects
// @access  Private
const getUserProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user._id },
      { 'collaborators.user': req.user._id }
    ]
  })
    .populate('owner', 'name email')
    .populate('collaborators.user', 'name email')
    .sort('-createdAt');
  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('collaborators.user', 'name email avatar')
    .populate('journalEntries.createdBy', 'name email avatar')
    .populate('milestones.assignedTo', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json(project);
});

// @desc    Add journal entry
// @route   POST /api/projects/:id/journal
// @access  Private
const addJournalEntry = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is owner or collaborator
  const isParticipant = project.owner.equals(req.user._id) || 
    project.collaborators.some(c => c.user.equals(req.user._id));
  
  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to add journal entries');
  }

  // Check daily entry limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = project.journalEntries.filter(entry => 
    entry.createdAt >= today
  ).length;

  if (todayEntries >= project.journalEntryLimit) {
    res.status(400);
    throw new Error('Daily journal entry limit reached');
  }

  project.journalEntries.push({
    ...req.body,
    createdBy: req.user._id
  });
  project.lastJournalEntry = Date.now();

  await project.save();
  res.status(201).json(project);
});

// @desc    Add milestone
// @route   POST /api/projects/:id/milestones
// @access  Private
const addMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Only project owner can add milestones');
  }

  project.milestones.push(req.body);
  await project.save();
  res.status(201).json(project);
});

// @desc    Update milestone status
// @route   PUT /api/projects/:id/milestones/:milestoneId
// @access  Private
const updateMilestoneStatus = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const milestone = project.milestones.id(req.params.milestoneId);
  if (!milestone) {
    res.status(404);
    throw new Error('Milestone not found');
  }

  // Check if user is assigned to milestone or is project owner
  const isAuthorized = project.owner.equals(req.user._id) || 
    milestone.assignedTo.some(userId => userId.equals(req.user._id));

  if (!isAuthorized) {
    res.status(403);
    throw new Error('Not authorized to update milestone');
  }

  milestone.status = req.body.status;
  await project.save();
  res.json(project);
});

// @desc    Add collaborator
// @route   POST /api/projects/:id/collaborators
// @access  Private
const addCollaborator = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Only project owner can add collaborators');
  }

  // Check if user is already a collaborator
  if (project.collaborators.some(c => c.user.equals(req.body.userId))) {
    res.status(400);
    throw new Error('User is already a collaborator');
  }

  project.collaborators.push({
    user: req.body.userId,
    userDetails: {
      name: req.body.userName,
      email: req.body.userEmail,
      avatar: req.body.userAvatar
    },
    role: req.body.role,
    skills: req.body.skills
  });

  await project.save();
  res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update project');
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .populate('owner', 'name email avatar')
    .populate('collaborators.user', 'name email avatar');

  res.json(updatedProject);
});

// @desc    Upload project cover image
// @route   POST /api/projects/:id/cover
// @access  Private
const uploadCoverImage = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update cover image');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  project.coverImage = `/uploads/project-covers/${req.file.filename}`;
  await project.save();
  
  res.status(200).json({ coverImage: project.coverImage });
});

// @desc    Update project visibility
// @route   PUT /api/projects/:id/visibility
// @access  Private
const updateVisibility = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update visibility');
  }

  project.visibility = req.body.visibility;
  await project.save();
  
  res.status(200).json({ visibility: project.visibility });
});

// @desc    Update media storage limit
// @route   PUT /api/projects/:id/media-storage
// @access  Private
const updateMediaStorageLimit = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update media storage limit');
  }

  project.mediaStorageLimit = req.body.mediaStorageLimit;
  await project.save();
  
  res.status(200).json({ mediaStorageLimit: project.mediaStorageLimit });
});

export {
  createProject,
  getProjects,
  getUserProjects,
  getProjectById,
  updateProject,
  addJournalEntry,
  addMilestone,
  updateMilestoneStatus,
  addCollaborator,
  uploadCoverImage,
  updateVisibility,
  updateMediaStorageLimit,
};
