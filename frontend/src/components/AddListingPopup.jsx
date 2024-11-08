import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, IconButton, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageCarousel from './AddListing/ImageCarousel';
import ListingForm from './AddListing/ListingForm';

function AddListingPopup({ open, onClose, onPublish }) {
  // State variables to manage form and image data
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [publishError, setPublishError] = useState('');

  // Convert File objects to base64 strings
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle the publishing of the listing
  const handlePublish = async () => {
    setPublishError('');
    // Validate required fields
    if (!title || !price || !location || !condition || images.length === 0) {
      setPublishError('Please fill in all required fields and add at least one image.');
      return;
    }

    // Start loading state
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Replace with actual user ID from auth
          title,
          price,
          location,
          condition,
          description,
          images
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Use the returned item data from the server
        onPublish(data.item);

        // Reset form
        setImages([]);
        setCurrentImageIndex(0);
        setTitle('');
        setPrice('');
        setLocation('');
        setCondition('');
        setDescription('');
        onClose();
      } else {
        setPublishError(data.message || 'Error creating listing');
      }
    } catch (error) {
      setPublishError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }} aria-label="Close">
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <ImageCarousel
              images={images}
              setImages={setImages}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              setImageError={setImageError}
            />
          </Grid>
          <ListingForm
            title={title}
            setTitle={setTitle}
            price={price}
            setPrice={setPrice}
            location={location}
            setLocation={setLocation}
            condition={condition}
            setCondition={setCondition}
            description={description}
            setDescription={setDescription}
            publishError={publishError}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePublish} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddListingPopup;