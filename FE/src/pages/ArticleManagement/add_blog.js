import React, { useState } from 'react';
import {
  Typography, TextField, Button, Paper, Container, CssBaseline, Grid
} from '@mui/material';
import { addBlog } from './../../services/blog_service'; // Adjust the path if necessary

const AddBlog = () => {
  const [newBlog, setNewBlog] = useState({
    aId: '',
    title: '',
    docId: '',
    content: '',
    thumbnail: '',
    wordFile: null,
  });
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewBlog({ ...newBlog, wordFile: file });
    }
  };

  const handleAddBlog = async () => {
    // if (!newBlog.title || !newBlog.aId || !newBlog.docId || !newBlog.content) {
    //   setValidationError('All fields are required.');
    //   return;
    // }

    const formData = new FormData();
    formData.append('aId', newBlog.aId);
    formData.append('title', newBlog.title);
    formData.append('docId', newBlog.docId);
    formData.append('content', newBlog.content);
    formData.append('thumbnail', newBlog.thumbnail);
    if (newBlog.wordFile) {
      formData.append('wordFile', newBlog.wordFile);
    }

    try {
      await addBlog(formData);
      alert('Blog added successfully');
      setNewBlog({
        aId: '',
        title: '',
        docId: '',
        content: '',
        thumbnail: '',
        wordFile: null,
      });
      setValidationError('');
    } catch (error) {
      console.error('Error adding blog:', error);
      setValidationError('Failed to add blog. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography component="h1" variant="h5">Add a New Blog</Typography>
        {validationError && (
          <Typography color="error" variant="body2">{validationError}</Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="aId"
              label="Author ID"
              name="aId"
              value={newBlog.aId}
              onChange={(e) => setNewBlog({ ...newBlog, aId: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="docId"
              label="Doctor ID"
              name="docId"
              value={newBlog.docId}
              onChange={(e) => setNewBlog({ ...newBlog, docId: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              // required
              fullWidth
              id="content"
              label="Content"
              name="content"
              multiline
              rows={4}
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              Upload Word File
              <input
                type="file"
                accept=".doc, .docx"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {newBlog.wordFile && (
              <Typography>{newBlog.wordFile.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddBlog}
            >
              Add Blog
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddBlog;
