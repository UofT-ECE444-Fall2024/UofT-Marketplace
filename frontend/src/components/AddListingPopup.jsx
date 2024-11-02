import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Button, IconButton, Box, Grid, Typography, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


function AddListingPopup({ open, onClose, onPublish }) {
  // State variables to manage form and image data
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [publishError, setPublishError] = useState('');

  // Handle adding new images from file input
  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length + images.length > 5) {
      setImageError('You can only upload up to 5 images.');
      return;
    }

    const newImages = validImages.map(file => URL.createObjectURL(file)); 
    setImages(prevImages => [...prevImages, ...newImages]);
    setCurrentImageIndex(Math.min(currentImageIndex, images.length));
    setImageError('');
  };

  // Handle deleting the currently displayed image
  const handleDeleteImage = () => {
    const newImages = images.filter((_, index) => index !== currentImageIndex);
    setImages(newImages);
    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
  };

  // Navigate to the previous image in the carousel
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Navigate to the next image in the carousel
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle the publishing of the listing
  const handlePublish = () => {
    setPublishError('');
    // Validate required fields
    if (!title || !price || !location || images.length === 0) {
      setPublishError('Please fill in all required fields and add at least one image.');
      return;
    }

    // Start loading state
    setLoading(true); 
    onPublish({
      image: images[0],
      title,
      price: '$' + price,
      location,
      description,
    });

    // Reset the form after publishing
    setTimeout(() => {
      setImages([]);
      setCurrentImageIndex(0);
      setTitle('');
      setPrice('');
      setLocation('');
      setDescription('');
      setLoading(false);
      onClose();
    }, 1000); // Optional delay for better UX
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
        },
      }}
    >
      <IconButton
        onClick={onClose}
        style={{ position: 'absolute', right: 8, top: 8 }}
        aria-label="Close"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 2,
          minHeight: '400px',
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {/* Carousel Section */}
          <Grid item xs={12} sm={6}>
            <Box
              position="relative"
              width="100%"
              height={250}
              bgcolor="grey.200"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={1}
              sx={{ marginBottom: 2 }}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt="Listing"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              ) : (
                <AddPhotoAlternateIcon fontSize="large" color="action" /> // Placeholder icon
              )}
              {/* Navigation buttons for carousel */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePreviousImage}
                    style={{ position: 'absolute', left: 8, top: '50%' }}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    style={{ position: 'absolute', right: 8, top: '50%' }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </>
              )}
              {images.length > 0 && (
                <IconButton
                  onClick={handleDeleteImage}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            {/* Image indicators */}
            <Box display="flex" justifyContent="center" mt={1}>
              {images.map((_, index) => (
                <Box
                  key={index}
                  width={8}
                  height={8}
                  bgcolor={index === currentImageIndex ? 'primary.main' : 'grey.400'}
                  borderRadius="50%"
                  mx={0.5}
                />
              ))}
            </Box>

            {/* Button to add more photos */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
              disabled={images.length >= 5}
            >
              Add Photo
              <input type="file" hidden multiple onChange={handleAddImage} />
            </Button>
            
            {imageError && ( 
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {imageError}
              </Typography>
            )}
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              required
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Price"
              required
              fullWidth
              margin="normal"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              label="Location"
              required
              fullWidth
              margin="normal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {publishError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {publishError}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ padding: '0 16px 16px 16px' }}>
        <Button onClick={handlePublish} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddListingPopup;