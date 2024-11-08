import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const LOCATIONS = ['Bahen', 'University College', 'Hart House', 'Sid Smith', 'Myhal', 'Robarts'];
const CONDITIONS = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

function ListingForm({ title, setTitle, price, setPrice, location, setLocation, condition, setCondition, description, setDescription, publishError }) {
  return (
    <Grid item xs={12} sm={6}>
      <TextField label="Title" required fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Price" required fullWidth margin="normal" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Location</InputLabel>
        <Select value={location} label="Location" onChange={(e) => setLocation(e.target.value)}>
          {LOCATIONS.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Condition</InputLabel>
        <Select value={condition} label="Condition" onChange={(e) => setCondition(e.target.value)}>
          {CONDITIONS.map(con => <MenuItem key={con} value={con}>{con}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField label="Description" multiline rows={4} fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
      {publishError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{publishError}</Typography>}
    </Grid>
  );
}

export default ListingForm;
