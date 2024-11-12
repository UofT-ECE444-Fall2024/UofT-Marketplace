import React from 'react';
import SearchBar from "./SearchBar"
import PriceFilter from './filters/PriceFilter';
import ConditionFilter from './filters/ConditionFilter';
import DateListedFilter from './filters/DateListedFilter';
import LocationFilter from './filters/LocationFilter';
import SortByFilter from './filters/SortByFilter'
import CategoryFilter from './filters/CategoryFilter';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import AvailabilityFilter from './filters/AvailabilityFilter';

const drawerWidth = 360;

const SearchAndFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
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
            <SearchBar queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <PriceFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <AvailabilityFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <CategoryFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <ConditionFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <LocationFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <SortByFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
            <DateListedFilter queries={queries} setQueries={setQueries} searchAndFilterNavigate={searchAndFilterNavigate} />
        </Drawer>
    )



}

export default SearchAndFilter;