import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  IconButton,
  Fab,
} from '@mui/material';
import { BookmarkBorder, Group, Create, Add } from '@mui/icons-material';
import { fetchProjects } from '../../store/projectSlice';
import { RootState, AppDispatch } from '../../store';

const CATEGORIES = [
  { value: 'all', label: 'All Projects' },
  { value: 'art', label: 'Art' },
  { value: 'coding', label: 'Coding' },
  { value: 'music', label: 'Music' },
  { value: 'writing', label: 'Writing' },
  { value: 'activism', label: 'Activism' },
  { value: 'other', label: 'Other' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'art':
      return '#FF6B6B';
    case 'coding':
      return '#4ECDC4';
    case 'music':
      return '#45B7D1';
    case 'writing':
      return '#96CEB4';
    case 'activism':
      return '#FF9F1C';
    default:
      return '#6C757D';
  }
};

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const filteredProjects = projects.filter(project => {
    const matchesCategory = category === 'all' || project.category === category;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skillsNeeded.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {CATEGORIES.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Search projects, skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
              }}
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <CardMedia
                component="img"
                height="140"
                image={project.coverImage || '/default-project-cover.jpg'}
                alt={project.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {project.title}
                </Typography>
                <Chip
                  label={project.category}
                  size="small"
                  sx={{ 
                    backgroundColor: getCategoryColor(project.category),
                    color: 'white',
                    mb: 1
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description.slice(0, 120)}...
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {project.skillsNeeded.slice(0, 3).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size="small">
                    <Group />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {project.collaborators.length}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton size="small">
                    <Create />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {project.journalEntries.length}
                  </Typography>
                  <IconButton size="small">
                    <BookmarkBorder />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {user && (
        <Fab
          color="primary"
          aria-label="add project"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => navigate('/projects/new')}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default ProjectList;
