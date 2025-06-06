import React, { useState } from 'react';
import { Box } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({queries, setQueries, searchAndFilterNavigate}) => {
  const handleSearchChange = (e) => {
    const queriesCpy = {...queries};
    queriesCpy['search'] =  encodeURIComponent(e.target.value);
    setQueries(queriesCpy);
  };

  const handleSearchEnterSubmit = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchAndFilterNavigate(queries);
    }
  };

  const handleSearchClickSubmit = (event) => {
    event.preventDefault();
    searchAndFilterNavigate(queries);
  };

  return (
    <Box
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 350,
        margin: '5px',
        marginTop: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Listings"
        inputProps={{ 'aria-label': 'search listings' }}
        onChange={handleSearchChange}
        onKeyDown={handleSearchEnterSubmit}
      />
      <IconButton
        type="button"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={handleSearchClickSubmit}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );}

  export default SearchBar;