import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    weight: '',
    bodyType: '',
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
          bodyType: form.bodyType,
        }),
      });

      if (response.ok) {
        alert('Successfully registered user');
        navigate('/');
      } else {
        alert('Error registering user');
      }
    } catch (error) {
      console.error('Error in registration:', error);
      alert('An error occurred on the server');
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
            label="User name"
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
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            inputProps={{ min: 0, step: 0.1 }}
            value={form.weight}
            onChange={handleChange}
            required
          />

          {/* Body Type Select con explicación */}
<FormControl fullWidth sx={{ mt: 2 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
      Body Type
    </Typography>
    <Tooltip
      title={
        <div>
          <strong>Ectomorph:</strong> delgado, metabolismo rápido<br />
          <strong>Mesomorph:</strong> atlético, gana músculo fácilmente<br />
          <strong>Endomorph:</strong> gana grasa con facilidad
        </div>
      }
      arrow
    >
      <IconButton size="small" sx={{ ml: 1, p: 0.5 }}>
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
  <Select
    name="bodyType"
    value={form.bodyType}
    onChange={handleChange}
    required
  >
    <MenuItem value="ECTOMORPH">Ectomorph</MenuItem>
    <MenuItem value="MESOMORPH">Mesomorph</MenuItem>
    <MenuItem value="ENDOMORPH">Endomorph</MenuItem>
  </Select>
</FormControl>


          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography align="center">
            Already have an account?{' '}
            <Link onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
              Log in here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;