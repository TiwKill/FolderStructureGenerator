import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Folder Structure Generator',
    description: 'A tool to generate and visualize folder structures',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}): React.JSX.Element {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster richColors />
            </body>
        </html>
    )
} 