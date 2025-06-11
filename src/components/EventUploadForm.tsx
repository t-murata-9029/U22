// app/EventTest/[eventid]/create/EventUploadForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// propsの型を定義
interface EventUploadFormProps {
  eventid: string;
}

export default function EventUploadForm({ eventid }: EventUploadFormProps) {
  const supabase = createClient();
  const [name, setName] = useState('');
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // ユーザー情報を取得するuseEffect
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        alert('ログインが必要です。');
        router.push('/auth/login');
      }
    };
    fetchUser();
  }, [router, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !userId) {
      alert('ファイルを選択し、ログインしていることを確認してください。');
      return;
    }
    if (!eventid) {
        alert('イベントIDが取得できませんでした。');
        return;
    }
    
    setUploading(true);

    const safeFileName = encodeURIComponent(file.name);
    const filePath = `${Date.now()}-${safeFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('image-bucket')
      .upload(filePath, file);

    if (uploadError || !uploadData) {
      console.error('画像アップロード失敗:', uploadError.message);
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase.from('store').insert([
      {
        event_id: eventid,
        name,
        description,
        image: uploadData.path,
        owner_id: userId,
      },
    ]);

    if (insertError) {
      console.error('DB登録エラー:', insertError.message);
      alert('保存に失敗しました');
    } else {
      alert('アップロードと保存が完了しました');
      setName('');
      setDescription('');
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">storeアップロード</h1>

      {/* ▼▼▼ ご指摘のあった入力フォーム部分です ▼▼▼ */}
      <input
        type="text"
        placeholder="店舗名"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        className="mb-4" // 少しマージンを調整
      />
      {/* ▲▲▲ ここまで ▲▲▲ */}
      
      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {uploading ? 'アップロード中...' : 'アップロードして保存'}
      </button>
    </div>
  );
}