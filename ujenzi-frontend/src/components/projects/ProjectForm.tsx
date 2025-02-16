import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Category, Visibility } from '../../theme';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Paper,
  Autocomplete,
  Chip,
} from '@mui/material';
import { createNewProject } from '../../store/projectSlice';
import { RootState, AppDispatch } from '../../store';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'art', label: 'Art' },
  { value: 'coding', label: 'Coding' },
  { value: 'music', label: 'Music' },
  { value: 'writing', label: 'Writing' },
  { value: 'activism', label: 'Activism' },
  { value: 'other', label: 'Other' },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public - Anyone can view' },
  { value: 'private', label: 'Private - Only you and collaborators' },
  { value: 'collaborative', label: 'Collaborative - Open for contributions' },
];

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.projects);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: 'other' as Category,
      visibility: 'public' as Visibility,
      skillsNeeded: [] as string[],
      skillsOffered: [] as string[],
      tags: [] as string[],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Required')
        .min(3, 'Must be at least 3 characters'),
      description: Yup.string()
        .required('Required')
        .min(10, 'Must be at least 10 characters'),
      category: Yup.mixed<Category>()
        .required('Required')
        .oneOf(CATEGORIES.map(c => c.value)),
      visibility: Yup.string()
        .required('Required')
        .oneOf(VISIBILITY_OPTIONS.map(v => v.value) as ReadonlyArray<string>),
      skillsNeeded: Yup.array().of(Yup.string()),
      skillsOffered: Yup.array().of(Yup.string()),
      tags: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(createNewProject({
          ...values,
          category: values.category as Category,
          visibility: values.visibility as Visibility,
          status: 'active',
        })).unwrap();
        navigate('/projects');
      } catch (err) {
        // Error is handled by the reducer
      }
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Project
        </Typography>

        {error && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Project Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="category"
                name="category"
                select
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {CATEGORIES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="visibility"
                name="visibility"
                select
                label="Visibility"
                value={formik.values.visibility}
                onChange={formik.handleChange}
                error={formik.touched.visibility && Boolean(formik.errors.visibility)}
                helperText={formik.touched.visibility && formik.errors.visibility}
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Project Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                id="skillsNeeded"
                freeSolo
                options={[]}
                value={formik.values.skillsNeeded}
                onChange={(_, newValue) => {
                  formik.setFieldValue('skillsNeeded', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills Needed"
                    placeholder="Add skills you're looking for"
                    helperText="Press Enter to add skills"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                id="skillsOffered"
                freeSolo
                options={[]}
                value={formik.values.skillsOffered}
                onChange={(_, newValue) => {
                  formik.setFieldValue('skillsOffered', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills Offered"
                    placeholder="Add skills others can learn"
                    helperText="Press Enter to add skills"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="tags"
                freeSolo
                options={[]}
                value={formik.values.tags}
                onChange={(_, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add relevant tags"
                    helperText="Press Enter to add tags"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/projects')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProjectForm;
