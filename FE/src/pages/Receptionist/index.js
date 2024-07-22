import ChatPopup from "../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForRecepptionist.js";
import React, { useState, useEffect } from 'react';
import { Fab, Badge, Popover, Box, Typography, TextField, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';
import LoginForm from '../../layouts/LoginForm'; // Import LoginForm
import { login } from '../../services/Authentication';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3001'); // Connect to Socket.io server

const tokenTimeout = 3600000; // 1 hour in milliseconds
const ReceptionistDemo =()=>{
    return(
        <>
    <ChatPopup></ChatPopup>
    </>
    )
}
export default ReceptionistDemo;