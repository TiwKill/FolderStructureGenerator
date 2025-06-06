"use client"

import React from "react"
import FolderStructureBuilder from "@/components/folder-structure"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Folder, GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { PageSkeleton } from "@/components/folder-structure/skeleton-loader"
import { Input } from "@/components/ui/input"

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
    const [editingTabId, setEditingTabId] = React.useState<string | null>(null)
    const [editingTabName, setEditingTabName] = React.useState("")
    const [draggedTabId, setDraggedTabId] = React.useState<string | null>(null)
    const [dragOverTabId, setDragOverTabId] = React.useState<string | null>(null)
    const editInputRef = React.useRef<HTMLInputElement>(null)

    // Load data from localStorage on component mount
    React.useEffect(() => {
        const loadData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 800))

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
                const defaultTab: TabStructure = {
                    id: "folder-structure-1",
                    label: "Project Structure",
                    createdAt: Date.now(),
                }
                setTabs([defaultTab])
                setActiveTab(defaultTab.id)
            }
            setIsLoaded(true)
        }

        loadData()
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

    // Focus input when editing tab name
    React.useEffect(() => {
        if (editingTabId && editInputRef.current) {
            editInputRef.current.focus()
            editInputRef.current.select()
        }
    }, [editingTabId])

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
        if (tabs.length <= 1) return

        const newTabs = tabs.filter((tab) => tab.id !== id)
        setTabs(newTabs)

        try {
            localStorage.removeItem(`${STORAGE_KEYS.TAB_DATA_PREFIX}${id}`)
        } catch (error) {
            console.error("Error removing tab data from localStorage:", error)
        }

        if (activeTab === id) {
            setActiveTab(newTabs[0].id)
        }
    }

    const startEditingTab = (id: string) => {
        const tab = tabs.find((tab) => tab.id === id)
        if (tab) {
            setEditingTabId(id)
            setEditingTabName(tab.label)
        }
    }

    const saveTabName = () => {
        if (!editingTabId) return

        const trimmedName = editingTabName.trim()
        if (trimmedName === "") {
            setEditingTabName(tabs.find((tab) => tab.id === editingTabId)?.label || "")
            setEditingTabId(null)
            return
        }

        setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === editingTabId ? { ...tab, label: trimmedName } : tab)))
        setEditingTabId(null)
    }

    const handleTabDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        setDraggedTabId(id)
        e.dataTransfer.effectAllowed = "move"
        // Add some transparency to the dragged element
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "0.4"
        }
        // Required for Firefox
        e.dataTransfer.setData("text/plain", id)
    }

    const handleTabDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDraggedTabId(null)
        setDragOverTabId(null)
        // Reset opacity
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "1"
        }
    }

    const handleTabDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.preventDefault()
        if (draggedTabId === id) return
        setDragOverTabId(id)
    }

    const handleTabDragLeave = () => {
        setDragOverTabId(null)
    }

    const handleTabDrop = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        e.preventDefault()
        if (!draggedTabId || draggedTabId === id) return

        setTabs((prevTabs) => {
            const draggedTabIndex = prevTabs.findIndex((tab) => tab.id === draggedTabId)
            const dropTargetIndex = prevTabs.findIndex((tab) => tab.id === id)

            if (draggedTabIndex === -1 || dropTargetIndex === -1) return prevTabs

            const newTabs = [...prevTabs]
            const [draggedTab] = newTabs.splice(draggedTabIndex, 1)
            newTabs.splice(dropTargetIndex, 0, draggedTab)

            return newTabs
        })

        setDraggedTabId(null)
        setDragOverTabId(null)
    }

    if (!isLoaded) {
        return <PageSkeleton />
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
                                                <div
                                                    key={tab.id}
                                                    className={`flex items-center group relative ${dragOverTabId === tab.id ? "border-2 border-dashed border-blue-500 rounded-md" : ""
                                                        }`}
                                                    draggable
                                                    onDragStart={(e) => handleTabDragStart(e, tab.id)}
                                                    onDragEnd={handleTabDragEnd}
                                                    onDragOver={(e) => handleTabDragOver(e, tab.id)}
                                                    onDragLeave={handleTabDragLeave}
                                                    onDrop={(e) => handleTabDrop(e, tab.id)}
                                                >
                                                    <TabsTrigger
                                                        value={tab.id}
                                                        className="flex items-center gap-2 whitespace-nowrap"
                                                        onClick={(e) => {
                                                            // Prevent triggering tab change when clicking on edit input
                                                            if (editingTabId === tab.id) {
                                                                e.preventDefault()
                                                            }
                                                        }}
                                                    >
                                                        <span
                                                            className="cursor-grab hover:cursor-grabbing touch-none mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onMouseDown={(e) => e.stopPropagation()}
                                                        >
                                                            <GripHorizontal className="w-3 h-3 text-gray-400" />
                                                        </span>

                                                        <Folder className="w-4 h-4" />

                                                        {editingTabId === tab.id ? (
                                                            <Input
                                                                ref={editInputRef}
                                                                value={editingTabName}
                                                                onChange={(e) => setEditingTabName(e.target.value)}
                                                                onBlur={saveTabName}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        saveTabName()
                                                                    } else if (e.key === "Escape") {
                                                                        setEditingTabId(null)
                                                                    }
                                                                    e.stopPropagation()
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="h-6 px-1 py-0 text-sm w-24 min-w-0"
                                                            />
                                                        ) : (
                                                            <span
                                                                onDoubleClick={(e) => {
                                                                    e.stopPropagation()
                                                                    startEditingTab(tab.id)
                                                                }}
                                                                className="cursor-text"
                                                            >
                                                                {tab.label}
                                                            </span>
                                                        )}

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
                    <p>Tip: Double-click on tab name to rename it, or drag tabs to reorder them</p>
                </div>
            </div>
        </main>
    )
}
