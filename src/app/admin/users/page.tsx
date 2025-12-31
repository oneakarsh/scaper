'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material';
import {
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
import { userAPI } from '@/lib/api';
import { User } from '@/types';

export default function UsersManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll(session?.accessToken);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user has superadmin role (only superadmins can manage users)
    const userRole = session.user.role;
    if (userRole !== 'superadmin') {
      router.push('/admin');
      return;
    }

    setCurrentUser(session.user);
    fetchUsers();
  }, [router, session, status, fetchUsers]);

  const handleOpenUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
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
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      password: '',
    });
  };

  const handleSaveUser = async () => {
    try {
      const userData = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        ...(userForm.password && { password: userForm.password }), // Only include password if provided
      };

      if (editingUser) {
        await userAPI.update(editingUser.id, userData, session?.accessToken);
      } else {
        await userAPI.create(userData, session?.accessToken);
      }

      handleCloseUserDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userAPI.delete(id, session?.accessToken);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <AdminIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Admins</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {users.filter(u => u.role === 'admin').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', color: 'white' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Super Admins</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {users.filter(u => u.role === 'superadmin').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', color: 'white' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Active Users</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {users.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Users Table */}
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

      {/* User Dialog */}
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
    </Container>
  );
}