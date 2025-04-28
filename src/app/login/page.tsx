import { Box, Paper } from "@mui/material";
import Login from "@/features/common/login/components/Login"
/*---運営用のログイン---*/
export default function page() {
    return (
        <Box className="login" justifySelf={"center"} sx={{ width: 500, py: 2 }}>
            <Login />
        </Box>
    );
}