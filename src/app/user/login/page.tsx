'use client'

import { Box } from "@mui/material";
import Login from "@/features/routes/login/components/Login"

/*---運営用のログイン---*/
export default function page() {
    return (
        <Box className="login" justifySelf={"center"} sx={{ width: true ? "50%" : "80%", py: 2, alignItems: 'center', height: '1024px' }} >
            <Login />
        </Box>
    );
}