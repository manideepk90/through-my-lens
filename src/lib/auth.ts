import { NextResponse } from 'next/server'

// Simple token generation and verification for Edge Runtime
const TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function comparePasswords(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return plainPassword === hashedPassword
}

export async function hashPassword(password: string): Promise<string> {
    return password // In a real app, use proper hashing
}

export function generateToken(): string {
    // Generate a simple token with timestamp
    const timestamp = Date.now()
    const token = `${timestamp}-${TOKEN_SECRET}`
    return Buffer.from(token).toString('base64')
}

export async function verifyToken(token: string): Promise<boolean> {
    try {
        const decoded = Buffer.from(token, 'base64').toString()
        const [timestamp, secret] = decoded.split('-')

        // Check if token is expired (24 hours)
        const tokenAge = Date.now() - parseInt(timestamp)
        if (tokenAge > 24 * 60 * 60 * 1000) {
            return false
        }
        // Verify secret
        return secret === TOKEN_SECRET
    } catch (error) {
        console.error('Token verification failed:', error)
        return false
    }
}

export function setAuthToken(response: NextResponse, token: string) {
    response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
    })
}

export function removeAuthToken(response: NextResponse) {
    response.cookies.delete('auth-token', {
        path: '/'
    })
}

export async function isAuthenticated(request: Request): Promise<boolean> {
    const cookies = request.headers.get('cookie')
    if (!cookies) return false

    const token = cookies
        .split(';')
        .find(c => c.trim().startsWith('auth-token='))
        ?.split('=')[1]

    if (!token) return false
    return await verifyToken(token)
} 