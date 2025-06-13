import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import eggImage from '../assets/egg.png';
import Navbar from '../components/Navbar';
import PetAvatar from '../components/PetAvatar';
import petMap from '../components/PetMap';

const getBarColor = (label, value) => {
  if (label.includes('Salud') || label.includes('Felicidad')) {
    if (value < 30) return 'error.main';
    if (value < 50) return 'warning.main';
  }
  if (label.includes('Hambre')) {
    if (value > 80) return 'error.main';
    if (value > 50) return 'warning.main';
  }
  return 'primary.main';
};

const StatBar = ({ label, value, unit = '' }) => {
  const barColor = getBarColor(label, value);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{label}</Typography>
        <Typography variant="body2">
          {value}{unit}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        sx={{
          height: 10,
          borderRadius: 5,
          '& .MuiLinearProgress-bar': {
            backgroundColor: barColor,
          },
        }}
      />
    </Box>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [hasPet, setHasPet] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [petToCreate, setPetToCreate] = useState(null);
  const [petName, setPetName] = useState('');
  const [petData, setPetData] = useState(null);
  const allPetKeys = Object.keys(petMap);
  const [loadingPet, setLoadingPet] = useState(true);

  useEffect(() => {
    fetchPetData();
  }, []);

  const fetchPetData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setLoadingPet(false);
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/pet/myPet', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('No tiene mascota');

    const data = await res.json();
    setHasPet(true);
    setPetData(data);
    localStorage.setItem('hasPet', 'true');
    localStorage.setItem('petImage', data.type);
    if (petMap[data.type]) setPetImage(petMap[data.type]);
  } catch (error) {
    setHasPet(false);
    localStorage.removeItem('hasPet');
    localStorage.removeItem('petImage');
  } finally {
    setLoadingPet(false);
  }
};

  const handleCreatePet = () => {
    const randomKey = allPetKeys[Math.floor(Math.random() * allPetKeys.length)];
    setPetToCreate(randomKey);
    setDialogOpen(true);
  };

  const confirmPetCreation = async () => {
    try {
      const response = await fetch('http://localhost:8080/pet/newPet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ petName, type: petToCreate }),
      });

      if (!response.ok) throw new Error('No se pudo crear la mascota');
      await fetchPetData();
      setDialogOpen(false);
      setPetName('');
    } catch (error) {
      console.error('Error al crear mascota:', error);
    }
  };

  const handleRemoveAccessory = async (accessoryId) => {
    try {
      const response = await fetch(`http://localhost:8080/pet/removeAccessory/${accessoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error("No se pudo quitar el accesorio");

      const updatedPet = await response.json();
      setPetData(updatedPet);
    } catch (error) {
      console.error("❌ Error al quitar accesorio:", error);
    }
  };

  return (
    <Box
  sx={{
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #ffffff, #f0f4ff)',
    display: 'flex',
    flexDirection: 'column',
  }}
>
      <Navbar />

      <Container
  maxWidth="lg"
  sx={{
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 4
  }}
>
  {loadingPet ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
      <Typography sx={{ mt: 2, ml: 2 }}>Cargando tu mascota...</Typography>
    </Box>
  ) : !hasPet ? (
    <Box onClick={handleCreatePet} sx={{ cursor: 'pointer', textAlign: 'center' }}>
      <img src={eggImage} alt="Huevo" style={{ width: 'min(45vw, 500px)' }} />
      <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
        ¡Clica aquí para que nazca tu pet!
      </Typography>
    </Box>
  ) : (
    <>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {petData?.type && (
          <PetAvatar type={petData.type} accessories={petData.accessories} />
        )}
      </Box>

      {petData && (
        <Box sx={{ width: '320px' }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
              {petData.name}
            </Typography>
            <StatBar label="❤️ Felicidad" value={petData.happiness} />
            <StatBar label="🩺 Salud" value={petData.health} />
            <StatBar label="🍖 Hambre" value={petData.hunger} />
            <StatBar label="💪 Fuerza" value={petData.strength} />
            <StatBar label="🏆 Victorias" value={petData.victories} />
            <StatBar label="⚖️ Peso" value={petData.weight} unit="kg" />
          </Paper>

          {petData?.accessories?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Accesorios equipados:
              </Typography>
              {petData.accessories.map((acc) => (
                <Box
                  key={acc.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1
                  }}
                >
                  <Typography>{acc.name}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveAccessory(acc.id)}
                  >
                    Quitar
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  )}
</Container>


      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>¡Ponle un nombre a tu mascota!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la mascota"
            fullWidth
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmPetCreation} disabled={!petName.trim()}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
