import type { LucideIcon } from "lucide-react"

export interface FileItem {
    id: string
    name: string
    type: "file" | "folder"
    children?: FileItem[]
    size?: number
    dateModified?: Date
    dateCreated?: Date
}

export interface ClipboardItem {
    items: FileItem[]
    operation: "copy" | "cut"
    timestamp: number
}

export interface FrameworkStructureProps {
    onFrameworkSelect?: (structure: FileItem) => void
    selectedFramework?: {
        framework: string
    } | null
    isLoading?: boolean
}

export interface FileIcon {
    icon: LucideIcon
    color: string
}

export interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onClear?: () => void
    onExport?: (format: "json" | "text" | "tree") => void
}

export interface DuplicateFileOptions {
    action: "replace" | "keep_both" | "skip" | "rename"
    newName?: string
    applyToAll?: boolean
}

export interface FileConflictDialog extends DialogProps {
    sourceItem: FileItem
    targetFolder: FileItem
    onResolve: (option: DuplicateFileOptions) => void
}

// Enhanced interfaces for new features
export interface HistoryAction {
    id: string
    type: "add" | "delete" | "rename" | "move" | "paste" | "copy" | "cut" | "update"
    timestamp: number
    data: any
    description: string
}

export interface NameConflictResolution {
    action: "replace" | "keep" | "rename"
    newName?: string
}

export interface PasteProgress {
    total: number
    completed: number
    currentItem: string
    isActive: boolean
}

// Remove FileFolderItem - use FileItem instead
export type FileFolderItem = FileItem
