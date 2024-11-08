import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { ShoppingBag, Home, Devices, Movie, HealthAndSafety, SportsMotorsports, Category } from '@mui/icons-material';

const CATEGORIES = new Map([
  ['Clothing & Accessories', {
    icon: <ShoppingBag />,
    subcategories: ['Accessories', 'Menswear', 'Womenswear', 'Baby & Kids', 'Shoes']
  }],
  ['Home & Living', {
    icon: <Home />,
    subcategories: ['Furniture', 'Home Decor', 'Appliances', 'Tools & Hardware']
  }],
  ['Electronics', {
    icon: <Devices />,
    subcategories: ['Computers & Tablets', 'Phones & Accessories']
  }],
  ['Entertainment', {
    icon: <Movie />,
    subcategories: ['Books, Movies & Music', 'Games & Puzzles']
  }],
  ['Health & Beauty', {
    icon: <HealthAndSafety />,
    subcategories: ['Skincare & Makeup', 'Haircare & Beauty Tools', 'Health & Wellness']
  }],
  ['Outdoors & Sports', {
    icon: <SportsMotorsports />,
    subcategories: ['Bicycles & Vehicles', 'Sports & Gear']
  }],
  ['Miscellaneous', {
    icon: <Category />,
    subcategories: ['Vintage & Collectibles', 'Arts & Crafts', 'Other']
  }]
]);

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
          sx={{ pl: 7, color: 'text.primary' }}
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