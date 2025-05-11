# Through My Lens - Photo Blog

A beautiful and dynamic photo blog built with Next.js, featuring a responsive grid layout, smooth animations, and an admin dashboard for content management.

## Features

- 🖼️ Responsive photo grid with smooth animations
- 🔍 Click-to-expand photo view with full details
- 🎨 Custom background styling for each photo
- 🔐 Admin authentication and dashboard
- 📤 Image upload with metadata
- ✏️ Edit and delete functionality
- 📱 Mobile-friendly design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- SQLite (better-sqlite3)
- JWT Authentication

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/through-my-lens.git
   cd through-my-lens
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   JWT_SECRET=your-secure-secret-key
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

4. Create the uploads directory:
   ```bash
   mkdir -p public/uploads
   ```

5. Start the development server:
   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
through-my-lens/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and database
│   └── styles/          # Global styles
├── public/
│   └── uploads/         # Uploaded images
└── ...config files
```

## Admin Access

1. Visit `/admin` to access the login page
2. Use the credentials from your `.env.local` file
3. After login, you'll be redirected to the admin dashboard
4. From there, you can:
   - Upload new photos
   - Edit existing photos
   - Delete photos
   - Manage photo metadata

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. # through-my-lens
# through-my-lens
