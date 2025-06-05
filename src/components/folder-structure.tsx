"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    FileText,
    FileJson,
    Keyboard
} from "lucide-react"
import FileFolder from './folder-structure/file-folder'
import { formatStructureForDisplay, formatTreeStructure, deepCloneItem } from './folder-structure/utils'
import ProfileCard from './folder-structure/profile-card'
import { ModeToggle } from './mode-toggle'

interface FileFolderItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileFolderItem[];
    size?: number;
}

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClear?: () => void;
    onExport?: (format: 'tree' | 'json') => void;
}

// Constants
const INITIAL_STRUCTURE: FileFolderItem = {
    id: 'root',
    name: 'Project',
    type: 'folder',
    children: [],
}

// Dialog Components
const ClearDialog: React.FC<DialogProps> = ({ open, onOpenChange, onClear }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Clear Structure</DialogTitle>
                <DialogDescription>
                    Are you sure you want to clear the entire structure? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onClear} className="sm:w-auto w-full">
                        Clear All
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const ExportDialog: React.FC<DialogProps> = ({ open, onOpenChange, onExport }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Export Structure</DialogTitle>
                <DialogDescription>
                    Choose the format to export your folder structure.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => onExport?.('tree')}
                        className="flex items-center gap-2 justify-start"
                        variant="outline"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Tree Structure (.txt)
                    </Button>
                    <Button
                        onClick={() => onExport?.('json')}
                        className="flex items-center gap-2 justify-start"
                        variant="outline"
                    >
                        <FileJson className="w-4 h-4" />
                        Export as JSON (.json)
                    </Button>
                </div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const ShortcutsDialog: React.FC<DialogProps> = ({ open, onOpenChange }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5" />
                    Keyboard Shortcuts
                </DialogTitle>
                <DialogDescription>
                    Use these keyboard shortcuts to work more efficiently
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Copy</span>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            ⌘/Ctrl + C
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Cut</span>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            ⌘/Ctrl + X
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Paste</span>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            ⌘/Ctrl + V
                        </kbd>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Delete</span>
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700">
                            Delete
                        </kbd>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

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
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
    const [draggedItemParentId, setDraggedItemParentId] = useState<string | null>(null)

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

    const onCopy = useCallback((id: string) => {
        const item = findItem(id)
        if (item) {
            setClipboard(deepCloneItem(item))
            setClipboardType('copy')
        }
    }, [findItem])

    const onCut = useCallback((id: string) => {
        const item = findItem(id)
        if (item) {
            setClipboard(item)
            setClipboardType('cut')
        }
    }, [findItem])

    const onDelete = useCallback((id: string) => {
        if (id === 'root') return // Prevent deleting root

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const parent = findParent(id, [newStructure])
            if (parent && parent.children) {
                parent.children = parent.children.filter((child) => child.id !== id)
            }
            return newStructure
        })
    }, [findParent])

    const onPaste = useCallback((targetId: string) => {
        if (!clipboard) return

        setStructure(prev => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const targetItem = findItem(targetId, [newStructure])

            if (!targetItem || targetItem.type !== 'folder') return prev

            // If it's a cut operation, remove the original item
            if (clipboardType === 'cut') {
                const parent = findParent(clipboard.id, [newStructure])
                if (parent && parent.children) {
                    parent.children = parent.children.filter(child => child.id !== clipboard.id)
                }
                targetItem.children = targetItem.children || []
                targetItem.children.push(clipboard)
                setClipboard(null) // Clear clipboard after cut & paste
            } else {
                // For copy operation, create a deep clone with new IDs
                const clonedItem = deepCloneItem(clipboard)
                targetItem.children = targetItem.children || []
                targetItem.children.push(clonedItem)
            }

            return newStructure
        })
    }, [clipboard, clipboardType, findItem, findParent])

    const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
        // Don't trigger shortcuts if user is editing text
        if (currentEditingId || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            return
        }

        // Only proceed if there are selected items
        if (selectedItems.length === 0) return

        if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
            // Copy (Ctrl/Cmd + C)
            e.preventDefault()
            if (selectedItems.length === 1) {
                onCopy(selectedItems[0])
                toast.success('Copied to clipboard')
            }
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
            // Cut (Ctrl/Cmd + X)
            e.preventDefault()
            if (selectedItems.length === 1) {
                onCut(selectedItems[0])
                toast.success('Cut to clipboard')
            }
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
            // Paste (Ctrl/Cmd + V)
            e.preventDefault()
            if (clipboard && selectedItems.length === 1) {
                const targetItem = findItem(selectedItems[0])
                if (targetItem && targetItem.type === 'folder') {
                    onPaste(selectedItems[0])
                    toast.success('Pasted from clipboard')
                } else {
                    toast.error('Can only paste into folders')
                }
            }
        } else if (e.key === 'Delete' || (e.metaKey && e.key === 'Backspace')) {
            // Delete (Delete key or Cmd + Backspace on Mac)
            e.preventDefault()
            selectedItems.forEach(id => {
                if (id !== 'root') {
                    onDelete(id)
                }
            })
            if (selectedItems.length > 0) {
                toast.success('Items deleted')
                setSelectedItems([])
            }
        }
    }, [selectedItems, clipboard, currentEditingId, onCopy, onCut, onPaste, onDelete, findItem])

    // Add keyboard shortcut handler
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

    const checkDuplicateName = (parentId: string, name: string, excludeId: string | null = null): boolean => {
        const parent = findItem(parentId)
        if (!parent || !parent.children) return false

        return parent.children.some(child => 
            child.name.toLowerCase() === name.toLowerCase() && child.id !== excludeId
        )
    }

    const onAdd = (parentId: string, type: 'file' | 'folder') => {
        const parent = findItem(parentId)
        if (!parent || parent.type !== 'folder') return

        let baseName = type === 'file' ? 'New File' : 'New Folder'
        let newName = baseName
        let counter = 1

        // Find a unique name
        while (checkDuplicateName(parentId, newName)) {
            newName = `${baseName} ${counter}`
            counter++
        }

        const newItem: FileFolderItem = {
            id: `${type}-${Date.now()}`,
            name: newName,
            type,
            ...(type === 'folder' ? { children: [] } : {}),
        }

        setStructure((prev) => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            const parent = findItem(parentId, [newStructure])
            if (parent && parent.children) {
                parent.children.push(newItem)
            }
            return newStructure
        })
    }

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

    const onExport = (id: string) => {
        const item = findItem(id)
        if (!item) return

        // Create export menu using Dialog
        setShowExportDialog(true)
        setCurrentExportItem(item)
    }

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

    const handleError = (message: string) => {
        toast.error(message)
    }

    const handleClearStructure = () => {
        setStructure(INITIAL_STRUCTURE)
        localStorage.removeItem('folderStructure')
        toast.success('Structure cleared successfully')
        setShowClearDialog(false)
    }

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

    const handleDragStart = (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => {
        setDraggedItem(item)
        setDraggedItemIndex(index)
        setDraggedItemParentId(parentId)
        e.dataTransfer.setData('text/plain', item.id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, targetItem: FileFolderItem, targetIndex: number, targetParentId: string | null) => {
        e.preventDefault()
        
        if (!draggedItem || !targetItem) return

        // Don't allow dropping a folder into itself or its children
        if (draggedItem.type === 'folder' && isDescendant(draggedItem, targetItem)) {
            toast.error('Cannot drop a folder into itself or its children')
            return
        }

        // Check for duplicate names in the target folder
        const targetParent = findItem(targetParentId || 'root')
        if (targetParent && targetParent.type === 'folder') {
            const hasDuplicate = targetParent.children?.some(child => 
                child.id !== draggedItem.id && 
                child.name.toLowerCase() === draggedItem.name.toLowerCase()
            )

            if (hasDuplicate) {
                toast.error(`A file or folder with the name "${draggedItem.name}" already exists in this folder`)
                return
            }
        }

        setStructure(prev => {
            const newStructure = JSON.parse(JSON.stringify(prev))
            
            // Remove item from its original position
            const sourceParent = findParent(draggedItem.id, [newStructure])
            if (sourceParent) {
                sourceParent.children = sourceParent.children?.filter(child => child.id !== draggedItem.id) || []
            }

            // Add item to its new position
            const targetParent = findItem(targetParentId || 'root', [newStructure])
            if (targetParent && targetParent.type === 'folder') {
                if (!targetParent.children) targetParent.children = []
                
                // Insert at the correct position
                if (targetIndex !== undefined) {
                    targetParent.children.splice(targetIndex, 0, draggedItem)
                } else {
                    targetParent.children.push(draggedItem)
                }
            }

            return newStructure
        })

        // Clear drag state
        setDraggedItem(null)
        setDraggedItemIndex(null)
        setDraggedItemParentId(null)
    }

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