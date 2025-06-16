import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📨 Login data:", form);
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const pet = data.pet;

        localStorage.setItem('token', token);
        localStorage.setItem('petData', JSON.stringify(pet));

        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.roles || [];

        alert('Successful login!');

        if (roles.includes('ROLE_ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert('Incorrect credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error trying to log in');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #e3f2fd, #fce4ec)',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 400,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Enter
          </Button>
          <Typography align="center">
            Don't have an account?{' '}
            <Link
              onClick={() => navigate('/register')}
              sx={{ cursor: 'pointer' }}
            >
              Register here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
