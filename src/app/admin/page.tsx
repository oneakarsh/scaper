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
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resortAPI, bookingAPI, userAPI } from '@/lib/api';
import { Resort, Booking, User } from '@/types';

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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  // User management state
  const [userDialog, setUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as 'admin' | 'superadmin',
    password: '',
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user has admin or superadmin role
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/');
      return;
    }

    // setCurrentUser(session.user as User);
    setCurrentUser(session.user as User);
    fetchData();
  }, [router, session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const promises = [
        resortAPI.getAll(session?.accessToken),
        bookingAPI.getAllAdmin(session?.accessToken),
      ];

      // Fetch users only for superadmins
      if (currentUser?.role === 'superadmin') {
        promises.push(userAPI.getAll(session?.accessToken));
      }

      const [resortsRes, bookingsRes, usersRes] = await Promise.all(promises);

      const resortsData = resortsRes?.data?.data ?? resortsRes?.data ?? [];
      const bookingsData = bookingsRes?.data?.data ?? bookingsRes?.data ?? [];
      const usersData = usersRes?.data?.data ?? usersRes?.data ?? [];

      setResorts(Array.isArray(resortsData) ? resortsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      if (currentUser?.role === 'superadmin') {
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

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
        await resortAPI.update(editingResort.id!, resortData, session?.accessToken);
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

  // User management functions
  const handleOpenUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as 'admin' | 'superadmin',
        password: '', // Don't populate password for editing
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
      });
    }
    setUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialog(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      const userData = {
        ...userForm,
        ...(editingUser ? {} : { password: userForm.password }), // Only include password for new users
      };

      if (editingUser) {
        await userAPI.update(editingUser.id, userData, session?.accessToken);
      } else {
        await userAPI.create(userData, session?.accessToken);
      }

      handleCloseUserDialog();
      fetchData();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id, session?.accessToken);
        fetchData();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
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

  // if (loading) {
  //   return (
  //     <Box sx={{ py: 4, px: 2 }}>
  //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
  //         <CircularProgress />
  //       </Box>
  //     </Box>
  //   );
  // }

  return (
    <div>
      <Box sx={{ py: 4, px: 2 }}>
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
          {currentUser?.role === 'superadmin' && (
            <Tab icon={<PeopleIcon />} label="Manage Users" />
          )}
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            {/* Welcome Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 4,
                borderRadius: 3,
                color: 'white',
                mb: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                Welcome back, {currentUser?.name || 'Admin'}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                {currentUser?.role === 'superadmin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {currentUser?.role === 'superadmin'
                  ? 'Manage users, resorts, and oversee the entire system'
                  : 'Manage resorts and bookings for your assigned properties'
                }
              </Typography>
            </Box>

            {/* System Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <HotelIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Total Resorts</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.totalResorts}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Total Bookings</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.totalBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Pending</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.pendingBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Confirmed</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.confirmedBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Super Admin Additional Stats */}
            {currentUser?.role === 'superadmin' && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AdminIcon sx={{ mr: 1, fontSize: 28 }} />
                        <Typography variant="h6">Total Admins</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold">
                        {users.filter(u => u.role === 'admin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <SecurityIcon sx={{ mr: 1, fontSize: 28 }} />
                        <Typography variant="h6">Super Admins</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold">
                        {users.filter(u => u.role === 'superadmin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Quick Actions */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Quick Actions</Typography>
              <Typography>
                Use the tabs above to manage resorts and bookings.
                {currentUser?.role === 'superadmin' && ' As a super admin, you can also manage user accounts.'}
              </Typography>
            </Alert>
          </Box>
        </TabPanel>

        {/* Manage Resorts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  <HotelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Resort Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create and manage resort properties
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenResortDialog()}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Add Resort
              </Button>
            </Box>

            {/* Resorts Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Price/Night</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rooms</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resorts.map((resort, index) => (
                    <TableRow
                      key={resort.id ?? resort._id ?? index}
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{resort.name}</TableCell>
                      <TableCell>{resort.location}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${resort.pricePerNight}
                      </TableCell>
                      <TableCell>{resort.rooms}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenResortDialog(resort)}
                          sx={{
                            mr: 1,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': { backgroundColor: '#1565c0' }
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteResort(resort.id ?? resort._id!)}
                          sx={{
                            backgroundColor: '#d32f2f',
                            color: 'white',
                            '&:hover': { backgroundColor: '#b71c1c' }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {resorts.length === 0 && (
              <Box textAlign="center" py={6}>
                <HotelIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No resorts found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Start by adding your first resort property
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Manage Bookings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white',
                mb: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                <BookingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Booking Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Review and manage customer reservations
              </Typography>
            </Box>

            {/* Bookings Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Resort</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check-in</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check-out</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Guests</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {booking.id.slice(-8)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {booking.resort?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.numberOfGuests}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${booking.totalPrice}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' && (
                          <Box>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                              sx={{
                                mr: 1,
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                '&:hover': { backgroundColor: '#1b5e20' }
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                              sx={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                '&:hover': { backgroundColor: '#b71c1c' }
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {bookings.length === 0 && (
              <Box textAlign="center" py={6}>
                <BookingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No bookings found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bookings will appear here once customers make reservations
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Manage Users Tab (Super Admin Only) */}
        {currentUser?.role === 'superadmin' && (
          <TabPanel value={tabValue} index={3}>
            <Box>
              {/* Header with better styling */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 3,
                  borderRadius: 2,
                  color: 'white'
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    User Management
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Manage admin users and their permissions
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleOpenUserDialog()}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Add Admin
                </Button>
              </Box>

              {/* Stats Cards for Users */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AdminIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Total Admins</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {users.filter(u => u.role === 'admin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', color: 'white' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <SecurityIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Super Admins</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {users.filter(u => u.role === 'superadmin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', color: 'white' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PeopleIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Active Users</Typography>
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {users.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Enhanced Users Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:hover': { backgroundColor: '#f9f9f9' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={user.role === 'superadmin' ? 'error' : 'primary'}
                            size="small"
                            variant="filled"
                            sx={{
                              fontWeight: 'bold',
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenUserDialog(user)}
                            sx={{
                              mr: 1,
                              backgroundColor: '#1976d2',
                              color: 'white',
                              '&:hover': { backgroundColor: '#1565c0' }
                            }}
                          >
                            Edit
                          </Button>
                          {user.role !== 'superadmin' && (
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteUser(user.id)}
                              sx={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                '&:hover': { backgroundColor: '#b71c1c' }
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {users.length === 0 && (
                <Box textAlign="center" py={6}>
                  <PeopleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No users found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start by adding your first admin user
                  </Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        )}
      </Paper>
    </Box>

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

      {/* User Dialog (Super Admin Only) */}
      <Dialog
        open={userDialog}
        onClose={handleCloseUserDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 3
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
            {editingUser ? <EditIcon sx={{ mr: 1 }} /> : <PersonAddIcon sx={{ mr: 1 }} />}
            <Typography variant="h5" fontWeight="bold">
              {editingUser ? 'Edit User' : 'Add New Admin'}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {editingUser ? 'Update user information and permissions' : 'Create a new admin user account'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="User Role"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'superadmin' })}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                helperText={userForm.role === 'superadmin' ? 'Super admins can manage other users' : 'Admins can manage resorts and bookings'}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </TextField>
            </Grid>
            {!editingUser && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  helperText="Minimum 8 characters required"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseUserDialog}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {editingUser ? 'Update User' : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}