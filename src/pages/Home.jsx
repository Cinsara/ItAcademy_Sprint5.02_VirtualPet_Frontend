import React from 'react';
import { Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #e3f2fd, #fce4ec)',
      }}
    >
      <Box sx={{ width: 500 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            🐾 ¡Bienvenido a tu mascota virtual!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Aquí podrás alimentar, cuidar y jugar con tu mascota.
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;


