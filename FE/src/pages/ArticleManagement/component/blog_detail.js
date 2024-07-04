import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BlogDetail = () => {
    const location = useLocation();
    const id = location.pathname.split('/').pop();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        fetch(`https://localhost:7240/api/Blog/${id}`)
            .then(response => response.json())
            .then(data => setBlog(data))
            .catch(error => console.error('Error fetching blog detail:', error));
    }, [id]);

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p>{blog.detail}</p>
        </div>
    );
};

export default BlogDetail;
