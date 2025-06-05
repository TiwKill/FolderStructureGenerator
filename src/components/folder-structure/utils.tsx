import { FILE_ICONS } from './constants'
import { File } from 'lucide-react'
import { FileFolderItem, FileIcon } from '@/types/interfaces'

export const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const getFileIcon = (filename: string): FileIcon => {
    // First check for exact filename matches
    if (FILE_ICONS[filename.toLowerCase()]) {
        return FILE_ICONS[filename.toLowerCase()]
    }
    
    // Then check for extensions
    const extension = filename.split('.').pop()?.toLowerCase()
    return extension && FILE_ICONS[extension] ? FILE_ICONS[extension] : { icon: File, color: 'text-gray-500' }
}

export const formatTreeStructure = (structure: FileFolderItem, isLast: boolean = true, prefix: string = ''): string => {
    let output = ''
    
    // Add root folder name with trailing slash
    if (prefix === '') {
        output = `${structure.name}/\n`
    } else {
        // For nested items, add the appropriate prefix and name
        output = `${prefix}${isLast ? '└─ ' : '├─ '}${structure.name}${structure.type === 'folder' ? '/' : ''}\n`
    }
    
    if (structure.children && structure.children.length > 0) {
        // Sort children: folders first, then files, both alphabetically
        const sortedChildren = [...structure.children].sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1
            }
            return a.name.localeCompare(b.name)
        })

        sortedChildren.forEach((child, index) => {
            const isLastChild = index === sortedChildren.length - 1
            const newPrefix = prefix + (isLast ? '   ' : '│  ')
            output += formatTreeStructure(child, isLastChild, newPrefix)
        })
    }
    
    return output
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