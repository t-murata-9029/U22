import Signup from "@/features/routes/signup/components/Signup";
import { Box, Paper, TextField, Typography } from "@mui/material";

export default function page() {
    return (
        <Box sx={{ px: 2, py: 2 }} component={Paper}>
            <Signup />
        </Box>
    );
}