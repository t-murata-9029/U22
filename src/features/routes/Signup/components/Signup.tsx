'use client'

import { Box, Button, TextField, Typography } from "@mui/material";
import Form from 'next/form'
import { signup } from '../endpoint'

export default function Signup() {
    return (
        <Box>
            <Typography variant="h5">新規アカウント作成</Typography>
            <Form action={signup}>
                <Box sx={{ py: 1 }}>
                    <TextField name="email" label="メールアドレス" variant="outlined" />
                </Box>
                <Box sx={{ py: 1 }}>
                    <TextField name="password" label="パスワード" variant="outlined" type="password" />
                </Box>
                <Box>
                    <Button variant="contained" type="submit">作成</Button>
                </Box>
            </Form>
        </Box>
    );
};