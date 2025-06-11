import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, CircularProgress,
  Grid, Avatar, Card, CardContent, Chip, Divider, Badge
} from '@mui/material';
import {
  SportsMma, EmojiEvents, MonetizationOn,
  Mood, MoodBad, SentimentDissatisfied, Pets
} from '@mui/icons-material';
import PetAvatar from '../components/PetAvatar';
import Navbar from '../components/Navbar';
import opponentPlaceholder from '../assets/compete/silhouette.png';
import logoBattleArena from '../assets/compete/pet_battle_arena.png';
import background_battle_arena from '../assets/compete/background_pet_battle_arena.png';


const Compete = () => {
  const [pet, setPet] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [battleHistory, setBattleHistory] = useState([]);

  useEffect(() => {
    try {
      const storedPet = localStorage.getItem('petData');
      if (!storedPet || storedPet === 'undefined') {
        console.warn("⚠️ petData no válido");
        localStorage.removeItem('petData');
        return;
      }

      const parsedPet = JSON.parse(storedPet);
      if (parsedPet && typeof parsedPet === 'object' && parsedPet.name) {
        setPet(parsedPet);
      } else {
        console.warn("⚠️ petData mal formateado");
        localStorage.removeItem('petData');
      }
    } catch (err) {
      console.error("❌ Error leyendo petData:", err);
      localStorage.removeItem('petData');
    }
  }, []);

  const getResultIcon = (result) => {
    switch (result) {
      case 'CHALLENGER_WINS': return <Mood color="success" fontSize="large" />;
      case 'OPPONENT_WINS': return <MoodBad color="error" fontSize="large" />;
      case 'DRAW': return <SentimentDissatisfied color="warning" fontSize="large" />;
      default: return <Pets fontSize="large" />;
    }
  };

  const formatResultText = (result) => {
  if (!result || typeof result !== 'string') return '';
  return result.replace('_', ' ').toLowerCase();
};


  const handleCompete = async () => {
  console.log("🔁 Iniciando combate...");
  setLoading(true);
  setResult(null); // Resetear resultado anterior
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:8080/game/newGame', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('❌ Error al iniciar la batalla');

    const text = await response.text();
    console.log("📃 Texto recibido del backend:", text);

    let gameData;
    try {
      gameData = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError);
      alert("La respuesta del servidor no es válida.");
      return;
    }

    console.log("📦 Datos parseados:", gameData);

    setResult(gameData);
    setOpponent(gameData.opponent || null);
    setBattleHistory(prev => [gameData, ...prev.slice(0, 4)]);

    if (gameData?.challenger) {
      setPet(gameData.challenger);
      localStorage.setItem('petData', JSON.stringify(gameData.challenger));
    }

  } catch (error) {
    console.error('❌ Error en la batalla:', error);
    alert('❌ Error al competir');
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
  sx={{
    minHeight: '100vh',
    backgroundImage: `url(${background_battle_arena})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    pb: 4
  }}
>

      <Navbar />

      <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: 4, px: 2 }}>
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
  <img
    src={logoBattleArena}
    alt="Pet Battle Arena"
    style={{
      maxWidth: '300px',
      width: '100%',
      height: 'auto',
      margin: '0 auto',
      display: 'block'
    }}
  />
</Box>


        <Grid container spacing={3} justifyContent="center">
          {/* Tu mascota */}
          <Grid item xs={12} md={5}>
  <Card sx={{ 
  height: '100%', 
  borderRadius: 3,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  }
}}>
    <CardContent sx={{ textAlign: 'center', minHeight: 400 }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EmojiEvents sx={{ mr: 1 }} /> Your pet
                </Typography>
                {pet ? (
                  <>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Chip label={`${pet.victories} wins`} size="small" color="success" sx={{ color: 'white' }} />
                      }
                    >
                      <PetAvatar type={pet.type} />
                    </Badge>
                    <Typography variant="h5" sx={{ mt: 2, mb: 1, color: '#fff' }}>{pet.name}</Typography>
                    <Grid container spacing={1} sx={{ mt: 1 }} justifyContent="center">
                      <Grid item xs={5}><Typography variant="body2" sx={{ color: '#fff' }}>💪 Strength</Typography><Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>{pet.strength}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" sx={{ color: '#fff' }}>❤️ Health</Typography><Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>{pet.health}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" sx={{ color: '#fff' }}>😊 Happiness</Typography><Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>{pet.happiness}</Typography></Grid>
                      <Grid item xs={5}><Typography variant="body2" sx={{ color: '#fff' }}>🍗 Hunger</Typography><Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>{pet.hunger}</Typography></Grid>
                    </Grid>
                  </>
                ) : <CircularProgress sx={{ mt: 10 }} />}
              </CardContent>
            </Card>
          </Grid>

          {/* Oponente */}
<Grid item xs={12} md={5}>
    <Card sx={{ 
  height: '100%', 
  borderRadius: 3,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  }
}}>
    <CardContent sx={{ textAlign: 'center', minHeight: 400 }}>
      <Typography
        variant="h6"
        sx={{
        color: '#fff',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EmojiEvents sx={{ mr: 1 }} /> Oponente
      </Typography>

      {opponent ? (
        <>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Chip
                label={`${opponent.victories} wins`}
                size="medium"
                color="error"
                sx={{ color: 'white' }}
              />
            }
          >
            <PetAvatar type={opponent.type} />
          </Badge>
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            {opponent.name}
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }} justifyContent="center">
            <Grid item xs={5}>
              <Typography variant="body2" sx={{ color: '#fff' }}>💪 Strength</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                {opponent.strength}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" sx={{ color: '#fff' }}>❤️ Health</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                {opponent.health}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" sx={{ color: '#fff' }}>😊 Happiness</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                {opponent.happiness}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" sx={{ color: '#fff' }}>🍗 Hunger</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ color: '#fff' }}>
                {opponent.hunger}
              </Typography>
            </Grid>
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary',
          }}
        >
          <img
  src={opponentPlaceholder}
  alt="Oponente desconocido"
  style={{ width: 500, opacity: 0.5, marginBottom: 16 }}
/>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
    Presiona "PELEAR!"
  </Typography>
  <Typography variant="h6" sx={{ color: '#fff' }}>
    para comenzar la batalla
  </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
</Grid>

          {/* Botón pelear - AHORA DEBAJO */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={handleCompete}
                disabled={loading || !pet}
                sx={{
                  py: 2, 
                  px: 4,
                  fontSize: '1.1rem', 
                  fontWeight: 'bold',
                  borderRadius: 2, 
                  boxShadow: 3,
                  '&:hover': { 
                    transform: 'translateY(-2px)', 
                    boxShadow: 6 
                  },
                  transition: 'all 0.3s'
                }}
                startIcon={<SportsMma />}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'PELEAR!'}
              </Button>
            </Box>
          </Grid>

          {/* Resultado */}
{result?.gameResult && (
  <Grid item xs={12}>
    <Card sx={{ mt: 3, boxShadow: 3, borderRadius: 3 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          {getResultIcon(result.gameResult)}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {formatResultText(result.gameResult)}
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          vs <strong>{result?.opponent?.name || '???'}</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{
          backgroundColor: '#f8f9fa',
          p: 2,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MonetizationOn color="warning" sx={{ mr: 1 }} />
            Ganaste: <Box component="span" fontWeight="bold" sx={{ ml: 1 }}>{result.coinsAwarded ?? 0} monedas</Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
)}

        </Grid>
      </Box>
    </Box>
  );
};

export default Compete;