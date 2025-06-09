import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{
      backgroundColor: '#fff',
      color: '#333',
      boxShadow: 'none',
      borderBottom: '1px solid #eee',
      m: 0,
      p: 0,
      position: 'relative',
      top: 0,
      zIndex: 1
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 4, py: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          GymPet
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {[['/home', 'My pet'], ['/shop', 'Shop'], ['/train', 'Train'], ['/battle', 'Compete']].map(([path, label]) => (
            <Button
              key={path}
              onClick={() => navigate(path)}
              sx={{
                textTransform: 'uppercase',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '999px',
                background: 'linear-gradient(to right, #fce4ec, #e1f5fe)',
                px: 2,
                color: '#333',
                '&:hover': {
                  background: 'linear-gradient(to right, #f8bbd0, #b3e5fc)',
                },
              }}
            >
              {label}
            </Button>
          ))}
          <Button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            sx={{
              textTransform: 'uppercase',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '999px',
              background: 'linear-gradient(to right, #ff8a80, #ff80ab)',
              px: 2,
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(to right, #ff5252, #ec407a)'
              }
            }}
          >
            Log out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
