import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function ListingCard({ image, title, location, price }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 5, m: 2, overflow: 'hidden' }}>
      {/* Wrapping the image in a Box with padding to create a border effect */}
      <Box sx={{ padding: 2, backgroundColor: '#ffffff', borderRadius: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
          sx={{ borderRadius: 2 }}
        />
      </Box>
      <CardContent sx={{ textAlign: 'left' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" component="div" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton aria-label="add to favorites" onClick={handleClick}>
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {location}
        </Typography>
        <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
          {price}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ListingCard;
