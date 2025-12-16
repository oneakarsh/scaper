import React from 'react';
import { Typography, Container } from '@mui/material';

const ResortsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        All Resorts
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Browse our complete collection of luxury resorts worldwide.
      </Typography>
      {/* The resorts will be displayed here via the Layout component */}
    </Container>
  );
};

export default ResortsPage;