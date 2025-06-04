'use client'

import { sessionValidator } from "@/utils/sessionValidator";
import { Box, Paper, Typography, CircularProgress } from "@mui/material"; // Import CircularProgress for loading indicator
import { useEffect, useState } from "react";

export default function UserHome() {
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
        <Typography variant="h5" component="h1">ここがユーザーのホームだよ</Typography>
    </Box>
);

const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">ログインしてね</Typography>
    </Box>
);