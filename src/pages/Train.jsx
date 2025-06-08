// Train.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/image_home.png';
import runningDragon from '../assets/petAssets/dragon_running.gif'; // imagen animada en pixel

const Train = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const timer =
      seconds > 0 &&
      setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Capa oscura */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: 'white', color: 'black', zIndex: 1 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          >
            🐾 Mascota Virtual
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate('/home')}>
              Mi mascota
            </Button>
            <Button color="inherit" onClick={() => navigate('/shop')}>
              Shop
            </Button>
            <Button color="inherit" onClick={() => navigate('/train')}>
              Entrenar
            </Button>
            <Button color="inherit" onClick={() => navigate('/battle')}>
              Competir
            </Button>
            <Button
              color="inherit"
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenido */}
      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
        }}
      >
        <img
          src={runningDragon}
          alt="Entrenando"
          style={{ width: 'min(50vw, 400px)', height: 'auto' }}
        />
        <Typography
          variant="h4"
          sx={{
            mt: 3,
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px black',
          }}
        >
          Entrenando...
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 1,
            color: '#ffee58',
            fontFamily: 'Orbitron, sans-serif',
            textShadow: '1px 1px 3px black',
          }}
        >
          ⏱️ {seconds}s
        </Typography>
      </Container>
    </Box>
  );
};

export default Train;

