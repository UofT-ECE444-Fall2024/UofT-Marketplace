import React, { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
import AddListingPopup from '../components/AddListingPopup';
import SearchAndFilter from "../components/SearchAndFilter";
import Toolbar from '@mui/material/Toolbar';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ListingsGrid = ({listings}) => {
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handlePublish = async (newListing) => {
    setOpenPopup(false);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, padding: 5 }}>
      <Toolbar />
      <Grid container justifyContent="flex-end" sx={{ marginBottom: 3 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleOpenPopup}>
            + Add Listing
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={5} sx={{ flexGrow: 1 }}>
        {/* Check if there are listings to display */}
        {listings.length > 0 ? (
          listings.map((listing, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ListingCard
                image={listing.image}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                id={listing.id}
              />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: 5 }}>
            <Typography>No listings available currently!</Typography>
          </Box>
        )}
      </Grid>

      {/* Add Listing Popup */}
      <AddListingPopup open={openPopup} onClose={handleClosePopup} onPublish={handlePublish} />
    </Box>
  );
}

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setQuery(e.target.value)
  };

  const handleSearchEnterSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()  
      navigate(`?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchClickSubmit = (event) => {
    event.preventDefault()  
    navigate(`?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const search_query_string = searchParams.get('search');
    const apiSearchParams = search_query_string ? `?search=${search_query_string}` : '';

    fetch(`http://localhost:5001/api/listings${apiSearchParams}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setListings(data.listings);
          } else {
            setError(data.message || 'Error fetching listings');
          }
        });
  }, [searchParams]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SearchAndFilter handleSearchChange={handleSearchChange} handleSearchClickSubmit={handleSearchClickSubmit} handleSearchEnterSubmit={handleSearchEnterSubmit} />
      <ListingsGrid listings={listings} />
    </Box>
  )
}

export default ListingsPage;
