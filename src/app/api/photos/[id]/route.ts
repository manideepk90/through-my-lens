import { NextResponse } from 'next/server'
import { photosDb } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const photo = await photosDb.getById(params.id)
        if (!photo) {
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(photo)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const photo = await photosDb.getById(params.id)
        if (!photo) {
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            )
        }

        const updates = await request.json()
        const updatedPhoto = await photosDb.update(params.id, updates)
        return NextResponse.json(updatedPhoto)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!isAuthenticated()) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const photo = await photosDb.getById(params.id)
        if (!photo) {
            return NextResponse.json(
                { error: 'Photo not found' },
                { status: 404 }
            )
        }

        // Delete the image file
        const imagePath = join(process.cwd(), 'public', photo.imageUrl)
        try {
            await unlink(imagePath)
        } catch (error) {
            console.error('Error deleting image file:', error)
        }

        await photosDb.delete(params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 