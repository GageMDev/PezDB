"use client";
import React, {useState, useRef, useEffect} from "react";
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
import QualitySelector from "@/components/InputForm/QualitySelector";
import qualitySelector from "@/components/InputForm/QualitySelector";
import FootSelector from "@/components/InputForm/FootSelector";

const COLORS = ["Green", "Blue"]
const BUTTON_COLORS = ["White", "Red"]
const COLLECTIONS = ["Disney", "PEZ"]
const IMCS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "V"]
const IMC_TO_COUNTRY: { [key: string]: string[] } = {
    "1": ["Austria", "China", "Hungary"],
    "2": ["Austria", "Hungary"],
    "3": ["Austria", "Hungary"],
    "4": ["Austria"],
    "5": ["Yugoslavia", "Slovenia"],
    "6": ["Hong Kong", "China"],
    "7": ["Hong Kong", "China", "Czech Republic", "Czechoslovakia"],
    "8": ["Austria"],
    "9": ["United States"],
    "V": ["Yugoslavia", "Slovenia"],
}

interface FormInputState {
    name: string;
    collection: string;
    subCollection: string;
    copyright: string;
    variation: string;
    pezPackage: string;
    quality: string;
    yearReleased: string;
    pezURL: string;
    notes: string;
    stemColor: string;
    imc: string;
    patent: string;
    country: string;
    foot: string;
    footText: string;
    sleeveColor: string;
    buttonColor: string;
    sleeveText: string;
}


const PATENTS = ["BOX", "DBP", "2.620.061", "3.410.455", "3.845.882", "3.942.683", "4.966.305", "5.984.285", "7.523.841"]

function InputForm() {
    const [formInputState, setFormInputState] = useState<FormInputState>({
        name: "",
        collection: "",
        subCollection: "",
        copyright: "",
        variation: "",
        pezPackage: "Loose",
        quality: "Great",
        yearReleased: "",
        pezURL: "",
        notes: "",
        // Stem
        stemColor: "",
        imc: "",
        patent: "",
        country: "",
        foot: "Feet",
        footText: "",
        // Sleeve
        sleeveColor: "White",
        buttonColor: "White",
        sleeveText: ""
    });

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
        Object.keys(formInputState).forEach((key) => {
            const stateKey = key as keyof FormInputState;
            formData.append(key, formInputState[stateKey]);
        });

        if (image) {
            formData.append("image", image);
        }

        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/dispensers", formData);
            setIsSubmitting(false)
            setSubmitMessage(`${formInputState.name} submitted successfully`)
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
            body: JSON.stringify({_id: lastSubmittedID}),
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
                    <video ref={videoRef} autoPlay/>
                    <canvas ref={canvasRef}></canvas>
                    <Button variant="contained" onClick={handleImageCapture}>
                        Take Picture
                    </Button>
                </Stack>
                <form onSubmit={handleSubmit}>
                    <Stack direction="row">
                        <InputGroup label="Overall">
                            <AutocompleteWrapper
                                label="Name"
                                options={[]}
                                inputValue={formInputState.name}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        name: newValue
                                    }));
                                }}
                            />
                            <AutocompleteWrapper
                                label="Collection"
                                options={COLLECTIONS}
                                inputValue={formInputState.collection}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        collection: newValue
                                    }));
                                }}
                            />
                            <AutocompleteWrapper
                                label="Sub-Collection"
                                options={[]}
                                inputValue={formInputState.subCollection}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        subCollection: newValue
                                    }));
                                }}
                            />
                            <AutocompleteWrapper
                                label="Variation"
                                options={[]}
                                inputValue={formInputState.variation}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        variation: newValue
                                    }))
                                }}
                            />
                            <AutocompleteWrapper
                                label="Copyright"
                                options={[]}
                                inputValue={formInputState.copyright}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        copyright: newValue
                                    }))
                                }}
                            />
                            <AutocompleteWrapper
                                label="Year Released"
                                options={[]}
                                inputValue={formInputState.yearReleased}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        yearReleased: newValue
                                    }))
                                }}
                            />
                            <AutocompleteWrapper
                                label="Pez URL"
                                options={[]}
                                inputValue={formInputState.pezURL}
                                onInputChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        pezURL: newValue
                                    }))
                                }}
                            />
                            <QualitySelector onPackageChange={(newValue: string) => {
                                setFormInputState(prevState => ({
                                    ...prevState,
                                    pezPackage: newValue
                                }))
                            }} pezPackage={formInputState.pezPackage} onQualityChange={(newValue: string) => {
                                setFormInputState(prevState => ({
                                    ...prevState,
                                    quality: newValue
                                }))
                            }} quality={formInputState.quality}/>
                            <TextField
                                size="small"
                                sx={{width: 300}}
                                margin="dense"
                                label="notes"
                                multiline
                                value={formInputState.notes}
                                onChange={(event: any) => setFormInputState({...formInputState, notes: event.target.value})}
                            />
                        </InputGroup>
                        <Stack>
                            <InputGroup label="Stem">
                                <AutocompleteWrapper
                                    label="Color"
                                    options={COLORS}
                                    inputValue={formInputState.stemColor}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            stemColor: newValue
                                        }))
                                    }}
                                />
                                <AutocompleteWrapper
                                    label="IMC"
                                    options={IMCS}
                                    inputValue={formInputState.imc}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            imc: newValue
                                        }))
                                    }}
                                />
                                <AutocompleteWrapper
                                    label="Patent"
                                    options={PATENTS}
                                    inputValue={formInputState.patent}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            patent: newValue
                                        }))
                                    }}
                                />
                                <AutocompleteWrapper
                                    label="Country"
                                    options={IMC_TO_COUNTRY[formInputState.imc] || []}
                                    inputValue={formInputState.country}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            country: newValue
                                        }))
                                    }}
                                />
                                <FootSelector foot={formInputState.foot} onFootChange={(newValue: string) => {
                                    setFormInputState(prevState => ({
                                        ...prevState,
                                        foot: newValue
                                    }))
                                }}/>
                                <AutocompleteWrapper
                                    label="Foot Text"
                                    options={[]}
                                    inputValue={formInputState.footText}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            footText: newValue
                                        }))
                                    }}
                                    helpText="Use a space between to chars to indicate one on each foot. Use ? to indicate a missing one if needed."
                                />
                            </InputGroup>
                            <InputGroup label="Sleeve">
                                <AutocompleteWrapper
                                    label="Color"
                                    options={["White"]}
                                    inputValue={formInputState.sleeveColor}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            sleeveColor: newValue
                                        }))
                                    }}
                                />
                                <AutocompleteWrapper
                                    label="Button Color"
                                    options={BUTTON_COLORS}
                                    inputValue={formInputState.buttonColor}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            buttonColor: newValue
                                        }))
                                    }}
                                />
                                <AutocompleteWrapper
                                    label="Text"
                                    options={[]}
                                    inputValue={formInputState.sleeveText}
                                    onInputChange={(newValue: string) => {
                                        setFormInputState(prevState => ({
                                            ...prevState,
                                            sleeveText: newValue
                                        }))
                                    }}
                                />
                            </InputGroup>
                        </Stack>
                    </Stack>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{mt: 2}}
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
