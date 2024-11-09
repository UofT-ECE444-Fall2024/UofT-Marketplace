import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(value, chips, theme) {
    return {
      fontWeight: chips.includes(value)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

const MultiChipSelect = ({filterLabel, values, selectedChips, setSelectedChips, handleChange}) => {
    const theme = useTheme();

    return (
        <div>
            <FormControl sx={{ width: "98%" }}>
                <InputLabel>{filterLabel}</InputLabel>
                <Select
                    multiple
                    value={selectedChips}
                    onChange={handleChange}
                    input={<OutlinedInput label={filterLabel} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip
                                key={value}
                                label={value}
                            />
                        ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                {values.map((value) => (
                    <MenuItem
                        key={value}
                        value={value}
                        style={getStyles(value, selectedChips, theme)}
                    >
                        {value}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default MultiChipSelect;