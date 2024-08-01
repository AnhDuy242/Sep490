import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, MenuItem, Select, InputLabel, FormControl, Box, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const MedicalNotebookList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('id'); // Default to 'id'
  const [notebooks, setNotebooks] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'error' or 'success'
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [visibleImages, setVisibleImages] = useState({}); // Track visibility of images

  useEffect(() => {
    loadAllNotebooks();
  }, []);

  const loadAllNotebooks = async () => {
    try {
      const response = await axios.get('https://localhost:7240/api/DoctorMedicalNotebook/ViewAllMedicalNoteBooks_2');
      setNotebooks(response.data.$values || []);
    } catch (error) {
      setSnackbarMessage('Lỗi khi tải danh sách hồ sơ bệnh án');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const loadTestResults = async (mId) => {
    try {
      const response = await axios.get(`https://localhost:7240/api/PatientMedicalNoteBook/GetTestResult?mid=${mId}`);
      setTestResults(prevResults => ({
        ...prevResults,
        [mId]: response.data.$values || []
      }));
    } catch (error) {
      setSnackbarMessage('Lỗi khi tải kết quả kiểm tra');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSearch = async () => {
    try {
      let url = '';
  
      if (searchType === 'id') {
        url = `https://localhost:7240/api/DoctorMedicalNotebook/ViewMedicalNoteBookByPatientId?pid=${searchValue}`;
      } else if (searchType === 'name') {
        url = `https://localhost:7240/api/DoctorMedicalNoteBook/ViewMedicalNoteBookByPatientName?name=${searchValue}`;
      }
  
      if (searchValue.trim() === '') {
        loadAllNotebooks(); // Load all notebooks if search value is empty
        return;
      }
  
      const response = await axios.get(url);
      const data = response.data;
  
      if (Array.isArray(data.$values) && data.$values.length === 0) {
        loadAllNotebooks(); // Load all notebooks if no results are found
        setSnackbarMessage('Không tìm thấy hồ sơ bệnh án');
        setSnackbarSeverity('info');
        setOpenSnackbar(true);
      } else {
        const notebooksData = Array.isArray(data.$values) ? data.$values: [];
        console.log(notebooks);
        setNotebooks(notebooksData);
        setSnackbarMessage('Danh sách hồ sơ bệnh án đã được cập nhật');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      }
    } catch (error) {
      let errorMessage = 'Lỗi khi tìm kiếm hồ sơ bệnh án';
      if (error.response) {
        errorMessage = error.response.data || errorMessage;
      } else if (error.request) {
        errorMessage = 'Không nhận được phản hồi từ máy chủ';
      } else {
        errorMessage = error.message || errorMessage;
      }
      console.error('Search Error:', error); // Log error for debugging
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleToggleImage = (mId) => {
    if (visibleImages[mId]) {
      // Hide images if they are already visible
      setVisibleImages(prev => ({ ...prev, [mId]: false }));
    } else {
      // Load and show images
      loadTestResults(mId);
      setVisibleImages(prev => ({ ...prev, [mId]: true }));
    }
  };

  const handleOpenDialog = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage('');
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
        <FormControl style={{ width: 200 }}>
          <InputLabel>Tìm theo</InputLabel>
          <Select
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
            label="Search Type"
          >
            <MenuItem value="id"> ID</MenuItem>
            <MenuItem value="name">Tên bệnh nhân</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: 300 }}>
          <TextField
            label={searchType === 'id' ? "Nhập ID bệnh án" : "Nhập tên bệnh nhân"}
            variant="outlined"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <IconButton color="primary" onClick={loadAllNotebooks} style={{ marginLeft: 8 }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      <TableContainer component={Paper} style={{ marginTop: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Toa thuốc</TableCell>
              <TableCell>Chẩn đoán</TableCell>
              <TableCell>Tên bệnh nhân</TableCell>
              <TableCell>Bác sĩ khám </TableCell>
              <TableCell>Kết quả khám</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notebooks.map((notebook) => (
              <TableRow key={notebook.id}>
                <TableCell>{notebook.id}</TableCell>
                <TableCell>{notebook.prescription}</TableCell>
                <TableCell>{notebook.diagnostic}</TableCell>
                <TableCell>{notebook.patientName}</TableCell>
                <TableCell>{notebook.doctorName}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleToggleImage(notebook.id)}
                  >
                    {visibleImages[notebook.id] ? 'Ẩn ảnh' : 'Xem ảnh'}
                  </Button>
                  {visibleImages[notebook.id] && testResults[notebook.id] && testResults[notebook.id].map((result) => (
                    <div key={result.imgId}>
                      <Button onClick={() => handleOpenDialog(result.imgUrl)}>Xem ảnh</Button>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '80%',
            maxHeight: '80%',
            margin: 'auto',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
          <img
            src={selectedImage}
            alt="Test Result"
            style={{ maxWidth: '80%', maxHeight: '90%', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MedicalNotebookList;
