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
    fetch(`http://localhost:5001/api/listings${apiSearchQuery}`)
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
      <SearchAndFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
      <ListingsGrid listings={listings} />
    </Box>
  )
}

export default ListingsPage;
