'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Photo } from '@/lib/types'
import Image from 'next/image'

interface Category {
    id: string
    name: string
    description: string
}

export default function EditPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [photo, setPhoto] = useState<Photo | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [catError, setCatError] = useState('')
    const [categoryId, setCategoryId] = useState('')

    useEffect(() => {
        fetchPhoto()
        fetchCategories()
    }, [params.id])

    const fetchPhoto = async () => {
        try {
            const res = await fetch(`/api/photos/${params.id}`)
            if (!res.ok) throw new Error('Failed to fetch photo')
            const data = await res.json()
            setPhoto(data)
            setCategoryId(data.categoryId || '')
        } catch (err) {
            setError('Failed to load photo')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        setCatError('')
        try {
            const res = await fetch('/api/categories')
            if (!res.ok) throw new Error('Failed to fetch categories')
            const data = await res.json()
            setCategories(data)
        } catch (err) {
            setCatError('Failed to load categories')
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const backgroundColor = formData.get('backgroundColor') as string
        const categoryIdValue = formData.get('categoryId') as string

        try {
            const res = await fetch(`/api/photos/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    backgroundColor,
                    categoryId: categoryIdValue,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update photo')
            }

            router.push('/admin/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update photo')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    if (!photo) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600">Photo not found</div>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Photo</h1>
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900"
                >
                    Back to Dashboard
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            {catError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {catError}
                </div>
            )}

            <div className="mb-8">
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
                    <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={photo.title}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={photo.description}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="backgroundColor"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Background Color
                    </label>
                    <input
                        type="color"
                        id="backgroundColor"
                        name="backgroundColor"
                        defaultValue={photo.backgroundColor || '#ffffff'}
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
} 