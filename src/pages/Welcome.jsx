import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import allPetsImage from '../assets/welcome/all_pets.png';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(to bottom, #FFFFFF 0%, #F9F0FF 60%, #E6D4F7 100%),
          url(${allPetsImage})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center 70%',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'multiply',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(90, 45, 130, 0.2)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#5A2D82',
            mb: 3, 
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          GymPet
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#6B4D82',
            mb: 4,
            lineHeight: '1.7',
            fontSize: '1.1rem'
          }}
        >
          Your perfect fitness companion. Track workouts, earn rewards, and grow your virtual pet!
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 2,
              bgcolor: '#8A4FFF',
              color: '#fff',
              flex: 1,
              '&:hover': {
                bgcolor: '#7B3AFF',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(138, 79, 255, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 2,
              color: '#8A4FFF',
              borderColor: '#8A4FFF',
              borderWidth: '2px',
              flex: 1,
              '&:hover': {
                backgroundColor: 'rgba(138, 79, 255, 0.08)',
                borderColor: '#7B3AFF',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Welcome;