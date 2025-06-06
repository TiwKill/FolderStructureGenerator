"use client"

import type React from "react"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuShortcut,
} from "@/components/ui/context-menu"
import { Plus, Copy, Scissors, ClipboardPaste, Trash2, Pencil, Download, Upload, X, Undo, Redo } from "lucide-react"
import type { ClipboardItem } from "@/types/interfaces"

interface EnhancedContextMenuProps {
    children: React.ReactNode
    onNewFile?: () => void
    onNewFolder?: () => void
    onCopy?: () => void
    onCut?: () => void
    onPaste?: () => void
    onDelete?: () => void
    onRename?: () => void
    onExport?: () => void
    onImport?: () => void
    onClearSelection?: () => void
    onUndo?: () => void
    onRedo?: () => void
    canPaste?: boolean
    canUndo?: boolean
    canRedo?: boolean
    clipboard?: ClipboardItem | null
    selectedCount?: number
    isFolder?: boolean
    isEmptyArea?: boolean
}

export function EnhancedContextMenu({
    children,
    onNewFile,
    onNewFolder,
    onCopy,
    onCut,
    onPaste,
    onDelete,
    onRename,
    onExport,
    onImport,
    onClearSelection,
    onUndo,
    onRedo,
    canPaste = false,
    canUndo = false,
    canRedo = false,
    clipboard,
    selectedCount = 0,
    isFolder = false,
    isEmptyArea = false,
}: EnhancedContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-56">
                {/* Undo/Redo - Always at top */}
                {(canUndo || canRedo) && (
                    <>
                        <ContextMenuItem onClick={onUndo} disabled={!canUndo} className="gap-2">
                            <Undo className="w-4 h-4" />
                            Undo
                            <ContextMenuShortcut>Ctrl+Z</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={onRedo} disabled={!canRedo} className="gap-2">
                            <Redo className="w-4 h-4" />
                            Redo
                            <ContextMenuShortcut>Ctrl+Y</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}

                {/* New items - for folders and empty areas */}
                {(isFolder || isEmptyArea) && (
                    <>
                        <ContextMenuItem onClick={onNewFile} className="gap-2">
                            <Plus className="w-4 h-4" />
                            New File
                        </ContextMenuItem>
                        <ContextMenuItem onClick={onNewFolder} className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Folder
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                    </>
                )}

                {/* Clipboard operations */}
                {selectedCount > 0 && (
                    <>
                        <ContextMenuItem onClick={onCopy} className="gap-2">
                            <Copy className="w-4 h-4" />
                            Copy {selectedCount > 1 ? `(${selectedCount})` : ""}
                            <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={onCut} className="gap-2">
                            <Scissors className="w-4 h-4" />
                            Cut {selectedCount > 1 ? `(${selectedCount})` : ""}
                            <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}

                {/* Paste - available in folders and empty areas */}
                {(isFolder || isEmptyArea) && (
                    <ContextMenuItem onClick={onPaste} disabled={!canPaste} className={`gap-2 ${!canPaste ? "opacity-50" : ""}`}>
                        <ClipboardPaste className="w-4 h-4" />
                        Paste
                        {clipboard && clipboard.items.length > 1 && ` (${clipboard.items.length})`}
                        <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
                    </ContextMenuItem>
                )}

                {/* Import/Export */}
                {(isFolder || isEmptyArea) && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={onImport} className="gap-2">
                            <Upload className="w-4 h-4" />
                            Import
                        </ContextMenuItem>
                    </>
                )}

                <ContextMenuItem onClick={onExport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </ContextMenuItem>

                {/* Item-specific actions */}
                {selectedCount > 0 && (
                    <>
                        <ContextMenuSeparator />
                        {selectedCount === 1 && (
                            <ContextMenuItem onClick={onRename} className="gap-2">
                                <Pencil className="w-4 h-4" />
                                Rename
                                <ContextMenuShortcut>F2</ContextMenuShortcut>
                            </ContextMenuItem>
                        )}
                        <ContextMenuItem onClick={onDelete} className="gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="w-4 h-4" />
                            Delete {selectedCount > 1 ? `(${selectedCount})` : ""}
                            <ContextMenuShortcut>Del</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}

                {/* Selection management */}
                {selectedCount > 1 && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={onClearSelection} className="gap-2">
                            <X className="w-4 h-4" />
                            Clear Selection ({selectedCount})<ContextMenuShortcut>Esc</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
