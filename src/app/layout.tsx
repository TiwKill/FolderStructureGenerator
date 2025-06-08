import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
    title: 'Folder Structure Generator',
    description: 'Generate folder structure for your project',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}): React.JSX.Element {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                {children}
                <Toaster />
            </body>
        </html>
    )
} 