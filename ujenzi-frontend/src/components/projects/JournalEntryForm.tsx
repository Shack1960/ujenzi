import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { addJournalEntryToProject } from '../../store/projectSlice';

import { RootState, AppDispatch } from '../../store';

const validationSchema = Yup.object({
  content: Yup.string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
  media: Yup.array().of(Yup.string().url('Invalid URL')),
});

const JournalEntryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.projects);

  const formik = useFormik({
    initialValues: {
      content: '',
      media: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      if (id) {
        try {
          await dispatch(addJournalEntryToProject({ projectId: id, entry: values })).unwrap();

          navigate(`/projects/${id}`);
        } catch (err) {
          // Error is handled by the reducer
        }
      }
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add Journal Entry
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
                id="content"
                name="content"
                label="Entry Content"
                multiline
                rows={6}
                value={formik.values.content}
                onChange={formik.handleChange}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="media"
                name="media"
                label="Media URLs (comma separated)"
                value={formik.values.media.join(', ')}
                onChange={(e) => {
                  const urls = e.target.value
                    .split(',')
                    .map(url => url.trim())
                    .filter(url => url.length > 0);
                  formik.setFieldValue('media', urls);
                }}
                error={formik.touched.media && Boolean(formik.errors.media)}
                helperText={formik.touched.media && formik.errors.media}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/projects/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Add Entry'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default JournalEntryForm;
