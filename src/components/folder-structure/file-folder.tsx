// src/components/folder-structure/file-folder.tsx

import React, { useState, useRef, useEffect } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Folder, FolderOpen, Plus, Pencil, Trash2, Copy, Scissors, ClipboardPaste, Download, Upload } from "lucide-react"
import { getFileIcon } from './utils'
import { FileFolderItem } from '@/types/interfaces'

interface FileFolderProps {
    item: FileFolderItem;
    onAdd: (parentId: string, type: 'file' | 'folder') => void;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    selectedItems: string[];
    onSelect: (id: string, mode: 'single' | 'toggle' | 'range') => void;
    isSelected: boolean;
    onCopy: (id: string) => void;
    onPaste: (id: string) => void;
    onCut: (id: string) => void;
    clipboard: FileFolderItem | null;
    currentEditingId: string | null;
    setCurrentEditingId: (id: string | null) => void;
    onExport: (id: string) => void;
    onImport: (id: string) => void;
    path?: string;
    onError?: (message: string) => void;
    openFolders: string[];
    setOpenFolders: React.Dispatch<React.SetStateAction<string[]>>;
    onDragStart: (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => void;
    onDragOver: (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => void;
    onDrop: (e: React.DragEvent, item: FileFolderItem, index: number, parentId: string | null) => void;
    index: number;
    parentId: string | null;
}

const FileFolder: React.FC<FileFolderProps> = ({ 
    item, 
    onAdd, 
    onDelete, 
    onRename, 
    selectedItems,
    onSelect,
    isSelected,
    onCopy,
    onPaste,
    onCut,
    clipboard,
    currentEditingId,
    setCurrentEditingId,
    onExport,
    onImport,
    path = '',
    onError,
    openFolders,
    setOpenFolders,
    onDragStart,
    onDragOver,
    onDrop,
    index,
    parentId
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(() => openFolders.includes(item.id))
    const [editName, setEditName] = useState<string>(item.name)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [inputWidth, setInputWidth] = useState<string>('auto')
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const measureRef = useRef<HTMLSpanElement>(null)
    const isEditing = currentEditingId === item.id
    const currentPath = `${path}/${item.name}`

    // Update openFolders when isOpen changes
    useEffect(() => {
        if (isOpen) {
            setOpenFolders(prev => [...new Set([...prev, item.id])])
        } else {
            setOpenFolders(prev => prev.filter(id => id !== item.id))
        }
    }, [isOpen, item.id, setOpenFolders])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
            // Set initial width based on content
            if (measureRef.current) {
                const width = measureRef.current.offsetWidth
                setInputWidth(`${width + 20}px`) // Add some padding
            }
        }
    }, [isEditing])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSelected) {
                if (e.key === 'Delete') {
                    onDelete(item.id)
                } else if (e.ctrlKey || e.metaKey) {
                    if (e.key === 'c') onCopy(item.id)
                    else if (e.key === 'x') onCut(item.id)
                    else if (e.key === 'v' && item.type === 'folder') onPaste(item.id)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isSelected, item.id, onDelete, onCopy, onCut, onPaste])

    const handleRename = () => {
        if (editName.trim() === '') {
            onError?.('File name cannot be empty')
            setEditName(item.name)
            setCurrentEditingId(null)
            return
        }

        if (editName !== item.name) {
            onRename(item.id, editName.trim())
        } else {
            setEditName(item.name)
        }
        setCurrentEditingId(null)
    }

    const handleClick = (e: React.MouseEvent) => {
        if (currentEditingId && currentEditingId !== item.id) {
            handleRename()
        }

        if (item.type === 'folder') {
            setIsOpen(!isOpen)
        }
        
        if (e.ctrlKey || e.metaKey) {
            onSelect(item.id, 'toggle')
        } else if (e.shiftKey) {
            onSelect(item.id, 'range')
        } else if (!isEditing) {
            onSelect(item.id, 'single')
        }
    }

    const startRename = () => {
        setEditName(item.name)
        setCurrentEditingId(item.id)
    }

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation()
        onDragStart(e, item, index, parentId)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(true)
        onDragOver(e, item, index, parentId)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingOver(false)
        onDrop(e, item, index, parentId)
    }

    return (
        <div className="relative group rounded-lg">
            {/* Drop zone above the item */}
            <div
                className="h-1 -my-1"
                onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (parentId !== null) { // Only show for non-root items
                        e.dataTransfer.dropEffect = 'move'
                    }
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDrop(e, item, index, parentId)
                }}
            />

            <ContextMenu>
                <ContextMenuTrigger>
                    <div 
                        className={`
                            flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none
                            ${isSelected ? 'bg-gray-100 dark:bg-gray-800' : ''}
                            ${isDraggingOver ? 'border-2 border-dashed border-blue-500' : ''}
                        `}
                        onClick={handleClick}
                        onMouseEnter={() => setShowInfo(true)}
                        onMouseLeave={() => setShowInfo(false)}
                        draggable
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            {item.type === 'folder' ? (
                                isOpen ? <FolderOpen className="w-4 h-4 shrink-0 text-yellow-500" /> : <Folder className="w-4 h-4 shrink-0 text-yellow-500" />
                            ) : (
                                <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                    {(() => {
                                        const { icon: Icon, color } = getFileIcon(item.name)
                                        return <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                                    })()}
                                </span>
                            )}
                            {isEditing ? (
                                <>
                                    <span 
                                        ref={measureRef} 
                                        className="text-sm invisible absolute whitespace-pre"
                                        style={{ fontFamily: 'inherit' }}
                                    >
                                        {editName}
                                    </span>
                                    <Input
                                        ref={inputRef}
                                        value={editName}
                                        onChange={(e) => {
                                            setEditName(e.target.value)
                                            if (measureRef.current) {
                                                const width = measureRef.current.offsetWidth
                                                setInputWidth(`${width + 20}px`)
                                            }
                                        }}
                                        onBlur={handleRename}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleRename()
                                            } else if (e.key === 'Escape') {
                                                setEditName(item.name)
                                                setCurrentEditingId(null)
                                            }
                                            e.stopPropagation()
                                        }}
                                        className="h-6 px-1 py-0"
                                        style={{ width: inputWidth }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </>
                            ) : (
                                <span 
                                    className="text-sm truncate cursor-text px-1 overflow-hidden text-ellipsis"
                                    onDoubleClick={(e) => {
                                        e.stopPropagation()
                                        startRename()
                                    }}
                                >
                                    {item.name}
                                </span>
                            )}
                        </div>
                        {showInfo && !isEditing && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto truncate">
                                {currentPath}
                            </span>
                        )}
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48">
                    {item.type === 'folder' && (
                        <>
                            <ContextMenuItem onClick={() => {
                                onAdd(item.id, 'file')
                                setIsOpen(true)
                            }} className="gap-2">
                                <Plus className="w-4 h-4" /> New File
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => {
                                onAdd(item.id, 'folder')
                                setIsOpen(true)
                            }} className="gap-2">
                                <Plus className="w-4 h-4" /> New Folder
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                        </>
                    )}
                    <ContextMenuItem onClick={() => onCopy(item.id)} className="gap-2">
                        <Copy className="w-4 h-4" /> Copy
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => onCut(item.id)} className="gap-2">
                        <Scissors className="w-4 h-4" /> Cut
                    </ContextMenuItem>
                    {item.type === 'folder' && (
                        <>
                            <ContextMenuItem 
                                onClick={() => onPaste(item.id)}
                                disabled={!clipboard}
                                className={`gap-2 ${!clipboard ? 'opacity-50' : ''}`}
                            >
                                <ClipboardPaste className="w-4 h-4" /> Paste
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem onClick={() => onImport(item.id)} className="gap-2">
                                <Upload className="w-4 h-4" /> Import
                            </ContextMenuItem>
                        </>
                    )}
                    <ContextMenuItem onClick={() => onExport(item.id)} className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => {
                        setEditName(item.name)
                        setCurrentEditingId(item.id)
                    }} className="gap-2">
                        <Pencil className="w-4 h-4" /> Rename
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => onDelete(item.id)}
                        className="gap-2 text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            {item.type === 'folder' && item.children && isOpen && (
                <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                    {item.children.map((child, childIndex) => (
                        <React.Fragment key={child.id}>
                            <FileFolder
                                item={child}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                onRename={onRename}
                                selectedItems={selectedItems}
                                onSelect={onSelect}
                                isSelected={selectedItems.includes(child.id)}
                                onCopy={onCopy}
                                onPaste={onPaste}
                                onCut={onCut}
                                clipboard={clipboard}
                                currentEditingId={currentEditingId}
                                setCurrentEditingId={setCurrentEditingId}
                                onExport={onExport}
                                onImport={onImport}
                                path={currentPath}
                                onError={onError}
                                openFolders={openFolders}
                                setOpenFolders={setOpenFolders}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                index={childIndex}
                                parentId={item.id}
                            />
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileFolder