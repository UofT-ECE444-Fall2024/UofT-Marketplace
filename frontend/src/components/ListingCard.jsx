import React, { useState, useCallback } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function ListingCard({ image, title, location, price, id }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback((e) => {
    // Stop the card click from firing
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }, []);

  const handleCardClick = () => {
    // Open a new tab when the card is clicked, URL based on item ID
    const listingUrl = `/listings/${id}`;
    window.open(listingUrl, '_blank');
  };

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 5, m: 2, overflow: 'hidden', maxWidth: 400}} onClick={handleCardClick}>
      {/* Wrapping the image in a Box with padding to create a border effect */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <CardContent sx={{ textAlign: 'left' }}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" component="div" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
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
