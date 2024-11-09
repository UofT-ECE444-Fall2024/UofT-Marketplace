import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function ListingCard({ image, title, location, price, id, isFavorite, onFavoriteUpdate, userId }) {
  const [favoriteStatus, setFavoriteStatus] = useState(isFavorite);

  // Update local state when parent component changes the `isFavorite` prop
  useEffect(() => {
    setFavoriteStatus(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = useCallback(
    async (e) => {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      e.stopPropagation();
      const newFavoriteStatus = !favoriteStatus;
      setFavoriteStatus(newFavoriteStatus);
      try {
        if (newFavoriteStatus) {
          // Send POST request to add favorite
          await fetch('http://localhost:5001/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, item_id: id }),
          });
        } else {
          // Send DELETE request to remove favorite
          await fetch(`http://localhost:5001/api/favorites/${userId}/${id}`, {
            method: 'DELETE',
          });
        }
        // Inform parent component of the update
        onFavoriteUpdate(id, newFavoriteStatus);
      } catch (error) {
        console.error('Error updating favorite status:', error);
        // Revert state if API request fails
        setFavoriteStatus(!newFavoriteStatus);
      }
    },
    [favoriteStatus, id, onFavoriteUpdate, userId]
  );

  const handleCardClick = () => {
    const listingUrl = `/listings/${id}`;
    window.open(listingUrl, '_blank');
  };

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 5, m: 2, overflow: 'hidden' }} onClick={handleCardClick}>
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
            {favoriteStatus ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
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
