'use client'

import { EventData } from "@/interfases/event";
import { supabase } from "@/lib/supabase";
import { sessionValidator } from "@/utils/sessionValidator";
import { Box, Paper, Typography, CircularProgress, Dialog, DialogTitle, Button, Link } from "@mui/material"; // Import CircularProgress for loading indicator
import { useEffect, useState } from "react";
import QRCode from 'react-qr-code';
import { getJoinedEvents } from "../endpoint";
import React from "react";

export interface SimpleDialogProps {
    userId: string;
    open: boolean;
    onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>QRコード</DialogTitle>
            <Box sx={{ mx: 2, my: 2 }}>
                <QRCode value={props.userId || "no-session"} />
            </Box>
        </Dialog>
    );
}

export default function UserHome() {
    const [inSession, setInSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New state for loading status
    const [userId, setUserId] = useState<string>(""); // State for QR code value
    const [mail, setMail] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [eventList, setEventList] = useState<EventData[] | null>(null)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const validateSession = async () => {
            try {
                const isValid = await sessionValidator();
                setInSession(isValid);
                if (isValid) {
                    const { data } = await supabase.auth.getSession();
                    // You can stringify the session or use a specific property
                    setUserId(JSON.stringify(data.session?.user.id));
                    setMail(JSON.stringify(data.session?.user.email))
                    setEventList(await getJoinedEvents(data.session?.user.id))
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
            <Typography variant="h6" >ようこそ</Typography>
            <Typography variant="caption">{`${mail}でログインしてます`}</Typography>
            <br />
            <Button variant="contained" onClick={handleClickOpen}>
                QRコードを表示
            </Button>
            <SimpleDialog
                userId={userId}
                open={open}
                onClose={handleClose}
            />
            <br />
            <Link href="/event/search">イベント一覧</Link>
            <br />
            <Link href="/event/signup">イベント作成はこちら！</Link>
            <br />
            console.log(eventList);
            {eventList?.length != 0 ?
                <Box sx={{ my: 1 }}>
                    <Typography>あなたが所属しているイベント</Typography>
                    <Box sx={{ mx: 1 }}>
                        {
                            eventList?.map((record: EventData) => {
                                return (
                                    <React.Fragment key={record.id}>
                                        <Link href={`/event/${record.id}/dashbord`}>
                                            <Typography>{record.name}</Typography>
                                        </Link>
                                    </React.Fragment>
                                );
                            })
                        }
                    </Box>
                </Box>
                : ""
            }
            <Typography>待ちのやつ</Typography>
            <Typography>購入履歴</Typography>
            <Typography>最近利用したイベント</Typography>
            <Typography>利用したイベントのオススメ</Typography>
        </Box>
    ) :
        blockpage;
}

const blockpage = (
    <Box component={Paper} sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" component="h1">ログインしてね</Typography>
    </Box>
);