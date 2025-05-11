'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Photo } from '@/lib/types'

interface PhotoModalProps {
    photo: Photo
    categoryName: string
    isOpen: boolean
    onClose: () => void
}

const PhotoModal = ({ photo, categoryName, isOpen, onClose }: PhotoModalProps) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative aspect-w-16 aspect-h-9">
                        <Image
                            src={photo.imageUrl}
                            alt={photo.title}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900">{photo.title}</h2>
                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                                {categoryName}
                            </span>
                        </div>
                        <p className="mt-4 text-gray-600">{photo.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default PhotoModal 