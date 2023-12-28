import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {Dialog, DialogContent, DialogContentText, IconButton, InputAdornment} from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
interface AutocompleteWrapperProps {
    options: any[];
    inputValue: string;
    onInputChange: (newValue: string) => void;
    label: string;
    helpText?: string;
}

const AutocompleteWrapper: React.FC<AutocompleteWrapperProps> = ({options, inputValue, onInputChange, label, helpText}) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Autocomplete
            freeSolo
            size="small"
            options={options}
            inputValue={inputValue}
            onInputChange={(_, newValue) => onInputChange(newValue)}
            sx={{width: 300}}
            renderInput={(params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField {...params} margin="dense" size="small" label={label} />
                    {helpText && (
                        <>
                            <IconButton size="small" onClick={handleClickOpen}><HelpIcon/></IconButton>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogContent>
                                    <DialogContentText>
                                        {helpText}
                                    </DialogContentText>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            )}
        />
    );
};

export default AutocompleteWrapper;