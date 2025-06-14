import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  LinearProgress,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (seconds > 0 && seconds % 10 === 0) { 
      setXp((prev) => Math.min(prev + 1, 100));
    }
  }, [seconds]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/src/assets/train/trainning.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

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
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#2E7D32',
              fontWeight: 'bold',
              fontFamily: 'Orbitron, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {isRunning ? 'Training...' : 'Lets train!'}
          </Typography>

          {isRunning && (
            <Box
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                p: 2,
                borderRadius: 3,
                width: '100%',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: '#2E7D32',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 'bold',
                }}
              >
                ⏱️ {formatTime(seconds)}
              </Typography>
            </Box>
          )}

          {/* XP bar */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              Experience gained: {xp} XP
            </Typography>
            <LinearProgress
              variant="determinate"
              value={xp}
              sx={{
                height: 16,
                borderRadius: 8,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 8,
                  backgroundColor: '#4caf50',
                  backgroundImage: 'linear-gradient(to right, #4caf50, #81c784)',
                },
              }}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 3, width: '100%' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setSeconds(0);
                setXp(0);
                setIsRunning(true);
              }}
              disabled={isRunning}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                flex: 1,
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#388e3c',
                },
              }}
              size="large"
            >
              Start
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                setIsRunning(false);

                try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:8080/pet/trainPet', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ durationInSeconds: seconds }),
                  });

                  if (response.ok) {
                    const updatedPet = await response.json();
                    console.log('Updated pet:', updatedPet);

                    localStorage.setItem('petData', JSON.stringify(updatedPet));
                    setPetData(updatedPet);

                    alert('🐉 Training completed and pet updated');
                    } else {
                    console.error('EError updating pet');
                    alert('❌ Error updating pet');
                    }

                } catch (error) {
                  console.error('Error in fetch:', error);
                  alert('❌ Request error');
                }
              }}
              disabled={!isRunning}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                flex: 1,
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#d32f2f',
                },
              }}
              size="large"
            >
              Stop
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Train;