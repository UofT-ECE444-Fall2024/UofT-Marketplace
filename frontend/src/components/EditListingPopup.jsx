import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions, TextField, Button, Box, Typography, CircularProgress,
  IconButton, Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';

const LOCATIONS = ['Bahen', 'University College', 'Hart House', 'Sid Smith', 'Myhal', 'Robarts'];

function EditListingPopup({ open, onClose, onSave, listingData }) {
    const [title, setTitle] = useState(listingData?.title || '');
    const [price, setPrice] = useState(listingData?.price || '');
    const [location, setLocation] = useState(listingData?.location || '');
    const [description, setDescription] = useState(listingData?.description || '');
    const [images, setImages] = useState(listingData?.images || []);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageError, setImageError] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (listingData) {
            setTitle(listingData.title);
            setPrice(listingData.price ? listingData.price.replace('$', '') : '');
            setLocation(listingData.location);
            setDescription(listingData.description);
            setImages(listingData.images || []);  // Set existing images
          }
    }, [listingData]);

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleAddImage = async (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter(file => file.type.startsWith('image/'));
        
        // Limit the total number of images to 5
        const totalImages = validImages.length + images.length;
        if (totalImages > 5) {
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

    // Handle image deletion
    const handleDeleteImage = async () => {
        try {
            // Assuming the image is deleted successfully from the backend
            const response = await fetch(`http://localhost:5001/api/listings/${listingData.id}/images/${currentImageIndex}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                // Remove image from the local state
                const updatedImages = images.filter((_, index) => index !== currentImageIndex);
                setImages(updatedImages);
    
                // Adjust current image index after deletion
                setCurrentImageIndex(prevIndex => 
                    updatedImages.length > 0 ? Math.min(prevIndex, updatedImages.length - 1) : 0
                );
                
                setImageError('');
            } else {
                throw new Error('Failed to delete image');
            }
        } catch (err) {
            setImageError(err.message);
        }
    };
    

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handleSave = async () => {
        setSaveError('');
        if (!title || !price || !location) {
            setSaveError('Please complete all required fields.');
            return;
        }

        if (images.length === 0) {
            setSaveError('Please add at least one image.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/listings/${listingData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    price,
                    location,
                    description,
                    images
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                onSave(data.item);
                window.location.reload();  // Reload the page
            } else {
                setSaveError(data.message || 'Error saving listing');
            }
        } catch {
            setSaveError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
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
            <Typography variant="h6" gutterBottom>Edit Listing</Typography>
            <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
                <Box 
                    position="relative" 
                    width="100%" 
                    height={250} 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    bgcolor="grey.200" 
                    borderRadius={1}
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
                {/* Image indicators */}
                <Box display="flex" justifyContent="center" mt={1}>
                {(Array.isArray(images) ? images : []).map((_, index) => (
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
            <Grid item xs={12} sm={6}>
                <TextField 
                    label="Title" 
                    fullWidth 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <TextField 
                    label="Price" 
                    fullWidth 
                    value={price} 
                    type="number" 
                    onChange={(e) => setPrice(e.target.value)} 
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Location</InputLabel>
                    <Select value={location} onChange={(e) => setLocation(e.target.value)}>
                        {LOCATIONS.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField 
                    label="Description" 
                    fullWidth 
                    multiline 
                    rows={4} 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
                {saveError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {saveError}
                    </Typography>
                )}
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '0 16px 16px 16px' }}>
            <Button onClick={handleSave} variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
        </DialogActions>
        </Dialog>
    );
}

export default EditListingPopup;
