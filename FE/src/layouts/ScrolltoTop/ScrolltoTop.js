import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <StyledButton
      onClick={scrollToTop}
      className={visible ? 'visible' : ''}
    >
      <ArrowUpwardIcon />
    </StyledButton>
  );
};

const StyledButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&.visible': {
    opacity: 1,
  },
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default ScrollToTopButton;
