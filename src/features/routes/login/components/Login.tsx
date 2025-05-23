'use client'

import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";

export default function LoginForm() {
    return (
        <Stack spacing={2} sx={{ px: 2, py: 2 }} component={Paper}>
            <Typography variant="h5" sx={{ display: "flex", justifyContent: "center" }}>ログイン</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <TextField id="id" label="ID" variant="standard" sx={{ width: "75%" }} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <TextField id="password" type="password" label="Password" variant="standard" sx={{ width: "75%" }} />
            </Box>

            <Link href="./dashbord">
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" sx={{ width: "75%" }} >ログイン</Button>
                </Box>
            </Link>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ width: "75%" }}>パスワードを忘れた場合</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ width: "75%" }}>アカウントを新規作成</Typography>
            </Box>
        </Stack >
    );
}