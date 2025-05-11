import { NextResponse } from 'next/server'
import { photosDb } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
    try {
        const photos = await photosDb.getAll()
        return NextResponse.json(photos)
    } catch (error) {
        console.error('Error fetching photos:', error)
        return NextResponse.json(
            { error: 'Failed to fetch photos' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        // Check authentication
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const backgroundColor = formData.get('backgroundColor') as string
        const categoryId = formData.get('categoryId') as string

        if (!file || !title || !categoryId) {
            return NextResponse.json(
                { error: 'Title, file, and category are required' },
                { status: 400 }
            )
        }

        // Create uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await writeFile(join(uploadDir, file.name), Buffer.from(await file.arrayBuffer()))

        // Create photo record
        const photo = await photosDb.create({
            title,
            description,
            backgroundColor,
            imageUrl: `/uploads/${file.name}`,
            categoryId,
            createdAt: new Date().toISOString(),
        })

        return NextResponse.json(photo)
    } catch (error) {
        console.error('Error uploading photo:', error)
        return NextResponse.json(
            { error: 'Failed to upload photo' },
            { status: 500 }
        )
    }
} 