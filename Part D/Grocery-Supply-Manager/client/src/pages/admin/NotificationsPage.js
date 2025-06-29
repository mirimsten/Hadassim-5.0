import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';

import { Container, Typography, List, ListItem, ListItemText, Button, Pagination, Box } from '@mui/material';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; 

  const fetchNotifications = async (pageNumber = 1) => {
    try {
      const res = await axios.get(`http://localhost:5000/notifications?page=${pageNumber}&limit=${limit}`);
      setNotifications(res.data.notifications);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('שגיאה בשליפת ההודעות', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${id}/read`);
      fetchNotifications(page); // ריענון
    } catch (err) {
      console.error('שגיאה בעדכון ההודעה', err);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <List>
        {notifications.map((note) => (
          <ListItem
            key={note._id}
            sx={{
              bgcolor: note.read ? '#f0f0f0' : '#ffe0e0',
              borderLeft: note.read ? '6px solid #4caf50' : '6px solid #f44336',
              borderRadius: 2,
              mb: 1,
            }}
            secondaryAction={
              !note.read && (
                <Button onClick={() => markAsRead(note._id)} color="primary">
                  Mark as read
                </Button>
              )
            }
          >
            <ListItemText
              primary={note.message}
              secondary={new Date(note.date).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <BackButton />
      </Box>
    </Container>
  );
}

export default NotificationsPage;
