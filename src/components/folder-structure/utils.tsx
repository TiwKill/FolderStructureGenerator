import { FILE_ICONS } from "./constants"
import { File } from "lucide-react"
import type { FileItem, FileIcon } from "@/types/interfaces"
import { downloadAsZip, downloadAsDirectory } from "@/utils/folder-generator"

export const formatFileSize = (bytes: number): string => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const getFileIcon = (filename: string): FileIcon => {
    const lowerFilename = filename.toLowerCase()
    if (FILE_ICONS[lowerFilename]) return FILE_ICONS[lowerFilename]

    const extension = lowerFilename.split(".").pop()
    return extension && FILE_ICONS[extension] ? FILE_ICONS[extension] : { icon: File, color: "text-gray-500" }
}

export const createDefaultStructure = (): FileItem => ({
    id: "root",
    name: "project",
    type: "folder",
    children: [],
})

export const generateStructureDisplay = (structure: FileItem, indent = ""): string => {
    let result = ""

    if (structure.id === "root") {
        result += `${structure.name}/\n`
    } else {
        result += `${indent}${structure.name}${structure.type === "folder" ? "/" : ""}\n`
    }

    if (structure.type === "folder" && Array.isArray(structure.children)) {
        for (const child of structure.children) {
            result += generateStructureDisplay(child, indent + "  ")
        }
    }

    return result
}

export const generateTreeView = (structure: FileItem, prefix = "", isLast = true): string => {
    let result = ""

    if (structure.id === "root") {
        result += `${structure.name}/\n`
    } else {
        const connector = isLast ? "└─ " : "├─ "
        const itemName = structure.type === "folder" ? `${structure.name}/` : structure.name
        result += `${prefix}${connector}${itemName}\n`
        prefix += isLast ? "   " : "│  "
    }

    if (structure.type === "folder" && Array.isArray(structure.children)) {
        structure.children.forEach((child, index) => {
            const isLastChild = index === (structure.children?.length || 0) - 1
            result += generateTreeView(child, prefix, isLastChild)
        })
    }

    return result
}

const generateNumberedName = (existingNames: string[], baseName: string): string => {
    const lastDotIndex = baseName.lastIndexOf(".")
    const hasExtension = lastDotIndex > 0 && lastDotIndex < baseName.length - 1

    const nameWithoutExt = hasExtension ? baseName.slice(0, lastDotIndex) : baseName
    const extension = hasExtension ? baseName.slice(lastDotIndex) : ""

    let counter = 1
    let uniqueName: string

    do {
        uniqueName = `${nameWithoutExt} (${counter})${extension}`
        counter++
    } while (existingNames.includes(uniqueName.toLowerCase()))

    return uniqueName
}

export const generateUniqueNameForNewItem = (existingItems: FileItem[], baseName: string): string => {
    const existingNames = existingItems.map((item) => item.name.toLowerCase())
    if (!existingNames.includes(baseName.toLowerCase())) return baseName
    return generateNumberedName(existingNames, baseName)
}

export const generateUniqueName = (
    existingItems: FileItem[],
    baseName: string,
    originalName?: string,
    isMovingToSameParent = false,
): string => {
    if (isMovingToSameParent && originalName === baseName) return baseName

    const existingNames = existingItems.map((item) => item.name.toLowerCase())
    if (!existingNames.includes(baseName.toLowerCase())) return baseName

    return generateNumberedName(existingNames, baseName)
}

export const exportStructure = (structure: FileItem, format: "json" | "text" | "tree" | "zip" | "directory") => {
    try {
        if (format === "zip") {
            return downloadAsZip([structure], "project-structure.zip")
        }

        if (format === "directory") {
            return downloadAsDirectory([structure], "project-structure")
        }

        let content = ""
        let filename = ""
        let mimeType = "text/plain"

        switch (format) {
            case "json":
                content = JSON.stringify(structure, null, 2)
                filename = "project-structure.json"
                mimeType = "application/json"
                break
            case "tree":
                content = generateTreeView(structure)
                filename = "project-structure-tree.txt"
                break
            case "text":
                content = generateStructureDisplay(structure)
                filename = "project-structure.txt"
                break
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
    } catch (err) {
        console.error("Export failed:", err)
    }
}

export const importStructure = (content: string): FileItem => {
    try {
        const parsed = JSON.parse(content)
        if (!parsed.id || !parsed.name || !parsed.type) {
            throw new Error("Missing required fields")
        }
        return parsed as FileItem
    } catch (error) {
        throw new Error("Failed to parse imported structure")
    }
}

export const formatTreeStructure = (structure: FileItem): string => generateTreeView(structure)
