'use client'

import { supabase } from "@/lib/supabase";

export default async function page() {
    const { data, error } = await supabase.auth.getSession()
    return (
        <>
        </>
    );
}