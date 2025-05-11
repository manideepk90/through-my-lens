import type { Metadata } from 'next'
import { Inter, Playfair_Display, Space_Grotesk } from 'next/font/google'
import Navbar from '@/components/Navbar'
import CameraCursor from '@/components/CameraCursor'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
    title: 'LensLand',
    description: 'Capture the Memory',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} font-sans bg-black text-white`}>
                <CameraCursor />
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </body>
        </html>
    )
} 