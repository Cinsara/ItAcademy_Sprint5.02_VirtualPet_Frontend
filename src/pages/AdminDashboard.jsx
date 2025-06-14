import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Button,
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  TextField, IconButton, CircularProgress, Container,
  Alert, Avatar, Chip, Stack, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, ListItemIcon, ListItemText, Collapse
} from '@mui/material';
import {
  Delete, AdminPanelSettings, Logout, Save, Pets, People,
  MoreVert, Upgrade, Warning, Check, Close, KeyboardArrowDown, KeyboardArrowUp
} from '@mui/icons-material';
import { deepPurple, teal, orange, red } from '@mui/material/colors';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [editedUsers, setEditedUsers] = useState([]);
  const [editedPets, setEditedPets] = useState([]);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [promoteDialog, setPromoteDialog] = useState({ open: false, userId: null, username: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const token = localStorage.getItem('token');

  const toggleUserExpand = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  useEffect(() => {
    if (!token) return setAuthorized(false);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];
      setAuthorized(roles.includes('ROLE_ADMIN'));
    } catch (e) {
      setAuthorized(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authorized) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, petsRes] = await Promise.all([
          fetch('http://localhost:8080/admin/users', { 
            headers: { Authorization: 'Bearer ' + token } 
          }),
          fetch('http://localhost:8080/admin/pets', { 
            headers: { Authorization: 'Bearer ' + token } 
          })
        ]);
        
        if (!usersRes.ok || !petsRes.ok) throw new Error('Error loading data');
        
        const usersData = await usersRes.json();
        const petsData = await petsRes.json();
        
        setUsers(usersData);
        setPets(petsData);

        const initialExpanded = {};
        usersData.forEach(user => {
          initialExpanded[user.id] = false;
        });
        setExpandedUsers(initialExpanded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authorized]);

  const getUserPets = (userId) => {
    return pets.filter(pet => pet.ownerId === userId);
  };

  const handleUserChange = (id, field, value) => {
    setUsers(users.map(user => user.id === id ? { ...user, [field]: value } : user));
    setEditedUsers(prev => [...new Set([...prev, id])]);
  };

  const handlePetChange = (id, field, value) => {
    setPets(pets.map(pet => pet.id === id ? { ...pet, [field]: value } : pet));
    setEditedPets(prev => [...new Set([...prev, id])]);
  };

  const saveUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        editedUsers.map(id => {
          const user = users.find(u => u.id === id);
          return fetch(`http://localhost:8080/admin/user/${id}/diamonds?diamonds=${user.diamonds}`, {
            method: 'PUT',
            headers: { Authorization: 'Bearer ' + token }
          });
        })
      );
      setSuccess('Users updated successfully');
      setEditedUsers([]);
    } catch (err) {
      setError('Error saving users');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const savePets = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        editedPets.map(id => {
          const pet = pets.find(p => p.id === id);
          return fetch(`http://localhost:8080/admin/pet/${id}/stats`, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet)
          });
        })
      );
      setSuccess('Pets updated successfully');
      setEditedPets([]);
    } catch (err) {
      setError('Error saving pets');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const { type, id } = deleteDialog;
      
      const url = type === 'user' 
        ? `http://localhost:8080/admin/users/${id}`
        : `http://localhost:8080/admin/pets/${id}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Delete error ${type}`);
      }

      if (type === 'user') {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        setExpandedUsers(prev => {
          const newExpanded = {...prev};
          delete newExpanded[id];
          return newExpanded;
        });
      } else {
        setPets(prevPets => prevPets.filter(pet => pet.id !== id));
      }
      
      setSuccess(`${type === 'user' ? 'User' : 'Pet'} successfully deleted`);
      setDeleteDialog({ open: false, type: null, id: null });
    } catch (err) {
      setError(`Delete error ${deleteDialog.type === 'user' ? 'user' : 'pet'}: ${err.message}`);
      console.error('Error in handleDelete:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handlePromoteUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/admin/makeAdmin/${promoteDialog.userId}`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token }
      });
      
      if (!response.ok) throw new Error('Error when promoting user');
      
      setUsers(users.map(user => 
        user.id === promoteDialog.userId 
          ? { ...user, rol: 'ADMIN' } 
          : user
      ));
      
      setSuccess(`User ${promoteDialog.username} promoted to administrator`);
      setPromoteDialog({ open: false, userId: null, username: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleMenuOpen = (event, item, type) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem({ ...item, type });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (authorized === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (authorized === false) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Access denied</Typography>
          <Typography>You do not have permission to access this page</Typography>
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/'}
          startIcon={<Logout />}
        >
          Back to top
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          <AdminPanelSettings sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Administration Panel</Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<Logout />}
            sx={{ textTransform: 'none' }}
          >
            Sign out
          </Button>
        </Toolbar>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
              height: 3
            }
          }}
        >
          <Tab label="Usuarios" icon={<People />} iconPosition="start" />
          <Tab label="Mascotas" icon={<Pets />} iconPosition="start" />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {tab === 0 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>
                User Management
              </Typography>
              <Button 
                variant="contained" 
                onClick={saveUsers}
                disabled={editedUsers.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  bgcolor: deepPurple[500],
                  '&:hover': { bgcolor: deepPurple[700] }
                }}
              >
                Save Changes
              </Button>
            </Stack>
            
            <Paper elevation={3} sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Diamonds</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pets</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => {
                    const userPets = getUserPets(user.id);
                    return (
                      <React.Fragment key={user.id}>
                        <TableRow hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}>
                                {user.username.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography>{user.username}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.rol} 
                              size="small"
                              color={user.rol === 'ADMIN' ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              value={user.diamonds}
                              onChange={e => handleUserChange(user.id, 'diamonds', e.target.value)}
                              variant="outlined"
                              sx={{ width: 100 }}
                              InputProps={{
                                inputProps: { 
                                  min: 0,
                                  style: { textAlign: 'center' }
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${userPets.length} mascota(s)`} 
                              color={userPets.length > 0 ? 'secondary' : 'default'}
                              onClick={() => toggleUserExpand(user.id)}
                              deleteIcon={expandedUsers[user.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              onDelete={() => toggleUserExpand(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={(e) => handleMenuOpen(e, user, 'user')}>
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                            <Collapse in={expandedUsers[user.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Pets of {user.username}
                                </Typography>
                                {userPets.length > 0 ? (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Health</TableCell>
                                        <TableCell>Hunger</TableCell>
                                        <TableCell>Happiness</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {userPets.map(pet => (
                                        <TableRow key={pet.id}>
                                          <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                              <Avatar sx={{ bgcolor: orange[500], width: 24, height: 24 }}>
                                                {pet.name.charAt(0).toUpperCase()}
                                              </Avatar>
                                              <Typography>{pet.name}</Typography>
                                            </Stack>
                                          </TableCell>
                                          <TableCell>
                                            <Chip label={pet.type} size="small" color="secondary" />
                                          </TableCell>
                                          <TableCell>{pet.health}%</TableCell>
                                          <TableCell>{pet.hunger}%</TableCell>
                                          <TableCell>{pet.happiness}%</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    This user has no pets
                                  </Typography>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ color: 'text.primary' }}>
                Pet Management
              </Typography>
              <Button 
                variant="contained" 
                onClick={savePets}
                disabled={editedPets.length === 0 || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  bgcolor: teal[500],
                  '&:hover': { bgcolor: teal[700] }
                }}
              >
                Save Changes
              </Button>
            </Stack>
            
            <Paper elevation={3} sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Strength</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Health</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hunger</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Happiness</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pets.map(pet => {
                    const owner = users.find(user => user.id === pet.ownerId);
                    return (
                      <TableRow 
                        key={pet.id} 
                        hover
                        sx={{ 
                          '&:nth-of-type(odd)': { 
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50' 
                          } 
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar sx={{ bgcolor: orange[500], width: 32, height: 32 }}>
                              {pet.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography>{pet.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={pet.type} 
                            size="small"
                            color="secondary"
                          />
                        </TableCell>
                        <TableCell>
                          {owner ? (
                            <Chip
                              avatar={<Avatar sx={{ bgcolor: deepPurple[500], width: 24, height: 24 }}>
                                {owner.username.charAt(0).toUpperCase()}
                              </Avatar>}
                              label={owner.username}
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Ownerless
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={pet.weight}
                            onChange={e => handlePetChange(pet.id, 'weight', e.target.value)}
                            variant="outlined"
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                min: 0,
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={pet.strength}
                            onChange={e => handlePetChange(pet.id, 'strength', e.target.value)}
                            variant="outlined"
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                min: 0,
                                max: 100,
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={pet.health}
                            onChange={e => handlePetChange(pet.id, 'health', e.target.value)}
                            variant="outlined"
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                min: 0,
                                max: 100,
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={pet.hunger}
                            onChange={e => handlePetChange(pet.id, 'hunger', e.target.value)}
                            variant="outlined"
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                min: 0,
                                max: 100,
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            size="small"
                            value={pet.happiness}
                            onChange={e => handlePetChange(pet.id, 'happiness', e.target.value)}
                            variant="outlined"
                            sx={{ width: 80 }}
                            InputProps={{
                              inputProps: { 
                                min: 0,
                                max: 100,
                                style: { textAlign: 'center' }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(e) => handleMenuOpen(e, pet, 'pet')}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
      </Container>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedItem?.type === 'user' && (
          <>
            <MenuItem 
              onClick={() => {
                setPromoteDialog({ 
                  open: true, 
                  userId: selectedItem.id, 
                  username: selectedItem.username 
                });
                handleMenuClose();
              }}
              disabled={selectedItem.rol === 'ADMIN'}
            >
              <ListItemIcon>
                <Upgrade fontSize="small" />
              </ListItemIcon>
              <ListItemText>Promote to Admin</ListItemText>
            </MenuItem>
            <MenuItem 
              onClick={() => {
                setDeleteDialog({ open: true, type: 'user', id: selectedItem.id });
                handleMenuClose();
              }}
              sx={{ color: red[500] }}
            >
              <ListItemIcon sx={{ color: red[500] }}>
                <Delete fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete User</ListItemText>
            </MenuItem>
          </>
        )}
        {selectedItem?.type === 'pet' && (
          <MenuItem 
            onClick={() => {
              setDeleteDialog({ open: true, type: 'pet', id: selectedItem.id });
              handleMenuClose();
            }}
            sx={{ color: red[500] }}
          >
            <ListItemIcon sx={{ color: red[500] }}>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Pet</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: null, id: null })}
      >
        <DialogTitle>
          <Warning color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Confirm deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, type: null, id: null })}
            startIcon={<Close />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            disabled={loading}
          >
            Eliminate
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={promoteDialog.open}
        onClose={() => setPromoteDialog({ open: false, userId: null, username: '' })}
      >
        <DialogTitle>
          <Upgrade color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Promote to Administrator
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to promote the user <strong>{promoteDialog.username}</strong> to administrator?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This user will have full access to the administration panel.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setPromoteDialog({ open: false, userId: null, username: '' })}
            startIcon={<Close />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePromoteUser}
            color="primary"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Check />}
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;