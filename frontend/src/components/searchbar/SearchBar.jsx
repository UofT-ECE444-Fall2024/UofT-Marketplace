import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({handleSearchChange, handleSearchClickSubmit, handleSearchEnterSubmit}) => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 290, margin: '5px', marginTop: '20px' }}
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
    </Paper>
  );}

  export default SearchBar;
  