import React, { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

function ImageCarousel({ images, setImages, currentImageIndex, setCurrentImageIndex, setImageError }) {
  // Convert a file to a base64 string to display in the carousel
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddImage = async (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));

    if (validImages.length + images.length > 5) {
      setImageError('You can only upload up to 5 images.');
      return;
    }

    try {
      const base64Images = await Promise.all(validImages.map(fileToBase64));
      setImages(prevImages => [...prevImages, ...base64Images]);
      setCurrentImageIndex(Math.min(currentImageIndex, images.length));
      setImageError('');
    } catch (error) {
      setImageError('Error processing images. Please try again.');
    }
  };

  const handleDeleteImage = () => {
    const newImages = images.filter((_, index) => index !== currentImageIndex);
    setImages(newImages);
    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
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
          <AddPhotoAlternateIcon fontSize="large" color="action" />
        )}
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

      <Button
        variant="outlined"
        component="label"
        fullWidth
        sx={{ mt: 2, color: "var(--customDarkBlue)" }}
        disabled={images.length >= 5}
      >
        Add Photo
        <input type="file" hidden multiple onChange={handleAddImage} />
      </Button>
    </Box>
  );
}

export default ImageCarousel;
