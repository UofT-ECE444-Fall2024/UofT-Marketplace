import React, { useState } from 'react';
import { LOCATIONS } from '../constants.js';
import MultiChipSelect from '../MultiChipSelect'
import Box from '@mui/material/Box';


const LocationFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
    const [location, setLocation] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setLocation(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        const queriesCpy = {...queries}
        if (value.length === 0) {
            if ('location' in queriesCpy && value.length === 0) {
                delete queriesCpy.location;
                setQueries(queriesCpy);
            }
            searchAndFilterNavigate(queriesCpy);
            return;
        }
        queriesCpy['location'] = encodeURIComponent(value.map(String).join(","));
        setQueries(queriesCpy);
        event.preventDefault();
        searchAndFilterNavigate(queriesCpy);
    };

    return (
        <Box sx={{m: 1}}>
            <MultiChipSelect filterLabel="Location" values={LOCATIONS} handleChange={handleChange} selectedChips={location} setSelectedChips={setLocation} />
        </Box>
    )
}

export default LocationFilter;