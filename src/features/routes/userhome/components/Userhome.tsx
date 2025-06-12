'use client'

import { supabase } from "@/lib/supabase";
import { sessionValidator } from "@/utils/sessionValidator";
import { Box, Paper, Typography, CircularProgress } from "@mui/material"; // Import CircularProgress for loading indicator
import { useEffect, useState } from "react";
import QRCode from 'react-qr-code';

export default function UserHome() {
    const [inSession, setInSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading status
    const [userId, setUserId] = useState<string>(""); // State for QR code value

    useEffect(() => {
        const validateSession = async () => {
            try {
                const isValid = await sessionValidator();
                setInSession(isValid);
                if (isValid) {
                    const { data } = await supabase.auth.getSession();
                    // You can stringify the session or use a specific property
                    setUserId(JSON.stringify(data.session?.user.id));
                }
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

    return inSession ? (
        <Box component={Paper} sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" component="h1">ログインしてるよ</Typography>
            <QRCode value={userId || "no-session"} />
        </Box>
    ) : (
        <Box component={Paper} sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" component="h1">ログインしてね</Typography>
        </Box>
    );
}

const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">ログインしてね</Typography>
    </Box>
);