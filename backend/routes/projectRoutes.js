import express from 'express';
import {
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
} from '../controllers/projectController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base project routes
router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.get('/myprojects', protect, getUserProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject);

// Journal entries
router.route('/:id/journal')
  .post(protect, addJournalEntry);

// Milestones
router.route('/:id/milestones')
  .post(protect, addMilestone);

router.route('/:id/milestones/:milestoneId')
  .put(protect, updateMilestoneStatus);

// Collaborators
router.route('/:id/collaborators')
  .post(protect, addCollaborator);

// Cover image routes
router.route('/:id/cover')
  .post(protect, upload.single('coverImage'), uploadCoverImage);

// Visibility routes
router.route('/:id/visibility')
  .put(protect, updateVisibility);

// Media storage routes
router.route('/:id/media-storage')
  .put(protect, updateMediaStorageLimit);

export default router;
