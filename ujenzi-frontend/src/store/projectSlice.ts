import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects, createProject, getProjectById, updateProject, addJournalEntry, addMilestone } from '../services/api';
import { ProjectState, Project } from '../types';

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  offlineProjects: [],
  syncStatus: 'synced',
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async () => {
    const response = await getProjects();
    return response;
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string) => {
    const response = await getProjectById(id);
    return response;
  }
);

export const createNewProject = createAsyncThunk(
  'projects/create',
  async (projectData: Partial<Project>) => {
    const response = await createProject(projectData);
    return response;
  }
);

export const updateExistingProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }: { id: string; projectData: Partial<Project> }) => {
    const response = await updateProject(id, projectData);
    return response;
  }
);

export const addJournalEntryToProject = createAsyncThunk(
  'projects/addJournalEntry',
  async ({ projectId, entry }: { projectId: string; entry: any }) => {
    const response = await addJournalEntry(projectId, entry);
    return { projectId, entry: response };
  }
);

export const addMilestoneToProject = createAsyncThunk(
  'projects/addMilestone',
  async ({ projectId, milestone }: { projectId: string; milestone: any }) => {
    const response = await addMilestone(projectId, milestone);
    return { projectId, milestone: response };
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch project';
      })
      .addCase(createNewProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createNewProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create project';
      })
      .addCase(updateExistingProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?._id === action.payload._id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateExistingProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update project';
      })
      .addCase(addJournalEntryToProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addJournalEntryToProject.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedProject?._id === action.payload.projectId) {
          state.selectedProject.journalEntries.push(action.payload.entry);
        }
      })
      .addCase(addJournalEntryToProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add journal entry';
      })
      .addCase(addMilestoneToProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMilestoneToProject.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedProject?._id === action.payload.projectId) {
          state.selectedProject.milestones.push(action.payload.milestone);
        }
      })
      .addCase(addMilestoneToProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add milestone';
      });
  },
});

export const { clearSelectedProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;
