import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

const PriceFilter = ({queries, setQueries, searchAndFilterNavigate}) => {
    const handleMinPriceChange = (event) => {
        const queriesCpy = {...queries};
        queriesCpy['minPrice'] =  event.target.value;
        if (event.target.value === '') {
            if ('minPrice' in queriesCpy) {
                delete queriesCpy.minPrice;
                setQueries(queriesCpy);
            }
            return;
        }
        setQueries(queriesCpy);
    };

    const handleMaxPriceChange = (event) => {
        const queriesCpy = {...queries};
        if (event.target.value === '') {
            if ('maxPrice' in queriesCpy) {
                delete queriesCpy.maxPrice;
                setQueries(queriesCpy);
            }
            return;
        }
        queriesCpy['maxPrice'] =  event.target.value;
        setQueries(queriesCpy);
    };

    const handlePriceEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchAndFilterNavigate(queries);
        }
    };

    return (
        <Stack direction="row">
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Min"
                    placeholder="Min"
                    type="number"
                    onChange={handleMinPriceChange}
                    onKeyDown={handlePriceEnter}
                />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Max"
                    placeholder="Max"
                    type="number"
                    onChange={handleMaxPriceChange}
                    onKeyDown={handlePriceEnter}
                />
            </FormControl>
        </Stack>
    )
}

export default PriceFilter;