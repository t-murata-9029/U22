import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabase";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                id: { label: "ユーザーID", type: "text" },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.id || !credentials?.password) {
                    console.log("❌ 入力が不足しています:", credentials);
                    return null;
                }

                const { data, error } = await supabase
                    .from("user") // ← テーブル名注意
                    .select("*")
                    .eq("id", credentials.id)
                    .single();

                if (error) {
                    console.log("❌ Supabaseエラー:", error.message);
                    return null;
                }

                if (!data) {
                    console.log("❌ ユーザーが見つかりません:", credentials.id);
                    return null;
                }

                if (credentials.password !== data.password) {
                    console.log("❌ パスワード不一致:", {
                        入力: credentials.password,
                        登録済み: data.password,
                    });
                    return null;
                }

                console.log("✅ ログイン成功:", data);
                return { id: data.id, name: data.name };
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
};
