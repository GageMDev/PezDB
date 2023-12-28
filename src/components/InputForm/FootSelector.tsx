import React, {useState, ChangeEvent} from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    SelectChangeEvent,
    Box
} from '@mui/material';

interface QualitySelectorProps {
    foot: string;
    onFootChange: (value: string) => void;
}

const FootSelector = ({foot, onFootChange}: QualitySelectorProps) => {

    const handleFootChange = (event: ChangeEvent<HTMLInputElement>) => {
        onFootChange((event.target as HTMLInputElement).value);
    };

    return (
        <RadioGroup row aria-label="item" name="row-radio-buttons-group" value={foot}
                    onChange={handleFootChange}>
            <FormControlLabel value="No Feet" control={<Radio/>} label="No Feet"/>
            <FormControlLabel value="Thin Feet" control={<Radio/>} label="Thin Feet"/>
            <FormControlLabel value="Feet" control={<Radio/>} label="Feet"/>
        </RadioGroup>
    );
};

export default FootSelector;
