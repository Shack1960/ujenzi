import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Create as JournalIcon,
  Assignment as MilestoneIcon,
  Group as CollaboratorsIcon,
  Category as CategoryIcon,
  Build as SkillsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchProjectById } from '../../store/projectSlice';
import { RootState, AppDispatch } from '../../store';
import { getCategoryColor } from '../../theme';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProject: project, isLoading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!project) {
    return <Alert severity="info">Project not found</Alert>;
  }

  const isOwner = user && project.owner._id === user._id;
  const isCollaborator = user && project.collaborators.some(c => c.user._id === user._id);

  return (
    <Box sx={{ p: 3 }}>
      {project.coverImage && (
        <Box sx={{ mb: 3, height: 300, position: 'relative' }}>
          <img
            src={project.coverImage}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {project.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label={project.category}
                sx={{
                  backgroundColor: getCategoryColor(project.category),
                  color: 'white',
                }}
              />
              <Chip label={project.status} color={project.status === 'active' ? 'success' : 'default'} />
            </Box>
            <Typography variant="body1" paragraph>
              {project.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <JournalIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Journal Entries</Typography>
            </Box>
            <List>
              {project.journalEntries.map((entry) => (
                <ListItem key={entry._id} alignItems="flex-start" component={Paper} sx={{ mb: 2, p: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={entry.createdBy.avatar} alt={entry.createdBy.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{entry.createdBy.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(entry.createdAt), 'PPp')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                          {entry.content}
                        </Typography>
                        {entry.media.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                            {entry.media.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Journal entry media ${index + 1}`}
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {(isOwner || isCollaborator) && (
              <Button
                variant="contained"
                startIcon={<JournalIcon />}
                onClick={() => navigate(`/projects/${project._id}/journal/new`)}
              >
                Add Journal Entry
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MilestoneIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Milestones</Typography>
            </Box>
            <List>
              {project.milestones.map((milestone) => (
                <ListItem
                  key={milestone._id}
                  alignItems="flex-start"
                  component={Paper}
                  sx={{ mb: 2, p: 2 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{milestone.title}</Typography>
                        <Chip
                          label={milestone.status}
                          color={
                            milestone.status === 'completed'
                              ? 'success'
                              : milestone.status === 'in-progress'
                              ? 'warning'
                              : 'default'
                          }
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {milestone.description}
                        </Typography>
                        {milestone.dueDate && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Due: {format(new Date(milestone.dueDate), 'PP')}
                          </Typography>
                        )}
                        {milestone.assignedTo.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Assigned to:
                            </Typography>
                            {milestone.assignedTo.map((user) => (
                              <Chip
                                key={user._id}
                                avatar={<Avatar src={user.avatar} alt={user.name} />}
                                label={user.name}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {isOwner && (
              <Button
                variant="contained"
                startIcon={<MilestoneIcon />}
                onClick={() => navigate(`/projects/${project._id}/milestones/new`)}
              >
                Add Milestone
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CollaboratorsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Team</Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Project Owner
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={project.owner.avatar} alt={project.owner.name} />
                <Box>
                  <Typography variant="subtitle1">{project.owner.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.owner.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {project.collaborators.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Collaborators
                </Typography>
                <List disablePadding>
                  {project.collaborators.map((collaborator) => (
                    <ListItem key={collaborator.user._id} disablePadding sx={{ mb: 1 }}>
                      <ListItemAvatar>
                        <Avatar src={collaborator.user.avatar} alt={collaborator.user.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={collaborator.user.name}
                        secondary={
                          <>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {collaborator.role}
                            </Typography>
                            {collaborator.skills.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mt: 0.5 }}
                              />
                            ))}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {isOwner && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CollaboratorsIcon />}
                onClick={() => navigate(`/projects/${project._id}/collaborators/invite`)}
                sx={{ mt: 2 }}
              >
                Invite Collaborators
              </Button>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CategoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Project Info</Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created
            </Typography>
            <Typography variant="body2" paragraph>
              {format(new Date(project.createdAt), 'PP')}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body2" paragraph>
              {format(new Date(project.updatedAt), 'PP')}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Visibility
            </Typography>
            <Typography variant="body2">
              {project.visibility.charAt(0).toUpperCase() + project.visibility.slice(1)}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SkillsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Skills</Typography>
            </Box>
            {project.skillsNeeded.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Skills Needed
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {project.skillsNeeded.map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            {project.skillsOffered.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Skills You Can Learn
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {project.skillsOffered.map((skill) => (
                    <Chip key={skill} label={skill} size="small" color="success" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetails;
