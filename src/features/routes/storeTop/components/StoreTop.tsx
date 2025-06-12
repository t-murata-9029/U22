'use client'

import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
                <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>商品名</TableCell>
                                <TableCell align="right">値段</TableCell>
                                <TableCell align="right">概要</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                storeInfo?.item_list?.map(item => {
                                    return (
                                        <TableRow
                                            key={item.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {item.name}
                                            </TableCell>
                                            <TableCell align="right">{`${item.price}円`}</TableCell>
                                            <TableCell align="right">{item.description}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
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