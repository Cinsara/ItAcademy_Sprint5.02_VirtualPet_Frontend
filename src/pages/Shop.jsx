import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Paper,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Shop = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [petData, setPetData] = useState(null);
  const [diamonds, setDiamonds] = useState(30);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  console.log("🔐 Token enviado:", token);

  // ✅ Cargar ítems desde el backend
  fetch('http://localhost:8080/shop/items', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch shop items');
      return res.json();
    })
    .then(data => {
      const formattedItems = [
  ...(Array.isArray(data.food) ? data.food.map(f => ({
    id: f.id,
    name: f.name,
    description: f.description,
    price: f.price,
    type: 'food',
    rarity: f.happinessChange > 10 ? 'Junk' : 'Healthy',
    image: f.imageUrl // Asegúrate que esto no es undefined
  })) : []),

  ...(Array.isArray(data.accessories) ? data.accessories.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    type: 'accessory',
    rarity: 'Fashion',
    image: a.imageUrl // Asegúrate que esto existe
  })) : [])
];
      setItems(formattedItems);
    })
    .catch(err => console.error('❌ Error fetching shop items:', err));

  // ✅ Cargar diamantes
  fetch('http://localhost:8080/user/diamonds', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch diamonds');
      return res.json();
    })
    .then(data => setDiamonds(data))
    .catch(err => console.error('💎 Error fetching diamonds:', err));
}, []);



  const handleBuy = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to purchase.");
      return;
    }

    if (diamonds < item.price) {
      alert("You don't have enough diamonds!");
      return;
    }

    const endpoint = item.type === 'food' ? 'buyFood' : 'buyAccessory';
    const body = item.type === 'food'
      ? { foodId: item.id }
      : { accessoryId: item.id };

    try {
  const response = await fetch(`http://localhost:8080/shop/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Purchase failed');
  }

  const updatedPet = await response.json();
  setPetData(updatedPet);

  // 🔄 Nueva petición para obtener los diamantes actualizados
  const diamondsResponse = await fetch('http://localhost:8080/user/diamonds', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!diamondsResponse.ok) {
    throw new Error('Failed to refresh diamonds');
  }

  const newDiamonds = await diamondsResponse.json();
  setDiamonds(newDiamonds);

  alert(`✅ ${item.name} applied to your pet!`);

} catch (error) {
  console.error('❌ Error buying item:', error);
  alert(`Error: ${error.message}`);
}
  };

  const renderSection = (type, title) => (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          color: 'primary.main',
          textAlign: 'center',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            backgroundColor: 'primary.main',
            margin: '8px auto 0',
            borderRadius: '2px'
          }
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {items.filter((item) => item.type === type).map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e1f5fe, #fce4ec)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                textAlign: 'center',
                p: 1,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{ height: 100, width: 'auto', mx: 'auto', my: 2 }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#555' }}>
                  {item.description}
                </Typography>
                <Chip
                  label={item.rarity}
                  size="small"
                  sx={{
                    backgroundColor:
                      item.rarity === 'Healthy'
                        ? '#c8e6c9'
                        : item.rarity === 'Junk'
                        ? '#ffe0b2'
                        : '#c5cae9',
                    color:
                      item.rarity === 'Healthy'
                        ? '#2e7d32'
                        : item.rarity === 'Junk'
                        ? '#e65100'
                        : '#303f9f',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    height: '20px',
                    my: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    mb: 0.5,
                    fontWeight: 'bold',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {item.price} 💎
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    px: 2,
                    py: 0.5,
                    backgroundColor: '#f95454',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                  onClick={() => handleBuy(item)}
                >
                  Purchase
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff',
      pb: 8
    }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Hero Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              color: 'text.primary'
            }}
          >
            Welcome to the Pet Shop!
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Discover delicious food to keep your pet healthy and stylish accessories to boost their happiness.
          </Typography>
        </Paper>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4
        }}>
          {/* Left Sidebar - Pet Stats */}
          <Box sx={{ 
            width: { xs: '100%', lg: 250 },
            flexShrink: 0,
            order: { xs: 2, lg: 1 }
          }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                position: 'sticky',
                top: 20
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={{ 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                🐾 Pet Stats
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
                mb: 3
              }}>
                <StatItem icon="❤️" label="Happiness" value={petData?.happiness ?? '-'} />
                <StatItem icon="🩺" label="Health" value={petData?.health ?? '-'} />
                <StatItem icon="🍖" label="Hunger" value={petData?.hunger ?? '-'} />
                <StatItem icon="💪" label="Strength" value={petData?.strength ?? '-'} />
                <StatItem icon="⚖️" label="Weight" value={petData?.weight ? `${petData.weight} kg` : '-'} />
                <StatItem icon="🏆" label="Victories" value={petData?.victories ?? '-'} />
              </Box>
              
              {/* Diamonds Section - Sin fondo azul */}
              <Box 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Your Diamonds
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {diamonds} 💎
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Main Shop Content */}
          <Box sx={{ 
            flexGrow: 1,
            order: { xs: 1, lg: 2 }
          }}>
            {renderSection('food', 'Food & Snacks')}
            {renderSection('accessory', 'Accessories')}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// Componente auxiliar para mostrar estadísticas
const StatItem = ({ icon, label, value }) => (
  <Box>
    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {icon} {label}
    </Typography>
    <Typography variant="body1" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);

export default Shop;