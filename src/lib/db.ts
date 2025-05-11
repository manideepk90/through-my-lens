import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Photo, User, Category } from './types'
import { hashPassword } from './auth'
import { promisify } from 'util'

let db: any = null

const initDb = async () => {
    if (db) return db

    try {
        db = await open({
            filename: 'photos.db',
            driver: sqlite3.Database
        })

        // Initialize database tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT
            );
            CREATE TABLE IF NOT EXISTS photos (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                imageUrl TEXT NOT NULL,
                backgroundColor TEXT,
                categoryId TEXT,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (categoryId) REFERENCES categories(id)
            );
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `)

        // Create admin user if not exists
        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [adminUsername])

        if (!existingUser) {
            const hashedPassword = await hashPassword(adminPassword)
            await db.run(
                'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
                [crypto.randomUUID(), adminUsername, hashedPassword]
            )
        }

        return db
    } catch (error) {
        console.error('Database initialization error:', error)
        throw error
    }
}

// Initialize database
initDb().catch(console.error)

export const categoriesDb = {
    getAll: async () => {
        try {
            const db = await initDb()
            return await db.all('SELECT * FROM categories ORDER BY name ASC') as Category[]
        } catch (error) {
            console.error('Error getting all categories:', error)
            return []
        }
    },
    getById: async (id: string) => {
        try {
            const db = await initDb()
            return await db.get('SELECT * FROM categories WHERE id = ?', [id]) as Category
        } catch (error) {
            console.error('Error getting category by id:', error)
            return null
        }
    },
    create: async (category: Omit<Category, 'id'>) => {
        try {
            const db = await initDb()
            const id = crypto.randomUUID()
            await db.run(
                'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
                [id, category.name, category.description]
            )
            return { ...category, id }
        } catch (error) {
            console.error('Error creating category:', error)
            throw error
        }
    },
    delete: async (id: string) => {
        try {
            const db = await initDb()
            await db.run('DELETE FROM categories WHERE id = ?', [id])
        } catch (error) {
            console.error('Error deleting category:', error)
            throw error
        }
    }
}

export const photosDb = {
    getAll: async () => {
        try {
            const db = await initDb()
            return await db.all('SELECT * FROM photos ORDER BY createdAt DESC') as Photo[]
        } catch (error) {
            console.error('Error getting all photos:', error)
            return []
        }
    },
    getByCategory: async (categoryId: string) => {
        try {
            const db = await initDb()
            return await db.all('SELECT * FROM photos WHERE categoryId = ? ORDER BY createdAt DESC', [categoryId]) as Photo[]
        } catch (error) {
            console.error('Error getting photos by category:', error)
            return []
        }
    },
    getById: async (id: string) => {
        try {
            const db = await initDb()
            return await db.get('SELECT * FROM photos WHERE id = ?', [id]) as Photo
        } catch (error) {
            console.error('Error getting photo by id:', error)
            return null
        }
    },
    create: async (photo: Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const db = await initDb()
            const id = crypto.randomUUID()
            const now = new Date().toISOString()
            await db.run(`
                INSERT INTO photos (id, title, description, imageUrl, backgroundColor, categoryId, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, photo.title, photo.description, photo.imageUrl, photo.backgroundColor, photo.categoryId, now, now])
            return { ...photo, id, createdAt: now, updatedAt: now }
        } catch (error) {
            console.error('Error creating photo:', error)
            throw error
        }
    },
    update: async (id: string, photo: Partial<Photo>) => {
        try {
            const db = await initDb()
            const now = new Date().toISOString()
            const updates = Object.entries(photo)
                .filter(([key]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
                .map(([key]) => `${key} = ?`)
                .join(', ')
            await db.run(`
                UPDATE photos
                SET ${updates}, updatedAt = ?
                WHERE id = ?
            `, [...Object.values(photo), now, id])
            return { ...photo, id, updatedAt: now }
        } catch (error) {
            console.error('Error updating photo:', error)
            throw error
        }
    },
    delete: async (id: string) => {
        try {
            const db = await initDb()
            await db.run('DELETE FROM photos WHERE id = ?', [id])
        } catch (error) {
            console.error('Error deleting photo:', error)
            throw error
        }
    }
}

export const usersDb = {
    getByUsername: async (username: string) => {
        try {
            const db = await initDb()
            return await db.get('SELECT * FROM users WHERE username = ?', [username]) as User
        } catch (error) {
            console.error('Error getting user by username:', error)
            return null
        }
    },

    create: async (user: Omit<User, 'id'>) => {
        try {
            const db = await initDb()
            const id = crypto.randomUUID()
            await db.run(
                'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
                [id, user.username, user.password]
            )
            return { ...user, id }
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    }
}

export default db 