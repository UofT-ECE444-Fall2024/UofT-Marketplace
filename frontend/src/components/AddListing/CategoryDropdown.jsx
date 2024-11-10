import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { CATEGORIES } from '../constants.js';

function CategoryDropdown({ category, setCategory }) {
  const menuItems = Array.from(CATEGORIES.entries()).reduce((items, [categoryName, { icon, subcategories }]) => {
    // Add header item
    items.push(
      <MenuItem 
        key={categoryName}
        disabled
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{categoryName}</ListItemText>
      </MenuItem>
    );
    
    // Add subcategory items
    subcategories.forEach(subcategory => {
      items.push(
        <MenuItem 
          key={`${categoryName}-${subcategory}`}
          value={subcategory}
          sx={{ pl: 6.5, color: 'text.primary' }}
        >
          <ListItemText>{subcategory}</ListItemText>
        </MenuItem>
      );
    });
    
    return items;
  }, []);

  return (
    <FormControl fullWidth margin="normal" required>
      <InputLabel>Category</InputLabel>
      <Select
        value={category}
        label="Category"
        onChange={(e) => setCategory(e.target.value)}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
}

export default CategoryDropdown;