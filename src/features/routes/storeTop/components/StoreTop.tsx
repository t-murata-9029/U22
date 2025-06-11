'use client'

import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { existStore, getStoreInfo } from '../endpoints';
import { StoreData } from '@/interfases/store';

/* イベントのトップ画面 */
export default function StoreTop() {
    const [store, setStore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [storeInfo, setStoreInfo] = useState<StoreData | null>(null)

    const params = useParams()

    useEffect(() => {
        const validateEvent = async () => {
            try {
                const eventId = typeof params.event_id === 'string' ? params.event_id : Array.isArray(params.event_id) ? params.event_id[0] : undefined;
                const storeId = typeof params.store_id === 'string' ? params.store_id : Array.isArray(params.store_id) ? params.store_id[0] : undefined;

                if (eventId && storeId) {
                    const isValid = await existStore(eventId, storeId);
                    setStore(isValid);
                    // storeの情報を持ってくる
                    if (isValid) {
                        setStoreInfo(await getStoreInfo(eventId, storeId));
                    }
                } else {
                    setStore(false);
                }
            } catch (error) {
                console.error("Error validating session:", error);
                setStore(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateEvent();
    }, []);

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
            <Typography variant="h5" component="h1">{storeInfo?.name}</Typography>
            <Box sx={{ px: 1, py: 1 }}>
                <Typography variant='h6'>概要</Typography>
                <Typography variant='body1'>{storeInfo?.description || "無し"}</Typography>
            </Box>
            <Box sx={{ px: 1, py: 1 }}>
                <Typography variant='h6'>商品</Typography>
                {
                    storeInfo?.item_list?.map(item => {
                        return (
                            <React.Fragment key={item.id}>
                                <Typography>{item?.name}</Typography>

                            </React.Fragment>
                        );
                    })
                }
            </Box>
        </Box >
    );

    return store ? normalpage : blockpage;
}



const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">存在しないお店だよ</Typography>
    </Box>
);