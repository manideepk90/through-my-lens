import { NextResponse } from 'next/server'
import { removeAuthToken } from '@/lib/auth'

export async function POST() {
    try {
        removeAuthToken()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 