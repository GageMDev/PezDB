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
import QualitySelector from "@/components/InputForm/QualitySelector";
import qualitySelector from "@/components/InputForm/QualitySelector";
import FootSelector from "@/components/InputForm/FootSelector";

const COLORS = ["Green", "Blue"]
const BUTTON_COLORS = ["White", "Red"]
const COLLECTIONS = ["Disney", "PEZ"]
const IMCS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "V"]
const IMC_TO_COUNTRY: {[key: string]: string[]} = {
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
const PATENTS = ["BOX", "DBP", "2.620.061", "3.410.455", "3.845.882", "3.942.683", "4.966.305", "5.984.285", "7.523.841"]

function InputForm() {
    const [dispenserName, setDispenserName] = useState("");
    const [collection, setCollection] = useState("");
    const [subCollection, setSubCollection] = useState("");
    const [copyright, setCopyright] = useState("");
    const [variation, setVariation] = useState("");
    const [pezPackage, setPezPackage] = useState("Loose");
    const [quality, setQuality] = useState("Great");
    const [yearReleased, setYearReleased] = useState("");
    const [pezURL, setPezURL] = useState("");

    const [stemColor, setStemColor] = useState<string>("");
    const [imc, setIMC] = useState<string>("");
    const [patent, setPatent] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [foot, setFoot] = useState<string>("Feet");
    const [footText, setFootText] = useState<string>("");

    const [sleeveColor, setSleeveColor] = useState<string>("White");
    const [buttonColor, setButtonColor] = useState<string>("White");
    const [sleeveText, setSleeveText] = useState<string>("");

    const [formInputState, setFormInputState] = useState({
        dispenserName: "",
        collection: "",
        subCollection: "",
        copyright: "",
        variation: "",
        pezPackage: "Loose",
        quality: "Great",
        yearReleased: "",
        pezURL: "",
        stemColor: "",
        imc: "",
        patent: "",
        country: "",
        foot: "Feet",
        footText: "",
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
        formData.append("name", dispenserName);
        formData.append("collection", collection);
        formData.append("subCollection", subCollection);
        formData.append("copyRight", copyright);
        formData.append("variation", variation);
        formData.append("package", pezPackage);
        formData.append("quality", quality);
        formData.append("pezURL", pezURL);
        formData.append("yearReleased", yearReleased);

        formData.append("stemColor", stemColor);
        formData.append("imc", imc);
        formData.append("patent", patent);
        formData.append("country", country);
        formData.append("foot", foot);
        formData.append("footText", footText);

        formData.append("sleeveColor", sleeveColor);
        formData.append("buttonColor", buttonColor);
        formData.append("sleeveText", sleeveText);

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
                            inputValue={formInputState.dispenserName}
                            onInputChange={(newValue: string) => {
                                setFormInputState(prevState => ({
                                    ...prevState,
                                    dispenserName: newValue
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
                            inputValue={yearReleased}
                            onInputChange={(newValue: string) => {
                                setYearReleased(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Pez URL"
                            options={[]}
                            inputValue={pezURL}
                            onInputChange={(newValue: string) => {
                                setPezURL(newValue);
                            }}
                        />
                        <QualitySelector onPackageChange={setPezPackage} pezPackage={pezPackage} onQualityChange={setQuality} quality={quality}/>
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
                            options={IMC_TO_COUNTRY[imc] || []}
                            inputValue={country}
                            onInputChange={(newValue: string) => {
                                setCountry(newValue);
                            }}
                        />
                        <FootSelector foot={foot} onFootChange={setFoot}/>
                        <AutocompleteWrapper
                            label="Foot Text"
                            options={[]}
                            inputValue={footText}
                            onInputChange={(newValue: string) => {
                                setFootText(newValue);
                            }}
                            helpText="Use a space between to chars to indicate one on each foot. Use ? to indicate a missing one if needed."
                        />
                    </InputGroup>
                    <InputGroup label="Sleeve">
                        <AutocompleteWrapper
                            label="Color"
                            options={["White"]}
                            inputValue={sleeveColor}
                            onInputChange={(newValue: string) => {
                                setSleeveColor(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Button Color"
                            options={BUTTON_COLORS}
                            inputValue={buttonColor}
                            onInputChange={(newValue: string) => {
                                setButtonColor(newValue);
                            }}
                        />
                        <AutocompleteWrapper
                            label="Text"
                            options={[]}
                            inputValue={sleeveText}
                            onInputChange={(newValue: string) => {
                                setSleeveColor(newValue);
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
