// src/pages/ArticleManagement/component/CreateBlogDialog.js
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AiOutlineUpload } from 'react-icons/ai'; // Import icon from react-icons
import './CreateBlogDialog.css'; // Import CSS

const CreateBlogDialog = ({ open, onClose, onAddBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', content: '', thumbnail: '' });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleAddBlog = () => {
    onAddBlog(newBlog);
    setNewBlog({ title: '', content: '', thumbnail: '' });
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        // Insert image into content
        const imgTag = `<img src="${reader.result}" class="draggable-image" alt="Uploaded" />`;
        setNewBlog(prevBlog => ({ ...prevBlog, content: prevBlog.content + imgTag }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md" // Set maxWidth to medium for better control
      PaperProps={{
        style: {
          width: '90vw', // Set width to 90% of the viewport width
          height: '90vh', // Set height to 90% of the viewport height
          margin: 'auto', // Center dialog horizontally
          maxHeight: '90vh', // Ensure dialog does not exceed 90% of viewport height
        },
      }}
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
          contentEditable
          suppressContentEditableWarning
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 8,
            minHeight: 200,
            marginTop: 16,
            overflowY: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: newBlog.content }}
          onInput={(e) => setNewBlog({ ...newBlog, content: e.currentTarget.innerHTML })}
        />
        <Tooltip title="Upload Image" aria-label="upload-image">
          <IconButton
            color="primary"
            component="label"
            style={{ marginTop: 16 }}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <AiOutlineUpload size={24} />
          </IconButton>
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddBlog} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBlogDialog;
