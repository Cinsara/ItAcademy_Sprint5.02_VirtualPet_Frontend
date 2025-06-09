import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PetAnimation from '../components/PetAnimation';

const Train = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [xp, setXp] = useState(0);
  const intervalRef = useRef(null);
  const [petData, setPetData] = useState(null);

  useEffect(() => {
    const storedPet = localStorage.getItem('petData');
    if (storedPet) {
      setPetData(JSON.parse(storedPet));
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const nextSeconds = prevSeconds + 1;

        // Añadir 1 XP por minuto
        if (nextSeconds % 60 === 0) {
          setXp((prevXp) => Math.min(prevXp + 1, 100));
        }

        return nextSeconds;
      });
    }, 1000);
  } else if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  return () => clearInterval(intervalRef.current);
}, [isRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#ffffffdd', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
            🐾 Mascota Virtual
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate('/home')}>Mi mascota</Button>
            <Button color="inherit" onClick={() => navigate('/shop')}>Shop</Button>
            <Button color="inherit" onClick={() => navigate('/train')}>Entrenar</Button>
            <Button color="inherit" onClick={() => navigate('/battle')}>Competir</Button>
            <Button color="inherit" onClick={() => { localStorage.clear(); navigate('/'); }}>Cerrar sesión</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {petData?.type && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 4,
              mb: 2,
              position: 'relative',
            }}
          >
            {/* Dragón grande */}
            <Box
              sx={{
                width: '180px',
                height: '180px',
                animation: isRunning ? 'move-across 4s linear infinite' : 'none',
                transformOrigin: 'center center',
                zIndex: 2,
                position: 'relative',
                top: '120px',
                left: '20px', 
              }}
            >
              <PetAnimation type={petData.type} />
            </Box>

            {/* Línea SVG más grande */}
            <Box
              sx={{
                width: '100%',
                height: '120px',
                backgroundImage: 'url("/wallpaper_training.svg")',
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 100%',
                backgroundPosition: 'bottom',
                animation: isRunning ? 'scroll-line 4s linear infinite' : 'none',
                zIndex: 1,
              }}
            />
          </Box>
        )}

        <Typography
          variant="h3"
          sx={{
            mt: 1,
            color: '#222',
            fontWeight: 'bold',
            fontFamily: 'Orbitron, sans-serif',
            textShadow: '1px 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {isRunning ? 'Entrenando...' : '¡Vamos a entrenar!'}
        </Typography>

        {isRunning && (
          <Typography
            variant="h5"
            sx={{
              color: '#4caf50',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '1.6rem',
            }}
          >
            ⏱️ {formatTime(seconds)}
          </Typography>
        )}

        {/* Barra de XP mejorada */}
        <Box sx={{ width: '90%', maxWidth: 500, mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
            Experiencia ganada: {xp} XP
          </Typography>
          <LinearProgress
            variant="determinate"
            value={xp}
            sx={{
              height: 14,
              borderRadius: 7,
              backgroundColor: '#cfd8dc',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50',
              },
            }}
          />
        </Box>

        {/* Botones mejorados */}
        <Box sx={{ mt: 5, display: 'flex', gap: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setSeconds(0);
              setXp(0);
              setIsRunning(true);
            }}
            disabled={isRunning}
            sx={{ px: 5, py: 1.8, fontSize: '1rem', fontWeight: 'bold' }}
          >
            Start
          </Button>
          <Button
  variant="contained"
  color="error"
  onClick={async () => {
    setIsRunning(false);

    try {
      const token = localStorage.getItem('token'); // solo si usas JWT
      const response = await fetch('http://localhost:8080/pet/trainPet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // solo si se requiere
        },
        body: JSON.stringify({ durationInSeconds: seconds }),
      });

      if (response.ok) {
        const updatedPet = await response.json();
        console.log('Mascota actualizada:', updatedPet);
        alert('🐉 Entrenamiento finalizado y mascota actualizada');
      } else {
        console.error('Error al actualizar la mascota');
        alert('❌ Error al actualizar la mascota');
      }
    } catch (error) {
      console.error('Error en fetch:', error);
      alert('❌ Error en la petición');
    }
  }}
  disabled={!isRunning}
  sx={{ px: 5, py: 1.8, fontSize: '1rem', fontWeight: 'bold' }}
>
  Stop
</Button>

        </Box>
      </Container>
    </Box>
  );
};

export default Train;
