import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function AddListingPopup({ open, onClose, onPublish }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDeletePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    const newListing = {
      image: photos[0] || '/placeholder_img.jpg',
      title,
      location,
      price: `$${price}`,
    };

    onPublish(newListing);
    // Reset form
    setTitle('');
    setPrice('');
    setLocation('');
    setDescription('');
    setPhotos([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Add New Listing
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', gap: 2 }}>
        {/* Photo Carousel */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {photos.length > 0 ? (
            <Carousel navButtonsAlwaysVisible indicators={true} sx={{ width: 300, height: 300 }}>
              {photos.map((photo, index) => (
                <Box key={index} sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src={photo}
                    alt={`photo-${index}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => handleDeletePhoto(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Carousel>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AddAPhotoIcon fontSize="large" />
              <Typography>Upload Photos</Typography>
              <Button variant="contained" component="label">
                Choose Files
                <input type="file" multiple hidden onChange={handlePhotoUpload} />
              </Button>
            </Box>
          )}
        </Box>

        {/* Listing Form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title*"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Price*"
            variant="outlined"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            inputProps={{ min: "0", step: "0.01" }}
          />
          <TextField
            label="Location*"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handlePublish}>
            Publish
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddListingPopup;
