import { NextResponse } from 'next/server'
import { categoriesDb } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
    try {
        const categories = await categoriesDb.getAll()
        return NextResponse.json(categories)
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        if (!(await isAuthenticated(request))) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        const { name, description } = await request.json()
        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            )
        }
        const category = await categoriesDb.create({ name, description })
        return NextResponse.json(category)
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
} 