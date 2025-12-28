'use client';

import React from 'react';
import { Container, Typography, Box, Avatar, List, ListItem, ListItemText, Divider } from '@mui/material';

const mockUser = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    joined: '2024-09-12',
};

const mockBookings = [
    { id: 'BK-001', resort: 'Paradise Resort', dates: 'May 1 - May 7, 2025' },
    { id: 'BK-002', resort: 'Forest Retreat', dates: 'Jun 15 - Jun 18, 2025' },
];

export default function ProfilePage() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 72, height: 72 }}>JD</Avatar>
                <Box>
                    <Typography variant="h5">{mockUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{mockUser.email}</Typography>
                    <Typography variant="caption" color="text.secondary">Joined {new Date(mockUser.joined).toLocaleDateString()}</Typography>
                </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 1 }}>Recent Bookings</Typography>
            <List component="nav" aria-label="recent bookings" sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {mockBookings.map((b) => (
                    <React.Fragment key={b.id}>
                        <ListItem>
                            <ListItemText primary={`${b.resort}`} secondary={`${b.dates} — ${b.id}`} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>

            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    This is a mock profile. Connect to the API to load real user data.
                </Typography>
            </Box>
        </Container>
    );
}
