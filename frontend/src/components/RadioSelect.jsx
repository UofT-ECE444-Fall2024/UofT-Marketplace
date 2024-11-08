import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';

const RadioSelect = ({filterLabel, values, handleChange}) => {
    return (
        <FormControl
            sx={{marginTop: "20px"}}
        >
            <Stack direction="column">
                <FormLabel
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: "20px"
                    }}
                >
                    {filterLabel}
                </FormLabel>
                <RadioGroup
                    defaultValue={values[0]}
                    name="radio-buttons-group"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: "20px"
                    }}
                >
                    {values.map((value) => {
                        return <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio />}
                            label={value}
                            onClick={handleChange}
                        />
                    })}
                </RadioGroup>
            </Stack>
        </FormControl>
    )
}

export default RadioSelect;