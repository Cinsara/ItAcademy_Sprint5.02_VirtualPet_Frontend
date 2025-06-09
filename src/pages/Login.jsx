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
import backgroundImage from '../assets/image_login_register_v3.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      const pet = data.pet;

      console.log("🐾 Mascota recibida directamente:", pet);

      // Guarda la mascota en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('petData', JSON.stringify(pet));

      alert('Inicio de sesión correcto');
      navigate('/home');
    } else {
      alert('Credenciales incorrectas');
    }
  } catch (error) {
    console.error('Error en el login:', error);
    alert('Error al intentar iniciar sesión');
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
    background: 'linear-gradient(to bottom, #f0f4ff,rgb(85, 183, 201))',
  }}
>
  {/* Caja con imagen de fondo centrada */}
  <Box
    sx={{
      width: '105%',
      maxWidth: '1400px',
      height: '100%',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderLeft: '10px solid white',
      borderRight: '10px solid white',
      overflow: 'hidden',
    }}
  >
    {/* Tu caja del formulario (sin cambios) */}
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
        Iniciar sesión
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
          label="Contraseña"
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
          Entrar
        </Button>
        <Typography align="center">
          ¿No tienes cuenta?{' '}
          <Link
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </form>
    </Paper>
  </Box>
</Box>

  );
};

export default Login;
