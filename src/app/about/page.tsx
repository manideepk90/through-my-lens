import { motion } from 'framer-motion'

export default function AboutPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                About Through My Lens
            </h1>
            <div className="prose prose-lg mx-auto">
                <p>
                    Welcome to Through My Lens, a personal photo blog where I share my
                    journey through photography. Each image tells a unique story, capturing
                    moments that inspire, amaze, and connect us to the world around us.
                </p>
                <p>
                    My passion for photography began years ago when I first picked up a
                    camera. Since then, I've been exploring different styles, techniques,
                    and subjects, always learning and growing as a photographer.
                </p>
                <p>
                    This blog is a collection of my favorite shots, from breathtaking
                    landscapes to intimate portraits, from street photography to abstract
                    compositions. Each photo is carefully selected and edited to convey
                    the emotions and stories behind the scenes.
                </p>
                <p>
                    I believe that photography is more than just taking pictures—it's about
                    seeing the world in a unique way and sharing that perspective with
                    others. Through this blog, I hope to inspire others to look at the
                    world through their own lens and discover the beauty in everyday
                    moments.
                </p>
            </div>
        </motion.div>
    )
} 