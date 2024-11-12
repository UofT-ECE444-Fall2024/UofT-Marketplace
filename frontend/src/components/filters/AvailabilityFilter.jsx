import React, { useState } from 'react';
import MultiChipSelect from '../MultiChipSelect';  // Assuming the component that handles multi-select with chips
import { AVAILABILITY_OPTIONS } from '../constants.js';  // Availability options (e.g., Available, Unavailable)
import Box from '@mui/material/Box';

const AvailabilityFilter = ({ queries, setQueries, searchAndFilterNavigate }) => {
    const [availability, setAvailability] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        if (!value) return;
        setAvailability(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        const queriesCpy = { ...queries };
        if (value.length === 0) {
            if ('availability' in queriesCpy && value.length === 0) {
                delete queriesCpy.availability;
                setQueries(queriesCpy);
            }
            searchAndFilterNavigate(queriesCpy);
            return;
        }
        queriesCpy['availability'] = encodeURIComponent(value.map(String).join(","));
        event.preventDefault();
        searchAndFilterNavigate(queriesCpy);
    };

    return (
        <Box sx={{ m: 1 }}>
            <MultiChipSelect
                filterLabel="Availability"
                values={AVAILABILITY_OPTIONS}
                handleChange={handleChange}
                selectedChips={availability}
                setSelectedChips={setAvailability}
            />
        </Box>
    );
};

export default AvailabilityFilter;
