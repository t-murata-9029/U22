'use client'

import { Box, Button, Typography } from "@mui/material";
import Form from "next/form";
import { logout } from "../endpoint";
import { useRouter } from "next/navigation";

export function Logout() {

    const router = useRouter();

    const backpage = () => {
        router.back()
    }

    return (
        <Box>
            <Typography variant="body1">ログアウトしますか？</Typography>
            <Form action={logout}>
                <Button type="submit">はい</Button>
            </Form>
            <Form action={backpage}>
                <Button type="submit">いいえ</Button>
            </Form>
        </Box>
    );
}