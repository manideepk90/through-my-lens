'use client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import PhotoGrid from '@/components/PhotoGrid'
import { Photo, Category } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showIntro, setShowIntro] = useState(true)
    const [showFlash, setShowFlash] = useState(false)
    const cameraRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            const [photosRes, categoriesRes] = await Promise.all([
                fetch('/api/photos'),
                fetch('/api/categories'),
            ])
            setPhotos(await photosRes.json())
            setCategories(await categoriesRes.json())
            setLoading(false)
        }
        fetchData()
    }, [])

    // Camera click handler
    const handleCapture = () => {

        setShowFlash(true)
        setTimeout(() => {
            setShowFlash(false)
            setShowIntro(false)
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-black text-white rounded-2xl overflow-hidden flex flex-col relative">
            {/* Camera Intro Overlay */}
            <AnimatePresence>
                {showIntro && (
                    <motion.div
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }}
                        style={{ pointerEvents: showIntro ? 'auto' : 'none' }}
                    >
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: showFlash ? 0.95 : 1, opacity: showFlash ? 0.7 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center"
                        >
                            <div ref={cameraRef} className="flex flex-col items-center">
                                {/* Camera SVG */}
                                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                                    <rect x="20" y="40" width="80" height="50" rx="10" fill="#222" stroke="#fff" strokeWidth="3" />
                                    <circle cx="60" cy="65" r="18" fill="#111" stroke="#fff" strokeWidth="3" />
                                    <circle cx="60" cy="65" r="8" fill="#fff" />
                                    <rect x="45" y="30" width="30" height="15" rx="5" fill="#222" stroke="#fff" strokeWidth="3" />
                                    <rect x="80" y="50" width="10" height="8" rx="2" fill="#fff" />
                                </svg>
                                <motion.button
                                    className="mt-10 px-8 py-3 rounded-full bg-white text-black font-bold text-xl shadow-lg hover:bg-gray-200 transition"
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCapture}
                                    style={{
                                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)'
                                    }}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
                                        Capture
                                    </span>
                                </motion.button>
                            </div>
                            {/* Flash overlay */}
                            <AnimatePresence>
                                {showFlash
                                    &&
                                    (
                                        <motion.div
                                            className="fixed z-[100] bg-white"
                                            style={{
                                                position: 'fixed',
                                                left: '50%',
                                                top: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '100vw',
                                                height: '100vh',
                                                pointerEvents: 'none',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            initial={{
                                                opacity: 1,
                                                scale: 0,
                                                x: '-50%',
                                                y: '-50%',
                                                borderRadius: '50%',
                                            }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                borderRadius: '0%',
                                                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                                            }}
                                            exit={{
                                                opacity: 0,
                                                transition: { duration: 0.1 }
                                            }}
                                        />
                                    )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                transition={{ delay: showIntro ? 0 : 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className={showIntro ? 'pointer-events-none select-none' : ''}
            >
                {/* Main Split Section */}
                <div className="flex flex-1">
                    {/* Left Side */}
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: showIntro ? -60 : 0, opacity: showIntro ? 0 : 1 }}
                        transition={{ delay: showIntro ? 0 : 0.7, duration: 0.8 }}
                        className="w-1/2 flex flex-col justify-between p-12"
                    >
                        <div>
                            {/* Abstract SVG */}
                            <motion.div
                                className="mb-12"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.8 : 1 }}
                                transition={{ delay: showIntro ? 0 : 1, duration: 0.7 }}
                            >
                                <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
                                    <g opacity="0.2">
                                        <ellipse cx="120" cy="120" rx="100" ry="100" stroke="white" strokeWidth="1.5" />
                                        <ellipse cx="120" cy="120" rx="80" ry="100" stroke="white" strokeWidth="1.5" />
                                        <ellipse cx="120" cy="120" rx="100" ry="80" stroke="white" strokeWidth="1.5" />
                                        <ellipse cx="120" cy="120" rx="90" ry="90" stroke="white" strokeWidth="1.5" />
                                        <ellipse cx="120" cy="120" rx="70" ry="100" stroke="white" strokeWidth="1.5" />
                                        <ellipse cx="120" cy="120" rx="100" ry="70" stroke="white" strokeWidth="1.5" />
                                    </g>
                                </svg>
                            </motion.div>
                            {/* Headline */}
                            <motion.h1
                                className="font-bold text-[4rem] leading-[1.1] tracking-tight mb-4"
                                style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                                transition={{ delay: showIntro ? 0 : 1.2, duration: 0.7 }}
                            >
                                Capture<br />the Memory
                            </motion.h1>
                        </div>
                        {/* Bottom Left Info */}
                        <motion.div
                            className="flex items-end justify-between w-full"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                            transition={{ delay: showIntro ? 0 : 1.4, duration: 0.7 }}
                        >
                            <div>
                                <span className="text-3xl font-bold">(17)</span>
                                <span className="ml-2 text-lg text-gray-400">Years of<br />experience</span>
                            </div>
                            <span className="text-gray-400 text-sm">Scroll</span>
                        </motion.div>
                    </motion.div>
                    {/* Right Side */}
                    <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: showIntro ? 60 : 0, opacity: showIntro ? 0 : 1 }}
                        transition={{ delay: showIntro ? 0 : 0.7, duration: 0.8 }}
                        className="w-1/2 flex items-center justify-center bg-gray-900"
                    >
                        <div className="relative w-[400px] h-[500px] rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src="/uploads/kolkata-train.jpg"
                                alt="Photographer"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
                {/* Portfolio link bottom right */}
                <motion.div
                    className="absolute bottom-6 right-12 text-white text-lg font-light tracking-widest"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                    transition={{ delay: showIntro ? 0 : 1.6, duration: 0.7 }}
                >
                    <a href="#portfolio" className="border-b border-white/30 hover:border-white transition">portfolio</a>
                </motion.div>
                {/* Works Section: Show dynamic photos */}
                <section id="works" className="bg-black py-24 border-t border-gray-800">
                    <div className="container mx-auto px-8">
                        <motion.h2
                            className="text-4xl font-bold mb-8"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                            transition={{ delay: showIntro ? 0 : 1.8, duration: 0.7 }}
                        >
                            Works
                        </motion.h2>
                        {loading ? (
                            <div className="text-gray-400">Loading photos...</div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 40 : 0 }}
                                transition={{ delay: showIntro ? 0 : 2, duration: 0.7 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {categories.map((category) => (
                                    <div key={category.id} className="relative group overflow-hidden rounded-xl">
                                        {/* Category Cover Image */}
                                        <div className="aspect-[4/3] w-full">
                                            <Image
                                                src={photos.filter(photo => photo.categoryId === category.id)?.[Math.floor(Math.random() * photos.filter(photo => photo.categoryId === category.id).length)]?.imageUrl || '/placeholder.jpg'}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        {/* Category Info Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-gray-300 text-sm">
                                                {photos.filter(photo => photo.categoryId === category.id).length} photos
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>
                <section id="about" className="bg-black py-24 border-t border-gray-800">
                    <div className="container mx-auto px-8">
                        <h2 className="text-4xl font-bold mb-8">About</h2>
                        <div className="text-gray-400">
                            <p className="mb-6">
                                With over 17 years behind the lens, I've dedicated my life to capturing moments that tell compelling stories. My journey began in the bustling streets of Kolkata, where I discovered my passion for street photography and human narratives.
                            </p>
                            <p className="mb-6">
                                My work has been featured in National Geographic, Time Magazine, and various international exhibitions. I specialize in documentary photography, with a particular focus on cultural heritage and social change in South Asia.
                            </p>
                            <p>
                                When I'm not traveling for assignments, I conduct photography workshops and mentor emerging photographers. My approach combines traditional photographic techniques with modern digital innovations, always staying true to the authentic moment.
                            </p>
                        </div>
                    </div>
                </section>
                {/* <section id="awards" className="bg-black py-24 border-t border-gray-800">
                    <div className="container mx-auto px-8">
                        <h2 className="text-4xl font-bold mb-8">Awards</h2>
                        <div className="text-gray-400">[Awards and recognitions]</div>
                    </div>
                </section> */}
                <section id="contact" className="bg-black py-24 border-t border-gray-800">
                    <div className="container mx-auto px-8">
                        <h2 className="text-4xl font-bold mb-8">Contact</h2>
                        <div className="text-gray-400">[Contact form or details]</div>
                    </div>
                </section>
            </motion.div>
        </div>
    )
} 