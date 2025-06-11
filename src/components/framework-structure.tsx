"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Loader2, Settings } from "lucide-react"
import { getFrameworkStructure } from "./folder-structure/framework-templates"
import type { FrameworkStructureProps } from "@/types/interfaces"
import { frameworks } from "@/components/constants/frameworks-constant"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface ExtendedFrameworkStructureProps extends FrameworkStructureProps {
    isLoading?: boolean
}

interface FrameworkOptions {
    [key: string]: {
        [option: string]: boolean | string
    }
}

export default function FrameworkStructure({
    onFrameworkSelect,
    selectedFramework,
    isLoading = false,
}: ExtendedFrameworkStructureProps) {
    const [frameworkOptions, setFrameworkOptions] = useState<FrameworkOptions>({
        "Next.js": {
            "Would you like to use TypeScript?": true,
            "Would you like to use ESLint?": true,
            "Would you like to use Tailwind CSS?": true,
            "Would you like your code inside a `src/` directory?": false,
            "Would you like to use App Router? (recommended)": true,
            "Would you like to use Turbopack for `next dev`?": false,
        },
        React: {
            "Include components folder": true,
            "Include hooks folder": true,
            "Include utils folder": true,
            "Include TypeScript config": true,
            "Include Vite config": true,
            "Include public folder": true,
        },
        "Vue.js": {
            "Include components folder": true,
            "Include views folder": true,
            "Include composables folder": true,
            "Include TypeScript config": true,
            "Include Vite config": true,
            "Include public folder": true,
        },
        Angular: {
            "Include app module": true,
            "Include components": true,
            "Include services folder": true,
            "Include TypeScript config": true,
            "Include Angular config": true,
            "Include assets folder": true,
        },
        Svelte: {
            "Include lib folder": true,
            "Include routes folder": true,
            "Include components": true,
            "Include TypeScript config": true,
            "Include Svelte config": true,
            "Include Vite config": true,
        },
        "Nuxt.js": {
            "Include pages folder": true,
            "Include components folder": true,
            "Include layouts folder": true,
            "Include TypeScript config": true,
            "Include Nuxt config": true,
            "Include public folder": true,
        },
        Remix: {
            "Include routes folder": true,
            "Include components": true,
            "Include utils folder": true,
            "Include TypeScript config": true,
            "Include Remix config": true,
            "Include public folder": true,
        },
        Astro: {
            "Include pages folder": true,
            "Include components folder": true,
            "Include layouts folder": true,
            "Include TypeScript config": true,
            "Include Astro config": true,
            "Include public folder": true,
        },
    })

    const [isMobile, setIsMobile] = useState(false)
    const [selectedFrameworkForOptions, setSelectedFrameworkForOptions] = useState<string | null>(null)
    const [showOptionsDialog, setShowOptionsDialog] = useState(false)

    // Detect mobile screen size
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)
        return () => window.removeEventListener("resize", checkIsMobile)
    }, [])

    const handleOptionChange = (framework: string, option: string, value: boolean | string) => {
        setFrameworkOptions((prev) => ({
            ...prev,
            [framework]: {
                ...prev[framework],
                [option]: value,
            },
        }))
    }

    const handleFrameworkSelect = (framework: string) => {
        try {
            // Get base structure
            const baseStructure = getFrameworkStructure(framework)

            // Apply customizations based on selected options
            const customizedStructure = applyFrameworkOptions(baseStructure, framework, frameworkOptions[framework])

            onFrameworkSelect?.(customizedStructure)
            setShowOptionsDialog(false)
        } catch (error) {
            console.error("Framework selection error:", error)
            toast.error(`Failed to load ${framework} template`)
        }
    }

    const handleFrameworkClick = (framework: string) => {
        if (isMobile) {
            setSelectedFrameworkForOptions(framework)
            setShowOptionsDialog(true)
        }
    }

    const applyFrameworkOptions = (structure: any, framework: string, options: { [key: string]: boolean | string }) => {
        // Clone the structure to avoid mutations
        const customStructure = JSON.parse(JSON.stringify(structure))

        // Apply customizations based on framework and options
        switch (framework) {
            case "Next.js":
                return applyNextjsOptions(customStructure, options)
            case "React":
                return applyReactOptions(customStructure, options)
            case "Vue.js":
                return applyVueOptions(customStructure, options)
            case "Angular":
                return applyAngularOptions(customStructure, options)
            case "Svelte":
                return applySvelteOptions(customStructure, options)
            case "Nuxt.js":
                return applyNuxtOptions(customStructure, options)
            case "Remix":
                return applyRemixOptions(customStructure, options)
            case "Astro":
                return applyAstroOptions(customStructure, options)
            default:
                return customStructure
        }
    }

    const applyNextjsOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const useTypeScript = options["Would you like to use TypeScript?"] as boolean
        const useESLint = options["Would you like to use ESLint?"] as boolean
        const useTailwind = options["Would you like to use Tailwind CSS?"] as boolean
        const useSrcDirectory = options["Would you like your code inside a `src/` directory?"] as boolean
        const useAppRouter = options["Would you like to use App Router? (recommended)"] as boolean
        const useTurbopack = options["Would you like to use Turbopack for `next dev`?"] as boolean

        // Update project name to reflect configuration
        structure.name = `nextjs-project${useTypeScript ? "-ts" : "-js"}`

        // Handle src directory structure
        if (useSrcDirectory) {
            // Move app directory inside src
            const appFolder = structure.children?.find((child: any) => child.name === "app")
            if (appFolder) {
                // Remove app from root
                structure.children = structure.children?.filter((child: any) => child.name !== "app")

                // Create src directory with app inside
                const srcFolder = {
                    id: "src-1",
                    name: "src",
                    type: "folder",
                    children: [appFolder],
                }
                structure.children?.unshift(srcFolder)
            }
        }

        // Handle App Router vs Pages Router
        if (!useAppRouter) {
            // Remove app directory and create pages directory
            structure.children = structure.children?.filter((child: any) => child.name !== "app" && child.name !== "src")

            const pagesFolder = {
                id: "pages-1",
                name: "pages",
                type: "folder",
                children: [
                    { id: "index-page-1", name: useTypeScript ? "index.tsx" : "index.js", type: "file" },
                    {
                        id: "api-folder-1",
                        name: "api",
                        type: "folder",
                        children: [{ id: "hello-api-1", name: useTypeScript ? "hello.ts" : "hello.js", type: "file" }],
                    },
                ],
            }

            if (useSrcDirectory) {
                const srcFolder = {
                    id: "src-1",
                    name: "src",
                    type: "folder",
                    children: [pagesFolder],
                }
                structure.children?.unshift(srcFolder)
            } else {
                structure.children?.unshift(pagesFolder)
            }
        }

        // Handle TypeScript configuration
        if (!useTypeScript) {
            // Remove TypeScript config and change file extensions
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")

            // Update file extensions recursively
            const updateExtensions = (item: any) => {
                if (item.type === "file") {
                    if (item.name.endsWith(".tsx")) {
                        item.name = item.name.replace(".tsx", ".jsx")
                    } else if (item.name.endsWith(".ts")) {
                        item.name = item.name.replace(".ts", ".js")
                    }
                }
                if (item.children) {
                    item.children.forEach(updateExtensions)
                }
            }
            updateExtensions(structure)
        }

        // Handle ESLint
        if (useESLint) {
            structure.children?.push({
                id: "eslint-config-1",
                name: ".eslintrc.json",
                type: "file",
            })
        }

        // Handle Tailwind CSS
        if (!useTailwind) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tailwind.config.ts")

            // Remove globals.css or update it
            const findAndUpdateGlobalsCss = (item: any) => {
                if (item.children) {
                    item.children = item.children.filter((child: any) => child.name !== "globals.css")
                    item.children.forEach(findAndUpdateGlobalsCss)
                }
            }
            findAndUpdateGlobalsCss(structure)
        } else {
            // Ensure tailwind config has correct extension
            const tailwindConfig = structure.children?.find((child: any) => child.name.startsWith("tailwind.config"))
            if (tailwindConfig) {
                tailwindConfig.name = useTypeScript ? "tailwind.config.ts" : "tailwind.config.js"
            }
        }

        // Handle Turbopack (add to package.json scripts)
        if (useTurbopack) {
            // This would typically modify package.json scripts
            // For now, we'll just add a comment or note
            structure.children?.push({
                id: "turbo-note-1",
                name: "README-turbopack.md",
                type: "file",
            })
        }

        // Update next.config file extension based on TypeScript choice
        const nextConfig = structure.children?.find((child: any) => child.name.startsWith("next.config"))
        if (nextConfig) {
            nextConfig.name = useTypeScript ? "next.config.ts" : "next.config.js"
        }

        return structure
    }

    const applyReactOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const srcFolder = structure.children?.find((child: any) => child.name === "src")
        if (srcFolder) {
            if (!options["Include components folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "components")
            }

            if (!options["Include hooks folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "hooks")
            }

            if (!options["Include utils folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "utils")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Vite config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "vite.config.ts")
        }

        if (!options["Include public folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "public")
        }

        return structure
    }

    const applyVueOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const srcFolder = structure.children?.find((child: any) => child.name === "src")
        if (srcFolder) {
            if (!options["Include components folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "components")
            }

            if (!options["Include views folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "views")
            }

            if (!options["Include composables folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "composables")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Vite config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "vite.config.ts")
        }

        if (!options["Include public folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "public")
        }

        return structure
    }

    const applyAngularOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const srcFolder = structure.children?.find((child: any) => child.name === "src")
        if (srcFolder) {
            const appFolder = srcFolder.children?.find((child: any) => child.name === "app")
            if (appFolder && !options["Include app module"]) {
                appFolder.children = appFolder.children?.filter((child: any) => child.name !== "app.module.ts")
            }

            if (!options["Include components"]) {
                appFolder.children = appFolder.children?.filter((child: any) => !child.name.includes("component"))
            }

            if (!options["Include services folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "services")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Angular config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "angular.json")
        }

        if (!options["Include assets folder"]) {
            const srcFolder = structure.children?.find((child: any) => child.name === "src")
            if (srcFolder) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "assets")
            }
        }

        return structure
    }

    const applySvelteOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const srcFolder = structure.children?.find((child: any) => child.name === "src")
        if (srcFolder) {
            if (!options["Include lib folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "lib")
            }

            if (!options["Include routes folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "routes")
            }

            if (!options["Include components"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "components")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Svelte config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "svelte.config.js")
        }

        if (!options["Include Vite config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "vite.config.js")
        }

        return structure
    }

    const applyNuxtOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        if (!options["Include pages folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "pages")
        }

        if (!options["Include components folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "components")
        }

        if (!options["Include layouts folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "layouts")
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Nuxt config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "nuxt.config.ts")
        }

        if (!options["Include public folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "public")
        }

        return structure
    }

    const applyRemixOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const appFolder = structure.children?.find((child: any) => child.name === "app")
        if (appFolder) {
            if (!options["Include routes folder"]) {
                appFolder.children = appFolder.children?.filter((child: any) => child.name !== "routes")
            }

            if (!options["Include components"]) {
                appFolder.children = appFolder.children?.filter((child: any) => child.name !== "components")
            }

            if (!options["Include utils folder"]) {
                appFolder.children = appFolder.children?.filter((child: any) => child.name !== "utils")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Remix config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "remix.config.js")
        }

        if (!options["Include public folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "public")
        }

        return structure
    }

    const applyAstroOptions = (structure: any, options: { [key: string]: boolean | string }) => {
        const srcFolder = structure.children?.find((child: any) => child.name === "src")
        if (srcFolder) {
            if (!options["Include pages folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "pages")
            }

            if (!options["Include components folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "components")
            }

            if (!options["Include layouts folder"]) {
                srcFolder.children = srcFolder.children?.filter((child: any) => child.name !== "layouts")
            }
        }

        if (!options["Include TypeScript config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "tsconfig.json")
        }

        if (!options["Include Astro config"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "astro.config.mjs")
        }

        if (!options["Include public folder"]) {
            structure.children = structure.children?.filter((child: any) => child.name !== "public")
        }

        return structure
    }

    const resetToDefaults = (framework: string) => {
        const defaultOptions = { ...frameworkOptions[framework] }

        // Reset to default values
        if (framework === "Next.js") {
            defaultOptions["Would you like to use TypeScript?"] = true
            defaultOptions["Would you like to use ESLint?"] = true
            defaultOptions["Would you like to use Tailwind CSS?"] = true
            defaultOptions["Would you like your code inside a `src/` directory?"] = false
            defaultOptions["Would you like to use App Router? (recommended)"] = true
            defaultOptions["Would you like to use Turbopack for `next dev`?"] = false
        } else {
            // For other frameworks, set all to true
            Object.keys(defaultOptions).forEach((key) => {
                if (typeof defaultOptions[key] === "boolean") {
                    defaultOptions[key] = true
                }
            })
        }

        setFrameworkOptions((prev) => ({
            ...prev,
            [framework]: defaultOptions,
        }))
    }

    // Render options content (shared between submenu and dialog)
    const renderOptionsContent = (framework: string) => (
        <div className="space-y-4">
            <div className="space-y-3">
                {Object.entries(frameworkOptions[framework] || {}).map(([option, value]) => {
                    // Regular checkbox options
                    return (
                        <div key={option} className="flex items-center space-x-3">
                            <Checkbox
                                id={`${framework}-${option}`}
                                checked={value as boolean}
                                onCheckedChange={(checkedState) => handleOptionChange(framework, option, checkedState as boolean)}
                                className="h-4 w-4"
                            />
                            <label
                                htmlFor={`${framework}-${option}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                                {option}
                            </label>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 border-t">
                <Button
                    onClick={() => handleFrameworkSelect(framework)}
                    disabled={isLoading}
                >
                    Apply Template
                </Button>

                <Button
                    onClick={() => resetToDefaults(framework)}
                    variant="outline"
                    disabled={isLoading}
                >
                    Reset to Defaults
                </Button>
            </div>
        </div>
    )

    return (
        <div className="w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                        <div className={`flex items-center ${selectedFramework?.framework ? "gap-2" : ""}`}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Code className="h-4 w-4" />}
                            <span className="hidden sm:inline">{selectedFramework?.framework || ""}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="start">
                    <DropdownMenuLabel>Choose Framework Template</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {frameworks.map((framework) => (
                        <div key={framework.name}>
                            {isMobile ? (
                                // Mobile: Use simple menu item that opens dialog
                                <DropdownMenuItem
                                    onClick={() => handleFrameworkClick(framework.name)}
                                    className="cursor-pointer flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    <Code className="h-4 w-4" />
                                    <span className="flex-1">{framework.name}</span>
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                </DropdownMenuItem>
                            ) : (
                                // Desktop: Use submenu
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer flex items-center gap-2" disabled={isLoading}>
                                        <Code className="h-4 w-4" />
                                        <span>{framework.name}</span>
                                    </DropdownMenuSubTrigger>

                                    <DropdownMenuSubContent className="w-96 max-h-96 overflow-hidden">
                                        <DropdownMenuLabel className="text-sm font-medium">{framework.name} Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <ScrollArea className="h-full">
                                            <div className="p-3 max-h-80">{renderOptionsContent(framework.name)}</div>
                                        </ScrollArea>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            )}
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Options Dialog */}
            <Dialog open={showOptionsDialog} onOpenChange={setShowOptionsDialog}>
                <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            {selectedFrameworkForOptions} Options
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Customize your {selectedFrameworkForOptions} template by selecting the options you want to include.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 py-4">
                        <ScrollArea className="h-full pr-4">
                            {selectedFrameworkForOptions && renderOptionsContent(selectedFrameworkForOptions)}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
