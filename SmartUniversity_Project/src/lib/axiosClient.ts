import axios from 'axios';

// Khởi tạo instance của Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'https://localhost:7031/api', // Đổi port này cho đúng với port Backend C# của bạn đang chạy
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10 giây nếu BE không phản hồi
});

// THÊM INTERCEPTOR REQUEST: Tự động nhét Token vào mọi API gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chúng ta sẽ lưu nó lúc Login)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// THÊM INTERCEPTOR RESPONSE: Xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 401 là lỗi hết hạn Token hoặc chưa đăng nhập
      console.error('Unauthorized! Token hết hạn hoặc không hợp lệ.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        // Tùy chọn: Tự động đá về trang Login
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;