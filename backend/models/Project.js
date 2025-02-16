import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add entry content'],
  },
  media: [{
    type: String, // URLs to images, videos, etc.
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a milestone title'],
  },
  description: String,
  dueDate: Date,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true,
});

const projectSchema = new mongoose.Schema({
  coverImage: {
    type: String,
    default: '',
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a project description'],
  },
  location: String,
  budget: Number,
  category: {
    type: String,
    required: [true, 'Please add a project category'],
    enum: ['art', 'coding', 'music', 'writing', 'activism', 'other'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerDetails: {
    name: String,
    email: String,
    avatar: String,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userDetails: {
      name: String,
      email: String,
      avatar: String,
    },
    role: {
      type: String,
      enum: ['contributor', 'mentor', 'observer'],
      default: 'contributor',
    },
    skills: [String], // Skills they're contributing or seeking
  }],
  journalEntries: [journalEntrySchema],
  milestones: [milestoneSchema],
  skillsNeeded: [String], // Skills the project is looking for
  skillsOffered: [String], // Skills that can be learned from this project
  startDate: Date,
  estimatedEndDate: Date,
  lastJournalEntry: {
    type: Date,
    default: Date.now,
  },
  journalEntryLimit: {
    type: Number,
    default: 1, // Number of allowed journal entries per day
  },
  mediaStorageLimit: {
    type: Number,
    default: 100, // MB of media storage allowed
  }
}, {
  timestamps: true,
});

// Index for efficient querying
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ skillsNeeded: 1 });
projectSchema.index({ skillsOffered: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
