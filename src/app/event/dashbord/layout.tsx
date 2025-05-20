'use client'

import { AppBar, Box, Button, Grid, IconButton, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const isPc = useMediaQuery("(min-width: 1024px)");

    return (
        <Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            文化祭管理アプリ
                        </Typography>
                        <Button color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            {isPc ?
                <Grid container spacing={1}>
                    <Grid size={1.5}>
                    </Grid>
                    <Grid size={9}>
                        <Box sx={{ mx: 2, my: 2 }}>
                            {children}
                        </Box>
                    </Grid>
                    <Grid size={1.5}>
                    </Grid>
                </Grid>
                :
                <Box sx={{ mx: 2, my: 2 }}>
                    {children}
                </Box>
            }
        </Box >
    );
}
