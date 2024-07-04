import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, CircularProgress
} from '@mui/material';
import { loadBlogs,deleteBlog, addBlog } from '../../services/blog_service'; // You need to create this service
import InfoIcon from '@mui/icons-material/Info';


const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    loadBlogs(setBlogs, setLoading, setError);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = blogs
      .filter(blog =>
        blog.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
    setFilteredBlogs(filtered);
  };

  const handleViewDetail = (blog_id) => {
    // Implement the navigation to the blog detail page
    console.log('View detail for blog ID:', blog_id);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography fontSize={50}>Blog Management</Typography>
      <TextField
        label="Search by title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table className="table_list">
          <TableHead>
            <TableRow>
              <TableCell>Blog ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(searchQuery ? filteredBlogs : blogs).map((blog) => (
              <TableRow key={blog.blog_id}>
                <TableCell>{blog.blog_id}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.content}</TableCell>
                <TableCell>
                  <IconButton
                    title="View Detail"
                    onClick={() => handleViewDetail(blog.blog_id)}
                  >
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BlogTable;
