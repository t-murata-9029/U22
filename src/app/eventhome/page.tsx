'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'

type Store = {
    id: string 
    title: string
image_path: string
}

const EventHome = () => {
const [stores, setStores] = useState<Store[]>([])

useEffect(() => {
    const fetchStores = async () => {
    const { data, error } = await supabase
        .from('stores') // テーブル名
        .select('*')     // 全カラムを取得

    if (error) {
        console.error('取得失敗:', error)
    } else if (data) {
        setStores(data)
    }
    }

    fetchStores()
}, [])

return (
    <div style={{ padding: '20px' }}>
    <h1>store ID一覧</h1>
    <ul>
        {stores.map((store) => (
        <li key={store.id}>{store.id}</li>
        ))}
    </ul>
    </div>
)
}
export default EventHome
