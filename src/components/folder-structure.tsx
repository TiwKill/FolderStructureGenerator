"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import {
    Keyboard
} from "lucide-react"
import FileFolder from './folder-structure/file-folder'
import { formatStructureForDisplay, formatTreeStructure, deepCloneItem } from './folder-structure/utils'
import ProfileCard from './folder-structure/profile-card'
import { ModeToggle } from './mode-toggle'
import { ClearDialog, ExportDialog, ShortcutsDialog } from './folder-structure/dialogs'
import { FileFolderItem } from '@/types/folder-structure'
import { INITIAL_STRUCTURE } from './folder-structure/constants'

const FolderStructureBuilder: React.FC = () => {
    const [structure, setStructure] = useState<FileFolderItem>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('folderStructure')
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (e) {
                    console.error('Failed to parse saved structure:', e)
                }
            }
        }
        return INITIAL_STRUCTURE
    })

    const [openFolders, setOpenFolders] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('openFolders')
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (e) {
                    console.error('Failed to parse saved open folders:', e)
                    return []
                }
            }
        }
        return []
    })

    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null)
    const [clipboard, setClipboard] = useState<FileFolderItem | null>(null)
    const [clipboardType, setClipboardType] = useState<'copy' | 'cut' | null>(null)
    const [currentEditingId, setCurrentEditingId] = useState<string | null>(null)
    const [structureDisplay, setStructureDisplay] = useState<string>('')
    const [showClearDialog, setShowClearDialog] = useState<boolean>(false)
    const [showExportDialog, setShowExportDialog] = useState<boolean>(false)
    const [currentExportItem, setCurrentExportItem] = useState<FileFolderItem | null>(null)
    const [showShortcutsDialog, setShowShortcutsDialog] = useState<boolean>(false)
    const [draggedItem, setDraggedItem] = useState<FileFolderItem | null>(null)
    const [draggedItemParentId, setDraggedItemParentId] = useState<string | null>(null)

    // Find Item
    const findItem = useCallback(
        (id: string, items: FileFolderItem[] = [structure]): FileFolderItem | null => {
            for (const item of items) {
                if (item.id === id) return item
                if (item.children) {
                    const found = findItem(id, item.children)
                    if (found) return found
                }
            }
            return null
        },
        [structure]
    )

    // Find Parent
    const findParent = useCallback(
        (id: string, items: FileFolderItem[] = [structure]): FileFolderItem | null => {
            for (const item of items) {
                if (item.children) {
                    if (item.children.some((child) => child.id === id)) return item
                    const found = findParent(id, item.children)
                    if (found) return found
                }
            }
            return null
        },
        [structure]
    )

    // Check Duplicate Name
    const checkDuplicateName = useCallback((parentId: string, name: string, excludeId: string | null = null): boolean => {
        const parent = findItem(parentId)
        if (!parent || !parent.children) return false

        return parent.children.some(child =>
            child.id !== excludeId &&
            child.name.toLowerCase() === name.toLowerCase()
        )
    }, [findItem])

    // Copy
    const onCopy = useCallback((id: string) => {
        const item = findItem(id)
        if (item) {
            setClipboard(deepCloneItem(item))
            setClipboardType('copy')
            toast.success(`Copied ${item.type}: ${item.name}`)
        }
    }, [findItem])

    // Cut
    const onCut = useCallback((id: string) => {
        if (id === 'root') {
            toast.error('Cannot cut the root folder')
            return
        }
        const item = findItem(id)
        if (item) {
            setClipboard(deepCloneItem(item))
            setClipboardType('cut')
            toast.success(`Cut ${item.type}: ${item.name}`)
        }
    }, [findItem])

    // Delete
    const onDelete = useCallback((id: string) => {
        if (id === 'root') {
            toast.error('Cannot delete the root folder')
            return
        }

        const item = findItem(id)
        if (!item) return

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const parent = findParent(id, [newStructure])

            if (parent) {
                parent.children = parent.children?.filter(child => child.id !== id) || []
            }

            return newStructure
        })

        // Clear selection if the deleted item was selected
        setSelectedItems(prev => prev.filter(itemId => itemId !== id))
        setLastSelectedItem(null)

        toast.success(`Deleted ${item.type}: ${item.name}`)
    }, [findItem, findParent])

    // Paste
    const onPaste = useCallback((targetId: string) => {
        if (!clipboard || !clipboardType) {
            toast.error('Nothing to paste')
            return
        }

        const targetFolder = findItem(targetId)
        if (!targetFolder || targetFolder.type !== 'folder') {
            toast.error('Can only paste into folders')
            return
        }

        // Check for duplicate names
        if (checkDuplicateName(targetId, clipboard.name)) {
            toast.error('An item with this name already exists in the target folder')
            return
        }

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const target = findItem(targetId, [newStructure])

            if (!target || target.type !== 'folder') return prev

            if (!target.children) target.children = []

            // For copy operation, create a new item with a new ID
            if (clipboardType === 'copy') {
                const newItem = deepCloneItem(clipboard)
                newItem.id = crypto.randomUUID()
                if (newItem.children) {
                    const updateIds = (item: FileFolderItem) => {
                        item.id = crypto.randomUUID()
                        if (item.children) {
                            item.children.forEach(updateIds)
                        }
                    }
                    updateIds(newItem)
                }
                target.children.push(newItem)
            }
            // For cut operation, move the item
            else if (clipboardType === 'cut') {
                const sourceParent = findParent(clipboard.id, [newStructure])
                if (sourceParent) {
                    sourceParent.children = sourceParent.children?.filter(child => child.id !== clipboard.id) || []
                }
                target.children.push(clipboard)
            }

            return newStructure
        })

        if (clipboardType === 'cut') {
            setClipboard(null)
            setClipboardType(null)
        }

        toast.success(`Pasted ${clipboard.type}: ${clipboard.name}`)
    }, [clipboard, clipboardType, findItem, findParent, checkDuplicateName])

    // Add
    const onAdd = useCallback((parentId: string, type: 'file' | 'folder') => {
        const parent = findItem(parentId)
        if (!parent || parent.type !== 'folder') {
            toast.error('Can only create items inside folders')
            return
        }

        // Generate a default name
        const baseName = type === 'folder' ? 'New Folder' : 'New File'
        let newName = baseName
        let counter = 1

        // Find a unique name
        while (checkDuplicateName(parentId, newName)) {
            newName = `${baseName} (${counter})`
            counter++
        }

        const newItem: FileFolderItem = {
            id: crypto.randomUUID(),
            name: newName,
            type,
            children: type === 'folder' ? [] : undefined,
            size: type === 'file' ? 0 : undefined
        }

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const targetParent = findItem(parentId, [newStructure])

            if (targetParent && targetParent.type === 'folder') {
                if (!targetParent.children) targetParent.children = []
                targetParent.children.push(newItem)
            }

            return newStructure
        })

        // Open the parent folder if it's not already open
        if (!openFolders.includes(parentId)) {
            setOpenFolders(prev => [...prev, parentId])
        }

        // Select and start editing the new item
        setSelectedItems([newItem.id])
        setLastSelectedItem(newItem.id)
        setCurrentEditingId(newItem.id)

    }, [findItem, checkDuplicateName, openFolders])

    // Keyboard Shortcuts
    const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
        // Only handle shortcuts when no input is focused
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return
        }

        // Handle Ctrl/Cmd + C (Copy)
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                onCopy(selectedItems[0])
            }
        }
        // Handle Ctrl/Cmd + X (Cut)
        else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                onCut(selectedItems[0])
            }
        }
        // Handle Ctrl/Cmd + V (Paste)
        else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                const selectedItem = findItem(selectedItems[0])
                if (selectedItem?.type === 'folder') {
                    onPaste(selectedItem.id)
                }
            }
        }
        // Handle Delete key
        else if (e.key === 'Delete') {
            e.preventDefault()
            if (selectedItems.length > 0) {
                // Delete all selected items
                selectedItems.forEach(id => {
                    if (id !== 'root') {
                        onDelete(id)
                    }
                })
            }
        }
        // Handle Ctrl/Cmd + N (New File)
        else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                const selectedItem = findItem(selectedItems[0])
                if (selectedItem?.type === 'folder') {
                    onAdd(selectedItem.id, 'file')
                }
            }
        }
        // Handle Ctrl/Cmd + Shift + N (New Folder)
        else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                const selectedItem = findItem(selectedItems[0])
                if (selectedItem?.type === 'folder') {
                    onAdd(selectedItem.id, 'folder')
                }
            }
        }
        // Handle F2 (Rename)
        else if (e.key === 'F2') {
            e.preventDefault()
            if (selectedItems.length === 1) {
                setCurrentEditingId(selectedItems[0])
            }
        }
    }, [selectedItems, onCopy, onCut, onPaste, onDelete, onAdd, findItem])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcuts)
        return () => window.removeEventListener('keydown', handleKeyboardShortcuts)
    }, [handleKeyboardShortcuts])

    // Save to localStorage whenever structure changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('folderStructure', JSON.stringify(structure))
            // Update the structure display
            const formatted = formatStructureForDisplay(structure)
            setStructureDisplay(formatted)
        }
    }, [structure])

    // Save openFolders to localStorage when it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('openFolders', JSON.stringify(openFolders))
        }
    }, [openFolders])

    // Select
    const handleSelect = (id: string, mode: 'single' | 'toggle' | 'range') => {
        if (mode === 'single') {
            setSelectedItems([id])
            setLastSelectedItem(id)
        } else if (mode === 'toggle') {
            setSelectedItems(prev =>
                prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
            )
            setLastSelectedItem(id)
        } else if (mode === 'range' && lastSelectedItem) {
            const allItems = getAllItems()
            const currentIndex = allItems.indexOf(id)
            const lastIndex = allItems.indexOf(lastSelectedItem)
            const start = Math.min(currentIndex, lastIndex)
            const end = Math.max(currentIndex, lastIndex)
            const itemsInRange = allItems.slice(start, end + 1)
            setSelectedItems(itemsInRange)
        }
    }

    // Rename
    const onRename = (id: string, newName: string) => {
        const item = findItem(id)
        if (!item) return

        const parentId = findParent(id)?.id
        if (!parentId) return

        // Check for duplicate names in the same folder
        if (checkDuplicateName(parentId, newName, id)) {
            toast.error(`A file or folder with the name "${newName}" already exists in this folder`)
            return
        }

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const item = findItem(id, [newStructure])
            if (item) {
                item.name = newName
            }
            return newStructure
        })
    }

    // Export
    const onExport = (id: string) => {
        const item = findItem(id)
        if (!item) return

        // Create export menu using Dialog
        setShowExportDialog(true)
        setCurrentExportItem(item)
    }

    // Handle Export
    const handleExport = (format: 'tree' | 'json') => {
        if (!currentExportItem) return

        if (format === 'tree') {
            // Export as tree structure (.txt)
            const treeStructure = formatTreeStructure(currentExportItem)
            const blob = new Blob([treeStructure], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${currentExportItem.name}-structure.txt`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } else if (format === 'json') {
            // Export as JSON
            const data = JSON.stringify(currentExportItem, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${currentExportItem.name}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }

        setShowExportDialog(false)
    }

    // Import
    const onImport = (id: string) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement
            const file = target.files?.[0]
            if (!file) return

            try {
                const text = await file.text()
                const importedData = JSON.parse(text) as FileFolderItem

                setStructure(prev => {
                    const newStructure = JSON.parse(JSON.stringify(prev))
                    const parent = findItem(id, [newStructure])
                    if (parent && parent.type === 'folder') {
                        if (!parent.children) parent.children = []
                        parent.children.push({
                            ...importedData,
                            id: `${importedData.type}-${Date.now()}`
                        })
                    }
                    return newStructure
                })
            } catch (error) {
                console.error('Error importing file:', error)
            }
        }
        input.click()
    }

    // Handle Error
    const handleError = (message: string) => {
        toast.error(message)
    }

    // Clear Structure
    const handleClearStructure = () => {
        setStructure(INITIAL_STRUCTURE)
        localStorage.removeItem('folderStructure')
        toast.success('Structure cleared successfully')
        setShowClearDialog(false)
    }

    // Get All Items
    const getAllItems = useCallback((items: FileFolderItem[] = [structure]): string[] => {
        let result: string[] = []
        for (const item of items) {
            result.push(item.id)
            if (item.children) {
                result = result.concat(getAllItems(item.children))
            }
        }
        return result
    }, [structure])

    // Drag Start
    const handleDragStart = (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => {
        e.stopPropagation()
        setDraggedItem(item)
        setDraggedItemParentId(parentId)
        e.dataTransfer.setData('text/plain', item.id)
        e.dataTransfer.effectAllowed = 'move'
    }

    // Drag Over
    const handleDragOver = (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!draggedItem) return
        
        // Prevent dropping onto itself or its descendants
        if (item.id === draggedItem.id || isDescendant(item, draggedItem)) {
            e.dataTransfer.dropEffect = 'none'
            return
        }

        // Allow dropping into folders or between items in the same folder
        const isSameFolder = parentId === draggedItemParentId
        
        // Allow dropping if it's a folder or if we're reordering in the same folder
        if (item.type === 'folder' || isSameFolder) {
            e.dataTransfer.dropEffect = 'move'
        } else {
            e.dataTransfer.dropEffect = 'none'
        }
    }

    // Drop
    const handleDrop = (e: React.DragEvent, targetItem: FileFolderItem, targetIndex: number, targetParentId: string | null) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!draggedItem || draggedItemParentId === null) return

        const isSameFolder = targetParentId === draggedItemParentId

        // Validate drop target
        if (targetItem.id === draggedItem.id || isDescendant(targetItem, draggedItem)) {
            toast.error('Cannot drop an item into itself or its descendants')
            return
        }

        // Check if we're moving between folders
        if (!isSameFolder) {
            // Target must be a folder for moving between folders
            if (targetItem.type !== 'folder') {
                toast.error('Can only drop items into folders')
                return
            }

            // Check for duplicate names in the target folder
            if (checkDuplicateName(targetItem.id, draggedItem.name)) {
                toast.error('An item with this name already exists in the target folder')
                return
            }
        }

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            
            // Find and remove the dragged item from its original location
            const removeFromParent = (items: FileFolderItem[]): boolean => {
                const index = items.findIndex(item => item.id === draggedItem.id)
                if (index !== -1) {
                    items.splice(index, 1)
                    return true
                }
                for (const item of items) {
                    if (item.children && removeFromParent(item.children)) {
                        return true
                    }
                }
                return false
            }

            // Handle removal from original location
            const originalParent = findItem(draggedItemParentId, [newStructure])
            if (originalParent?.children) {
                removeFromParent(originalParent.children)
            }

            // Handle insertion at new location
            if (isSameFolder) {
                // Reordering within the same folder
                const parent = findItem(targetParentId || 'root', [newStructure])
                if (parent?.children) {
                    const currentIndex = parent.children.findIndex(child => child.id === draggedItem.id)
                    if (currentIndex !== -1) {
                        parent.children.splice(currentIndex, 1)
                    }
                    const adjustedIndex = currentIndex < targetIndex ? targetIndex - 1 : targetIndex
                    if (adjustedIndex >= 0 && adjustedIndex <= parent.children.length) {
                        parent.children.splice(adjustedIndex, 0, draggedItem)
                    } else {
                        parent.children.push(draggedItem)
                    }
                }
            } else {
                // Add to target folder
                const target = findItem(targetItem.id, [newStructure])
                if (target?.type === 'folder') {
                    if (!target.children) {
                        target.children = []
                    }
                    if (targetIndex >= 0 && targetIndex <= target.children.length) {
                        target.children.splice(targetIndex, 0, draggedItem)
                    } else {
                        target.children.push(draggedItem)
                    }
                }
            }

            return newStructure
        })
        
        // Clear drag state
        setDraggedItem(null)
        setDraggedItemParentId(null)
    }

    // Is Descendant
    const isDescendant = (parent: FileFolderItem, child: FileFolderItem): boolean => {
        if (!parent.children) return false
        if (parent.children.some(item => item.id === child.id)) return true
        return parent.children.some(item => isDescendant(item, child))
    }

    return (
        <div className="h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
                <div className="flex-1 overflow-auto p-4 lg:p-6 min-h-[50vh] lg:min-h-0 lg:max-w-[65%]">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-lg font-semibold">Folder Structure</h2>
                                </div>
                                <ProfileCard />
                            </div>
                            <div className='flex gap-2 items-center'>
                                <ModeToggle />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setShowShortcutsDialog(true)}
                                >
                                    <Keyboard className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowClearDialog(true)}
                                    className="px-3 py-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>
                        <FileFolder
                            item={structure}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            onRename={onRename}
                            selectedItems={selectedItems}
                            onSelect={handleSelect}
                            isSelected={selectedItems.includes(structure.id)}
                            onCopy={onCopy}
                            onPaste={onPaste}
                            onCut={onCut}
                            clipboard={clipboard}
                            currentEditingId={currentEditingId}
                            setCurrentEditingId={setCurrentEditingId}
                            onExport={onExport}
                            onImport={onImport}
                            path=""
                            onError={handleError}
                            openFolders={openFolders}
                            setOpenFolders={setOpenFolders}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            index={0}
                            parentId={null}
                        />
                    </div>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 overflow-auto lg:w-[35%] flex-shrink-0">
                    <div className="max-w-3xl mx-auto lg:max-w-none">
                        <h3 className="text-sm font-medium mb-2">Structure Preview</h3>
                        <pre className="text-xs font-mono whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md break-all">
                            {structureDisplay}
                        </pre>
                    </div>
                </div>
            </div>

            <ClearDialog
                open={showClearDialog}
                onOpenChange={setShowClearDialog}
                onClear={handleClearStructure}
            />

            <ExportDialog
                open={showExportDialog}
                onOpenChange={setShowExportDialog}
                onExport={handleExport}
            />

            <ShortcutsDialog
                open={showShortcutsDialog}
                onOpenChange={setShowShortcutsDialog}
            />
        </div>
    )
}

export default FolderStructureBuilder 