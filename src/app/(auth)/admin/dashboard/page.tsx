'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Photo, Category } from '@/lib/types'
import Image from 'next/image'

export default function DashboardPage() {
    const router = useRouter()
    const [photos, setPhotos] = useState<Photo[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPhotos()
        fetchCategories()
    }, [])

    const fetchPhotos = async () => {
        try {
            const res = await fetch('/api/photos')
            if (!res.ok) throw new Error('Failed to fetch photos')
            const data = await res.json()
            setPhotos(data)
        } catch (err) {
            setError('Failed to load photos')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            if (!res.ok) throw new Error('Failed to fetch categories')
            const data = await res.json()
            setCategories(data)
        } catch (err) {
            setError('Failed to load categories')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this photo?')) return

        try {
            const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete photo')
            setPhotos(photos.filter(photo => photo.id !== id))
        } catch (err) {
            setError('Failed to delete photo')
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/admin/login')
        } catch (err) {
            setError('Failed to logout')
        }
    }

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category?.name || 'Uncategorized'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => router.push('/admin/dashboard/categories')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Manage Categories
                    </button>
                    <button
                        onClick={() => router.push('/admin/dashboard/upload')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Upload New Photo
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                    <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div className="aspect-w-16 aspect-h-9 relative">
                            <Image
                                src={photo.imageUrl}
                                alt={photo.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {photo.title}
                                </h3>
                                <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                                    {getCategoryName(photo.categoryId || '')}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-2">
                                {photo.description}
                            </p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => router.push(`/admin/dashboard/edit/${photo.id}`)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 