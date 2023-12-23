"use client"
import React, {FormEventHandler, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {Box, Button, FormControl, Select, SelectChangeEvent, TextField, Typography,} from '@mui/material';

function InputForm() {
    const [textInput, setTextInput] = useState('');
    const [dropdownValue, setDropdownValue] = useState('');
    const [image, setImage] = useState<Blob | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const startVideo = async () => {
            if (videoRef.current) {
                videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
                await videoRef.current.play();
            }
        };
        startVideo();
    }, []);

    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextInput(event.target.value);
    };

    const handleDropdownChange = (event: SelectChangeEvent) => {
        setDropdownValue(event.target.value);
    };

    const handleImageCapture = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
            setImage(blob);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('text', textInput);
        formData.append('dropdown', dropdownValue);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('/api/submit', formData);
            console.log('Form submitted successfully:', response.data);
            // Handle successful submission (e.g., clear form fields, display success message)
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle submission error (e.g., display error message)
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400}}>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <TextField
                        label="Text Input"
                        value={textInput}
                        onChange={handleTextInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <Select
                        label="Dropdown"
                        value={dropdownValue}
                        onChange={handleDropdownChange}
                        fullWidth
                    >
                        <option value="">Select an option</option>
                        {/* Add your dropdown options here */}
                    </Select>
                    <video ref={videoRef} autoPlay />
                    <Button variant="contained" onClick={handleImageCapture}>
                        Take Picture
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{mt: 2}}
                    >
                        Submit
                    </Button>
                </FormControl>

            </form>
            {submitMessage && <Typography variant="body1">{submitMessage}</Typography>}
        </Box>
    );
}

export default InputForm;
