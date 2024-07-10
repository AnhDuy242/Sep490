// blog_service.js

// Hàm để gọi API lấy danh sách bác sĩ
export const fetchBlogs = async () => {
    const response = await fetch('https://localhost:7240/api/Blog');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
  
  // Hàm để tải dữ liệu blog và cập nhật trạng thái
  export const loadBlogs = async (setDoctors, setLoading, setError) => {
    try {
      const data = await fetchBlogs(); // Gọi hàm fetchBlogs để lấy dữ liệu
      setDoctors(data.$values); // Cập nhật dữ liệu vào trạng thái
    } catch (error) {
      setError(error.message); // Cập nhật lỗi vào trạng thái
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };
  
  // Hàm để xóa blog
  export const deleteBlog = async (id) => {
    const response = await fetch(`https://localhost:7240/api/Blog/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete blog with id ${id}`);
    }
  };
  
  //Hàm để thêm blog mới
  export const addBlog = async (blog) => {
    const response = await fetch('https://localhost:7240/api/Blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blog),
    });
    if (!response.ok) {
      throw new Error('Failed to add new blog');
    }
    return await response.json();
  };

  // export const uploadImage = async (file) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('image', file);
  
  //     const response = await fetch('https://localhost:7240/api/Blog', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to upload image');
  //     }
  
  //     const data = await response.json();
  //     return data.url; // Giả sử API trả về một đường dẫn URL cho ảnh đã tải lên
  //   } catch (error) {
  //     throw new Error(`Error uploading image: ${error.message}`);
  //   }
  // };