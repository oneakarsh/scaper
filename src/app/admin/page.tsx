'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  BookOnline as BookingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resortAPI, bookingAPI } from '@/lib/api';
import { Resort, Booking } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalResorts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });

  // Resort management state
  const [resortDialog, setResortDialog] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);
  const [resortForm, setResortForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: 0,
    longitude: 0,
    pricePerNight: 0,
    amenities: '',
    maxGuests: 1,
    rooms: 1,
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // For now, assume all authenticated users can access admin
    // You can add role checking here if needed
    fetchData();
  }, [router, session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resortsRes, bookingsRes] = await Promise.all([
        resortAPI.getAll(session?.accessToken),
        bookingAPI.getAllAdmin(session?.accessToken),
      ]);

      const resortsData = resortsRes?.data?.data ?? resortsRes?.data ?? [];
      const bookingsData = bookingsRes?.data?.data ?? bookingsRes?.data ?? [];

      setResorts(Array.isArray(resortsData) ? resortsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      // Calculate stats
      setStats({
        totalResorts: resortsData.length || 0,
        totalBookings: bookingsData.length || 0,
        pendingBookings: bookingsData.filter((b: Booking) => b.status === 'pending').length || 0,
        confirmedBookings: bookingsData.filter((b: Booking) => b.status === 'confirmed').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Resort management functions
  const handleOpenResortDialog = (resort?: Resort) => {
    if (resort) {
      setEditingResort(resort);
      setResortForm({
        name: resort.name,
        description: resort.description,
        location: resort.location,
        latitude: resort.latitude,
        longitude: resort.longitude,
        pricePerNight: resort.pricePerNight,
        amenities: resort.amenities.join(', '),
        maxGuests: resort.maxGuests,
        rooms: resort.rooms,
      });
    } else {
      setEditingResort(null);
      setResortForm({
        name: '',
        description: '',
        location: '',
        latitude: 0,
        longitude: 0,
        pricePerNight: 0,
        amenities: '',
        maxGuests: 1,
        rooms: 1,
      });
    }
    setResortDialog(true);
  };

  const handleCloseResortDialog = () => {
    setResortDialog(false);
    setEditingResort(null);
  };

  const handleSaveResort = async () => {
    try {
      const resortData = {
        ...resortForm,
        amenities: resortForm.amenities.split(',').map(a => a.trim()),
      };

      if (editingResort) {
        await resortAPI.update(editingResort.id, resortData, session?.accessToken);
      } else {
        await resortAPI.create(resortData, session?.accessToken);
      }

      handleCloseResortDialog();
      fetchData();
    } catch (error) {
      console.error('Failed to save resort:', error);
    }
  };

  const handleDeleteResort = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resort?')) {
      try {
        await resortAPI.delete(id, session?.accessToken);
        fetchData();
      } catch (error) {
        console.error('Failed to delete resort:', error);
      }
    }
  };

  // Booking management functions
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await bookingAPI.updateStatus(id, status, session?.accessToken);
      fetchData();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning' as const;
      case 'confirmed': return 'success' as const;
      case 'cancelled': return 'error' as const;
      default: return 'default' as const;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Admin Dashboard
      </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <HotelIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Resorts</Typography>
              </Box>
              <Typography variant="h4" color="primary">{stats.totalResorts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4" color="primary">{stats.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>{stats.pendingBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Confirmed</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'success.main' }}>{stats.confirmedBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<HotelIcon />} label="Manage Resorts" />
          <Tab icon={<BookingIcon />} label="Manage Bookings" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Welcome to the admin dashboard! Use the tabs above to manage resorts and bookings.
          </Alert>
          <Typography>
            Here you can monitor your resort booking system. The overview shows key statistics at a glance.
          </Typography>
        </TabPanel>

        {/* Manage Resorts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Resort Management</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenResortDialog()}
            >
              Add Resort
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price/Night</TableCell>
                  <TableCell>Rooms</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resorts.map((resort) => (
                  <TableRow key={resort.id}>
                    <TableCell>{resort.name}</TableCell>
                    <TableCell>{resort.location}</TableCell>
                    <TableCell>${resort.pricePerNight}</TableCell>
                    <TableCell>{resort.rooms}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenResortDialog(resort)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteResort(resort.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Manage Bookings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Booking Management
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Resort</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell>Check-out</TableCell>
                  <TableCell>Guests</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id.slice(-8)}</TableCell>
                    <TableCell>{booking.resort?.name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.numberOfGuests}</TableCell>
                    <TableCell>${booking.totalPrice}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            sx={{ mr: 1 }}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Resort Dialog */}
      <Dialog open={resortDialog} onClose={handleCloseResortDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingResort ? 'Edit Resort' : 'Add New Resort'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={resortForm.name}
                onChange={(e) => setResortForm({ ...resortForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location"
                value={resortForm.location}
                onChange={(e) => setResortForm({ ...resortForm, location: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={resortForm.description}
                onChange={(e) => setResortForm({ ...resortForm, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Price per Night"
                value={resortForm.pricePerNight}
                onChange={(e) => setResortForm({ ...resortForm, pricePerNight: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Guests"
                value={resortForm.maxGuests}
                onChange={(e) => setResortForm({ ...resortForm, maxGuests: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Rooms"
                value={resortForm.rooms}
                onChange={(e) => setResortForm({ ...resortForm, rooms: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Amenities (comma-separated)"
                value={resortForm.amenities}
                onChange={(e) => setResortForm({ ...resortForm, amenities: e.target.value })}
                helperText="e.g., WiFi, Pool, Spa, Restaurant"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={resortForm.latitude}
                onChange={(e) => setResortForm({ ...resortForm, latitude: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={resortForm.longitude}
                onChange={(e) => setResortForm({ ...resortForm, longitude: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResortDialog}>Cancel</Button>
          <Button onClick={handleSaveResort} variant="contained">
            {editingResort ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}