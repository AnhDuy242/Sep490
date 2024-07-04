// Hàm để gọi API lấy danh sách bác sĩ
export const fetchBlogs = async () => {
    const response = await fetch('https://localhost:7240/api/Blog');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
  
  // Hàm để tải dữ liệu bác sĩ và cập nhật trạng thái
  export const loadBlogs = async (setDoctors, setLoading, setError) => {
    try {
      const data = await fetchBlogs(); // Gọi hàm fetchDoctors để lấy dữ liệu
      setDoctors(data.$values); // Cập nhật dữ liệu vào trạng thái
    } catch (error) {
      setError(error.message); // Cập nhật lỗi vào trạng thái
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };
  
  // Hàm để xóa bác sĩ
  export const deleteBlog = async (id) => {
    const response = await fetch(`https://localhost:7240/api/Blog/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete blog with id ${id}`);
    }
  };
  
  // Hàm để thêm bác sĩ mới
  export const addBlog = async (blog) => {
    const response = await fetch('https://localhost:7240/api/Blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blog),
    });
    if (!response.ok) {
      throw new Error('Failed to add new doctor');
    }
    return await response.json();
  };