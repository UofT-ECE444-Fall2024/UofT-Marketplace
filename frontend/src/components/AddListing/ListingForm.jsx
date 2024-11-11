import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import CategoryDropdown from './CategoryDropdown';
import { LOCATIONS, CONDITIONS } from '../constants.js';

function ListingForm({ title, setTitle, price, setPrice, location, setLocation, condition, setCondition, description, setDescription, category, setCategory, publishError }) {
  return (
    <Grid item xs={12} sm={6}>
      <TextField label="Title" required fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Price" required fullWidth margin="normal" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Location</InputLabel>
        <Select
          multiple
          value={Array.isArray(location) ? location : []}
          label="Location"
          onChange={(e) => setLocation(e.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {LOCATIONS.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Condition</InputLabel>
        <Select value={condition} label="Condition" onChange={(e) => setCondition(e.target.value)}>
          {CONDITIONS.map(con => <MenuItem key={con} value={con}>{con}</MenuItem>)}
        </Select>
      </FormControl>
      <CategoryDropdown
        category={category}
        setCategory={setCategory}
      />
      <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      {publishError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{publishError}</Typography>}
    </Grid>
  );
}

export default ListingForm;