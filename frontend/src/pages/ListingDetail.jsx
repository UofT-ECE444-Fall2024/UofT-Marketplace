import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, CardActions, Button, IconButton} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


function ListingDetail() {
  const { id } = useParams(); // Get the ID from the URL
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Handle previous image click
  const handlePrevImage = () => {
    if (listing && listing.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : listing.images.length - 1));
    }
  };

  // Handle next image click
  const handleNextImage = () => {
    if (listing && listing.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex < listing.images.length - 1 ? prevIndex + 1 : 0));
    }
  };

  if (loading) {
    return <CircularProgress />; // Show loading spinner while fetching
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>; // Show error message
  }

  if (!listing) {
    return <Typography variant="h6">No listing found.</Typography>; // If listing is not found
  }

  return  (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        minHeight: '100vh', // Full viewport height
        padding: '16px', // Add some padding around the card
        boxSizing: 'border-box', // Ensure padding is included in the height calculation
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 1200, height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            justifyContent: 'space-between',
            padding: '16px',
            height: '100%', // Make the Box fill the available height
          }}
        ><Box
            sx={{
              width: '70%',
              position: 'relative',
              height: '100%', // Make image container fill the height
              borderRadius: '8px',
              overflow: 'hidden', // Prevent image overflow
            }}
          >
            {/* Slideshow Image */}
            <img
              src={listing.images ? listing.images[currentImageIndex] : '/path/to/default-image.jpg'}
              alt={`Listing Image ${currentImageIndex + 1}`}
              style={{
                width: '100%',
                height: '100%', // Set height to 100% of the container
                objectFit: 'contain', // Change to contain to fit the image within the container
                borderRadius: '8px',
              }}
            />
            
            {/* Navigation arrows */}
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ width: '30%' }}>
            <Typography variant="h5" component="div" fontWeight="bold" align='left'>
              {listing.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" align='left'>
              {listing.location}
            </Typography>
            <Typography variant="body1" color="text.primary" fontWeight="bold" align='left'>
              Price: {listing.price} ~ {listing.status}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }} align='left'>
              {listing.description}
            </Typography>

            <hr style={{ margin: '16px 0', border: '1px solid #ccc' }} />

            <Typography variant="h6" component="div" fontWeight="bold" align="left" sx={{ marginBottom: '8px' }}>
              Seller Information:
            </Typography>

            <Box sx={{ marginBottom: '16px' }}>
              <Typography variant="body1" color="text.primary" align="left" sx={{ fontWeight: 'bold' }}>
                Name: {listing.seller.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="left">
                Description: {listing.seller.description || 'No description available'}
              </Typography>
              <Typography variant="body2" color="text.primary" align="left">
                Status: {listing.seller.verified ? 'Verified' : 'Not Verified'}
              </Typography>
            </Box>

            <CardActions>
              {/* TO DO: connect this button to the chat function to contact seller! */}
              <Button
                  size="small"
                  sx={{
                    backgroundColor: '#007BFF', // Blue color
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0056b3', // Darker blue for hover
                    },
                    borderRadius: '8px', // Rounded corners
                    padding: '8px 16px', // Padding
                    fontWeight: 'bold', // Bold text
                  }}
                >           
                Contact Seller
              </Button>
            </CardActions>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default ListingDetail;