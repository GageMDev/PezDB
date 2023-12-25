import {Box, Typography} from "@mui/material";
import React from "react";

export default function InputGroup({children, label}: {children: React.ReactNode, label: string}) {

    return (
        <Box sx={{border: 1, borderRadius: '16px', padding: 1, margin: 1}}>
            <Typography>{label}</Typography>
            {children}
        </Box>
    )
}