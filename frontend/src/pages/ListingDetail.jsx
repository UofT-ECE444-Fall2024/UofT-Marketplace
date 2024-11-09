import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent, Typography, Box, CircularProgress, CardActions, Button, IconButton} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import EditListingPopup from '../components/EditListingPopup';
import ReadRating from '../components/ratings/ReadRating';


function ListingDetail() {
  const { id } = useParams(); // Get the ID from the URL

  // user data
  const [userData, setUserData] = useState(null);

  // listing details
  const [listing, setListing] = useState(null);
  const [listingLoading, setListingLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // this is for delete and edit buttons
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null); // Holds the listing data to edit

  const navigate = useNavigate();

  useEffect(() => {
    fetchListingDetail();
    fetchProfile();
  }, [id]);

  const fetchListingDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/listings/${id}`); // Fetch details for the specific listing
      if (!response.ok) {
        throw new Error('Failed to fetch listing details');
      }
      const data = await response.json();
      setListing(data.listing); // Assuming the API returns the listing in 'listing' field
      setSelectedListing(data.listing);
    } catch (err) {
      setError(err.message);
    } finally {
      setListingLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.username) {
        throw new Error('Not logged in');
      }

      const response = await fetch(`http://localhost:5001/api/profile/${storedUser.username}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirmDelete = () => {
    handleCloseConfirm();
    // Proceed with delete and redirect
    handleDelete();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/listings/${id}`, { method: 'DELETE' });
      if (response.ok) {
        navigate('/listings');
      }
      else {
        throw new Error('Failed to delete listing');
      }
      navigate('/home'); // Redirect to homepage after successful deletion
    } catch (err) {
      setError(err.message);
    }
  };

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

  if (profileLoading || listingLoading) {
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
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
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
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ width: '30%' }}>
            <Typography variant="h5" component="div" fontWeight="bold" align='left'>
              {listing.title} {listing.user_id}
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
            <Box sx={{ marginBottom: '16px' }}>
              <ReadRating username={listing.seller.username} fullname={listing.seller.full_name} verified={listing.seller.verified} joinedOn={listing.seller.joined_on} />
            </Box>

            <CardActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              {/* TO DO: connect this button to the chat function to contact seller! */}
              {userData.username !== listing.seller.username && (
              <Button
                  size="small"
                  sx={{
                    backgroundColor: '#007BFF', // Blue color
                    color: 'white',
                    '&:hover': { backgroundColor: '#0056b3' },
                    borderRadius: '8px', // Rounded corners
                    padding: '8px 16px', // Padding
                    fontWeight: 'bold', // Bold text
                  }}
                >           
                Contact Seller
              </Button>
              )}
              
              {userData.username === listing.seller.username  && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: '#007BFF',
                      color: 'white',
                      '&:hover': { backgroundColor: '#0056b3' },
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 'bold',
                      flex: 1
                    }}
                    onClick={() => {
                      setSelectedListing(listing); // listing is the data object for the item to edit
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <EditListingPopup open={isEditOpen}
                      onClose={() => setEditOpen(false)}
                      onSave={(updatedListing) => {setEditOpen(false);}}
                      listingData={selectedListing}
                    />
                  <Button
                    size="small"
                    sx={{
                      backgroundColor: 'red',
                      color: 'white',
                      '&:hover': { backgroundColor: '#d40000' },
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 'bold',
                      flex: 1
                    }}
                    color="error"
                    onClick={handleOpenConfirm}
                  >
                    Delete
                  </Button>
                </Box>
              )}

              {/* Confirmation Dialog */}
              <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
              >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this listing? This action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseConfirm} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} color="error">
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>

            </CardActions>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default ListingDetail;