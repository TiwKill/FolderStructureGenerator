import React, { useState, useEffect } from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Github } from "lucide-react"
import Link from 'next/link'

const ProfileCard: React.FC = () => {
    const [joinDate, setJoinDate] = useState<string | null>(null)
    const username = 'TiwKill'

    useEffect(() => {
        const fetchGithubProfile = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`)
                const data = await response.json()
                if (data.created_at) {
                    const date = new Date(data.created_at)
                    const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })
                    setJoinDate(formattedDate)
                }
            } catch (error) {
                console.error('Error fetching GitHub profile:', error)
            }
        }

        fetchGithubProfile()
    }, [username])

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Created by Piyawat
                </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarImage src={`https://github.com/${username}.png`} />
                        <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Piyawat Pothanak</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Full-stack developer passionate about creating useful tools and beautiful interfaces.
                        </p>
                        <div className="flex items-center pt-2">
                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {joinDate ? `Joined GitHub ${joinDate}` : 'Loading...'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Link
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 bg-secondary text-secondary-foreground"
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Link>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default ProfileCard 