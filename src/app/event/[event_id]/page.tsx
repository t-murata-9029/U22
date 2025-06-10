import EventTop from "@/features/routes/eventTop/components/EventTop";
import { Typography } from "@mui/material";

export default function page() {
    return (
        <>
            <Typography variant='body1'>ここがイベントのトップ</Typography>
            <EventTop />
        </>
    );

}