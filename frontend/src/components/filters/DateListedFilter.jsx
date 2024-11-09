import React, { useState } from 'react';
import RadioSelect from '../RadioSelect';
import { DATE_LISTED } from '../constants.js';

const DateListedFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
    const handleChange = (event) => {
        if (!event.target.value) return;
        const queriesCpy = {...queries}
        if (event.target.value === "All") {
            if ('daysSinceListed' in queriesCpy) {
                delete queriesCpy.daysSinceListed;
                setQueries(queriesCpy);
            }
            return;
        }
        queriesCpy['daysSinceListed'] = event.target.value.split(" ")[1];
        setQueries(queriesCpy);
        searchAndFilterNavigate(queriesCpy);
    };

    return (
        <div>
            <RadioSelect filterLabel="Date Listed" values={DATE_LISTED} handleChange={handleChange} />
        </div>
    )
}

export default DateListedFilter;