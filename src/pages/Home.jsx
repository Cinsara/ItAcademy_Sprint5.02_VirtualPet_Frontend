// Home.jsx actualizado con ajustes visuales y estilo cartoon
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/image_home.png';
import eggImage from '../assets/egg.png';
import Navbar from '../components/Navbar';

// Imágenes de mascotas
import cat_orange from '../assets/petAssets/pet_cat_orange.png';
import dog_purple from '../assets/petAssets/pet_dog_purple.png';
import dog_yellow from '../assets/petAssets/pet_dog_yellow.png';
import dragon_blue from '../assets/petAssets/pet_dragon_blue.png';
import dragon_green from '../assets/petAssets/pet_dragon_green.png';
import dragon_orange from '../assets/petAssets/pet_dragon_orange.png';

const petMap = {
  cat_orange,
  dog_purple,
  dog_yellow,
  dragon_blue,
  dragon_green,
  dragon_orange,
};

const Stat = ({ icon, label, value }) => (
  <Box
    sx={{
      textAlign: 'center',
      borderRadius: 2,
      backgroundColor: '#e3f2fd',
      p: 1,
      boxShadow: 1,
    }}
  >
    <Typography variant="body1" fontWeight="bold">
      {icon} {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const Home = () => {
  const navigate = useNavigate();
  const [hasPet, setHasPet] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [petToCreate, setPetToCreate] = useState(null);
  const [petName, setPetName] = useState('');
  const [petData, setPetData] = useState(null);
  const [justCreated, setJustCreated] = useState(false);
  const allPetKeys = Object.keys(petMap);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:8080/pet/myPet', {
       method: 'GET',
       headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
       },
    })
      .then((res) => {
        if (!res.ok) throw new Error('No tiene mascota');
        return res.json();
      })
      .then((data) => {
        console.log('🐾 Datos recibidos de la mascota:', data); //QUITAR LUEGO DE PROBAR
        setHasPet(true);
        setPetData(data);
        localStorage.setItem('hasPet', 'true');
        localStorage.setItem('petImage', data.type);
        if (petMap[data.type]) {
          setPetImage(petMap[data.type]);
        }
      })
      .catch(() => {
        setHasPet(false);
        localStorage.removeItem('hasPet');
        localStorage.removeItem('petImage');
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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
      body: JSON.stringify({
        petName,
        type: petToCreate,
      }),
    });

    if (!response.ok) throw new Error('No se pudo crear la mascota');

    // 🔄 Volver a pedir la mascota desde el backend
    const petResponse = await fetch('http://localhost:8080/pet/myPet', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!petResponse.ok) throw new Error('Error al obtener la mascota después de crearla');

    const data = await petResponse.json();
    console.log('Tipo de mascota recibida:', data.type);
    console.log('Imagen cargada:', petMap[data.type]);

    setPetData(data);
    setHasPet(true);
    setJustCreated(true);
    setPetImage(petMap[data.type]);
    localStorage.setItem('hasPet', 'true');
    localStorage.setItem('petImage', data.type);
    setDialogOpen(false);
    setPetName('');

    setTimeout(() => setJustCreated(false), 3000);
  } catch (error) {
    console.error('Error al crear mascota:', error);
  }
};


  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 0 }} />

      <Navbar />

      <Container disableGutters maxWidth={false} sx={{ flexGrow: 1, position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', zIndex: 1 }}>
        {!hasPet ? (
          <Box onClick={handleCreatePet} sx={{ cursor: 'pointer', position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '22%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <img src={eggImage} alt="Huevo" style={{ width: 'min(45vw, 500px)', height: 'auto' }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold', color: 'white', textShadow: '2px 2px 5px black' }}>
              ¡Clica aquí para que nazca tu pet!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>

            <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '22%', zIndex: 1 }}>
              <img src={petImage} alt="Tu mascota" style={{ width: 'min(45vw, 500px)', height: 'auto' }} />
            </Box>

            {petData && (
              <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '5%', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 3, p: 2, minWidth: '280px', maxWidth: '90vw' }}>
                <Typography variant="h6" sx={{ gridColumn: 'span 3', textAlign: 'center', fontFamily: 'Fredoka, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#212121', mb: 1 }}>
                  {petData.name}
                </Typography>
                <Stat icon="❤️" label="Felicidad" value={petData.happiness} />
                <Stat icon="🩺" label="Salud" value={petData.health} />
                <Stat icon="🍖" label="Hambre" value={petData.hunger} />
                <Stat icon="💪" label="Fuerza" value={petData.strength} />
                <Stat icon="🏆" label="Victorias" value={petData.victories} />
                <Stat icon="⚖️" label="Peso" value={petData.weight} />
              </Box>
            )}
          </Box>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>¡Ponle un nombre a tu mascota!</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nombre de la mascota" fullWidth value={petName} onChange={(e) => setPetName(e.target.value)} />
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
