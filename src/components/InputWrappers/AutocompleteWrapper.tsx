import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface AutocompleteWrapperProps {
    options: any[];
    inputValue: string;
    onInputChange: (newValue: string) => void;
    label: string;
}

const AutocompleteWrapper: React.FC<AutocompleteWrapperProps> = ({ options, inputValue, onInputChange, label }) => {
    return (
        <Autocomplete
            freeSolo
            options={options}
            inputValue={inputValue}
            onInputChange={(_, newValue) => onInputChange(newValue)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} margin="dense" label={label} />}
        />
    );
};

export default AutocompleteWrapper;