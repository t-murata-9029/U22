import { Widgets } from "@mui/icons-material";
<<<<<<< HEAD
import { Box, Button, Divider, Grid, Paper, Stack, TextField, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import map_img from "@/../public/website_heatmap.png";
import Image from "next/image";
import React from "react";

export default function page() {

    function generate(element: React.ReactElement<unknown>) {
        return [0, 1, 2].map((value) =>
            React.cloneElement(element, {
                key: value,
            }),
        );
    }

=======
import { Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from "@mui/material";

export default function page() {
>>>>>>> main
    return (
        <>
            <Box sx={{ px: 2, py: 2 }} component={Paper}>
                <Typography variant="h5">(イベント名)さんようこそ</Typography>
                <Divider />
<<<<<<< HEAD
                <Box id="discription" sx={{ my: 2 }}>
=======
                <Box id="discription" sx={{ my: 1 }}>
>>>>>>> main
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
<<<<<<< HEAD
                <Grid container spacing={2} sx={{ my: 2 }}>
                    <Grid size={6}>
                        <Box id="transaction-board">
                            <Stack direction="row" sx={{ justifyContent: "space-between", alignContent: "center" }}>
                                <Typography variant="h5">取引データ</Typography>
                                <Button variant="outlined" size="medium">詳細</Button>
                            </Stack>
                            <Box id="transaction-detail" sx={{ mx: 2 }}>
                                <Box id="transaction-content" sx={{ my: 1 }}>
                                    <Typography variant="h6">売上</Typography>
                                    <Typography variant="h5" sx={{ mx: 2 }}>100,000円</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{ my: 1 }}>
                                    <Typography variant="h6">総決済回数</Typography>
                                    <Typography variant="h5" sx={{ mx: 2 }}>1,000回</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{ my: 1 }}>
                                    <Typography variant="h6">平均注文額</Typography>
                                    <Typography variant="h5" sx={{ mx: 2 }}>500円</Typography>
                                </Box>
                                <Box id="transaction-content" sx={{ my: 1 }}>
                                    <Typography variant="h6">人気店</Typography>
                                    <Typography variant="h5" sx={{ mx: 2 }}>〇〇店</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={6}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignContent: "center" }}>
                            <Typography variant="h5">会場地図</Typography>
                            <Button variant="outlined" size="medium">詳細</Button>
                        </Stack>
                        <Image src={map_img} height={500} width={500} alt="会場地図" />
                    </Grid>
                </Grid>
                <Box sx={{ my: 2 }}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignContent: "center" }}>
                        <Typography variant="h5">店舗一覧</Typography>
                        <Button variant="outlined" size="medium">詳細</Button>
                    </Stack>

                    <List>
                        {generate(
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Single-line item"
                                />
                            </ListItem>,
                        )}
                    </List>
                </Box>
=======
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Typography>ここに売上表示する</Typography>
                    </Grid>
                    <Grid size={6}>
                        <Typography>ここにまっぷ表示する</Typography>
                    </Grid>
                </Grid>
                <Typography>ここにてんぽ表示する</Typography>
>>>>>>> main
            </Box>
        </>
    );
}