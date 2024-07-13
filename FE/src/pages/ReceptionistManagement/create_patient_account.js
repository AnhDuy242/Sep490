import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Typography, TextField, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, Select, MenuItem, FormControl, InputLabel, TablePagination, useMediaQuery
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
const CreatePatientAccount = () => {
    return (
        <>
            <Button className="btn_add" variant="contained">
                Thêm tài khoản
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Tài Khoản</TableCell>
                            <TableCell>Tên bác sĩ</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Mật khẩu</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Tuổi</TableCell>
                            <TableCell>Chuyên khoa</TableCell>
                            <TableCell>Trạng thái hoạt động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        (
                            <TableRow>
                             
                            </TableRow>
                        )
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default CreatePatientAccount;