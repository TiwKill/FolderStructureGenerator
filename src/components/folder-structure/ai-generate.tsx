"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { createDefaultStructure } from "./utils"
import type { FileItem, PaymentInfo } from "@/types/interfaces"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowUp, Check, Loader2, Coins, MessageSquare, CreditCard, Sparkles } from "lucide-react"
import PaymentUpload from "./payment-upload"
import PaymentStatus from "./payment-status"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCredits } from "@/lib/hooks/use-credits"
import FrameworkInstructions from "./framework-instructions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

export default function AiGenerate({ tabId }: { tabId?: string }) {
    const [structure, setStructure] = useState<FileItem>(createDefaultStructure())
    const [userInput, setUserInput] = useState("")
    const [displayedMessages, setDisplayedMessages] = useState<
        Array<{ type: "user" | "ai"; content: string; timestamp: Date }>
    >([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [payment, setPayment] = useState<PaymentInfo | null>(null)
    const [selectedStructure, setSelectedStructure] = useState<string | null>(null)

    // Use temporary user ID for demo - in real app, use actual user ID
    const {
        credits,
        addCredits,
        useCredit,
        hasCredits,
        showPayment,
        togglePayment,
        getExpiryTime,
        CREDITS_PER_PAYMENT
    } = useCredits("demo-user")

    const expiryTime = getExpiryTime()
    const formattedExpiryTime = expiryTime ? new Date(expiryTime).toLocaleString() : null

    // Load last payment from localStorage on mount
    useEffect(() => {
        const savedPayment = localStorage.getItem('last-payment')
        if (savedPayment) {
            try {
                const parsedPayment = JSON.parse(savedPayment)
                // Convert string dates back to Date objects
                parsedPayment.timestamp = new Date(parsedPayment.timestamp)
                if (parsedPayment.verifiedAt) {
                    parsedPayment.verifiedAt = new Date(parsedPayment.verifiedAt)
                }
                setPayment(parsedPayment)
            } catch (error) {
                console.error('Error loading last payment:', error)
            }
        }
    }, [])

    // Save payment to localStorage whenever it changes
    useEffect(() => {
        if (payment) {
            try {
                localStorage.setItem('last-payment', JSON.stringify(payment))
            } catch (error) {
                console.error('Error saving payment:', error)
            }
        }
    }, [payment])

    const mockResponses = [
        "ได้เลยครับ! ผมจะสร้าง folder structure สำหรับ React project ที่มี TypeScript และ Tailwind CSS ให้คุณ\n\n```\nmy-react-app/\n├── public/\n│   ├── index.html\n│   └── favicon.ico\n├── src/\n│   ├── components/\n│   │   ├── ui/\n│   │   │   ├── Button.tsx\n│   │   │   └── Input.tsx\n│   │   └── Layout.tsx\n│   ├── pages/\n│   │   ├── Home.tsx\n│   │   └── About.tsx\n│   ├── hooks/\n│   │   └── useCustomHook.ts\n│   ├── utils/\n│   │   └── helpers.ts\n│   ├── styles/\n│   │   └── globals.css\n│   ├── App.tsx\n│   └── index.tsx\n├── package.json\n├── tsconfig.json\n├── tailwind.config.js\n└── README.md\n```",

        "สำหรับ Next.js project ที่คุณต้องการ ผมแนะนำ structure แบบนี้ครับ:\n\n```\nnext-project/\n├── app/\n│   ├── (dashboard)/\n│   │   ├── analytics/\n│   │   │   └── page.tsx\n│   │   └── settings/\n│   │       └── page.tsx\n│   ├── api/\n│   │   └── users/\n│   │       └── route.ts\n│   ├── globals.css\n│   ├── layout.tsx\n│   └── page.tsx\n├── components/\n│   ├── ui/\n│   └── shared/\n├── lib/\n│   ├── utils.ts\n│   └── db.ts\n├── public/\n│   └── images/\n└── types/\n    └── index.ts\n```",

        "ผมจะสร้าง Express.js API structure ที่มี MVC pattern ให้คุณนะครับ:\n\n```\napi-server/\n├── src/\n│   ├── controllers/\n│   │   ├── authController.js\n│   │   └── userController.js\n│   ├── models/\n│   │   ├── User.js\n│   │   └── index.js\n│   ├── routes/\n│   │   ├── auth.js\n│   │   └── users.js\n│   ├── middleware/\n│   │   ├── auth.js\n│   │   └── validation.js\n│   ├── config/\n│   │   └── database.js\n│   ├── utils/\n│   │   └── helpers.js\n│   └── app.js\n├── tests/\n├── .env.example\n├── package.json\n└── server.js\n```",
    ]

    const handlePaymentSubmit = async (newPayment: PaymentInfo) => {
        setPayment(newPayment)
        // Simulate payment verification
        setTimeout(() => {
            const verifiedPayment = {
                ...newPayment,
                status: "verified" as const,
                verifiedAt: new Date(),
            }
            setPayment(verifiedPayment)
            // Add credits when payment is verified
            addCredits(verifiedPayment.id)
        }, 3000)
    }

    const handleUseStructure = async () => {
        if (!selectedStructure) return

        try {
            // Extract the structure part from the markdown
            const structureMatch = selectedStructure.match(/```\n([\s\S]*?)\n```/)
            if (!structureMatch) {
                console.error('No structure found in the selected message')
                return
            }

            const structure = structureMatch[1]

            // Call the API to generate the folder structure
            const response = await fetch('/api/folder-structure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ structure }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate folder structure')
            }

            const data = await response.json()

            // Show success message
            toast({
                title: "โครงสร้างโฟลเดอร์ถูกสร้างแล้ว",
                description: `สร้างโครงสร้างโฟลเดอร์เรียบร้อยแล้วที่: ${data.path}`,
            })

        } catch (error) {
            console.error('Error generating folder structure:', error)
            // Show error message
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถสร้างโครงสร้างโฟลเดอร์ได้",
                variant: "destructive",
            })
        }
    }

    const getNpxCommand = () => {
        if (!selectedStructure) return null
        return `npx create-app --template=${selectedStructure.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`
    }

    const handleSubmit = async () => {
        if (!userInput.trim() || !hasCredits()) return

        // Use one credit
        if (!useCredit()) return

        // Add user message
        const userMessage = {
            type: "user" as const,
            content: userInput.trim(),
            timestamp: new Date(),
        }

        setDisplayedMessages((prev) => [...prev, userMessage])
        setUserInput("")
        setIsProcessing(true)

        // Simulate AI thinking
        const thinkingMessage = {
            type: "ai" as const,
            content: "กำลังคิดคำตอบ...",
            timestamp: new Date(),
        }
        setDisplayedMessages((prev) => [...prev, thinkingMessage])

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Remove thinking message and add actual response
        const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        const aiMessage = {
            type: "ai" as const,
            content: mockResponse,
            timestamp: new Date(),
        }

        setDisplayedMessages((prev) => [...prev.slice(0, -1), aiMessage])
        setIsProcessing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    // Show payment screen only when showPayment is true
    if (showPayment) {
        return (
            <div className="container max-w-4xl mx-auto">
                <Card className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CreditCard className="w-5 h-5 text-purple-500" />
                            เติมเครดิตเพิ่ม
                        </CardTitle>
                        <CardDescription>อัปโหลดหลักฐานการชำระเงินเพื่อรับเครดิตสำหรับใช้งาน AI Generate</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <PaymentUpload onPaymentSubmit={handlePaymentSubmit} />
                    </CardContent>
                    <CardFooter className="bg-gray-50 dark:bg-gray-900/30 p-4 flex justify-between items-center">
                        <Button variant="ghost" onClick={togglePayment}>
                            ย้อนกลับ
                        </Button>
                        <div className="text-sm text-gray-500">
                            {CREDITS_PER_PAYMENT} เครดิต / การชำระเงิน
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (payment?.status !== "verified" && payment !== null) {
        return (
            <div className="container max-w-4xl mx-auto">
                <PaymentStatus payment={payment} />
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto">
            <Tabs defaultValue="chat" className="w-full h-full">
                <TabsList className="grid grid-cols-2 mb-4 w-full h-full">
                    <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>AI Generate</span>
                    </TabsTrigger>
                    <TabsTrigger value="status" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>สถานะและเครดิต</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="mt-0">
                    <div className="grid grid-cols-1 gap-4">
                        <PaymentStatus payment={payment} />

                        <Card className="md:col-span-1 overflow-hidden border-2">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 p-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-amber-500" />
                                    เครดิตคงเหลือ
                                </CardTitle>
                                <CardDescription>
                                    จำนวนครั้งที่คุณสามารถใช้งาน AI Generate ได้
                                    {formattedExpiryTime && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            หมดอายุ: {formattedExpiryTime}
                                        </div>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-full mb-3">
                                        <Coins className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <p className="text-4xl font-bold mb-1">{credits?.credits || 0}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">ครั้งที่เหลือ</p>

                                    <Button variant="outline" className="mt-4 w-full" onClick={togglePayment}>
                                        เติมเครดิตเพิ่ม
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-0 space-y-4">
                    {/* Chat Section */}
                    <div className="flex flex-col gap-4">
                        {/* Messages */}
                        <ScrollArea className="border rounded-lg p-4 h-[350px] bg-slate-50 dark:bg-slate-900/50">
                            {displayedMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-3">
                                        <MessageSquare className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        ป้อนคำขอของคุณด้านล่างเพื่อให้ AI สร้าง folder structure ให้...
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        ตัวอย่าง: "สร้าง React project structure ที่มี TypeScript และ Tailwind CSS"
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {displayedMessages.map((message, index) => (
                                        <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[80%] ${message.type === "user" ? "order-1" : "order-0"}`}>
                                                <div className="flex items-center mb-1 text-xs">
                                                    <Badge
                                                        variant={message.type === "user" ? "secondary" : "default"}
                                                        className="rounded-full px-2 py-0 h-5"
                                                    >
                                                        {message.type === "user" ? "คุณ" : "AI"}
                                                    </Badge>
                                                    <span className="text-gray-400 ml-2 font-normal">
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`rounded-lg p-3 ${message.type === "user"
                                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100"
                                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                                        }`}
                                                >
                                                    {message.content === "กำลังคิดคำตอบ..." ? (
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                            <span className="italic">{message.content}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="whitespace-pre-wrap text-sm">
                                                            {message.content.split("```").map((part, i) => {
                                                                if (i % 2 === 0) {
                                                                    return <div key={i}>{part}</div>
                                                                } else {
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className="my-2 bg-gray-100 dark:bg-gray-900 p-3 rounded-md font-mono text-xs overflow-x-auto"
                                                                        >
                                                                            {part}
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Show use structure button for AI responses with structure */}
                                                {message.type === "ai" && message.content.includes("```") && (
                                                    <div className="mt-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setSelectedStructure(message.content)}
                                                            variant={selectedStructure === message.content ? "default" : "outline"}
                                                            className="gap-2"
                                                        >
                                                            {selectedStructure === message.content && <Check className="w-4 h-4" />}
                                                            ใช้โครงสร้างนี้
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input */}
                        <div className="relative w-full">
                            <Textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    hasCredits()
                                        ? "เช่น: สร้าง React project structure ที่มี TypeScript และ Tailwind CSS"
                                        : "เครดิตหมด กรุณาชำระเงินเพื่อใช้งานต่อ"
                                }
                                className="w-full pr-12 resize-none overflow-hidden min-h-[60px] pb-10 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                rows={2}
                                disabled={isProcessing || !hasCredits()}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = "auto"
                                    target.style.height = `${target.scrollHeight}px`
                                }}
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={!userInput.trim() || isProcessing || !hasCredits()}
                                className="absolute bottom-2 right-2 h-8 w-8 p-0"
                                type="button"
                                size="icon"
                                variant="default"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                            </Button>
                        </div>

                        {!hasCredits() && (
                            <Alert variant="destructive" className="animate-pulse">
                                <Coins className="w-4 h-4" />
                                <AlertTitle>เครดิตหมด</AlertTitle>
                                <AlertDescription>เครดิตของคุณหมดแล้ว กรุณาชำระเงินเพื่อใช้งานต่อ</AlertDescription>
                            </Alert>
                        )}

                        <div className="bg-gray-50 dark:bg-gray-900/30 p-4 text-xs text-gray-500 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-amber-500" />
                                <span>
                                    เครดิตคงเหลือ: <strong>{credits?.credits || 0}</strong> ครั้ง
                                    {formattedExpiryTime && (
                                        <span className="ml-2 text-gray-400">
                                            (หมดอายุ: {formattedExpiryTime})
                                        </span>
                                    )}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={togglePayment}>
                                เติมเครดิตเพิ่ม
                            </Button>
                        </div>
                    </div>

                    {/* Framework Instructions */}
                    {selectedStructure && <FrameworkInstructions structure={selectedStructure} />}
                </TabsContent>
            </Tabs>
        </div>
    )
}
