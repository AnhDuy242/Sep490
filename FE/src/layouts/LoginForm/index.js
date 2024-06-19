// src/components/LoginForm.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/bootstrap.css';
import '../LoginForm/LoginForm.css';
import google_icon from '../../assets/images/google.png';

const LoginForm = ({ show, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://example.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Login successful:', data);
      // Reset form fields and any error state
      setUsername('');
      setPassword('');
      setError(null);
    } catch (error) {
      setError(error.message || 'Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="btn-close">
        <Modal.Title>Đăng nhập</Modal.Title>
        <button type="button" onClick={handleClose} className="close-x" aria-label="Close">
          <span className="x-button" aria-hidden="true">&times;</span>
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className={`error-container ${error ? 'show' : ''}`}>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <div className='register-block'>
          <span className='register-text'>Bạn chưa có tài khoản? Đăng ký ngay</span>
        </div>

        <Form onSubmit={onSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Check
              type="checkbox"
              label="Hiển thị mật khẩu"
              onClick={togglePasswordVisibility}
            />
          </Form.Group>

          <Form.Group controlId="signin-by-other">
            <div className='or'>
              <hr className="new1" />
              <div>
                <span>Hoặc đăng nhập bằng</span>
              </div>
              <hr className="new1" />
            </div>
            <div className="btn-social">
              <a className="btn btn-google" href="/identity/externallogin/?provider=Google"><img src={google_icon} alt="Google" /></a>
            </div>
          </Form.Group>

          <Button variant="primaryD" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginForm;
