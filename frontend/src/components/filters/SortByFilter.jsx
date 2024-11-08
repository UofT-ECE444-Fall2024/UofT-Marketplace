import React, { useState } from 'react';
import RadioSelect from '../RadioSelect';
import { SORT_OPTIONS, SORT_OPTIONS_MAPPING } from '../constants.js';

const SortByFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
    const handleChange = (event) => {
        if (!event.target.value) return;
        const queriesCpy = {...queries}
        if (event.target.value === "Suggested") {
            if ('sortBy' in queriesCpy) {
                delete queriesCpy.daysSinceListed;
                setQueries(queriesCpy);
            }
            return;
        }
        queriesCpy['sortBy'] = SORT_OPTIONS_MAPPING[event.target.value];
        setQueries(queriesCpy);
        searchAndFilterNavigate(queriesCpy);
    };

    return (
        <div>
            <RadioSelect filterLabel="Sort By" values={SORT_OPTIONS} handleChange={handleChange} />
        </div>
    )
}

export default SortByFilter;