import { Widgets } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import map_img from "@/../public/website_heatmap.png";
import Image from "next/image";

export default function page() {
    return (
        <>
            <Box sx={{ px: 2, py: 2 }} component={Paper}>
                <Typography variant="h5">(イベント名)さんようこそ</Typography>
                <Divider />
                <Box id="discription" sx={{ my: 2 }}>
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
                <Grid container spacing={2} sx={{my:2}}>
                    <Grid size={6}>
                        <Box id="transaction-board">
                            <Stack direction="row" sx={{justifyContent: "space-between", alignContent: "center"}}>
                                <Typography variant="h5">取引データ</Typography>
                                <Button variant="outlined" size="large">詳細</Button>
                            </Stack>
                            <Box id="transaction-detail" sx={{mx:2}}>
                                <Box id="transaction-content" sx={{my:1}}>
                                    <Typography variant="h6">売上</Typography>
                                    <Typography variant="h5" sx={{mx:2}}>100,000円</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{my:1}}>
                                    <Typography variant="h6">総決済回数</Typography>
                                    <Typography variant="h5" sx={{mx:2}}>1,000回</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{my:1}}>
                                    <Typography variant="h6">平均注文額</Typography>
                                    <Typography variant="h5" sx={{mx:2}}>500円</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{my:1}}>
                                    <Typography variant="h6">人気店</Typography>
                                    <Typography variant="h5" sx={{mx:2}}>〇〇店</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction="row" sx={{justifyContent: "space-between", alignContent: "center"}}>
                                <Typography variant="h5">会場地図</Typography>
                                <Button variant="outlined" size="large">詳細</Button>
                            </Stack>
                        <Image src={map_img} height={500} width={500} alt="会場地図"/>
                    </Grid>
                </Grid>
                <Typography>ここにてんぽ表示する</Typography>
            </Box>
        </>
    );
}