import { FC } from "react";
import { headers } from "next/headers";
import StoreTop from "@/features/routes/storeTop/components/StoreTop";

type Props = {
    params: {
        store_id: string;
    };
};

const Page: FC<Props> = async (props) => {
    const requestUrl = (await headers()).get("x-url");

    return (
        <>
            <StoreTop />
        </>
    );
};

export default Page;