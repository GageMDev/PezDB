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
import AutocompleteWrapper from "@/components/InputWrappers/AutocompleteWrapper";
import InputGroup from "@/components/InputForm/InputGroup";

const COLORS = ["Green", "Blue"]
const COLLECTIONS = ["Disney", "PEZ"]
const IMCS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "V"]
const PATENTS = ["BOX", "DBP", "2.620.061", "3.410.455", "3.845.882", "3.942.683", "4.966.305", "5.984.285", "7.523.841"]

function InputForm() {
    const [dispenserName, setDispenserName] = useState("");
    const [collectionName, setCollectionName] = useState("");
    const [copyright, setCopyright] = useState("");
    const [variation, setVariation] = useState("");

    const [stemColor, setStemColor] = useState<string>("");
    const [imc, setIMC] = useState<string>("");
    const [patent, setPatent] = useState<string>("");
    const [country, setCountry] = useState<string>("");

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
        formData.append("collectionName", collectionName);
        formData.append("copyRight", copyright);
        formData.append("variation", variation);

        formData.append("stemColor", stemColor);
        formData.append("imc", imc);
        formData.append("patent", patent);
        formData.append("country", country);

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
                    <InputGroup label="Overall">
                        <AutocompleteWrapper
                            label="Name"
                            options={[]}
                            inputValue={dispenserName}
                            onInputChange={(newValue: string) => {
                                setDispenserName(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Collection"
                            options={COLLECTIONS}
                            inputValue={collectionName}
                            onInputChange={(newValue: string) => {
                                setCollectionName(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Copyright"
                            options={[]}
                            inputValue={copyright}
                            onInputChange={(newValue: string) => {
                                setCopyright(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Variation"
                            options={[]}
                            inputValue={variation}
                            onInputChange={(newValue: string) => {
                                setVariation(newValue);
                            }}
                        />
                    </InputGroup>
                    <InputGroup label="Stem">
                        <AutocompleteWrapper
                            label="Color"
                            options={COLORS}
                            inputValue={stemColor}
                            onInputChange={(newValue: string) => {
                                setStemColor(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="IMC"
                            options={IMCS}
                            inputValue={imc}
                            onInputChange={(newValue: string) => {
                                setIMC(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Patent"
                            options={PATENTS}
                            inputValue={patent}
                            onInputChange={(newValue: string) => {
                                setPatent(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Country"
                            options={[]}
                            inputValue={country}
                            onInputChange={(newValue: string) => {
                                setCountry(newValue);
                            }}
                        />
                    </InputGroup>
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
