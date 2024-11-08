import React, { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
import AddListingPopup from '../components/AddListingPopup';

function ListingsGrid() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    fetchListings();
    fetchFavorites();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/listings');
      const data = await response.json();

      if (data.status === 'success') {
        setListings(data.listings);
      } else {
        setError(data.message || 'Error fetching listings');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await fetch(`http://localhost:5001/api/favorites/${userId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setFavoriteIds(new Set(data.favorites.map(fav => fav.id)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handlePublish = async (newListing) => {
    await fetchListings();
    setOpenPopup(false);
  };

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
  };

  const handleFavoriteUpdate = async (listingId, isFavorited) => {
    try {
      const userId = 1;
      if (!userId) return;

      if (isFavorited) {
        await fetch('http://localhost:5001/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, item_id: listingId })
        });
      } else {
        await fetch(`http://localhost:5001/api/favorites/${userId}/${listingId}`, { method: 'DELETE' });
      }

      const newFavoriteIds = new Set(favoriteIds);
      isFavorited ? newFavoriteIds.add(listingId) : newFavoriteIds.delete(listingId);
      setFavoriteIds(newFavoriteIds);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const filteredListings = showFavorites
    ? listings.filter(listing => favoriteIds.has(listing.id))
    : listings;

  return (
    <Box sx={{ padding: 5 }}>
      <Grid container justifyContent="flex-end" spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item>
          <Button
            variant={showFavorites ? "contained" : "outlined"}
            color="primary"
            onClick={toggleFavoritesFilter}
          >
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOpenPopup}>
            + Add Listing
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={5} sx={{ flexGrow: 1 }}>
        {filteredListings.length > 0 ? (
          filteredListings.map((listing, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ListingCard
                image={listing.image}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                id={listing.id}
                isFavorite={favoriteIds.has(listing.id)}
                onFavoriteUpdate={handleFavoriteUpdate}
              />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: 5 }}>
            <Typography>
              {showFavorites ? "No favorite listings yet!" : "No listings available currently!"}
            </Typography>
          </Box>
        )}
      </Grid>

      <AddListingPopup open={openPopup} onClose={handleClosePopup} onPublish={handlePublish} />
    </Box>
  );
}

export default ListingsGrid;
