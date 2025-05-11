export interface Photo {
    id: string
    title: string
    description: string
    imageUrl: string
    backgroundColor?: string
    categoryId?: string
    createdAt: string
    updatedAt: string
}

export interface User {
    id: string
    username: string
    password: string
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface Category {
    id: string
    name: string
    description: string
}

export interface PhotoInput {
    title: string
    description: string
    backgroundColor?: string
    categoryId?: string
} 