'use client'

import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { existEvent } from '../endpoint';

/* イベントのトップ画面 */
export default function () {
    const [inSession, setInSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const params = useParams()
    console.log(params.event_id)

    useEffect(() => {
        const validateEvent = async () => {
            try {
                const eventId = typeof params.event_id === 'string' ? params.event_id : Array.isArray(params.event_id) ? params.event_id[0] : undefined;
                if (eventId) {
                    const isValid = await existEvent(eventId);
                    setInSession(isValid);
                } else {
                    setInSession(false);
                }
            } catch (error) {
                console.error("Error validating session:", error);
                setInSession(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateEvent();
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
        <Typography variant="h5" component="h1">イベントのトップだよ</Typography>
    </Box>
);

const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">存在しないイベントだよ</Typography>
    </Box>
);