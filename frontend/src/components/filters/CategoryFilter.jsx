import React, { useState } from 'react';
import { Box, Chip, FormControl, InputLabel, Select, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import { CATEGORIES } from '../constants.js';

const CategoryFilter = ({ queries, setQueries, searchAndFilterNavigate }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleCategoryChange = (event) => {
        const {
            target: { value },
        } = event;

        if (!value) return;
        setSelectedCategories(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        const queriesCpy = { ...queries };
        if (value.length === 0) {
            if ('category' in queriesCpy && value.length === 0) {
                delete queriesCpy.category;
                setQueries(queriesCpy);
            }
            searchAndFilterNavigate(queriesCpy);
            return;
        }
        queriesCpy['category'] = encodeURIComponent(value.map(String).join(","));
        event.preventDefault();
        searchAndFilterNavigate(queriesCpy);
    };

    const menuItems = Array.from(CATEGORIES.entries()).reduce((items, [categoryName, { icon, subcategories }]) => {
        // Add header item
        items.push(
            <MenuItem
                key={categoryName}
                disabled
                sx={{
                    display: 'flex',
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '& svg': {
                        mr: 2,
                        color: 'text.secondary',
                    },
                }}
            >
                <ListItemIcon>{icon || <FolderOutlined />}</ListItemIcon>
                <ListItemText>{categoryName}</ListItemText>
            </MenuItem>
        );

        // Add subcategory items
        subcategories.forEach(subcategory => {
            const categoryKey = subcategory;
            items.push(
                <MenuItem
                    key={categoryKey}
                    value={categoryKey}
                    sx={{
                        pl: 6.5,
                        color: 'text.primary',
                    }}
                >
                    <ListItemText>{subcategory}</ListItemText>
                </MenuItem>
            );
        });

        return items;
    }, []);

    return (
        <Box sx={{ m: 1}}>
            <FormControl fullWidth margin="normal" optional>
                <InputLabel>Category</InputLabel>
                <Box>
                    <Select
                        multiple
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        renderValue={(selected) => (
                            <Box >
                                {selected.map((category) => (
                                    <Chip
                                        key={category}
                                        label={category}
                                        variant="filled"
                                        color="SECONDARY"
                                        sx={{ maxWidth: 'calc(100% - 10px)' }}  // To make sure it fits within the Select container
                                    />
                                ))}
                            </Box>
                        )}
                        label="Category"
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    maxHeight: 400,
                                    overflow: 'auto',
                                },
                            },
                        }}
                        sx={{ width: '98%' }}  // Ensure full width for the Select component
                    >
                        {menuItems}
                    </Select>
            
                </Box>
            </FormControl>
        </Box>
    );
};

export default CategoryFilter;