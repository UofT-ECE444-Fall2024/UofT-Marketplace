import React, { useState } from 'react';
import { Grid, Button, Box, Typography } from '@mui/material';
import ListingCard from '../components/ListingCard';
import AddListingPopup from '../components/AddListingPopup';

function ListingsGrid() {
  const [listings, setListings] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handlePublish = (newListing) => {
    setListings((prevListings) => [newListing, ...prevListings]);
    setOpenPopup(false);
  };

  return (
    <Box sx={{ padding: 5 }}>
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

export default ListingsGrid;
