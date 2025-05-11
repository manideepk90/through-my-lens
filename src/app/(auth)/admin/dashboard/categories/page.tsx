'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
    id: string
    name: string
    description: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setError('')
        try {
            const res = await fetch('/api/categories')
            if (!res.ok) throw new Error('Failed to fetch categories')
            const data = await res.json()
            setCategories(data)
        } catch (err) {
            setError('Failed to load categories')
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create category')
            setSuccess('Category created!')
            setName('')
            setDescription('')
            fetchCategories()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">Back</button>
            </div>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Category'}
                </button>
            </form>
            <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li key={cat.id} className="p-4 bg-gray-50 rounded shadow flex flex-col">
                        <span className="font-bold text-gray-800">{cat.name}</span>
                        <span className="text-gray-600 text-sm">{cat.description}</span>
                    </li>
                ))}
                {categories.length === 0 && <li className="text-gray-500">No categories yet.</li>}
            </ul>
        </div>
    )
} 