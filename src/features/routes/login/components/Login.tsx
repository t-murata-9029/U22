import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import Form from "next/form";
import { login } from "@/features/routes/login/endpoint"

export default function LoginForm() {

    return (

        <Stack spacing={2} sx={{ px: 2, py: 2 }} component={Paper}>

            <Typography variant="h5" sx={{ display: "flex", justifyContent: "center" }}>ログイン</Typography>

            <Form action={login}>
                <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                        <TextField name="email" label="ID" variant="standard" sx={{ width: "75%" }} />

                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                        <TextField name="password" type="password" label="Password" variant="standard" sx={{ width: "75%" }} />

                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>

                        <Button variant="contained" type="submit" sx={{ width: "75%" }} >ログイン</Button>

                    </Box>
                </Stack>
            </Form>

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "center" }}>

                <Typography variant="caption" sx={{ width: "75%" }}>パスワードを忘れた場合</Typography>

            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>

                <Typography variant="caption" sx={{ width: "75%" }}>アカウントを新規作成</Typography>

            </Box>

        </Stack >

    );

}