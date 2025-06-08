"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Terminal, Code, Copy, CheckCircle, Server, Layers, FileCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface FrameworkInstructionsProps {
    structure: string
}

interface InstallStep {
    title: string
    command?: string
    description?: string
}

export default function FrameworkInstructions({ structure }: FrameworkInstructionsProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    // Extract framework type from structure
    const getFrameworkType = (structure: string): string => {
        const lowerStructure = structure.toLowerCase()
        if (lowerStructure.includes("next")) return "next"
        if (lowerStructure.includes("react")) return "react"
        if (lowerStructure.includes("express")) return "express"
        if (lowerStructure.includes("vue")) return "vue"
        return "generic"
    }

    const getFrameworkIcon = (type: string) => {
        switch (type) {
            case "next":
                return (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.5725 0C5.1725 0 0 5.1725 0 11.5725C0 17.9725 5.1725 23.145 11.5725 23.145C17.9725 23.145 23.145 17.9725 23.145 11.5725C23.145 5.1725 17.9725 0 11.5725 0ZM6.4125 17.6025L2.8875 11.5725L6.4125 5.5425H9.9375L6.4125 11.5725L9.9375 17.6025H6.4125ZM12.705 17.6025L9.18 11.5725L12.705 5.5425H16.23L12.705 11.5725L16.23 17.6025H12.705Z"
                            fill="currentColor"
                        />
                    </svg>
                )
            case "react":
                return (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z"
                            fill="currentColor"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 7.58172 18 12 18C16.4183 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2ZM12 16C8.68629 16 6 13.3137 6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10C18 13.3137 15.3137 16 12 16Z"
                            fill="currentColor"
                        />
                        <path
                            d="M12 22C17.5228 22 22 20.2091 22 18C22 15.7909 17.5228 14 12 14C6.47715 14 2 15.7909 2 18C2 20.2091 6.47715 22 12 22Z"
                            fill="currentColor"
                        />
                    </svg>
                )
            case "express":
                return <Server className="w-5 h-5" />
            case "vue":
                return (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.1973 3H15L12 7.8L9.5 3H0L12 23L24 3H19.1973Z" fill="currentColor" />
                        <path d="M19.1973 3L12 15L4.8 3H9.5L12 7.8L15 3H19.1973Z" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                )
            default:
                return <FileCode className="w-5 h-5" />
        }
    }

    const getInstallSteps = (type: string): InstallStep[] => {
        switch (type) {
            case "next":
                return [
                    {
                        title: "สร้างโปรเจกต์ Next.js",
                        command: "npx create-next-app@latest my-next-app --typescript --tailwind --eslint",
                        description: "คำสั่งนี้จะสร้างโปรเจกต์ Next.js พร้อมกับ TypeScript, Tailwind CSS และ ESLint",
                    },
                    {
                        title: "ติดตั้ง Dependencies เพิ่มเติม",
                        command:
                            "npm install @radix-ui/react-icons @radix-ui/react-slot class-variance-authority clsx tailwind-merge",
                        description: "ติดตั้ง libraries เพิ่มเติมสำหรับ UI components",
                    },
                ]
            case "react":
                return [
                    {
                        title: "สร้างโปรเจกต์ React",
                        command: "npx create-react-app my-react-app --template typescript",
                        description: "สร้างโปรเจกต์ React พร้อมกับ TypeScript template",
                    },
                    {
                        title: "ติดตั้ง Tailwind CSS",
                        command: "npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p",
                        description: "ติดตั้ง Tailwind CSS และสร้างไฟล์ configuration",
                    },
                    {
                        title: "ติดตั้ง Dependencies เพิ่มเติม",
                        command:
                            "npm install @radix-ui/react-icons @radix-ui/react-slot class-variance-authority clsx tailwind-merge",
                        description: "ติดตั้ง libraries สำหรับ UI components",
                    },
                ]
            case "express":
                return [
                    {
                        title: "สร้างโปรเจกต์ Express",
                        command: "mkdir my-express-app && cd my-express-app && npm init -y",
                        description: "สร้างโฟลเดอร์โปรเจกต์และเริ่มต้น npm project",
                    },
                    {
                        title: "ติดตั้ง Dependencies หลัก",
                        command: "npm install express typescript ts-node @types/node @types/express",
                        description: "ติดตั้ง Express และ TypeScript dependencies",
                    },
                    {
                        title: "ติดตั้ง Development Dependencies",
                        command: "npm install -D nodemon @typescript-eslint/parser @typescript-eslint/eslint-plugin",
                        description: "ติดตั้ง development tools สำหรับ hot-reloading และ linting",
                    },
                ]
            case "vue":
                return [
                    {
                        title: "สร้างโปรเจกต์ Vue",
                        command: "npm create vue@latest my-vue-app",
                        description: "สร้างโปรเจกต์ Vue ด้วย Vue CLI ล่าสุด",
                    },
                    {
                        title: "ติดตั้ง Dependencies",
                        command: "cd my-vue-app && npm install",
                        description: "เข้าไปในโฟลเดอร์โปรเจกต์และติดตั้ง dependencies",
                    },
                ]
            default:
                return [
                    {
                        title: "สร้างโปรเจกต์",
                        command: "mkdir my-project && cd my-project && npm init -y",
                        description: "สร้างโฟลเดอร์โปรเจกต์และเริ่มต้น npm project",
                    },
                    {
                        title: "ติดตั้ง TypeScript",
                        command: "npm install typescript @types/node --save-dev && npx tsc --init",
                        description: "ติดตั้ง TypeScript และสร้างไฟล์ configuration",
                    },
                ]
        }
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const frameworkType = getFrameworkType(structure)
    const installSteps = getInstallSteps(frameworkType)
    const frameworkIcon = getFrameworkIcon(frameworkType)

    const getFrameworkColor = (type: string): string => {
        switch (type) {
            case "next":
                return "bg-black text-white dark:bg-white dark:text-black"
            case "react":
                return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            case "express":
                return "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
            case "vue":
                return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            default:
                return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
        }
    }

    return (
        <Card className="overflow-hidden border-2">
            <CardHeader className={`bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getFrameworkColor(frameworkType)}`}>{frameworkIcon}</div>
                        <div className="flex flex-col gap-2">
                            <CardTitle className="text-lg flex items-center gap-2">คำแนะนำการติดตั้ง</CardTitle>
                            <CardDescription>ขั้นตอนการติดตั้งและเริ่มต้นโปรเจกต์</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="capitalize px-3 py-1">
                        {frameworkType}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <Tabs defaultValue="install">
                    <TabsList className="grid grid-cols-2 mb-4 w-full h-full">
                        <TabsTrigger value="install" className="flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            <span>การติดตั้ง</span>
                        </TabsTrigger>
                        <TabsTrigger value="structure" className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span>โครงสร้างไฟล์</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="install" className="space-y-6">
                        {installSteps.map((step, index) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-base font-medium">{step.title}</h3>
                                </div>

                                {step.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">{step.description}</p>
                                )}

                                {step.command && (
                                    <div className="ml-8 relative">
                                        <Alert className="bg-black text-white dark:bg-gray-900 pr-12 overflow-x-auto">
                                            <Terminal className="w-4 h-4 text-gray-400" />
                                            <AlertDescription className="font-mono text-xs mt-2 select-all whitespace-pre overflow-x-auto">
                                                {step.command}
                                            </AlertDescription>
                                        </Alert>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute top-3 right-3 h-7 w-7 text-gray-400 hover:text-white"
                                            onClick={() => handleCopy(step.command || "", index)}
                                        >
                                            {copiedIndex === index ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                )}

                                {index < installSteps.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="structure" className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                            <pre className="whitespace-pre">{structure.split("```").filter((_, i) => i % 2 === 1)[0]}</pre>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-gray-900/30 px-6 py-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    <Code className="w-4 h-4 inline mr-1" />
                    เริ่มต้นโปรเจกต์ {frameworkType.charAt(0).toUpperCase() + frameworkType.slice(1)}
                </div>
                <Button size="sm">ดูเอกสารเพิ่มเติม</Button>
            </CardFooter>
        </Card>
    )
}
