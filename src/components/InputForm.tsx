"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

function InputForm() {
    const [textInput, setTextInput] = useState("");
    const [dropdownValue, setDropdownValue] = useState("");
    const [image, setImage] = useState<Blob | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const startVideo = async () => {
            if (videoRef.current) {
                videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                await videoRef.current.play();
            }
        };
        startVideo();
    }, []);

    const handleTextInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setTextInput(event.target.value);
    };

    const handleDropdownChange = (event: SelectChangeEvent) => {
        setDropdownValue(event.target.value);
    };

    const handleImageCapture = async () => {
        if (videoRef.current && canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            canvasRef.current.getContext("2d")?.drawImage(videoRef.current, 0, 0);
            const blob = await new Promise<Blob | null>(
                (resolve) => canvasRef.current?.toBlob(resolve),
            );
            setImage(blob);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("text", textInput);
        formData.append("dropdown", dropdownValue);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("/api/submit", formData);
            console.log("Form submitted successfully:", response.data);
            // Handle successful submission (e.g., clear form fields, display success message)
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle submission error (e.g., display error message)
        }
    };

    return (
        <Box>
            <Stack direction="row" spacing={3}>
                <Stack>
                    <video ref={videoRef} autoPlay />
                    <canvas ref={canvasRef}></canvas>
                    <Button variant="contained" onClick={handleImageCapture}>
                        Take Picture
                    </Button>
                </Stack>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        value={textInput}
                        onChange={handleTextInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="stem-color-select-label">Stem Color</InputLabel>
                        <Select
                            labelId="stem-color-select-label"
                            label="Stem Color"
                            value={dropdownValue}
                            onChange={handleDropdownChange}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="Black">Black</MenuItem>
                            <MenuItem value="Blue">Blue</MenuItem>
                            <MenuItem value="Green">Green</MenuItem>
                            <MenuItem value="Pink">Pink</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        Submit
                    </Button>
                </form>
            </Stack>
            {submitMessage && (
                <Typography variant="body1">{submitMessage}</Typography>
            )}
        </Box>
    );
}

export default InputForm;
