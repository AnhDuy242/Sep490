import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { loadBlogs, deleteBlog, addBlog } from '../../services/blog_service';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState('');
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [openMultipleDeleteDialog, setOpenMultipleDeleteDialog] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    doctorid: '',
    content: '',
    date: '',
    thumbnail: '',
  });
  const [validationError, setValidationError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Search and store in array
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Load list of blogs
  useEffect(() => {
    loadBlogs(setBlogs, setLoading, setError);
  }, []);

  // Delete a blog
  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(deleteBlogId);
      const updatedBlogs = blogs.filter((blog) => blog.blogid !== deleteBlogId);
      setBlogs(updatedBlogs);
      handleCloseDeleteDialog();
      setSnackbarMessage('Blog deleted successfully.');
      setSnackbarOpen(true);
      window.location.reload()
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteBlogId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteBlogId('');
    setOpenDeleteDialog(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setNewBlog({
      title: '',
      author: '',
      doctorid: '',
      content: '',
      date: '',
      thumbnail: '',
    });
    setValidationError('');
    setOpenAddDialog(false);
  };

  // Add a blog
  const navigate = useNavigate();
  const navigateAdd = () => {
    navigate('/article/dashboard/add_blog');
  };
  const handleAddBlog = async () => {
    if (!newBlog.title || !newBlog.author || !newBlog.content || !newBlog.date || !newBlog.thumbnail || !newBlog.doctorid) {
      setValidationError('All fields are required.');
      return;
    }

    try {
      const addedBlog = await addBlog(newBlog);
      setBlogs([...blogs, addedBlog]);
      handleCloseAddDialog();
      setSnackbarMessage('Blog added successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    if (selectedBlogs.includes(id)) {
      setSelectedBlogs(selectedBlogs.filter((p) => p !== id));
    } else {
      setSelectedBlogs([...selectedBlogs, id]);
    }
  };

  const handleOpenMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(true);
  };

  const handleCloseMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(false);
  };

  const handleDeleteMultipleBlogs = async () => {
    try {
      await Promise.all(selectedBlogs.map(async (id) => {
        await deleteBlog(id);
      }));
      const updatedBlogs = blogs.filter((blog) => !selectedBlogs.includes(blog.blogid));
      setBlogs(updatedBlogs);
      setSelectedBlogs([]);
      handleCloseMultipleDeleteDialog();
      setSnackbarMessage('Selected blogs deleted successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting blogs:', error);
    }
  };

  // Handle search auto change
  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    const filtered = blogs
      .filter(blog =>
        blog.title.toLowerCase().includes(value.toLowerCase()) ||
        blog.author.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit displayed results
    setFilteredBlogs(filtered);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography fontSize={50}>Quản lý bài viết</Typography>
      <Autocomplete
        freeSolo
        options={filteredBlogs.map(blog => blog.title)}
        inputValue={searchQuery}
        onInputChange={handleSearchChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search by title "
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Button className="btn_add" variant="contained" component="a" onClick={navigateAdd}>
        Add Blog
      </Button>

      <Button
        className="btn_delete"
        disabled={selectedBlogs.length === 0}
        onClick={handleOpenMultipleDeleteDialog}
      >
        Delete Selected
      </Button>
      <TableContainer component={Paper}>
        <Table className="table_list">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Blog ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Img</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(searchQuery ? filteredBlogs : blogs).map((blog) => (
              <TableRow key={blog.blogid}>
                <TableCell>
                  <Checkbox
                    checked={selectedBlogs.includes(blog.blogid)}
                    onChange={() => handleCheckboxChange(blog.blogid)}
                  />
                </TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.blogId}</TableCell>
                <TableCell>{blog.date}</TableCell>
                <TableCell>
                  <img src={blog.thumbnail} alt={blog.title} style={{ width: '100px', height: 'auto' }} />
                </TableCell>
                <TableCell>
                  <IconButton
                    title="Delete"
                    onClick={() => handleOpenDeleteDialog(blog.blogId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton title="View Details">
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/** Delete multiple blogs */}
      <Dialog
        open={openMultipleDeleteDialog}
        onClose={handleCloseMultipleDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa nhiều bài viết</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có muốn xóa {selectedBlogs.length} bài viết đã chọn không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMultipleDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteMultipleBlogs}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete a blog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa bài viết không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteBlog}
            color="primary"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/** Add a blog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Thêm bài viết</DialogTitle>
        <DialogContent>
          {validationError && (
            <Typography color="error" variant="body2">
              {validationError}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="author"
            label="Author"
            type="text"
            fullWidth
            value={newBlog.author}
            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="doctorid"
            label="DoctorId"
            type="text"
            fullWidth
            value={newBlog.doctorid}
            onChange={(e) => setNewBlog({ ...newBlog, doctorid: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="date"
            type="date"
            fullWidth
            value={newBlog.date}
            onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="thumbnail"
            label="Thumbnail URL"
            type="text"
            fullWidth
            value={newBlog.thumbnail}
            onChange={(e) => setNewBlog({ ...newBlog, thumbnail: e.target.value })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleAddBlog} color="primary">
            Thêm bài viết
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BlogTable;
