import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
    }

    console.log("aiueo");

    redirect('/');
}