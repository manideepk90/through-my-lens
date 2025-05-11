'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const Navbar = () => {
    const pathname = usePathname()

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Admin', path: '/admin' },
    ]

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-black">
            <div className="font-bold text-xl tracking-widest">Through my lens<sup>®</sup></div>
            <div className="flex-1 flex justify-center space-x-12">
                <a href="#works" className="uppercase tracking-widest text-gray-300 hover:text-white text-sm">Works <span className="text-gray-500">(234)</span></a>
                <a href="#about" className="uppercase tracking-widest text-gray-300 hover:text-white text-sm">About</a>
                <a href="#awards" className="uppercase tracking-widest text-gray-300 hover:text-white text-sm">Awards</a>
            </div>
            <a href="#contact" className="uppercase tracking-widest text-gray-300 hover:text-white text-sm">Contact</a>
        </nav>
    )
}

export default Navbar 