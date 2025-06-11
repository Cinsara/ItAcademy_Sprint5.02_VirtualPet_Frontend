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
import backgroundImage from '../assets/image_register_v2.png';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    weight: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          weight: parseFloat(form.weight),
        }),
      });

      if (response.ok) {
        alert('Usuario registrado correctamente');
        navigate('/');
      } else {
        alert('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Ocurrió un error en el servidor');
    }
  };

  return (
    <Box
  sx={{
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #f0f4f8, #dfe9f3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 400,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(255,255,255,0.8)',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Registro
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Nombre de usuario"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Peso (kg)"
            name="weight"
            type="number"
            inputProps={{ min: 0, step: 0.1 }}
            value={form.weight}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Typography align="center">
            ¿Ya tienes cuenta?{' '}
            <Link onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Inicia sesión aquí
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;


