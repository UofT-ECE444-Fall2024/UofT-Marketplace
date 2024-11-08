import React, { useState } from 'react';
import MultiChipSelect from '../MultiChipSelect'
import { CONDITIONS } from '../constants.js';
import Box from '@mui/material/Box';

const ConditionFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
    const [condition, setCondition] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        if (!value) return;
        setCondition(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        const queriesCpy = {...queries}
        if (value.length === 0) {
            if ('condition' in queriesCpy && value.length === 0) {
                delete queriesCpy.condition;
                setQueries(queriesCpy);
            }
            searchAndFilterNavigate(queriesCpy);
            return;
        }
        queriesCpy['condition'] = encodeURIComponent(value.map(String).join(","));
        event.preventDefault();
        searchAndFilterNavigate(queriesCpy);
    };

    return (
        <Box sx={{m: 1}}>
            <MultiChipSelect filterLabel="Condition" values={CONDITIONS} handleChange={handleChange} selectedChips={condition} setSelectedChips={setCondition}  />
        </Box>
    )
}

export default ConditionFilter;