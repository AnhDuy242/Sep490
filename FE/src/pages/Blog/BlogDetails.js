import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Custom image renderer
const ImageRenderer = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/ArticleBlog/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Breadcrumbs Component */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={Link} to="/" color="inherit">
            Home
          </MuiLink>
          <MuiLink component={Link} to="/viewAllBlogs" color="inherit">
            Blog List
          </MuiLink>
          <Typography color="textPrimary">Chi tiết bài viết {blog.title}{blog.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="div" sx={{ mb: 2 }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {format(new Date(blog.date), 'eeee, d MMMM yyyy', { locale: vi })}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ReactMarkdown
            children={blog.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ node, ...props }) => <ImageRenderer {...props} />
            }}
          />
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default BlogDetail;
