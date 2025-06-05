'use client'

import { sessionValidator } from "@/utils/sessionValidator";
import { Box, CircularProgress, Typography, Paper, TextField, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { signup } from "../endpoint";
import Form from "next/form";
import { supabase } from "@/lib/supabase";

export default function EventSignup() {
    const [inSession, setInSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userid, setUserid] = useState<string | undefined>(""); // Initialize with undefined for clarity

    useEffect(() => {
        const validateAndSetUser = async () => {
            try {
                const isValid = await sessionValidator();
                setInSession(isValid); // Set the session status first

                if (isValid) {
                    const { data: { session }, error } = await supabase.auth.getSession();
                    if (session) {
                        setUserid(session.user.id);
                    } else if (error) {
                        console.error("Error getting session:", error);
                    }
                }
            } catch (error) {
                console.error("Error validating session or getting user:", error);
                setInSession(false);
                setUserid(undefined); // Ensure userid is cleared on error
            } finally {
                setIsLoading(false);
            }
        };

        validateAndSetUser();
    }, []); // Empty dependency array means this effect runs once after the initial render

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    /* ログイン済みの時返すページ */
    const normalpage = (
        <Box component={Paper} sx={{ p: 3, m: 2 }}>
            <Typography variant="h6" component="h1">イベント作成</Typography>
            <Form action={signup}>
                <Stack spacing={1}>
                    <TextField name="eventName" label="イベント名" variant="outlined" sx={{ width: "50%" }} />
                    <TextField name="discription" label="説明" multiline rows={4} variant="outlined" sx={{ width: "50%" }} />
                    {/* Ensure userid is not undefined before passing */}
                    {userid && <input type="hidden" name="userid" value={userid} />}
                    <Button variant="contained" type="submit" sx={{ width: "40px" }}>作成</Button>
                </Stack>
            </Form>
        </Box>
    );

    const blockpage = (
        <Box component={Paper} sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" component="h1">ログインしてね</Typography>
        </Box>
    );

    return inSession ? normalpage : blockpage;
}