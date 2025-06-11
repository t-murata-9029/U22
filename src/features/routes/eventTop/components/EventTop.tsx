'use client'

import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { existEvent, getEventInfo } from '../endpoint';
import { EventData } from '@/interfases/event';
import React from 'react';
import Link from 'next/link';

/* イベントのトップ画面 */
export default function () {
    const [event, setEvent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [eventInfo, setEventInfo] = useState<EventData | null>(null)

    const params = useParams()
    console.log(params.event_id)

    useEffect(() => {
        const validateEvent = async () => {
            try {
                const eventId = typeof params.event_id === 'string' ? params.event_id : Array.isArray(params.event_id) ? params.event_id[0] : undefined;
                if (eventId) {
                    const isValid = await existEvent(eventId);
                    setEvent(isValid);
                    // eventの情報を持ってくる
                    if (isValid) {
                        setEventInfo(await getEventInfo(eventId));
                    }
                } else {
                    setEvent(false);
                }
            } catch (error) {
                console.error("Error validating session:", error);
                setEvent(false);
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

    const normalpage = (
        <Box component={Paper} sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" component="h1">{eventInfo?.name}</Typography>
            <Box sx={{ px: 1, py: 1 }}>
                <Typography variant='h6'>概要</Typography>
                <Typography variant='body1'>{eventInfo?.description || "無し"}</Typography>
            </Box>
            <Box sx={{ px: 1, py: 1 }}>
                <Typography variant='h6'>イベント</Typography>
                {
                    eventInfo?.store_list?.map(store => {
                        return (
                            <React.Fragment key={store.id}>
                                <Link href={`./${eventInfo.id}/store/${store.id}`}>
                                    <Typography>{store?.name}</Typography>
                                </Link>
                            </React.Fragment>
                        );
                    })
                }
            </Box>
        </Box >
    );

    return event ? normalpage : blockpage;
}



const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">存在しないイベントだよ</Typography>
    </Box>
);