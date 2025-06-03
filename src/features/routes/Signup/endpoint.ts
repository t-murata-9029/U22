'use server'

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
        throw new Error('メールアドレスもしくはパスワードが未入力です。');
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) throw new Error(error.message)
    console.log(data)

    redirect('/user/signup/result');
}