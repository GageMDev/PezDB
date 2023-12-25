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
    pezPackage: string;
    quality: string;
    onPackageChange: (value: string) => void;
    onQualityChange: (value: string) => void;
}

const QualitySelector = ({pezPackage, quality, onPackageChange, onQualityChange}: QualitySelectorProps) => {

    const handlePackageChange = (event: ChangeEvent<HTMLInputElement>) => {
        onPackageChange((event.target as HTMLInputElement).value);
    };

    const handleQualityChange = (event: SelectChangeEvent) => {
        onQualityChange(event.target.value);
    };

    return (
        <Box>
            <RadioGroup row aria-label="item" name="row-radio-buttons-group" value={pezPackage} onChange={handlePackageChange}>
                <FormControlLabel value="Card" control={<Radio/>} label="Card"/>
                <FormControlLabel value="Bag" control={<Radio/>} label="Bag"/>
                <FormControlLabel value="Loose" control={<Radio/>} label="Loose"/>
            </RadioGroup>
            <FormControl sx={{width: 300}}>
                <Select labelId="quality-label" value={quality} onChange={handleQualityChange}>
                    <MenuItem value={"Great"}>Great</MenuItem>
                    <MenuItem value={"Good"}>Good</MenuItem>
                    <MenuItem value={"Okay"}>Okay</MenuItem>
                    <MenuItem value={"Poor"}>Poor</MenuItem>
                    <MenuItem value={"Awful"}>Awful</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default QualitySelector;
