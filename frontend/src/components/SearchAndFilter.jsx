import React from 'react';
import SearchBar from "./searchbar/SearchBar"
import PriceFilter from './filters/PriceFilter';
import ConditionFilter from './filters/ConditionFilter';
import DateListedFilter from './filters/DateListedFilter';
import LocationFilter from './filters/LocationFilter';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 300;

const SearchAndFilter = ({handleSearchChange, handleSearchClickSubmit, handleSearchEnterSubmit}) => {
    return (
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <SearchBar handleSearchChange={handleSearchChange} handleSearchClickSubmit={handleSearchClickSubmit} handleSearchEnterSubmit={handleSearchEnterSubmit} />
            <PriceFilter />
            <ConditionFilter />
            <DateListedFilter />
            <LocationFilter />
        </Drawer>
    )



}

export default SearchAndFilter;