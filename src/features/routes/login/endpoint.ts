import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function login(formData: FormData): Promise<string> {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    // 未入力の場合
    if (!email || !password) {
        return 'メールアドレスもしくはパスワードが未入力です。'
    }

    // supabaseにメールアドレスとパスワードを送ってログイン
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    // ログインに失敗した場合
    if (signInError) {
        return 'メールアドレスもしくはパスワードに誤りがあります。';
    }

    // ログイン情報をローカルストレージにセット
    localStorage.setItem('data', JSON.stringify(data))

    redirect('/user/home');
}