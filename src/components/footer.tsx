import React from 'react'

export default function Footer() {
    return (
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
                © {new Date().getFullYear()} BillSharing · Created by Piyawat Pothanak
            </p>
            <div className="mt-3 flex items-center justify-center gap-4">
                <a
                    href="https://github.com/TiwKill"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="hover:text-gray-700 dark:hover:text-gray-300 underline-offset-4 hover:underline"
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}
