import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

function ListingCard({ image, title, location, price, id, isFavorite, onFavoriteUpdate, userId }) {
  const [favoriteStatus, setFavoriteStatus] = useState(isFavorite);
  const navigate = useNavigate();

  // Update local state when parent component changes the `isFavorite` prop
  useEffect(() => {
    setFavoriteStatus(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = useCallback(
    async (e) => {
      e.stopPropagation();
      const newFavoriteStatus = !favoriteStatus;
      setFavoriteStatus(newFavoriteStatus);
      onFavoriteUpdate(id, newFavoriteStatus); // notify parent
    }
  );

  const handleCardClick = () => {
    const listingUrl = `/listings/${id}`;
    navigate(listingUrl);
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
      <CardContent 
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          height: '100%' // Ensures the content area doesn’t grow beyond the card height
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography 
            variant="subtitle1" 
            component="div" 
            fontWeight="bold" 
            sx={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {title}
          </Typography>
          <IconButton aria-label="add to favorites" onClick={handleFavoriteClick}>
            {favoriteStatus ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
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