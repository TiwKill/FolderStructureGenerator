"use client"

import React, { useState, useRef, useEffect } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import {
    Folder,
    FolderOpen,
    Plus,
    Pencil,
    Trash2,
    Copy,
    Scissors,
    ClipboardPaste,
    Download,
    Upload,
    X,
} from "lucide-react"
import { getFileIcon } from "./utils"
import type { FileItem, ClipboardItem } from "@/types/interfaces"

interface FileFolderProps {
    item: FileItem
    onAdd: (parentId: string, name: string, type: "file" | "folder") => void
    onDelete: (id: string | string[]) => void
    onRename: (id: string, newName: string) => void
    selectedItems: string[]
    onSelect: (id: string, isMultiSelect?: boolean) => void
    isSelected: boolean
    onCopy: (id: string | string[]) => void
    onPaste: (parentId: string) => void
    onCut: (id: string | string[]) => void
    clipboard: ClipboardItem | null
    currentEditingId: string | null
    setCurrentEditingId: (id: string | null) => void
    onExport: () => void
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void
    path?: string
    onError?: (message: string) => void
    openFolders: Set<string>
    setOpenFolders: React.Dispatch<React.SetStateAction<Set<string>>>
    onDragStart: (e: React.DragEvent, id: string) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent, targetId: string, position?: "before" | "after" | "inside") => void
    index: number
    parentId: string | null
    selectionOrder: string[]
    onClearSelection?: () => void
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
    path = "",
    onError,
    openFolders,
    setOpenFolders,
    onDragStart,
    onDragOver,
    onDrop,
    index,
    parentId,
    selectionOrder,
    onClearSelection,
}) => {
    const [editName, setEditName] = useState<string>(item.name)
    const [showInfo, setShowInfo] = useState<boolean>(false)
    const [inputWidth, setInputWidth] = useState<string>("auto")
    const [dragPosition, setDragPosition] = useState<"before" | "after" | "inside" | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const measureRef = useRef<HTMLSpanElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const itemRef = useRef<HTMLDivElement>(null)
    const isEditing = currentEditingId === item.id
    const currentPath = `${path}/${item.name}`

    // Get isOpen state directly from openFolders Set
    const isOpen = openFolders.has(item.id)

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

    const handleRename = () => {
        if (editName.trim() === "") {
            onError?.("File name cannot be empty")
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

    const toggleFolder = () => {
        if (item.type === "folder") {
            setOpenFolders((prev) => {
                const newSet = new Set(prev)
                if (newSet.has(item.id)) {
                    newSet.delete(item.id)
                } else {
                    newSet.add(item.id)
                }
                return newSet
            })
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        if (currentEditingId && currentEditingId !== item.id) {
            handleRename()
        }

        if (item.type === "folder") {
            toggleFolder()
        }

        if (e.ctrlKey || e.metaKey) {
            onSelect(item.id, true)
        } else if (e.shiftKey) {
            // Range selection logic could be implemented here
            onSelect(item.id, true)
        } else if (!isEditing) {
            onSelect(item.id, false)
        }
    }

    const startRename = () => {
        setEditName(item.name)
        setCurrentEditingId(item.id)
    }

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation()
        onDragStart(e, item.id)
    }

    const getDragPosition = (e: React.DragEvent): "before" | "after" | "inside" => {
        if (!itemRef.current) return "inside"

        const rect = itemRef.current.getBoundingClientRect()
        const y = e.clientY - rect.top
        const height = rect.height

        if (item.type === "folder") {
            // For folders, allow all three positions
            if (y < height * 0.25) return "before"
            if (y > height * 0.75) return "after"
            return "inside"
        } else {
            // For files, only allow before/after
            if (y < height * 0.5) return "before"
            return "after"
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const position = getDragPosition(e)
        setDragPosition(position)
        onDragOver(e)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Only clear drag position if we're actually leaving the element
        if (!itemRef.current?.contains(e.relatedTarget as Node)) {
            setDragPosition(null)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const position = dragPosition || getDragPosition(e)
        setDragPosition(null)
        onDrop(e, item.id, position)
    }

    const handleAddFile = () => {
        onAdd(item.id, "New File", "file")
        // Open the folder when adding a new item
        setOpenFolders((prev) => new Set([...prev, item.id]))
    }

    const handleAddFolder = () => {
        onAdd(item.id, "New Folder", "folder")
        // Open the folder when adding a new item
        setOpenFolders((prev) => new Set([...prev, item.id]))
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleContextMenuAction = (action: string) => {
        const targetIds = selectedItems.includes(item.id) ? selectedItems : [item.id]

        switch (action) {
            case "copy":
                onCopy(targetIds)
                break
            case "cut":
                onCut(targetIds)
                break
            case "delete":
                onDelete(targetIds)
                break
            case "clear-selection":
                onClearSelection?.()
                break
        }
    }

    const getDropIndicatorClass = () => {
        if (!dragPosition) return ""

        switch (dragPosition) {
            case "before":
                return "border-t-2 border-blue-500"
            case "after":
                return "border-b-2 border-blue-500"
            case "inside":
                return item.type === "folder" ? "border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
            default:
                return ""
        }
    }

    // Fixed selection order number calculation
    const getSelectionOrderNumber = () => {
        if (selectedItems.length <= 1 || !selectedItems.includes(item.id)) {
            return null
        }

        // Find the index in selectionOrder array and add 1 for display
        const orderIndex = selectionOrder.indexOf(item.id)
        return orderIndex >= 0 ? orderIndex + 1 : null
    }

    const selectionOrderNumber = getSelectionOrderNumber()

    return (
        <div className="relative group rounded-lg">
            {/* Hidden file input for import */}
            <input ref={fileInputRef} type="file" accept=".json" onChange={onImport} style={{ display: "none" }} />

            <ContextMenu>
                <ContextMenuTrigger>
                    <div
                        ref={itemRef}
                        className={`
              flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none transition-colors
              ${isSelected ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700" : ""}
              ${getDropIndicatorClass()}
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
                            {item.type === "folder" ? (
                                isOpen ? (
                                    <FolderOpen className={`w-4 h-4 shrink-0 text-yellow-500 ${clipboard?.items.some(i => i.id === item.id) ? 'opacity-50' : ''}`} />
                                ) : (
                                    <Folder className={`w-4 h-4 shrink-0 text-yellow-500 ${clipboard?.items.some(i => i.id === item.id) ? 'opacity-50' : ''}`} />
                                )
                            ) : (
                                <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                    {(() => {
                                        const { icon: Icon, color } = getFileIcon(item.name)
                                        return <Icon className={`w-4 h-4 shrink-0 ${color} ${clipboard?.items.some(i => i.id === item.id) ? 'opacity-50' : ''}`} />
                                    })()}
                                </span>
                            )}
                            {isEditing ? (
                                <>
                                    <span
                                        ref={measureRef}
                                        className="text-sm invisible absolute whitespace-pre"
                                        style={{ fontFamily: "inherit" }}
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
                                            if (e.key === "Enter") {
                                                handleRename()
                                            } else if (e.key === "Escape") {
                                                setEditName(item.name)
                                                setCurrentEditingId(null)
                                            }
                                            e.stopPropagation()
                                        }}
                                        className="h-6 px-1 py-0 text-sm"
                                        style={{ width: inputWidth }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </>
                            ) : (
                                <span
                                    className={`text-sm truncate cursor-text px-1 overflow-hidden text-ellipsis ${clipboard?.items.some(i => i.id === item.id) ? 'opacity-50' : ''}`}
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
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto truncate max-w-32">{currentPath}</span>
                        )}
                        {/* แสดงหมายเลขอันดับเฉพาะเมื่อเลือกมากกว่า 1 รายการ */}
                        {selectionOrderNumber && (
                            <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 ml-2 min-w-[20px] text-center font-medium">
                                {selectionOrderNumber}
                            </span>
                        )}
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-48">
                    {item.type === "folder" && (
                        <>
                            <ContextMenuItem onClick={handleAddFile} className="gap-2">
                                <Plus className="w-4 h-4" /> New File
                            </ContextMenuItem>
                            <ContextMenuItem onClick={handleAddFolder} className="gap-2">
                                <Plus className="w-4 h-4" /> New Folder
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                        </>
                    )}
                    <ContextMenuItem onClick={() => handleContextMenuAction("copy")} className="gap-2">
                        <Copy className="w-4 h-4" /> Copy {selectedItems.length > 1 ? `(${selectedItems.length})` : ""}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleContextMenuAction("cut")} className="gap-2">
                        <Scissors className="w-4 h-4" /> Cut {selectedItems.length > 1 ? `(${selectedItems.length})` : ""}
                    </ContextMenuItem>
                    {item.type === "folder" && (
                        <>
                            <ContextMenuItem
                                onClick={() => onPaste(item.id)}
                                disabled={!clipboard}
                                className={`gap-2 ${!clipboard ? "opacity-50" : ""}`}
                            >
                                <ClipboardPaste className="w-4 h-4" /> Paste
                                {clipboard && clipboard.items.length > 1 && ` (${clipboard.items.length})`}
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem onClick={handleImportClick} className="gap-2">
                                <Upload className="w-4 h-4" /> Import
                            </ContextMenuItem>
                        </>
                    )}
                    <ContextMenuItem onClick={onExport} className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                        onClick={() => {
                            setEditName(item.name)
                            setCurrentEditingId(item.id)
                        }}
                        className="gap-2"
                        disabled={selectedItems.length > 1}
                    >
                        <Pencil className="w-4 h-4" /> Rename
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => handleContextMenuAction("delete")}
                        className="gap-2 text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" /> Delete {selectedItems.length > 1 ? `(${selectedItems.length})` : ""}
                    </ContextMenuItem>
                    {selectedItems.length > 1 && (
                        <>
                            <ContextMenuSeparator />
                            <ContextMenuItem onClick={() => handleContextMenuAction("clear-selection")} className="gap-2">
                                <X className="w-4 h-4" /> Clear Selection ({selectedItems.length})
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {item.type === "folder" && item.children && isOpen && (
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
                                selectionOrder={selectionOrder}
                                onClearSelection={onClearSelection}
                            />
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FileFolder
