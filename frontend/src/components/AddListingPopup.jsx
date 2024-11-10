import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, IconButton, Grid, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageCarousel from './AddListing/ImageCarousel';
import ListingForm from './AddListing/ListingForm';

function AddListingPopup({ open, onClose, onPublish }) {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [locations, setLocations] = useState([]); // Changed to array for multiple locations
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [publishError, setPublishError] = useState('');

  const handlePublish = async () => {
    setPublishError('');
    if (!title || !price || locations.length === 0 || !condition || !category || images.length === 0) {
      setPublishError('Please fill in all required fields and add at least one image and location.');
      return;
    }

    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.username) {
        throw new Error('Not logged in');
      }

      const userresponse = await fetch(`http://localhost:5001/api/profile/${storedUser.username}`);
      const userdata = await userresponse.json();
      if (!userresponse.ok) {
        throw new Error(userdata.message);
      }

      const user_id = userdata.user.id;

      const response = await fetch('http://localhost:5001/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          title,
          price,
          location: locations, // Send array of locations
          condition,
          category,
          description,
          images
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        onPublish(data.item);

        // Reset form
        setImages([]);
        setCurrentImageIndex(0);
        setTitle('');
        setPrice('');
        setLocations([]);
        setCondition('');
        setCategory('');
        setDescription('');
        onClose();
      } else {
        setPublishError(data.message || 'Error creating listing');
      }
    } catch (error) {
      setPublishError(error.message);
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
            location={locations} // Pass locations array instead of single location
            setLocation={setLocations} // Pass setLocations function
            condition={condition}
            setCondition={setCondition}
            description={description}
            setDescription={setDescription}
            publishError={publishError}
            category={category}
            setCategory={setCategory}
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