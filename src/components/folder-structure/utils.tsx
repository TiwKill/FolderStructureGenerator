import { FILE_ICONS } from "./constants"
import { File } from "lucide-react"
import type { FileItem, FileIcon, FileFolderItem } from "@/types/interfaces"

export const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const getFileIcon = (filename: string): FileIcon => {
    // First check for exact filename matches
    if (FILE_ICONS[filename.toLowerCase()]) {
        return FILE_ICONS[filename.toLowerCase()]
    }

    // Then check for extensions
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension && FILE_ICONS[extension] ? FILE_ICONS[extension] : { icon: File, color: "text-gray-500" }
}

export const createDefaultStructure = (): FileItem => {
    return {
        id: "root",
        name: "project",
        type: "folder",
        children: [
            {
                id: "src",
                name: "src",
                type: "folder",
                children: [
                    {
                        id: "components",
                        name: "components",
                        type: "folder",
                        children: [],
                    },
                    {
                        id: "pages",
                        name: "pages",
                        type: "folder",
                        children: [],
                    },
                    {
                        id: "utils",
                        name: "utils",
                        type: "folder",
                        children: [],
                    },
                ],
            },
            {
                id: "package-json",
                name: "package.json",
                type: "file",
            },
            {
                id: "readme",
                name: "README.md",
                type: "file",
            },
        ],
    }
}

export const generateStructureDisplay = (structure: FileItem, prefix = "", isLast = true): string => {
    let result = ""

    if (structure.id === "root") {
        result += `${structure.name}/\n`
        if (structure.children) {
            structure.children.forEach((child, index) => {
                const isLastChild = index === structure.children!.length - 1
                result += generateStructureDisplay(child, "", isLastChild)
            })
        }
    } else {
        const connector = isLast ? "└── " : "├── "
        const icon = structure.type === "folder" ? "📁 " : "📄 "
        result += `${prefix}${connector}${icon}${structure.name}\n`

        if (structure.children && structure.children.length > 0) {
            const newPrefix = prefix + (isLast ? "    " : "│   ")
            structure.children.forEach((child, index) => {
                const isLastChild = index === structure.children!.length - 1
                result += generateStructureDisplay(child, newPrefix, isLastChild)
            })
        }
    }

    return result
}

export const exportStructure = (structure: FileItem, format: "json" | "text") => {
    let content: string
    let filename: string
    let mimeType: string

    if (format === "json") {
        content = JSON.stringify(structure, null, 2)
        filename = "project-structure.json"
        mimeType = "application/json"
    } else {
        content = generateStructureDisplay(structure)
        filename = "project-structure.txt"
        mimeType = "text/plain"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export const importStructure = (content: string): FileItem => {
    try {
        const parsed = JSON.parse(content)

        // Validate the structure
        if (!parsed.id || !parsed.name || !parsed.type) {
            throw new Error("Invalid structure format")
        }

        return parsed as FileItem
    } catch (error) {
        throw new Error("Failed to parse imported structure")
    }
}

export const formatStructureForDisplay = (structure: FileFolderItem, level: number = 0): string => {
    const indent = '  '.repeat(level)
    let output = `${indent}${structure.name}/\n`
    
    if (structure.children) {
        structure.children.forEach(child => {
            if (child.type === 'folder') {
                output += formatStructureForDisplay(child, level + 1)
            } else {
                output += `${indent}  ${child.name}\n`
            }
        })
    }
    
    return output
}

export const deepCloneItem = (item: FileFolderItem): FileFolderItem => {
    const clone = { ...item }
    if (item.children) {
        clone.children = item.children.map(child => deepCloneItem(child))
    }
    // Generate new IDs for cloned items
    clone.id = `${clone.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    return clone
} 

export const formatTreeStructure = (structure: FileItem): string => {
    return generateStructureDisplay(structure)
}
