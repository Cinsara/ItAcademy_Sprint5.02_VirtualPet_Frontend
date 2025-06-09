import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const dummyItems = [
  {
    id: 1,
    name: 'Red apple',
    type: 'food',
    description: 'A fresh and delicious apple.',
    price: 5,
    rarity: 'Healthy',
    image: '/src/assets/shop/apple.png',
  },
  {
    id: 2,
    name: 'Salad',
    type: 'food',
    description: 'Healthy and tasty green salad.',
    price: 6,
    rarity: 'Healthy',
    image: '/src/assets/shop/salad.png',
  },
  {
    id: 3,
    name: 'Burger',
    type: 'food',
    description: 'Beef burger with onion.',
    price: 12,
    rarity: 'Junk',
    image: '/src/assets/shop/burger.png',
  },
  {
    id: 4,
    name: 'Donut',
    type: 'food',
    description: 'Donut filled with strawberry and chocolate.',
    price: 4,
    rarity: 'Junk',
    image: '/src/assets/shop/donut.png',
  },
  {
    id: 5,
    name: 'Hat',
    type: 'accessory',
    description: 'A cute little hat',
    price: 7,
    rarity: 'Fashion',
    image: '/src/assets/shop/hat.png',
  },
  {
    id: 5,
    name: 'Teddy Bear',
    type: 'accessory',
    description: 'A soft and cuddly teddy bear',
    price: 10,
    rarity: 'Fashion',
    image: '/src/assets/shop/bear.png',
  },
{
    id: 5,
    name: 'Glasses',
    type: 'accessory',
    description: ' Some super cool glasses',
    price: 5,
    rarity: 'Fashion',
    image: '/src/assets/shop/glasses.png',
  },
];

const Shop = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(dummyItems);
  }, []);

  const handleBuy = (itemId) => {
    alert(`You purchased the item with ID: ${itemId}`);
  };

  const renderSection = (type, title) => (
    <>
      <Box sx={{ textAlign: 'center', py: 2, mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: '#333' }}>
          {title.toUpperCase()}
        </Typography>
        <Divider sx={{ my: 1, borderColor: '#ddd', width: '60%', mx: 'auto' }} />
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ px: 2 }}>
        {items.filter((item) => item.type === type).map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
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
                      item.rarity === 'Rare'
                        ? '#ffe0b2'
                        : item.rarity === 'Mythical'
                        ? '#c5cae9'
                        : '#c8e6c9',
                    color:
                      item.rarity === 'Rare'
                        ? '#e65100'
                        : item.rarity === 'Mythical'
                        ? '#303f9f'
                        : '#2e7d32',
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
  onClick={() => handleBuy(item.id)}
>
  Purchase
</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <Box sx={{ px: 2, pt: 2, pb: 6 }}>
        <Box sx={{ mb: 2, p: 3, backgroundColor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome to the Shop!
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Here you can find food to care for your pet and accessories to improve their happiness.
          </Typography>
        </Box>

        {renderSection('food', 'Food')}
        {renderSection('accessory', 'Accessory')}
      </Box>
    </Box>
  );
};

export default Shop;
