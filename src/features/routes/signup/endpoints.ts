'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        throw new Error('メールアドレスもしくはパスワードが未入力です。');
    }

    const { error } = await supabase.auth.signUp({
        email, password, options: {
            emailRedirectTo: 'http://localhost:3000/',
        },
    })

    if (error) throw new Error(error.message)

    redirect('/user/signup/result');
}