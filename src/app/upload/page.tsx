'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)

        const filePath = `${Date.now()}-${file.name}`

        const { data, error } = await supabase.storage
            .from('image-bucket')
            .upload(filePath, file)

        if (error) {
            console.error('Upload error:', error)
        } else {
            const { data: publicUrlData } = supabase.storage
                .from('image-bucket')
                .getPublicUrl(filePath)
            setImageUrl(publicUrlData.publicUrl)
        }

        setUploading(false)
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>画像アップロード</h1>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'アップロード中...' : 'アップロード'}
            </button>

            {imageUrl && (
                <div style={{ marginTop: '1rem' }}>
                    <p>アップロードされた画像:</p>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
                </div>
            )}
        </div>
    )
}

export default UploadPage