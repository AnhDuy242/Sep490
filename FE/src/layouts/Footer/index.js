import React from "react";
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { SocialIcon } from 'react-social-icons';
import '../Footer/Footer.css';



function Footer() {
  return (
    <>
      <GlobalStyle />
      <Box sx={{ bgcolor: '#00508E', color: '#fff', py: 6, px: 4 }}>
        <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Phòng khám đa khoa 68A Hà Đông
              </Typography>
              <Typography variant="body2">
                Nơi bệnh nhân có thể đặt niềm tin bởi dịch vụ khám chữa
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Dịch vụ
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Các gói khám sức khoẻ và tầm soát ung thư
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Các dịch vụ khác
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Tư vấn sức khoẻ từ xa
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ship thuốc tận nhà
              </Typography>
              <Typography variant="body2">
                BÁC SĨ GIA ĐÌNH – KHÁM VÀ CHĂM SÓC SỨC KHỎE ĐỊNH KỲ CHO 3 THẾ HỆ
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Liên hệ
              </Typography>
              <Typography variant="body2">
                Hotline: 1900.636.115
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Liên lạc với chúng tôi
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  variant="outlined"
                  placeholder="Nhập email của bạn..."
                  size="small"
                  sx={{ bgcolor: '#fff', borderRadius: 1, flexGrow: 1 }}
                />
                <IconButton type="submit" sx={{ ml: 1, bgcolor: '#007bff', color: '#fff' }}>
                  <SendIcon />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <SocialIcon url="https://facebook.com" bgColor="#fff" style={{ height: 35, width: 35 }} />
                <SocialIcon url="https://twitter.com" bgColor="#fff" style={{ height: 35, width: 35 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Footer;
