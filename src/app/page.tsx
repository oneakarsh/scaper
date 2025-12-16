import React from 'react';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import Link from 'next/link';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Discover Your Perfect Resort Getaway
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Book luxurious resorts worldwide with ease. Experience comfort, adventure, and unforgettable memories.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Link href="/resorts" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  mr: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                Explore Resorts
              </Button>
            </Link>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                Get Started
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Why Choose Scaper?
            </Typography>
            <Typography variant="body1" paragraph>
              ✓ Curated selection of premium resorts
            </Typography>
            <Typography variant="body1" paragraph>
              ✓ Easy booking and instant confirmation
            </Typography>
            <Typography variant="body1" paragraph>
              ✓ 24/7 customer support
            </Typography>
            <Typography variant="body1" paragraph>
              ✓ Best price guarantee
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
