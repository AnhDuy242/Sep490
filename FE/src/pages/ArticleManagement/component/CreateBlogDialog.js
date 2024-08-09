import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';
import remarkGfm from 'remark-gfm'; // Import remark-gfm

const CreateBlogDialog = ({ open, onClose }) => {
  const [newBlog, setNewBlog] = useState({ title: '', content: '', thumbnail: '', docId: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [doctors, setDoctors] = useState([]);
  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    // Fetch doctors and set a random doctor ID
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://localhost:7240/api/Header/GetAllDoctor');
        const data = await response.json();
        const doctorList = data.$values;
        if (doctorList.length > 0) {
          setDoctors(doctorList);
          // Choose a random doctor
          const randomDoctor = doctorList[Math.floor(Math.random() * doctorList.length)];
          // Update newBlog state with the random doctor's ID
          setNewBlog((prevState) => ({ ...prevState, docId: randomDoctor.docId }));
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means this effect runs once on mount

  const onDropImage = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://localhost:7240/api/Upload/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.url;
        setNewBlog({
          ...newBlog,
          content: `${newBlog.content}\n![Image](${imageUrl})`
        });
        setSnackbarMessage('Image uploaded successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setSnackbarMessage('Failed to upload image.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const onDropThumbnail = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      setNewBlog({ ...newBlog, thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onDropImage });
  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({ onDrop: onDropThumbnail, accept: 'image/*' });

  const handleAddBlog = () => {
    if (!newBlog.title || !newBlog.content) {
      setSnackbarMessage('Title and content cannot be empty.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Convert new lines to Markdown line breaks (with two new lines)
    const formattedContent = newBlog.content.replace(/\n\s*\n/g, '\n\n'); 

    const blogData = {
      title: newBlog.title,
      content: formattedContent, // Use the formatted content
      docId: newBlog.docId, // Use the randomly selected doctor ID
      date: new Date().toISOString(),
      thumbnail: newBlog.thumbnail,
      aId: accountId,
      articleManager: {
        aId: accountId,
        name: "Example Name",
        gender: "Example Gender",
        dob: new Date().toISOString(),
        isActive: true
      }
    };

    fetch('https://localhost:7240/api/ArticleManagerBlog/CreateBlog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Blog created successfully:', data);
        onClose();
        setNewBlog({ title: '', content: '', thumbnail: '', docId: '' });
        setThumbnailPreview('');
        setSnackbarMessage('Blog created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error creating blog:', error);
        setSnackbarMessage('Failed to create blog.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleContentChange = (e) => {
    // Update content with new line handling
    const updatedContent = e.target.value;
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="95vw" // Adjust the size to make it wider
    >
      <DialogTitle>Add New Blog</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        />
        <div
          {...getThumbnailRootProps()}
          style={{
            position: 'relative',
            marginBottom: '16px',
            border: '1px dashed gray',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <input {...getThumbnailInputProps()} />
          {thumbnailPreview && (
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${thumbnailPreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5
              }}
            />
          )}
          <IconButton component="label" color="primary" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <AddPhotoAlternateIcon fontSize="large" />
          </IconButton>
          <p>Click to select a thumbnail image</p>
        </div>
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={newBlog.content}
          onChange={handleContentChange} // Update content handling
        />
        <div style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center', marginTop: '16px' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{newBlog.content}</ReactMarkdown>
        </div>
        <div
          {...getImageRootProps()}
          style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center', marginTop: '16px' }}
        >
          <input {...getImageInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddBlog} color="primary">Add</Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreateBlogDialog;
