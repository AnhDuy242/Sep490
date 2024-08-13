import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  InputAdornment,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility, Search, Add, Refresh } from '@mui/icons-material';
import { Alert } from '@mui/material';
import CreateBlogDialog from './component/CreateBlogDialog';
import EditBlogDialog from './component/EditBlogDialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const accountId = localStorage.getItem('accountId');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTitle, startDate, endDate]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://localhost:7240/api/ArticleBlog');
      setBlogs(response.data.$values);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchTitle) {
      filtered = filtered.filter(blog => blog.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }

    if (startDate && endDate) {
      filtered = filtered.filter(blog => {
        const blogDate = new Date(blog.date);
        return blogDate >= new Date(startDate) && blogDate <= new Date(endDate);
      });
    }

    setFilteredBlogs(filtered);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:7240/api/ArticleBlog/${currentBlogId}`);
      fetchBlogs(); // Refresh the list
      setSnackbarMessage('Xóa blog thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setSnackbarMessage('Có lỗi khi xóa blog');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleEdit = (id) => {
    setCurrentBlogId(id);
    setOpenEditDialog(true);
  };

  const handlePreview = (blog) => {
    setPreviewBlog(blog);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDeleteDialog = (id) => {
    setCurrentBlogId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleRefresh = () => {
    setSearchTitle('');
    setStartDate('');
    setEndDate('');
    fetchBlogs(); // Refresh the list
  };

  const handleAddBlog = () => {
    fetchBlogs(); // Refresh the list after adding a new blog
    setOpenAddDialog(false); // Close the dialog after saving
  };
  const handleSaveEdit = (message) => {
    fetchBlogs(); // Refresh the list after editing
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  return (
    <div>
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              label="Tìm kiếm theo tiêu đề"
              variant="outlined"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Ngày bắt đầu"
              type="date"
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Ngày kết thúc"
              type="date"
              variant="outlined"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
            >
              Thêm mới blog
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
             Làm mới
            </Button>
          </Grid>
        </Grid>
      </Box>

      {filteredBlogs.map((blog) => (
        <Card
          key={blog.blogId}
          style={{
            margin: '16px',
            padding: '16px',
            backgroundImage: `url(${blog.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            color: '#fff'
          }}
        >
          <CardContent style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '16px' }}>
            <Typography variant="h5">{blog.title}</Typography>
            <Typography variant="body2" color="textSecondary">{blog.content}</Typography>
            <Typography variant="caption" color="textSecondary">{new Date(blog.date).toLocaleDateString()}</Typography>
            <div style={{ marginTop: '16px' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Visibility />}
                onClick={() => handlePreview(blog)}
              >
               Xem trước
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Edit />}
                style={{ marginLeft: '8px' }}
                onClick={() => handleEdit(blog.blogId)}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                style={{ marginLeft: '8px' }}
                onClick={() => handleOpenDeleteDialog(blog.blogId)}
              >
              Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có muốn xóa bài viết này không??</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="secondary">
           Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <CreateBlogDialog open={openAddDialog} onClose={handleCloseAddDialog} onSave={handleAddBlog} />
      
      <EditBlogDialog open={openEditDialog} onClose={handleCloseEditDialog} blogId={currentBlogId} onSave={handleSaveEdit} />

      <Dialog open={!!previewBlog} onClose={() => setPreviewBlog(null)} fullWidth maxWidth="95vw">
        <DialogContent>
          {previewBlog && (
            <div>
              <Typography style={{textAlign:'center'}} variant="h5">{previewBlog.title}</Typography>
              <div style={{ marginTop: '16px' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewBlog.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewBlog(null)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogList;
