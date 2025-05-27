'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation';




const EventUploadPage = () => {
    const [name, setName] = useState('')
    const router = useRouter();
    const [password, setPassword] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            const user = data?.user

            if (error || !user) {
                alert('ログインが必要です')
                // ログイン画面にリダイレクトする場合は下記も可
                router.push('/login')
                return
            }

            setUserId(user.id)
        }

        fetchUser()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleSubmit = async () => {
        if (!file) {
            alert('画像ファイルを選択してください')
            return
        }

        if (!userId) {
            alert('ユーザー情報を取得できませんでした')
            return
        }

        setUploading(true)
        const filePath = `${Date.now()}-${file.name}`

        // ① 画像をアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('image-bucket')
            .upload(filePath, file)

        if (uploadError || !uploadData) {
            console.error('画像アップロード失敗:', uploadError?.message)
            setUploading(false)
            return
        }

        // ② データベースに挿入
        const { error: insertError } = await supabase
            .from('store')
            .insert([
                {
                    name,
                    password,
                    description,
                    image: uploadData.path,
                    owner_id: userId,
                },
            ])

        if (insertError) {
            console.error('DB登録エラー:', insertError.message)
            alert('保存に失敗しました')
        } else {
            alert('アップロードと保存が完了しました')
            setName('')
            setPassword('')
            setDescription('')
            setFile(null)
        }

        setUploading(false)
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">イベントアップロード</h1>
            <input
                type="text"
                placeholder="店舗名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <textarea
                placeholder="説明"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
            />
            <button
                onClick={handleSubmit}
                disabled={uploading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {uploading ? 'アップロード中...' : 'アップロードして保存'}
            </button>
        </div>
    )
}

export default EventUploadPage
