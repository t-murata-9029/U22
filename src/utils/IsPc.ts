'use client'

import { useMediaQuery } from "@mui/material";

export default function isPc() {
    return useMediaQuery("(min-width: 1024px)");
}