"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { FileItem, ClipboardItem } from "@/types/interfaces"
import {
    createDefaultStructure,
    generateStructureDisplay,
    generateTreeView,
    exportStructure,
    importStructure,
    generateUniqueName,
    generateUniqueNameForNewItem,
} from "../components/folder-structure/utils"
import { useHistory } from "./use-history"

const STORAGE_KEY_PREFIX = "project-structure-data-"

export const useFolderStructure = (tabId?: string) => {
    // Core state
    const {
        state: structure,
        canUndo,
        canRedo,
        push: pushToHistory,
        undo: undoHistory,
        redo: redoHistory,
        clear: clearHistory,
    } = useHistory<FileItem>(createDefaultStructure())

    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(["root"]))
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectionOrder, setSelectionOrder] = useState<string[]>([])
    const [clipboard, setClipboard] = useState<ClipboardItem | null>(null)
    const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)
    const [selectedFramework, setSelectedFramework] = useState<string | null>(null)

    // Dialog states
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [showExportDialog, setShowExportDialog] = useState(false)
    const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)

    // Loading states
    const [isLoading, setIsLoading] = useState(true)
    const [isFrameworkLoading, setIsFrameworkLoading] = useState(false)

    // Computed values
    const structureDisplay = generateStructureDisplay(structure)
    const treeViewDisplay = generateTreeView(structure)

    // Get storage key for this tab
    const getStorageKey = useCallback(() => {
        return tabId ? `${STORAGE_KEY_PREFIX}${tabId}` : STORAGE_KEY_PREFIX + "default"
    }, [tabId])

    // Utility function to generate new IDs recursively
    const generateNewIds = useCallback((item: FileItem): FileItem => {
        const newId = `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        const newItem: FileItem = {
            ...item,
            id: newId,
            children: item.children ? item.children.map((child) => generateNewIds(child)) : undefined,
        }

        console.log(`Generated new ID for ${item.name}: ${item.id} -> ${newId}`)

        return newItem
    }, [])

    // Load data from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return

        const loadData = async () => {
            try {
                // Simulate loading time
                await new Promise((resolve) => setTimeout(resolve, 500))

                const storageKey = getStorageKey()
                const savedData = localStorage.getItem(storageKey)

                if (savedData) {
                    const parsedData = JSON.parse(savedData)

                    // Load structure
                    if (parsedData.structure) {
                        pushToHistory(parsedData.structure)
                    }

                    // Load open folders state
                    if (parsedData.openFolders && Array.isArray(parsedData.openFolders)) {
                        setOpenFolders(new Set(parsedData.openFolders))
                    }

                    // Load selected framework
                    if (parsedData.selectedFramework) {
                        setSelectedFramework(parsedData.selectedFramework)
                    }

                    // Load selection state (optional - usually we don't persist selection)
                    if (parsedData.selectedItems && Array.isArray(parsedData.selectedItems)) {
                        setSelectedItems(parsedData.selectedItems)
                    }

                    if (parsedData.selectionOrder && Array.isArray(parsedData.selectionOrder)) {
                        setSelectionOrder(parsedData.selectionOrder)
                    }
                } else {
                    console.log("No saved data found, using defaults")
                }
            } catch (error) {
                console.error("Error loading structure from localStorage:", error)
                toast.error("Failed to load saved structure")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [getStorageKey, pushToHistory])

    // Save data to localStorage - แก้ไข dependency array
    const saveToLocalStorage = useCallback(() => {
        if (typeof window === "undefined" || isLoading) return

        try {
            const storageKey = getStorageKey()
            const dataToSave = {
                structure,
                openFolders: Array.from(openFolders),
                selectedFramework,
                selectedItems,
                selectionOrder,
                lastUpdated: Date.now(),
            }

            localStorage.setItem(storageKey, JSON.stringify(dataToSave))
        } catch (error) {
            console.error("Error saving structure to localStorage:", error)
            toast.error("Failed to save structure")
        }
    }, [structure, openFolders, selectedFramework, selectedItems, selectionOrder, getStorageKey, isLoading])

    // Auto-save when structure, openFolders, or selection changes
    useEffect(() => {
        // Don't save during initial load
        if (isLoading) return

        const timeoutId = setTimeout(() => {
            saveToLocalStorage()
        }, 300) // Debounce saves

        return () => clearTimeout(timeoutId)
    }, [structure, openFolders, selectedFramework, selectedItems, selectionOrder, isLoading, saveToLocalStorage])

    // Utility functions
    const findItemById = useCallback((items: FileItem, id: string): FileItem | null => {
        if (items.id === id) return items
        if (items.children) {
            for (const child of items.children) {
                const found = findItemById(child, id)
                if (found) return found
            }
        }
        return null
    }, [])

    const findParentById = useCallback((items: FileItem, targetId: string): FileItem | null => {
        if (items.children) {
            for (const child of items.children) {
                if (child.id === targetId) {
                    return items
                }
                const found = findParentById(child, targetId)
                if (found) return found
            }
        }
        return null
    }, [])

    const updateStructure = useCallback(
        (updater: (prev: FileItem) => FileItem) => {
            const newStructure = updater(structure)
            pushToHistory(newStructure)
        },
        [structure, pushToHistory],
    )

    // Fixed selection logic to prevent duplicate entries
    const handleSelect = useCallback(
        (id: string, isMultiSelect = false) => {
            if (isMultiSelect) {
                setSelectedItems((prevSelected) => {
                    if (prevSelected.includes(id)) {
                        // Remove from selection
                        const newSelected = prevSelected.filter((item) => item !== id)

                        // Also update selection order
                        setSelectionOrder((prevOrder) => {
                            const newOrder = prevOrder.filter((itemId) => itemId !== id)
                            return newOrder
                        })

                        return newSelected
                    } else {
                        // Add to selection
                        const newSelected = [...prevSelected, id]

                        // Also update selection order
                        setSelectionOrder((prevOrder) => {
                            const newOrder = prevOrder.includes(id) ? prevOrder : [...prevOrder, id]
                            return newOrder
                        })

                        return newSelected
                    }
                })
            } else {
                // Single select - replace everything
                setSelectedItems([id])
                setSelectionOrder([id])
            }
        },
        [], // Remove dependencies to prevent stale closure
    )

    // Helper function for select all
    const selectAllItems = useCallback(() => {
        if (structure.children) {
            const allIds = structure.children.map((child) => child.id)
            setSelectedItems(allIds)
            setSelectionOrder(allIds)
        }
    }, [structure])



    // Helper function for clear selection
    const clearSelection = useCallback(() => {
        setSelectedItems([])
        setSelectionOrder([])
    }, [])

    const onAdd = useCallback(
        (parentId: string, name: string, type: "file" | "folder") => {

            let newItemId: string | null = null
            let finalName: string | null = null

            updateStructure((prev) => {
                const addToItem = (item: FileItem): FileItem => {
                    if (item.id === parentId) {
                        // Generate unique name using the CURRENT children (not stale state)
                        const uniqueName = generateUniqueNameForNewItem(item.children || [], name)

                        finalName = uniqueName

                        const newItem: FileItem = {
                            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            name: uniqueName,
                            type,
                            children: type === "folder" ? [] : undefined,
                        }

                        newItemId = newItem.id

                        const updatedItem = {
                            ...item,
                            children: [...(item.children || []), newItem],
                        }

                        return updatedItem
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.map(addToItem),
                        }
                    }
                    return item
                }
                return addToItem(prev)
            })

            if (type === "folder" && newItemId) {
                setOpenFolders((prev) => new Set([...prev, newItemId!]))
            }

            // Auto-start editing the new item
            if (newItemId) {
                setCurrentEditingId(newItemId)
            }
        },
        [updateStructure],
    )

    const onDelete = useCallback(
        (ids: string | string[]) => {
            const idsToDelete = Array.isArray(ids) ? ids : [ids]
            const itemsToDelete = idsToDelete.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (itemsToDelete.length === 0) return

            updateStructure((prev) => {
                const deleteFromItem = (item: FileItem): FileItem => {
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.filter((child) => !idsToDelete.includes(child.id)).map(deleteFromItem),
                        }
                    }
                    return item
                }
                return deleteFromItem(prev)
            })

            // Update selection state - remove deleted items
            setSelectedItems((prev) => prev.filter((selectedId) => !idsToDelete.includes(selectedId)))
            setSelectionOrder((prev) => prev.filter((selectedId) => !idsToDelete.includes(selectedId)))
            setOpenFolders((prev) => {
                const newSet = new Set(prev)
                idsToDelete.forEach((id) => newSet.delete(id))
                return newSet
            })

            const itemNames = itemsToDelete.map((item) => item.name).join(", ")
        },
        [structure, findItemById, updateStructure],
    )

    const onRename = useCallback(
        (id: string, newName: string) => {
            updateStructure((prev) => {
                const renameInItem = (item: FileItem): FileItem => {
                    if (item.id === id) {
                        return { ...item, name: newName }
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.map(renameInItem),
                        }
                    }
                    return item
                }
                return renameInItem(prev)
            })
        },
        [updateStructure],
    )

    const onCopy = useCallback(
        (ids: string | string[]) => {
            const idsToProcess = Array.isArray(ids) ? ids : [ids]
            const items = idsToProcess.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (items.length > 0) {
                setClipboard({ items, operation: "copy", timestamp: Date.now() })
                items.map((item) => item.name).join(", ")
            }
        },
        [structure, findItemById],
    )

    const onCut = useCallback(
        (ids: string | string[]) => {
            const idsToProcess = Array.isArray(ids) ? ids : [ids]
            const items = idsToProcess.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (items.length > 0) {
                setClipboard({ items, operation: "cut", timestamp: Date.now() })
                items.map((item) => item.name).join(", ")
            }
        },
        [structure, findItemById],
    )

    const onPaste = useCallback(
        (parentId: string) => {
            if (!clipboard || !clipboard.items.length) return

            updateStructure((prev) => {
                const pasteToItem = (item: FileItem): FileItem => {
                    if (item.id === parentId) {
                        // Generate new items with new IDs and unique names
                        const newItems = clipboard.items.map((clipboardItem) => {
                            // Generate unique name first
                            const uniqueName = generateUniqueNameForNewItem(item.children || [], clipboardItem.name)

                            // Generate new IDs recursively for the item and all its children
                            const itemWithNewIds = generateNewIds(clipboardItem)

                            return {
                                ...itemWithNewIds,
                                name: uniqueName,
                            }
                        })

                        return {
                            ...item,
                            children: [...(item.children || []), ...newItems],
                        }
                    }
                    if (item.children) {
                        return {
                            ...item,
                            children: item.children.map(pasteToItem),
                        }
                    }
                    return item
                }
                return pasteToItem(prev)
            })

            // For cut operation, delete original items
            if (clipboard.operation === "cut") {
                const idsToDelete = clipboard.items.map((item) => item.id)
                onDelete(idsToDelete)
            }

            const itemNames = clipboard.items.map((item) => item.name).join(", ")
            setClipboard(null)
        },
        [clipboard, updateStructure, onDelete, generateNewIds],
    )

    const onExport = useCallback(() => {
        setShowExportDialog(true)
    }, [])

    const onImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const imported = importStructure(content)
                // Generate new IDs for imported structure to avoid conflicts
                const importedWithNewIds = generateNewIds(imported)

                pushToHistory(importedWithNewIds)
                toast.success("Structure imported successfully")
            } catch (error) {
                toast.error("Failed to import structure")
            }
        }
        reader.readAsText(file)
    },
        [pushToHistory, generateNewIds],
    )

    const handleError = useCallback((message: string) => {
        toast.error(message)
    }, [])

    const handleClearStructure = useCallback(() => {
        const defaultStructure = createDefaultStructure()
        pushToHistory(defaultStructure)
        setOpenFolders(new Set(["root"]))
        setSelectedItems([])
        setSelectionOrder([])
        setClipboard(null)
        setSelectedFramework(null)
        setShowClearDialog(false)
        toast.success("Structure cleared")
    }, [pushToHistory])

    const handleExport = useCallback(
        (format: "json" | "text" | "tree" | "zip" | "directory") => {
            exportStructure(structure, format, selectedItems)
            setShowExportDialog(false)
            toast.success(`Structure exported as ${format.toUpperCase()}`)
        },
        [structure, selectedItems],
    )

    const handleFrameworkSelect = useCallback(async (newStructure: FileItem) => {
        setIsFrameworkLoading(true)
        try {
            // Simulate loading time for framework
            await new Promise((resolve) => setTimeout(resolve, 300))

            pushToHistory(newStructure)
            setSelectedFramework(newStructure.name)
            setOpenFolders(new Set(["root"]))
            setSelectedItems([])
            setSelectionOrder([])
            setClipboard(null)
        } catch (error) {
            console.error("Error applying framework structure:", error)
            toast.error("Failed to apply framework template")
        } finally {
            setIsFrameworkLoading(false)
        }
    },
        [pushToHistory],
    )

    // Keyboard shortcuts - ใช้ helper functions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't handle shortcuts while editing
            if (currentEditingId) return

            // Don't handle shortcuts if focus is on input elements
            const activeElement = document.activeElement
            if (
                activeElement &&
                (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    (activeElement as HTMLElement).contentEditable === "true")
            ) {
                return
            }

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case "c":
                        if (selectedItems.length > 0) {
                            e.preventDefault()
                            onCopy(selectedItems)
                        }
                        break
                    case "x":
                        if (selectedItems.length > 0) {
                            e.preventDefault()
                            onCut(selectedItems)
                        }
                        break
                    case "v":
                        if (clipboard && selectedItems.length === 1) {
                            const selectedItem = findItemById(structure, selectedItems[0])
                            if (selectedItem?.type === "folder") {
                                e.preventDefault()
                                onPaste(selectedItems[0])
                            }
                        }
                        break
                    case "a":
                        e.preventDefault()
                        selectAllItems()
                        break
                }
            } else if (e.key === "Delete" && selectedItems.length > 0) {
                e.preventDefault()
                onDelete(selectedItems)
            } else if (e.key === "F2" && selectedItems.length === 1) {
                e.preventDefault()
                setCurrentEditingId(selectedItems[0])
            } else if (e.key === "Escape") {
                clearSelection()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [
        selectedItems,
        clipboard,
        currentEditingId,
        structure,
        findItemById,
        onCopy,
        onCut,
        onPaste,
        onDelete,
        setCurrentEditingId,
        selectAllItems,
        clearSelection,
    ])

    // Enhanced Drag and drop handlers
    const handleDragStart = useCallback(
        (e: React.DragEvent, id: string) => {
            // If the dragged item is not selected, select it
            if (!selectedItems.includes(id)) {
                setSelectedItems([id])
                setSelectionOrder([id])
            }

            const dragData = {
                itemIds: selectedItems.includes(id) ? selectedItems : [id],
                sourceParentId: findParentById(structure, id)?.id || null,
            }

            e.dataTransfer.setData("text/plain", JSON.stringify(dragData))
            e.dataTransfer.effectAllowed = "move"
        },
        [selectedItems, findParentById, structure],
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent, targetId: string, position: "before" | "after" | "inside" = "inside") => {
            e.preventDefault()

            try {
                const dragData = JSON.parse(e.dataTransfer.getData("text/plain"))
                const { itemIds, sourceParentId } = dragData

                if (itemIds.includes(targetId)) return // Can't drop on itself

                const targetItem = findItemById(structure, targetId)
                if (!targetItem) return

                const draggedItems = itemIds.map((id: string) => findItemById(structure, id)).filter(Boolean) as FileItem[]
                if (draggedItems.length === 0) return

                let targetParentId: string
                let insertIndex = -1

                if (position === "inside" && targetItem.type === "folder") {
                    // Drop inside folder
                    targetParentId = targetId
                } else {
                    // Drop before/after item (reordering)
                    const targetParent = findParentById(structure, targetId)
                    if (!targetParent) return

                    targetParentId = targetParent.id
                    const targetIndex = targetParent.children?.findIndex((child) => child.id === targetId) ?? -1

                    if (targetIndex === -1) return

                    insertIndex = position === "before" ? targetIndex : targetIndex + 1
                }

                const targetParent = findItemById(structure, targetParentId)
                if (!targetParent || !targetParent.children) return

                // Check if moving within the same parent
                const isSameParent = sourceParentId === targetParentId

                updateStructure((prev) => {
                    let newStructure = { ...prev }

                    // Remove items from source
                    if (!isSameParent) {
                        newStructure = removeItemsFromStructure(newStructure, itemIds)
                    }

                    // Add items to target with new IDs if moving to different parent
                    newStructure = addItemsToStructure(
                        newStructure,
                        targetParentId,
                        draggedItems,
                        insertIndex,
                        isSameParent ? itemIds : [],
                        targetParent.children || [],
                        isSameParent,
                    )

                    return newStructure
                })

                // Open target folder if dropping inside
                if (position === "inside" && targetItem.type === "folder") {
                    setOpenFolders((prev) => new Set([...prev, targetId]))
                }

                draggedItems.map((item) => item.name).join(", ")
            } catch (error) {
                console.error("Drop error:", error)
                toast.error("Failed to move items")
            }
        },
        [structure, findItemById, findParentById, updateStructure],
    )

    // Helper functions for drag and drop
    const removeItemsFromStructure = useCallback((structure: FileItem, itemIds: string[]): FileItem => {
        const removeFromItem = (item: FileItem): FileItem => {
            if (item.children) {
                return {
                    ...item,
                    children: item.children.filter((child) => !itemIds.includes(child.id)).map(removeFromItem),
                }
            }
            return item
        }
        return removeFromItem(structure)
    }, [])

    const addItemsToStructure = useCallback(
        (
            structure: FileItem,
            targetParentId: string,
            draggedItems: FileItem[],
            insertIndex: number,
            excludeIds: string[],
            targetChildren: FileItem[],
            isSameParent = false,
        ): FileItem => {
            const addToItem = (item: FileItem): FileItem => {
                if (item.id === targetParentId) {
                    let newChildren = [...(item.children || [])]

                    // Remove items that are being moved within the same parent
                    if (excludeIds.length > 0) {
                        newChildren = newChildren.filter((child) => !excludeIds.includes(child.id))
                    }

                    // Create new items with appropriate names and IDs
                    const itemsToAdd = draggedItems.map((draggedItem) => {
                        const uniqueName = generateUniqueName(
                            targetChildren,
                            draggedItem.name,
                            draggedItem.name, // Pass original name
                            isSameParent, // Pass whether moving to same parent
                        )

                        // Generate new IDs only if moving to different parent
                        if (!isSameParent) {
                            const itemWithNewIds = generateNewIds(draggedItem)
                            console.log(
                                `Drag & Drop: Generated new ID for ${draggedItem.name}: ${draggedItem.id} -> ${itemWithNewIds.id}`,
                            )
                            return {
                                ...itemWithNewIds,
                                name: uniqueName,
                            }
                        } else {
                            // Same parent, keep original IDs
                            return {
                                ...draggedItem,
                                name: uniqueName,
                            }
                        }
                    })

                    if (insertIndex >= 0 && insertIndex <= newChildren.length) {
                        // Insert at specific position
                        newChildren.splice(insertIndex, 0, ...itemsToAdd)
                    } else {
                        // Add to end
                        newChildren.push(...itemsToAdd)
                    }

                    return {
                        ...item,
                        children: newChildren,
                    }
                }
                if (item.children) {
                    return {
                        ...item,
                        children: item.children.map(addToItem),
                    }
                }
                return item
            }
            return addToItem(structure)
        },
        [generateNewIds],
    )

    const onUndo = useCallback(() => {
        if (canUndo) {
            undoHistory()
        }
    }, [canUndo, undoHistory])

    const onRedo = useCallback(() => {
        if (canRedo) {
            redoHistory()
        }
    }, [canRedo, redoHistory])

    return {
        // State
        structure,
        openFolders,
        selectedItems,
        selectionOrder,
        clipboard,
        currentEditingId,
        structureDisplay,
        treeViewDisplay,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
        selectedFramework,
        isLoading,
        isFrameworkLoading,
        canUndo,
        canRedo,

        // Setters
        setOpenFolders,
        setCurrentEditingId,
        setShowClearDialog,
        setShowExportDialog,
        setShowShortcutsDialog,

        // Handlers
        onCopy,
        onCut,
        onDelete,
        onPaste,
        onAdd,
        handleSelect,
        onRename,
        onExport,
        onImport,
        handleError,
        handleClearStructure,
        handleExport,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleFrameworkSelect,
        clearSelection,
        selectAllItems,
        onUndo,
        onRedo,
    }
}
