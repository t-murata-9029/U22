'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const EventUploadPage = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

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

        setUploading(true)
        const filePath = `${Date.now()}-${file.name}`

        // ① 画像をストレージにアップロード
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('image-bucket')
            .upload(filePath, file)

        if (uploadError || !uploadData) {
            console.error('画像アップロードに失敗:', uploadError?.message)
            setUploading(false)
            return
        }

        // ② DBにレコード挿入（id, event_id は Supabase 側で自動生成）
        const { error: insertError } = await supabase
            .from('store')
            .insert([
                {
                    
                    name: name,
                    password: password,
                    description: description,
                    image: uploadData.path, // image カラムにパスを保存
                },
            ])

        if (insertError) {
            console.error('DB登録エラー:', insertError.message)
            alert('保存に失敗しました')
        } else {
            alert('アップロードと保存が完了しました')
            // フォームの状態をリセット
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
