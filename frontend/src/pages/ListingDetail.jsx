import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, CardActions, Button } from '@mui/material';

function ListingDetail() {
  const { id } = useParams(); // Get the ID from the URL
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Listing ID:', id); 
    const fetchListingDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/listings/${id}`); // Fetch details for the specific listing
        if (!response.ok) {
          throw new Error('Failed to fetch listing details');
        }
        const data = await response.json();
        setListing(data.listing); // Assuming the API returns the listing in 'listing' field
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  if (loading) {
    return <CircularProgress />; // Show loading spinner while fetching
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>; // Show error message
  }

  if (!listing) {
    return <Typography variant="h6">No listing found.</Typography>; // If listing is not found
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // Aspect ratio 4:3
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={listing.image ? listing.image : '/path/to/default-image.jpg'} // Fallback image
          alt={listing.title}
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
      <CardContent>
        <Typography variant="h5" component="div" fontWeight="bold">
          {listing.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.location}
        </Typography>
        <Typography variant="h6" color="text.primary">
          {listing.price}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {listing.description}
        </Typography>
        <CardActions>
          <Button size="small">Contact Seller</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default ListingDetail;