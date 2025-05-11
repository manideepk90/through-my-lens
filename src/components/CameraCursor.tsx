'use client'
import { useEffect, useState } from 'react'

export default function CameraCursor() {
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
    }, [])

    return (
        <div
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -50%)',
                transition: 'left 0.03s, top 0.03s',
                width: 36,
                height: 36,
                mixBlendMode: 'difference', // makes it visible on both light/dark backgrounds
            }}
        >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="6" y="12" width="24" height="15" rx="3" fill="#fff" stroke="#000" strokeWidth="2" />
                <circle cx="18" cy="19.5" r="5" fill="#000" stroke="#fff" strokeWidth="2" />
                <circle cx="18" cy="19.5" r="2" fill="#fff" />
                <rect x="13" y="7" width="10" height="6" rx="2" fill="#fff" stroke="#000" strokeWidth="2" />
                <rect x="26" y="14" width="3" height="3" rx="1" fill="#000" />
            </svg>
        </div>
    )
}
