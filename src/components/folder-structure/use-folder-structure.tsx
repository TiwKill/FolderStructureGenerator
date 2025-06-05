"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { FileItem, ClipboardItem } from "@/types/interfaces"
import {
    createDefaultStructure,
    generateStructureDisplay,
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
    const [clipboard, setClipboard] = useState<ClipboardItem | null>(null)
    const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)
    const [selectedFramework, setSelectedFramework] = useState<string | null>(null)

    // Dialog states
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [showExportDialog, setShowExportDialog] = useState(false)
    const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)

    // Computed values
    const structureDisplay = generateStructureDisplay(structure)

    // Get storage key for this tab
    const getStorageKey = useCallback(() => {
        return tabId ? `${STORAGE_KEY_PREFIX}${tabId}` : STORAGE_KEY_PREFIX + "default"
    }, [tabId])

    // Load data from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return

        try {
            const storageKey = getStorageKey()
            const savedData = localStorage.getItem(storageKey)

            if (savedData) {
                const parsedData = JSON.parse(savedData)
                if (parsedData.structure) {
                    setStructure(parsedData.structure)
                }
                if (parsedData.openFolders && Array.isArray(parsedData.openFolders)) {
                    setOpenFolders(new Set(parsedData.openFolders))
                }
                if (parsedData.selectedFramework) {
                    setSelectedFramework(parsedData.selectedFramework)
                }
            }
        } catch (error) {
            console.error("Error loading structure from localStorage:", error)
            toast.error("Failed to load saved structure")
        }
    }, [getStorageKey])

    // Save data to localStorage
    const saveToLocalStorage = useCallback(() => {
        if (typeof window === "undefined") return

        try {
            const storageKey = getStorageKey()
            const dataToSave = {
                structure,
                openFolders: Array.from(openFolders),
                selectedFramework,
                lastUpdated: Date.now(),
            }
            localStorage.setItem(storageKey, JSON.stringify(dataToSave))
        } catch (error) {
            console.error("Error saving structure to localStorage:", error)
            toast.error("Failed to save structure")
        }
    }, [structure, openFolders, selectedFramework, getStorageKey])

    // Auto-save when structure or openFolders changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveToLocalStorage()
        }, 300) // Debounce saves

        return () => clearTimeout(timeoutId)
    }, [saveToLocalStorage])

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

    // Event handlers
    const handleSelect = useCallback((id: string, isMultiSelect = false) => {
        setSelectedItems((prev) => {
            if (isMultiSelect) {
                return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            }
            return [id]
        })
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

            setSelectedItems((prev) => prev.filter((selectedId) => !idsToDelete.includes(selectedId)))
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
                setClipboard({ item: items[0], operation: "copy" }) // For now, handle single item
                const itemNames = items.map((item) => item.name).join(", ")
            }
        },
        [structure, findItemById],
    )

    const onCut = useCallback(
        (ids: string | string[]) => {
            const idsToProcess = Array.isArray(ids) ? ids : [ids]
            const items = idsToProcess.map((id) => findItemById(structure, id)).filter(Boolean) as FileItem[]

            if (items.length > 0) {
                setClipboard({ item: items[0], operation: "cut" }) // For now, handle single item
                const itemNames = items.map((item) => item.name).join(", ")
            }
        },
        [structure, findItemById],
    )

    const onPaste = useCallback(
        (parentId: string) => {
            if (!clipboard) return

            updateStructure((prev) => {
                const pasteToItem = (item: FileItem): FileItem => {
                    if (item.id === parentId) {
                        // Generate unique name using current children
                        const uniqueName = generateUniqueNameForNewItem(item.children || [], clipboard.item.name)

                        const newItem: FileItem = {
                            ...clipboard.item,
                            id: `${clipboard.item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            name: uniqueName,
                        }

                        return {
                            ...item,
                            children: [...(item.children || []), newItem],
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
                onDelete(clipboard.item.id)
            }

            setClipboard(null)
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
        setClipboard(null)
        setSelectedFramework(null)
        setShowClearDialog(false)
        toast.success("Structure cleared")
    }, [])

    const handleExport = useCallback(
        (format: "json" | "text") => {
            exportStructure(structure, format)
            setShowExportDialog(false)
            toast.success(`Structure exported as ${format.toUpperCase()}`)
        },
        [structure],
    )

    const handleFrameworkSelect = useCallback((newStructure: FileItem) => {
        try {
            setStructure(newStructure)
            setSelectedFramework(newStructure.name)
            setOpenFolders(new Set(["root"]))
            setSelectedItems([])
            setClipboard(null)
        } catch (error) {
            console.error("Error applying framework structure:", error)
            toast.error("Failed to apply framework template")
        }
    }, [])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentEditingId) return // Don't handle shortcuts while editing

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
                        // Select all items at root level
                        if (structure.children) {
                            setSelectedItems(structure.children.map((child) => child.id))
                        }
                        break
                }
            } else if (e.key === "Delete" && selectedItems.length > 0) {
                e.preventDefault()
                onDelete(selectedItems)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedItems, clipboard, currentEditingId, structure, findItemById, onCopy, onCut, onPaste, onDelete])

    // Enhanced Drag and drop handlers
    const handleDragStart = useCallback(
        (e: React.DragEvent, id: string) => {
            // If the dragged item is not selected, select it
            if (!selectedItems.includes(id)) {
                setSelectedItems([id])
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
        clipboard,
        currentEditingId,
        structureDisplay,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
        selectedFramework,

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
    }
}
