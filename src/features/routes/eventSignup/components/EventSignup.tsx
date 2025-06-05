'use client'

import { sessionValidator } from "@/utils/sessionValidator";
import { Box, CircularProgress, Typography, Paper, TextField, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { signup } from "../endpoint";
import Form from "next/form";

export default function EventSignup() {
    const [inSession, setInSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading status

    useEffect(() => {
        const validateSession = async () => {
            try {
                const isValid = await sessionValidator();
                setInSession(isValid);
            } catch (error) {
                console.error("Error validating session:", error);
                setInSession(false); // Assume not in session on error
            } finally {
                setIsLoading(false); // Set loading to false once validation is complete
            }
        };

        validateSession();
    }, []); // Empty dependency array means this effect runs once after the initial render

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
        );
    }


    return inSession ? normalpage : blockpage;
}

const normalpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h6" component="h1">イベント作成</Typography>
        <Form action={signup}>
            <Stack spacing={1}>
                <TextField name="eventName" label="イベント名" variant="outlined" sx={{ width: "50%" }} />
                <TextField name="discription" label="説明" multiline rows={4} variant="outlined" sx={{ width: "50%" }} />
                <Button variant="contained" sx={{ width: "40px" }}>作成</Button>
            </Stack>
        </Form>
    </Box>
);

const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">ログインしてね</Typography>
    </Box>
);