// AddBlog.js
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { createBlog } from '../../services/blog_service';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('Title', title);
    formData.append('DoctorId', doctorId);
    formData.append('AuthorId', authorId);
    formData.append('Content', content);
    Array.from(files).forEach((file) => {
      formData.append('Files', file);
    });

    try {
      const response = await createBlog(formData);
      setSnackbarMessage(response.message);
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to create blog');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Blog
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                required
                fullWidth
                id="title"
                label="Title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="doctorId"
                required
                fullWidth
                id="doctorId"
                label="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="authorId"
                required
                fullWidth
                id="authorId"
                label="Author ID"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="content"
                required
                fullWidth
                id="content"
                label="Content"
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
              >
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddBlog;
