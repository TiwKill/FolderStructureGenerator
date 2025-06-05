import React from 'react'
import FolderStructureBuilder from '@/components/folder-structure'

export default function Home(): React.JSX.Element {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-16">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                        Project Structure Builder
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Create and visualize your project folder structures with ease. Perfect for planning and documenting your project organization.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 backdrop-blur-sm">
                    <div className="h-[700px] relative">
                        <FolderStructureBuilder />
                    </div>
                </div>
            </div>
        </main>
    )
} 