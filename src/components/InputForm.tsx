"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Autocomplete,
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

const COLORS = ["Green", "Blue"]

function InputForm() {
    const [dispenserName, setDispenserName] = useState("");
    const [stemColor, setStemColor] = useState<string>("");
    const [image, setImage] = useState<Blob | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [lastSubmittedID, setLastSubmittedID] = useState("");

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
        formData.append("name", dispenserName);
        formData.append("stemColor", stemColor);

        if (image) {
            formData.append("image", image);
        }

        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/dispensers", formData);
            setIsSubmitting(false)
            setSubmitMessage(`${dispenserName} submitted successfully`)
            setLastSubmittedID(response.data.id)
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle submission error (e.g., display error message)
        }
    };

    const handleUndo = async () => {
        console.log("deleting object...");

        const response = await fetch('/api/dispensers', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: lastSubmittedID }),
        });

        if (!response.ok) {
            console.error('Failed to delete object', await response.text());
        } else {
            console.log('Object deleted successfully');
        }
    }


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
                        value={dispenserName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setDispenserName(event.target.value);
                        }}
                        margin="normal"
                        fullWidth
                    />
                    <Autocomplete
                        freeSolo
                        id="combo-box-demo"
                        options={COLORS}
                        inputValue={stemColor}
                        onInputChange={(_event: any, newValue: string) => {
                            setStemColor(newValue);
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Stem Color" />}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        Submit
                    </Button>
                    {submitMessage && (
                        <Stack direction="row">
                            <Typography variant="body1">{submitMessage}</Typography>
                            <Button onClick={handleUndo}>Undo?</Button>
                        </Stack>
                    )}
                </form>

            </Stack>

        </Box>
    );
}

export default InputForm;
