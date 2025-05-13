'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Pin = {
    id: string
    x: number
    y: number
    note: string
}

const imagePath = 'public/1745975138602-C00125-001B.jpg' // Supabaseに保存済みのパスに変更

const PinPage = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [pins, setPins] = useState<Pin[]>([])
    const [showModal, setShowModal] = useState(false)
    const [newPin, setNewPin] = useState<{ x: number; y: number } | null>(null)
    const [note, setNote] = useState('')

    useEffect(() => {
        const fetchPins = async () => {
            const { data } = await supabase
                .from('pins')
                .select('*')
                .eq('image_path', imagePath)

            if (data) setPins(data)
        }

        fetchPins()
    }, [])

    const handleImageClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setNewPin({ x, y })
        setShowModal(true)
    }

    const savePin = async () => {
        if (!newPin) return

        const { data, error } = await supabase
            .from('pins')
            .insert([
                {
                    image_path: imagePath,
                    x: newPin.x,
                    y: newPin.y,
                    note,
                },
            ])
            .select()

        if (!error && data) {
            setPins([...pins, { id: data[0].id, x: newPin.x, y: newPin.y, note }])
        }


        if (!error && data) {
            setPins([...pins, { id: data[0].id, x: newPin.x, y: newPin.y, note }])
            setShowModal(false)
            setNote('')
            setNewPin(null)
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">画像にピンを追加</h1>
            <div
                ref={containerRef}
                className="relative inline-block"
                onClick={handleImageClick}
            >
                <Image
                    src={`https://<YOUR_PROJECT>.supabase.co/storage/v1/object/public/${imagePath}`}
                    alt="Image"
                    width={600}
                    height={400}
                />
                {pins.map((pin) => (
                    <div
                        key={pin.id}
                        className="absolute w-3 h-3 bg-red-500 rounded-full"
                        style={{
                            top: `${pin.y}%`,
                            left: `${pin.x}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                        title={pin.note}
                    ></div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg mb-2">ピンの詳細</h2>
                        <textarea
                            className="w-full border p-2 mb-2"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-1 rounded mr-2"
                                onClick={savePin}
                            >
                                保存
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-1 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PinPage
