'use client'

import { EventData } from "@/interfases/event";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getAllEvent } from "../endpoint";
import React from "react";
import { CircularProgress, OutlinedInput, Paper, Typography } from "@mui/material";
import Link from "next/link";

export default function EventSearch() {
    /* 表示するイベント用 */
    const [eventList, setEventList] = useState<EventData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    /* 初回ロード時 */
    useEffect(() => {
        const setEvent = async () => {
            setEventList(await getAllEvent())
            setIsLoading(false)
        };
        setEvent();
    }, []);


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box component={Paper} sx={{ px: 2, py: 2 }}>
            <Typography variant="h5">イベント一覧</Typography>
            <OutlinedInput
                placeholder="イベント名で検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                size="small"
            />
            {
                eventList?.map(record => {
                    // 検索文字列含んでたら返す
                    if (record.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return (
                            <React.Fragment key={record.id}>
                                <Link href={`/event/${record.id}`}>
                                    <Typography variant="body1">{record.name}</Typography>
                                </Link>
                            </React.Fragment>
                        );
                    }
                    return;
                })
            }
        </Box>
    );
}