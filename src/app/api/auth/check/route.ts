import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticated(request)
        if (authenticated) {
            return NextResponse.json({ authenticated: true })
        }
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        )
    } catch (error) {
        console.error('Auth check error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 