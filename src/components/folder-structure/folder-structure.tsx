import React, { useState, useEffect } from 'react'
import { FileFolderItem } from '@/types/folder-structure'
import { FileFolder } from './file-folder'
import { ClearDialog, ExportDialog } from './dialogs'
import { INITIAL_STRUCTURE } from './constants'
import { formatTreeStructure, formatStructureForDisplay } from './utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Trash2, Download, Keyboard } from 'lucide-react'
import { ProfileCard } from './profile-card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const FolderStructureBuilder: React.FC = () => {
    const [structure, setStructure] = useState<FileFolderItem>(INITIAL_STRUCTURE)
    const [clearDialogOpen, setClearDialogOpen] = useState<boolean>(false)
    const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false)
    const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false)
    const { toast } = useToast()

    // Load structure from localStorage on mount
    useEffect(() => {
        const savedStructure = localStorage.getItem('folderStructure')
        if (savedStructure) {
            try {
                setStructure(JSON.parse(savedStructure))
            } catch (error) {
                console.error('Error loading structure from localStorage:', error)
            }
        }
    }, [])

    // Save structure to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('folderStructure', JSON.stringify(structure))
    }, [structure])

    const handleAddItem = (parentId: string, type: 'file' | 'folder'): void => {
        const newItem: FileFolderItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: type === 'folder' ? 'New Folder' : 'New File',
            type,
            children: type === 'folder' ? [] : undefined,
            size: type === 'file' ? Math.floor(Math.random() * 1000) : undefined
        }

        const updateStructure = (items: FileFolderItem[]): FileFolderItem[] => {
            return items.map(item => {
                if (item.id === parentId) {
                    return {
                        ...item,
                        children: [...(item.children || []), newItem]
                    }
                }
                if (item.children) {
                    return {
                        ...item,
                        children: updateStructure(item.children)
                    }
                }
                return item
            })
        }

        setStructure(prev => ({
            ...prev,
            children: updateStructure(prev.children)
        }))
    }

    const handleDeleteItem = (id: string): void => {
        const updateStructure = (items: FileFolderItem[]): FileFolderItem[] => {
            return items.filter(item => {
                if (item.id === id) return false
                if (item.children) {
                    item.children = updateStructure(item.children)
                }
                return true
            })
        }

        setStructure(prev => ({
            ...prev,
            children: updateStructure(prev.children)
        }))
    }

    const handleRenameItem = (id: string, newName: string): void => {
        const updateStructure = (items: FileFolderItem[]): FileFolderItem[] => {
            return items.map(item => {
                if (item.id === id) {
                    return { ...item, name: newName }
                }
                if (item.children) {
                    return {
                        ...item,
                        children: updateStructure(item.children)
                    }
                }
                return item
            })
        }

        setStructure(prev => ({
            ...prev,
            children: updateStructure(prev.children)
        }))
    }

    const handleClearStructure = (): void => {
        setStructure(INITIAL_STRUCTURE)
        setClearDialogOpen(false)
        toast({
            title: "Structure cleared",
            description: "The folder structure has been reset to its initial state.",
        })
    }

    const handleExport = (format: 'tree' | 'json'): void => {
        const content = format === 'tree' 
            ? formatTreeStructure(structure)
            : JSON.stringify(structure, null, 2)
        
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `folder-structure.${format === 'tree' ? 'txt' : 'json'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setExportDialogOpen(false)
        toast({
            title: "Structure exported",
            description: `The folder structure has been exported as ${format.toUpperCase()}.`,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Folder Structure Generator</h1>
                <div className="flex items-center gap-2">
                    <ProfileCard />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShortcutsOpen(true)}
                    >
                        <Keyboard className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() => handleAddItem(structure.id, 'folder')}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Folder
                </Button>
                <Button
                    onClick={() => handleAddItem(structure.id, 'file')}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add File
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => setClearDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setExportDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            <div className="border rounded-lg p-4 bg-card">
                <FileFolder
                    item={structure}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onRenameItem={handleRenameItem}
                />
            </div>

            <ClearDialog
                open={clearDialogOpen}
                onOpenChange={setClearDialogOpen}
                onClear={handleClearStructure}
            />

            <ExportDialog
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                onExport={handleExport}
            />

            <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span>Add Folder</span>
                                <kbd className="px-2 py-1 bg-muted rounded">Ctrl + F</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Add File</span>
                                <kbd className="px-2 py-1 bg-muted rounded">Ctrl + N</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Delete Item</span>
                                <kbd className="px-2 py-1 bg-muted rounded">Delete</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Rename Item</span>
                                <kbd className="px-2 py-1 bg-muted rounded">F2</kbd>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FolderStructureBuilder 