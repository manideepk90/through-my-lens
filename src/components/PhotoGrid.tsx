'use client'

import { motion } from 'framer-motion'
import PhotoCard from './PhotoCard'
import { Photo, Category } from '@/lib/types'

interface PhotoGridProps {
    photos: Photo[]
    categories: Category[]
}

const PhotoGrid = ({ photos = [], categories = [] }: PhotoGridProps) => {
    if (!photos || photos.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No photos available
            </div>
        )
    }

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category?.name || 'Uncategorized'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
                <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <PhotoCard
                        photo={photo}
                        categoryName={getCategoryName(photo.categoryId || '')}
                    />
                </motion.div>
            ))}
        </div>
    )
}

export default PhotoGrid 