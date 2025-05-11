import { NextResponse } from 'next/server'
import { comparePasswords, generateToken, setAuthToken } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        // Get admin credentials from environment variables
        const adminUsername = "admin"
        const adminPassword = "admin"

        if (!adminUsername || !adminPassword) {
            return NextResponse.json(
                { error: 'Admin credentials not configured' },
                { status: 500 }
            )
        }

        // Check if username matches
        if (username !== adminUsername) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Verify password
        // const isValid = await comparePasswords(password, adminPassword)
        // if (!isValid) {
        //     return NextResponse.json(
        //         { error: 'Invalid credentials' },
        //         { status: 401 }
        //     )
        // }

        // Generate token
        const token = generateToken()

        // Set auth token in cookies
        const response = NextResponse.json({ success: true })
        setAuthToken(response, token)

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 