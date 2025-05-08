import { Widgets } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

export default function page() {
    return (
        <>
            <Box sx={{ px: 2, py: 2 }} component={Paper}>
                <Typography variant="h5">(イベント名)さんようこそ</Typography>
                <Divider />
                <Box id="discription" sx={{ my: 1 }}>
                    <Typography variant="subtitle1" >紹介文</Typography>
                    <TextField slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }} fullWidth multiline rows={4} size="small" margin="dense" defaultValue="ここに入力してある紹介文表示する" />
                    <Box flexDirection="row" justifyContent="flex-end" display="flex">
                        <Button variant="contained" size="small">変更する</Button>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography>ここに売上表示する</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>ここにまっぷ表示する</Typography>
                    </Grid>
                </Grid>
                <Typography>ここにてんぽ表示する</Typography>
            </Box>
        </>
    );
}