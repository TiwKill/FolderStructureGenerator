import type { LucideIcon } from "lucide-react"

// File Item
export interface FileItem {
    id: string
    name: string
    type: "file" | "folder"
    children?: FileItem[]
    comment?: string
    dateCreated?: Date
    dateModified?: Date
    size?: number
}

// Clipboard Item
export interface ClipboardItem {
    items: FileItem[]
    operation: "copy" | "cut"
    timestamp: number
}

// Framework Structure
export interface FrameworkStructureProps {
    onFrameworkSelect?: (structure: FileItem) => void
    selectedFramework?: {
        framework: string
    } | null
    isLoading?: boolean
}

// File Icon
export interface FileIcon {
    icon: LucideIcon
    color: string
}

// Dialog Props
export interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onClear?: () => void
    onExport?: (format: "json" | "text" | "tree" | "zip" | "directory") => void
}

// History Action
export interface HistoryAction {
    id: string
    type: "add" | "delete" | "rename" | "move" | "paste" | "copy" | "cut" | "update"
    timestamp: number
    data: any
    description: string
}

// Folder Structure
export interface FolderStructure {
    [key: string]: FolderStructure | null
}

// Export Dialog
export interface ExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onExport?: (format: "json" | "text" | "tree" | "zip" | "directory") => void
}

// Structure Preview Dialog
export interface StructurePreviewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFormatSelect: (format: "text" | "tree") => void
    currentFormat: "text" | "tree"
}