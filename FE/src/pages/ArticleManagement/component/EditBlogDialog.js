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
import axios from 'axios';

const EditBlogDialog = ({ open, onClose, blogId, onSave }) => {
  const [accountId, setAccountId] = useState(localStorage.getItem('accountId'));
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    articleManager: {
      AId: accountId
    }
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    const storedAccountId = localStorage.getItem('accountId');
    if (storedAccountId) {
      setAccountId(storedAccountId);
    } else {
      console.error('No accountId found in local storage.');
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      setBlogData(prevData => ({
        ...prevData,
        articleManager: {
          ...prevData.articleManager,
          AId: accountId
        }
      }));
    }
  }, [accountId]);

  useEffect(() => {
    if (open && blogId) {
      fetchBlogData(blogId);
      if (accountId) {
        fetchArticleManagerData(accountId);
      }
    }
  }, [open, blogId, accountId]);

  const fetchBlogData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7240/api/ArticleBlog/${id}`);
      const { title, content, thumbnail } = response.data;
      setBlogData(prevData => ({
        ...prevData,
        title,
        content,
        thumbnail
      }));
      setThumbnailPreview(thumbnail);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };

  const fetchArticleManagerData = async (id) => {
    try {
      const response = await axios.get(`https://localhost:7240/api/ArticleManagerBlog/GetArticleManagerById/ArticleManager/${id}`);
      const articleManager = response.data;
      setBlogData(prevData => ({
        ...prevData,
        articleManager: {
          ...prevData.articleManager,
          name: articleManager.name,
          gender: articleManager.gender
        }
      }));
      console.log('Fetched ArticleManager:', articleManager);
    } catch (error) {
      console.error('Error fetching article manager data:', error);
    }
  };

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
        setBlogData({
          ...blogData,
          content: `${blogData.content}\n![Image](${imageUrl})`
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
      setBlogData({ ...blogData, thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onDropImage });
  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({ onDrop: onDropThumbnail, accept: 'image/*' });

  const handleUpdateBlog = () => {
    if (!blogData.title || !blogData.content) {
      setSnackbarMessage('Title and content are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formattedContent = blogData.content.replace(/\n\s*\n/g, '\n\n');
    console.log('Account ID:', accountId);
    console.log('Blog Data:', blogData);

    const updatedBlogData = {
      BlogId: blogId,
      title: blogData.title,
      content: formattedContent,
      thumbnail: blogData.thumbnail,
      articleManager: blogData.articleManager
    };
    console.log(updatedBlogData);
    axios.put(`https://localhost:7240/api/ArticleManagerBlog/UpdateBlog/blog/${blogId}`, updatedBlogData)
      .then(response => {
        console.log('Blog updated successfully:', response.data);
        onSave('Blog updated successfully!'); 
        onClose(); 
        setSnackbarMessage('Blog updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error updating blog:', error.response ? error.response.data : error.message);
        setSnackbarMessage('Failed to update blog.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleContentChange = (e) => {
    setBlogData(prevData => ({ ...prevData, content: e.target.value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="95vw"
    >
      <DialogTitle>Edit Blog</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={blogData.title}
          onChange={(e) => setBlogData(prevData => ({ ...prevData, title: e.target.value }))}
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
          value={blogData.content}
          onChange={handleContentChange}
        />
        <div
          {...getImageRootProps()}
          style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center', marginTop: '16px' }}
        >
          <input {...getImageInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
        <div style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center', marginTop: '16px' }}>
          <h2>{blogData.title}</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{blogData.content}</ReactMarkdown>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateBlog} color="primary">Update</Button>
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

export default EditBlogDialog;
