'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    description: string
}

export default function UploadPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryId, setCategoryId] = useState('')
    const [catError, setCatError] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])

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
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const backgroundColor = formData.get('backgroundColor') as string
        const categoryIdValue = formData.get('categoryId') as string

        if (!file || !title || !categoryIdValue) {
            setError('Please provide a title, select an image, and choose a category')
            setLoading(false)
            return
        }

        try {
            const uploadData = new FormData()
            uploadData.append('file', file)
            uploadData.append('title', title)
            uploadData.append('description', description)
            uploadData.append('backgroundColor', backgroundColor)
            uploadData.append('categoryId', categoryIdValue)

            const res = await fetch('/api/photos', {
                method: 'POST',
                body: uploadData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to upload photo')
            }

            router.push('/admin/dashboard')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload photo')
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must be less than 10MB')
                e.target.value = ''
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Upload New Photo</h1>
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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {preview ? (
                                <div className="relative aspect-w-16 aspect-h-9 mb-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                            ) : (
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

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
                        defaultValue="#ffffff"
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </div>
            </form>
        </div>
    )
} 