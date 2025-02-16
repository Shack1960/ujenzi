export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  skills: string[];
  interests: string[];
  avatar?: string;
}

export interface JournalEntry {
  _id: string;
  content: string;
  media: string[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  offlineId?: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  user: User;
  role: 'contributor' | 'mentor' | 'observer';
  skills: string[];
  joinedAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: 'art' | 'coding' | 'music' | 'writing' | 'activism' | 'other';
  tags: string[];
  status: 'active' | 'completed' | 'on-hold';
  visibility: 'public' | 'private' | 'collaborative';
  owner: User;
  collaborators: Collaborator[];
  journalEntries: JournalEntry[];
  milestones: Milestone[];
  skillsNeeded: string[];
  skillsOffered: string[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  lastSyncedAt?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  offlineProjects: Project[];
  isLoading: boolean;
  error: string | null;
  syncStatus: 'synced' | 'syncing' | 'pending';
}

export interface OfflineState {
  pendingJournalEntries: JournalEntry[];
  lastSyncTime: Date | null;
}
