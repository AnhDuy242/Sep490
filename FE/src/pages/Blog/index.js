import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Box, Pagination, Grid, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import image1 from '../../assets/images/126488852_686976525522495_760353682947467664_n.png';
import image2 from '../../assets/images/126912836_687750978778383_2129775464474129329_n.jpg';
import image3 from '../../assets/images/127176429_687744135445734_5900068982904423837_n.png';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://localhost:7240/api/ArticleBlog'); // Update the endpoint as needed
        const blogData = response.data.$values;

        // Sort blogs by date in descending order
        blogData.sort((a, b) => new Date(b.date) - new Date(a.date));

        setBlogs(blogData);
        setTotalPages(Math.ceil(blogData.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate the first blog from the rest
  const [featuredBlog, ...otherBlogs] = filteredBlogs;

  // Get blogs for the current page
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedBlogs = otherBlogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          {/* Breadcrumbs Component */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/" color="inherit">
              Trang chủ
            </MuiLink>
            <Typography color="textPrimary">Bài viết</Typography>
          </Breadcrumbs>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}> {/* 70% width for main content */}
              <TextField
                label="Tìm kiếm theo tiêu đề"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
              />

              {/* Display the first blog post prominently */}
              {featuredBlog && (
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', pl: 0 }}>
                  <Box
                    component="img"
                    sx={{
                      width: 320,
                      height: 180,
                      borderRadius: 1,
                      mr: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)', // Zoom effect
                      },
                    }}
                    src={featuredBlog.thumbnail || 'https://via.placeholder.com/320x180'}
                    alt={featuredBlog.title}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        mb: 5,
                        fontSize: 20,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mt: 5
                      }}
                    >
                      <Link to={`/viewDetailBlog/${featuredBlog.blogId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {featuredBlog.title}
                      </Link>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1 }} />
                      {format(new Date(featuredBlog.date), 'eeee, d MMMM yyyy', { locale: vi })}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                      {featuredBlog.excerpt}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Display the rest of the blog posts in a vertical list */}
              {paginatedBlogs.map(blog => (
                <Box key={blog.blogId} sx={{ mb: 2, display: 'flex', alignItems: 'center', pl: 0 }}>
                  <Box
                    component="img"
                    sx={{
                      width: 150,
                      height: 100,
                      borderRadius: 1,
                      mr: 2,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)', // Zoom effect
                      },
                    }}
                    src={blog.thumbnail || 'https://via.placeholder.com/100'}
                    alt={blog.title}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <CalendarTodayIcon sx={{ mr: 1 }} />
                      {format(new Date(blog.date), 'eeee, d MMMM yyyy', { locale: vi })}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: 18,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Link to={`/viewDetailBlog/${blog.blogId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {blog.title}
                      </Link>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {blog.excerpt}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Pagination Controls */}
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mt: 4, ml: 35 }}
              />
            </Grid>
            <Grid item xs={12} md={4}> {/* 30% width for banners */}
        
              <Box sx={{ mb: 2, height: 200, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    borderRadius: 1,
                  }}
                  src={image1}
                  alt="Banner Image"
                />
              </Box>
              <Box sx={{ mb: 2, height: 200, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    borderRadius: 1,
                  }}
                  src={image2}
                  alt="Banner Image"
                />
              </Box>
              <Box sx={{ height: 200, backgroundColor: '#f0f0f0', borderRadius: 1 }}>
                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    borderRadius: 1,
                  }}
                  src={image3}
                  alt="Banner Image"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default BlogList;
