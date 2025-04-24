import { FC } from "react";
import { headers } from "next/headers";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

type Props = {
    params: {
        store_id: string;
    };
};

const Page: FC<Props> = async (props) => {
    const requestUrl = (await headers()).get("x-url");

    return (
        <>
            <Box>
                <Typography variant="body1">URL</Typography>
                <Typography variant="body2">{requestUrl}</Typography>
            </Box>
            <Box>
                <Typography variant="body1">店舗名</Typography>
                <Typography variant="body2">id: {props.params.store_id}</Typography>
            </Box>
        </>
    );
};

export default Page;