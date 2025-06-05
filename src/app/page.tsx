"use client"

import React from "react"
import FolderStructureBuilder from "@/components/folder-structure"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { PageSkeleton } from "@/components/folder-structure/skeleton-loader"

interface TabStructure {
    id: string
    label: string
    createdAt: number
}

const STORAGE_KEYS = {
    TABS: "project-structure-tabs",
    ACTIVE_TAB: "project-structure-active-tab",
    TAB_DATA_PREFIX: "project-structure-data-",
}

export default function Home(): React.JSX.Element {
    const [tabs, setTabs] = React.useState<TabStructure[]>([])
    const [activeTab, setActiveTab] = React.useState("")
    const [isLoaded, setIsLoaded] = React.useState(false)

    // Load data from localStorage on component mount
    React.useEffect(() => {
        try {
            const savedTabs = localStorage.getItem(STORAGE_KEYS.TABS)
            const savedActiveTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB)

            if (savedTabs) {
                const parsedTabs = JSON.parse(savedTabs)
                setTabs(parsedTabs)

                if (savedActiveTab && parsedTabs.find((tab: TabStructure) => tab.id === savedActiveTab)) {
                    setActiveTab(savedActiveTab)
                } else if (parsedTabs.length > 0) {
                    setActiveTab(parsedTabs[0].id)
                }
            } else {
                // Create default tab if no saved tabs
                const defaultTab: TabStructure = {
                    id: "folder-structure-1",
                    label: "Project Structure",
                    createdAt: Date.now(),
                }
                setTabs([defaultTab])
                setActiveTab(defaultTab.id)
            }
        } catch (error) {
            console.error("Error loading tabs from localStorage:", error)
            // Fallback to default tab
            const defaultTab: TabStructure = {
                id: "folder-structure-1",
                label: "Project Structure",
                createdAt: Date.now(),
            }
            setTabs([defaultTab])
            setActiveTab(defaultTab.id)
        }
        setIsLoaded(true)
    }, [])

    // Save tabs to localStorage whenever tabs change
    React.useEffect(() => {
        if (isLoaded && tabs.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs))
            } catch (error) {
                console.error("Error saving tabs to localStorage:", error)
            }
        }
    }, [tabs, isLoaded])

    // Save active tab to localStorage whenever it changes
    React.useEffect(() => {
        if (isLoaded && activeTab) {
            try {
                localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab)
            } catch (error) {
                console.error("Error saving active tab to localStorage:", error)
            }
        }
    }, [activeTab, isLoaded])

    const addNewTab = () => {
        const newTabId = `folder-structure-${Date.now()}`
        const newTab: TabStructure = {
            id: newTabId,
            label: `Structure ${tabs.length + 1}`,
            createdAt: Date.now(),
        }

        setTabs((prevTabs) => [...prevTabs, newTab])
        setActiveTab(newTabId)
    }

    const removeTab = (id: string) => {
        if (tabs.length <= 1) return // Don't remove the last tab

        const newTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(newTabs)

        // Remove the tab's data from localStorage
        try {
            localStorage.removeItem(`${STORAGE_KEYS.TAB_DATA_PREFIX}${id}`)
        } catch (error) {
            console.error("Error removing tab data from localStorage:", error)
        }

        // If we're removing the active tab, switch to the first tab
        if (activeTab === id) {
            setActiveTab(newTabs[0].id)
        }
    }

    // Don't render until data is loaded
    if (!isLoaded) {
        return (
            <PageSkeleton />
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-16">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-8 mt-4">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                        Project Structure Builder
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Create and visualize your project folder structures with ease. Perfect for planning and documenting your
                        project organization.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto">
                    <TooltipProvider>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <ScrollArea className="w-full whitespace-nowrap">
                                        <TabsList className="inline-flex w-max min-w-full justify-start">
                                            {tabs.map((tab) => (
                                                <div key={tab.id} className="flex items-center group">
                                                    <TabsTrigger value={tab.id} className="flex items-center gap-2 whitespace-nowrap">
                                                        <Folder className="w-4 h-4" />
                                                        {tab.label}
                                                        {tabs.length > 1 && (
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    removeTab(tab.id)
                                                                }}
                                                                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                aria-label={`Close ${tab.label}`}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" || e.key === " ") {
                                                                        e.preventDefault()
                                                                        e.stopPropagation()
                                                                        removeTab(tab.id)
                                                                    }
                                                                }}
                                                            >
                                                                &times;
                                                            </span>
                                                        )}
                                                    </TabsTrigger>
                                                </div>
                                            ))}
                                        </TabsList>
                                    </ScrollArea>
                                </div>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={addNewTab}
                                            aria-label="Add new structure"
                                            className="flex-shrink-0"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Add new structure</TooltipContent>
                                </Tooltip>
                            </div>

                            {tabs.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id}>
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-900 backdrop-blur-sm">
                                        <div className="h-[700px] relative">
                                            <FolderStructureBuilder tabId={tab.id} />
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </TooltipProvider>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Tip: Use the + button to create multiple project structures</p>
                </div>
            </div>
        </main>
    )
}
