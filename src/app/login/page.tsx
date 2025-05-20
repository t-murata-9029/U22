"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            id,
            password,
            redirect: false,
        });

        if (res?.ok) {
            router.push("/");
        } else {
            alert("ログインに失敗しました");
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 space-y-4">
            <h2 className="text-xl">ログイン</h2>
            <input
                type="text"
                placeholder="ユーザーID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="border p-2 w-full"
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                ログイン
            </button>
        </form>
    );
}
