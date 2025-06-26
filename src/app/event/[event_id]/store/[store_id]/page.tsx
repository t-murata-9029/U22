import { FC } from "react";
import StoreTop from "@/features/routes/storeTop/components/StoreTop";

type Props = {
    params: {
        store_id: string;
    };
};

const Page: FC<Props> = async (props) => {

    return (
        <>
            <StoreTop />
        </>
    );
};

export default Page;