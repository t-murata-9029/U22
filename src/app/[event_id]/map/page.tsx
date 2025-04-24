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
                <Typography variant="body1">map</Typography>
            </Box>
        </>
    );
};

export default Page;