import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemButton,TextField,Button } from '@mui/material';
import io from 'socket.io-client';
import { AuthContext } from '../../utils/AuthContext';
const socket = io('http://localhost:3001');

const ConsultantChat = () => {
  const { user } = useContext(AuthContext);
  const [activeUsers, setActiveUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (user) {
      socket.emit('join', { role: user.role, name: user.username });

      socket.on('activeUsers', (users) => {
        setActiveUsers(users.filter(u => u.role === 'user'));
      });

      socket.on('message', (message) => {
        if (message.from === selectedUser || message.to === selectedUser) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      socket.off('activeUsers');
      socket.off('message');
    };
  }, [user, selectedUser]);

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (message && selectedUser) {
      socket.emit('message', { to: selectedUser, message });
      setMessages((prevMessages) => [...prevMessages, { from: user.username, to: selectedUser, message }]);
      setInputMessage('');
    }
  };

  return (
    <Box>
      <Typography variant="h6">Active Users</Typography>
      <List>
        {activeUsers.map((activeUser, index) => (
          <ListItem key={index}>
            <ListItemButton onClick={() => setSelectedUser(activeUser.name)}>
              <ListItemText primary={activeUser.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {selectedUser && (
        <Box>
          <Typography variant="h6">Chat with {selectedUser}</Typography>
          <Box>
            {messages.map((msg, index) => (
              <Typography key={index}><strong>{msg.from}:</strong> {msg.message}</Typography>
            ))}
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} variant="contained" color="primary" fullWidth>
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConsultantChat;
