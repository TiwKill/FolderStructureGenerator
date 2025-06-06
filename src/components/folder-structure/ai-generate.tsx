"use client"
import { useState } from "react"
import {
    createDefaultStructure
} from "./utils"
import type { FileItem } from "@/types/interfaces"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { ArrowUp, Loader2 } from "lucide-react"

export default function AiGenerate({ tabId }: { tabId?: string }) {
    const [structure, setStructure] = useState<FileItem>(createDefaultStructure())
    const [userInput, setUserInput] = useState("")
    const [displayedMessages, setDisplayedMessages] = useState<Array<{ type: 'user' | 'ai', content: string, timestamp: Date }>>([])
    const [isProcessing, setIsProcessing] = useState(false)

    const mockResponses = [
        "ได้เลยครับ! ผมจะสร้าง folder structure สำหรับ React project ที่มี TypeScript และ Tailwind CSS ให้คุณ\n\n```\nmy-react-app/\n├── public/\n│   ├── index.html\n│   └── favicon.ico\n├── src/\n│   ├── components/\n│   │   ├── ui/\n│   │   │   ├── Button.tsx\n│   │   │   └── Input.tsx\n│   │   └── Layout.tsx\n│   ├── pages/\n│   │   ├── Home.tsx\n│   │   └── About.tsx\n│   ├── hooks/\n│   │   └── useCustomHook.ts\n│   ├── utils/\n│   │   └── helpers.ts\n│   ├── styles/\n│   │   └── globals.css\n│   ├── App.tsx\n│   └── index.tsx\n├── package.json\n├── tsconfig.json\n├── tailwind.config.js\n└── README.md\n```",

        "สำหรับ Next.js project ที่คุณต้องการ ผมแนะนำ structure แบบนี้ครับ:\n\n```\nnext-project/\n├── app/\n│   ├── (dashboard)/\n│   │   ├── analytics/\n│   │   │   └── page.tsx\n│   │   └── settings/\n│   │       └── page.tsx\n│   ├── api/\n│   │   └── users/\n│   │       └── route.ts\n│   ├── globals.css\n│   ├── layout.tsx\n│   └── page.tsx\n├── components/\n│   ├── ui/\n│   └── shared/\n├── lib/\n│   ├── utils.ts\n│   └── db.ts\n├── public/\n│   └── images/\n└── types/\n    └── index.ts\n```",

        "ผมจะสร้าง Express.js API structure ที่มี MVC pattern ให้คุณนะครับ:\n\n```\napi-server/\n├── src/\n│   ├── controllers/\n│   │   ├── authController.js\n│   │   └── userController.js\n│   ├── models/\n│   │   ├── User.js\n│   │   └── index.js\n│   ├── routes/\n│   │   ├── auth.js\n│   │   └── users.js\n│   ├── middleware/\n│   │   ├── auth.js\n│   │   └── validation.js\n│   ├── config/\n│   │   └── database.js\n│   ├── utils/\n│   │   └── helpers.js\n│   └── app.js\n├── tests/\n├── .env.example\n├── package.json\n└── server.js\n```"
    ]

    const handleSubmit = async () => {
        if (!userInput.trim()) return

        // Add user message
        const userMessage = {
            type: 'user' as const,
            content: userInput.trim(),
            timestamp: new Date()
        }

        setDisplayedMessages(prev => [...prev, userMessage])
        setUserInput("")
        setIsProcessing(true)

        // Simulate AI thinking
        const thinkingMessage = {
            type: 'ai' as const,
            content: "กำลังคิดคำตอบ...",
            timestamp: new Date()
        }
        setDisplayedMessages(prev => [...prev, thinkingMessage])

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Remove thinking message and add actual response
        setDisplayedMessages(prev => prev.slice(0, -1))

        // Get random mock response
        const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        const aiMessage = {
            type: 'ai' as const,
            content: mockResponse,
            timestamp: new Date()
        }

        setDisplayedMessages(prev => [...prev, aiMessage])
        setIsProcessing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <>
            {/* Display conversation */}
            <div className="mb-4">
                <div className="text-xs font-mono dark:border dark:border-gray-800 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md break-all w-full min-h-[200px] max-h-[400px] overflow-y-auto">
                    {displayedMessages.length === 0 ? (
                        <div className="text-gray-500 italic">
                            ป้อนคำขอของคุณด้านล่างเพื่อให้ AI สร้าง folder structure ให้...
                        </div>
                    ) : (
                        displayedMessages.map((message, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                                <div className={`text-xs font-semibold mb-1 ${message.type === 'user'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-green-600 dark:text-green-400'
                                    }`}>
                                    {message.type === 'user' ? 'You:' : 'AI:'}
                                    <span className="text-gray-400 ml-2 font-normal">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={`${message.type === 'user'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-300 dark:border-blue-600'
                                        : 'bg-green-50 dark:bg-green-900/20 border-l-2 border-green-300 dark:border-green-600'
                                    } p-2 rounded-r-md`}>
                                    {message.content === "กำลังคิดคำตอบ..." ? (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            <span className="italic">{message.content}</span>
                                        </div>
                                    ) : (
                                        <pre className="whitespace-pre-wrap text-xs">{message.content}</pre>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Input section */}
            <div className="relative w-full">
                <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="เช่น: สร้าง React project structure ที่มี TypeScript และ Tailwind CSS"
                    className="w-full pr-12 resize-none overflow-hidden min-h-[40px] pb-10 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    rows={1}
                    disabled={isProcessing}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || isProcessing}
                    className="absolute bottom-2 right-2 p-2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    variant="ghost"
                >
                    {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ArrowUp className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </>
    )
}