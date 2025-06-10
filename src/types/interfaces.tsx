import type { LucideIcon } from "lucide-react"

export interface FileItem {
    id: string
    name: string
    type: "file" | "folder"
    children?: FileItem[]
    size?: number
    dateModified?: Date
    dateCreated?: Date
    comment?: string
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
    onExport?: (format: "json" | "text" | "tree" | "zip" | "directory") => void
}

// Enhanced interfaces for new features
export interface HistoryAction {
    id: string
    type: "add" | "delete" | "rename" | "move" | "paste" | "copy" | "cut" | "update"
    timestamp: number
    data: any
    description: string
}

// Remove FileFolderItem - use FileItem instead
export type FileFolderItem = FileItem

export interface FolderStructure {
    [key: string]: FolderStructure | null
}

export interface StructurePreviewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFormatSelect: (format: "text" | "tree") => void
    currentFormat: "text" | "tree"
}