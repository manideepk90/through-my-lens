import { photosDb, categoriesDb } from '@/lib/db'
import PhotoGrid from '@/components/PhotoGrid'
import Link from 'next/link'
import Image from 'next/image'

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const category = await categoriesDb.getById(params.id)
    const photos = await photosDb.getByCategory(params.id)
    const categories = await categoriesDb.getAll()

    if (!category) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
                <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            {/* Main Content - 60% width */}
            <div className="w-3/5 p-8">
                <div className="space-y-8">
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            All Photos
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                className={`px-4 py-2 rounded transition ${cat.id === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                    <PhotoGrid photos={photos} categories={categories} />
                </div>
            </div>

            {/* Category Info Sidebar - 40% width */}
            <div className="w-2/5 bg-gray-50 p-8 border-l border-gray-200">
                <div className="sticky top-8">
                    <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden mb-6 bg-gray-200">
                        <Image
                            src={`/uploads/kolkata-train.jpg`}
                            alt={category.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">
                        {category.name}
                    </h1>
                    <p className="font-sans text-lg text-gray-600 leading-relaxed">
                        {category.description}
                    </p>
                    <div className="mt-6">
                        <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-4">
                            About This Collection
                        </h2>
                        <p className="font-sans text-gray-600">
                            Explore our curated collection of {photos.length} photos in the {category.name.toLowerCase()} category.
                            Each image tells a unique story, capturing moments and memories through our lens.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
} 