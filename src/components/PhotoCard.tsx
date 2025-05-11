'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Photo } from '@/lib/types'
import PhotoModal from './PhotoModal'

interface PhotoCardProps {
    photo: Photo
    categoryName: string
}

const PhotoCard = ({ photo, categoryName }: PhotoCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <motion.div
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsModalOpen(true)}
                style={{
                    backgroundColor: photo.backgroundColor || '#ffffff',
                }}
            >
                <div className="aspect-w-16 aspect-h-9 relative">
                    <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-800">{photo.title}</h3>
                        <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                            {categoryName}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{photo.description}</p>
                </div>
            </motion.div>

            <PhotoModal
                photo={photo}
                categoryName={categoryName}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}

export default PhotoCard 