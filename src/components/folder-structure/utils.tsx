import { FILE_ICONS } from "./constants"
import { File } from "lucide-react"
import type { FileItem, FileIcon } from "@/types/interfaces"

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
        children: [],
    }
}

export const generateStructureDisplay = (structure: FileItem, indent = ""): string => {
    let result = ""

    if (structure.id === "root") {
        // Root folder
        result += `${structure.name}/\n`
        if (structure.children) {
            structure.children.forEach((child) => {
                result += generateStructureDisplay(child, indent + "  ")
            })
        }
    } else {
        // Regular files and folders
        if (structure.type === "folder") {
            result += `${indent}${structure.name}/\n`
            if (structure.children) {
                structure.children.forEach((child) => {
                    result += generateStructureDisplay(child, indent + "  ")
                })
            }
        } else {
            result += `${indent}${structure.name}\n`
        }
    }

    return result
}

/**
 * Generate a numbered name (e.g., "file (1).txt", "folder (1)")
 */
const generateNumberedName = (existingNames: string[], baseName: string): string => {
    // Check if the name has an extension
    const lastDotIndex = baseName.lastIndexOf(".")
    const hasExtension = lastDotIndex > 0 && lastDotIndex < baseName.length - 1

    let nameWithoutExt: string
    let extension: string

    if (hasExtension) {
        nameWithoutExt = baseName.substring(0, lastDotIndex)
        extension = baseName.substring(lastDotIndex)
    } else {
        nameWithoutExt = baseName
        extension = ""
    }

    let counter = 1
    let uniqueName: string

    do {
        if (hasExtension) {
            uniqueName = `${nameWithoutExt} (${counter})${extension}`
        } else {
            uniqueName = `${nameWithoutExt} (${counter})`
        }
        counter++
    } while (existingNames.includes(uniqueName.toLowerCase()))

    return uniqueName
}

/**
 * Generate unique name for new items (files/folders created by user)
 * This function will ALWAYS add numbers if there's a conflict
 */
export const generateUniqueNameForNewItem = (existingItems: FileItem[], baseName: string): string => {
    console.log("generateUniqueNameForNewItem called with:", {
        baseName,
        existingItems: existingItems.map((i) => i.name),
    })

    const existingNames = existingItems.map((item) => item.name.toLowerCase())
    console.log("Existing names (lowercase):", existingNames)

    // If no conflict, return the base name
    if (!existingNames.includes(baseName.toLowerCase())) {
        console.log("No conflict, returning base name:", baseName)
        return baseName
    }

    // There's a conflict, generate numbered name
    console.log("Conflict detected, generating numbered name")
    const result = generateNumberedName(existingNames, baseName)
    console.log("Generated unique name:", result)
    return result
}

/**
 * Generate a unique name for a file or folder (for move/drag operations)
 * @param existingItems - Array of existing items in the target location
 * @param baseName - The desired name
 * @param originalName - The original name (for move operations)
 * @param isMovingToSameParent - Whether this is a move within the same parent
 * @returns A unique name
 */
export const generateUniqueName = (
    existingItems: FileItem[],
    baseName: string,
    originalName?: string,
    isMovingToSameParent = false,
): string => {
    // If moving to the same parent and the name is the same as original, keep it
    if (isMovingToSameParent && originalName && originalName === baseName) {
        return baseName
    }

    const existingNames = existingItems.map((item) => item.name.toLowerCase())

    // If no conflict, return the base name
    if (!existingNames.includes(baseName.toLowerCase())) {
        return baseName
    }

    // There's a conflict, so we need to generate a unique name
    return generateNumberedName(existingNames, baseName)
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

export const formatTreeStructure = (structure: FileItem): string => {
    return generateStructureDisplay(structure)
}
