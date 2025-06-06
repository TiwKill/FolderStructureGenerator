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
} from "./utils"

const STORAGE_KEY_PREFIX = "project-structure-data-"

export const useFolderStructure = (tabId?: string) => {
    // Core state
    const [structure, setStructure] = useState<FileItem>(createDefaultStructure())
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

    // Get storage key for this tab
    const getStorageKey = useCallback(() => {
        return tabId ? `${STORAGE_KEY_PREFIX}${tabId}` : STORAGE_KEY_PREFIX + "default"
    }, [tabId])

    // Load data from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return

        const loadData = async () => {
            try {
                // Simulate loading time
                await new Promise((resolve) => setTimeout(resolve, 500))

                const storageKey = getStorageKey()
                const savedData = localStorage.getItem(storageKey)

                console.log("Loading from localStorage:", { storageKey, hasData: !!savedData })

                if (savedData) {
                    const parsedData = JSON.parse(savedData)

                    console.log("Parsed data:", {
                        hasStructure: !!parsedData.structure,
                        openFoldersCount: parsedData.openFolders?.length || 0,
                        selectedItemsCount: parsedData.selectedItems?.length || 0,
                        selectionOrderCount: parsedData.selectionOrder?.length || 0,
                        framework: parsedData.selectedFramework,
                    })

                    // Load structure
                    if (parsedData.structure) {
                        setStructure(parsedData.structure)
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
    }, [getStorageKey])

    // Save data to localStorage - แก้ไข dependency array
    const saveToLocalStorage = useCallback(() => {
        if (typeof window === "undefined" || isLoading) return

        try {
            const storageKey = getStorageKey()
            const dataToSave = {
                structure,
                openFolders: Array.from(openFolders),
                selectedFramework,
                selectedItems, // Save selection state
                selectionOrder, // Save selection order
                lastUpdated: Date.now(),
            }

            console.log("Saving to localStorage:", {
                storageKey,
                dataSize: JSON.stringify(dataToSave).length,
                openFoldersCount: dataToSave.openFolders.length,
                selectedItemsCount: dataToSave.selectedItems.length,
                selectionOrderCount: dataToSave.selectionOrder.length,
            })

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

    const updateStructure = useCallback((updater: (prev: FileItem) => FileItem) => {
        setStructure(updater)
    }, [])

    // Fixed selection logic to prevent duplicate entries
    const handleSelect = useCallback(
        (id: string, isMultiSelect = false) => {
            console.log("handleSelect called:", {
                id,
                isMultiSelect,
                currentSelected: selectedItems,
                currentOrder: selectionOrder,
            })

            if (isMultiSelect) {
                setSelectedItems((prevSelected) => {
                    if (prevSelected.includes(id)) {
                        // Remove from selection
                        const newSelected = prevSelected.filter((item) => item !== id)
                        console.log("Removing from selected:", { id, newSelected })

                        // Also update selection order
                        setSelectionOrder((prevOrder) => {
                            const newOrder = prevOrder.filter((itemId) => itemId !== id)
                            console.log("Removing from order:", { id, newOrder })
                            return newOrder
                        })

                        return newSelected
                    } else {
                        // Add to selection
                        const newSelected = [...prevSelected, id]
                        console.log("Adding to selected:", { id, newSelected })

                        // Also update selection order
                        setSelectionOrder((prevOrder) => {
                            const newOrder = prevOrder.includes(id) ? prevOrder : [...prevOrder, id]
                            console.log("Adding to order:", { id, newOrder })
                            return newOrder
                        })

                        return newSelected
                    }
                })
            } else {
                // Single select - replace everything
                console.log("Single select:", { id })
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
            console.log("Select all items:", allIds)
        }
    }, [structure])

    // Helper function for clear selection
    const clearSelection = useCallback(() => {
        setSelectedItems([])
        setSelectionOrder([])
    }, [])

    const onAdd = useCallback(
        (parentId: string, name: string, type: "file" | "folder") => {
            console.log("onAdd called with:", { parentId, name, type })

            let newItemId: string | null = null
            let finalName: string | null = null

            updateStructure((prev) => {
                const addToItem = (item: FileItem): FileItem => {
                    if (item.id === parentId) {
                        console.log(
                            "Found parent:",
                            item.name,
                            "with children:",
                            item.children?.map((c) => c.name),
                        )

                        // Generate unique name using the CURRENT children (not stale state)
                        const uniqueName = generateUniqueNameForNewItem(item.children || [], name)
                        console.log("Generated unique name:", uniqueName)

                        finalName = uniqueName

                        const newItem: FileItem = {
                            id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            name: uniqueName,
                            type,
                            children: type === "folder" ? [] : undefined,
                        }

                        newItemId = newItem.id
                        console.log("Creating new item:", newItem)

                        const updatedItem = {
                            ...item,
                            children: [...(item.children || []), newItem],
                        }

                        console.log(
                            "Updated parent children:",
                            updatedItem.children?.map((c) => c.name),
                        )
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

            if (finalName) {
                toast.success(`${type === "folder" ? "Folder" : "File"} "${finalName}" created`)
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
            toast.success(`Deleted: ${itemNames}`)
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

            toast.success(`Renamed to "${newName}"`)
        },
        [updateStructure],
    )

    const onCopy = useCallback(
        (ids: string | string[]) => {
            const idsToProcess = Array.isArray(ids) ? ids : [ids]
            const items = idsToProcess.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (items.length > 0) {
                setClipboard({ items, operation: "copy" })
                const itemNames = items.map((item) => item.name).join(", ")
                toast.success(`Copied: ${itemNames}`)
            }
        },
        [structure, findItemById],
    )

    const onCut = useCallback(
        (ids: string | string[]) => {
            const idsToProcess = Array.isArray(ids) ? ids : [ids]
            const items = idsToProcess.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (items.length > 0) {
                setClipboard({ items, operation: "cut" })
                const itemNames = items.map((item) => item.name).join(", ")
                toast.success(`Cut: ${itemNames}`)
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
                        const newItems = clipboard.items.map((clipboardItem) => {
                            const uniqueName = generateUniqueNameForNewItem(item.children || [], clipboardItem.name)
                            return {
                                ...clipboardItem,
                                id: `${clipboardItem.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

            if (clipboard.operation === "cut") {
                const idsToDelete = clipboard.items.map((item) => item.id)
                onDelete(idsToDelete)
            }

            const itemNames = clipboard.items.map((item) => item.name).join(", ")
            setClipboard(null)
            toast.success(`Pasted: ${itemNames}`)
        },
        [clipboard, updateStructure, onDelete],
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
                setStructure(imported)
                toast.success("Structure imported successfully")
            } catch (error) {
                toast.error("Failed to import structure")
            }
        }
        reader.readAsText(file)
    }, [])

    const handleError = useCallback((message: string) => {
        toast.error(message)
    }, [])

    const handleClearStructure = useCallback(() => {
        setStructure(createDefaultStructure())
        setOpenFolders(new Set(["root"]))
        setSelectedItems([])
        setSelectionOrder([])
        setClipboard(null)
        setSelectedFramework(null)
        setShowClearDialog(false)
        toast.success("Structure cleared")
    }, [])

    const handleExport = useCallback(
        (format: "json" | "text" | "tree") => {
            exportStructure(structure, format)
            setShowExportDialog(false)
            toast.success(`Structure exported as ${format.toUpperCase()}`)
        },
        [structure],
    )

    const handleFrameworkSelect = useCallback(async (newStructure: FileItem) => {
        setIsFrameworkLoading(true)
        try {
            // Simulate loading time for framework
            await new Promise((resolve) => setTimeout(resolve, 300))

            setStructure(newStructure)
            setSelectedFramework(newStructure.name)
            setOpenFolders(new Set(["root"]))
            setSelectedItems([])
            setSelectionOrder([])
            setClipboard(null)
            toast.success(`${newStructure.name} template applied successfully`)
        } catch (error) {
            console.error("Error applying framework structure:", error)
            toast.error("Failed to apply framework template")
        } finally {
            setIsFrameworkLoading(false)
        }
    }, [])

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

            console.log("Keyboard shortcut:", { key: e.key, ctrl: e.ctrlKey, meta: e.metaKey })

            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case "c":
                        if (selectedItems.length > 0) {
                            e.preventDefault()
                            console.log("Copy shortcut triggered")
                            onCopy(selectedItems)
                        }
                        break
                    case "x":
                        if (selectedItems.length > 0) {
                            e.preventDefault()
                            console.log("Cut shortcut triggered")
                            onCut(selectedItems)
                        }
                        break
                    case "v":
                        if (clipboard && selectedItems.length === 1) {
                            const selectedItem = findItemById(structure, selectedItems[0])
                            if (selectedItem?.type === "folder") {
                                e.preventDefault()
                                console.log("Paste shortcut triggered")
                                onPaste(selectedItems[0])
                            }
                        }
                        break
                    case "a":
                        e.preventDefault()
                        console.log("Select all shortcut triggered")
                        selectAllItems()
                        break
                }
            } else if (e.key === "Delete" && selectedItems.length > 0) {
                e.preventDefault()
                console.log("Delete shortcut triggered")
                onDelete(selectedItems)
            } else if (e.key === "F2" && selectedItems.length === 1) {
                e.preventDefault()
                console.log("Rename shortcut triggered")
                setCurrentEditingId(selectedItems[0])
            } else if (e.key === "Escape") {
                console.log("Escape shortcut triggered")
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

                    // Add items to target
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

                const itemNames = draggedItems.map((item) => item.name).join(", ")
                if (isSameParent && position !== "inside") {
                    toast.success(`Reordered: ${itemNames}`)
                } else {
                    toast.success(`Moved ${itemNames} to "${targetItem.name}"`)
                }
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

                    // Create new items with appropriate names
                    const itemsToAdd = draggedItems.map((draggedItem) => ({
                        ...draggedItem,
                        id: `${draggedItem.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: generateUniqueName(
                            targetChildren,
                            draggedItem.name,
                            draggedItem.name, // Pass original name
                            isSameParent, // Pass whether moving to same parent
                        ),
                    }))

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
        [],
    )

    return {
        // State
        structure,
        openFolders,
        selectedItems,
        selectionOrder,
        clipboard,
        currentEditingId,
        structureDisplay,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
        selectedFramework,
        isLoading,
        isFrameworkLoading,

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
        selectAllItems, // เพิ่ม helper function
    }
}
