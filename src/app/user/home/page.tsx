import { sessionValidator } from "@/utils/sessionValidator";
import { Box, Typography } from "@mui/material";

export default function page() {
    sessionValidator()
    return (
        <Box>
            <Typography>ここは、ユーザーのホームページです</Typography>
        </Box>
    );
}