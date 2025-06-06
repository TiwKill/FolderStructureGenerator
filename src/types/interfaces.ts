import type { LucideIcon } from "lucide-react"

export interface FileItem {
    id: string
    name: string
    type: "file" | "folder"
    children?: FileItem[]
    size?: number
}

export interface ClipboardItem {
    item: FileItem
    operation: "copy" | "cut"
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

// Remove FileFolderItem - use FileItem instead
export type FileFolderItem = FileItem
