import { Box, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

export default function LoginForm() {
    return (
        <Stack spacing={2} sx={{ px: 2, py: 2 }} component={Paper}>
            <Typography variant="h5">ログイン</Typography>
            <Box sx={{ px: 2 }}>
                <TextField id="id" label="ID" variant="standard" />
            </Box>
            <Box sx={{ px: 2 }}>
                <TextField id="password" type="password" label="Password" variant="standard" />
            </Box>
        </Stack >
    );
}