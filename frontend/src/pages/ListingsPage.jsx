import React, { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
import AddListingPopup from '../components/AddListingPopup';
import SearchAndFilter from "../components/SearchAndFilter";
import Toolbar from '@mui/material/Toolbar';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ListingsGrid({listings, setListings}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('user')));
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await fetch(`/api/favorites/${userId}`);
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
    setOpenPopup(false);
  };

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
  };

  const handleFavoriteUpdate = async (listingId, isFavorited) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      if (!userId) return;
  
      if (isFavorited) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, item_id: listingId })
        });
      } else {
        await fetch(`/api/favorites/${userId}/${listingId}`, { method: 'DELETE' });
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
    <Box component="main" sx={{ flexGrow: 1, p: 3, padding: 5 }}>
      <Toolbar />
      <Grid container justifyContent="flex-end" sx={{ marginBottom: 3 }}>
        <Grid item sx={{ mr: 2 }}>  {/* adds margin-right of 16px */}
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
                location={listing.location.join(',\n')}
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

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [queries, setQueries] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchAndFilterNavigate = (queries) => {
    let url_query_string = "?";
    for (const query in queries) {
      url_query_string += query + "=" + queries[query] + "&";
    }
    // Trim off last "&"
    url_query_string = url_query_string.substring(0, url_query_string.length - 1);
    navigate(url_query_string);
  }

  useEffect(() => {
    const apiSearchQuery = searchParams.toString().length > 0 ? `?${searchParams.toString()}` : "";
    fetch(`/api/listings${apiSearchQuery}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setListings(data.listings);
          } else {
            setError(data.message || 'Error fetching listings');
          }
        });
  }, [searchParams, listings]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SearchAndFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
      <ListingsGrid listings={listings} setListings={setListings} />
    </Box>
  )
}

export default ListingsPage;
