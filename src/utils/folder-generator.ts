import JSZip from 'jszip'
import type { FileItem } from "@/types/interfaces"

export function parseStructureFromString(structureString: string): FileItem[] {
    const lines = structureString
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim())

    const root: FileItem[] = []
    const stack: { node: FileItem; level: number }[] = []

    lines.forEach(line => {
        // Skip the first line which is usually the root folder name
        if (line.endsWith('/')) return

        // Calculate the level based on the number of │ or ├ or └
        const level = (line.match(/[│├└]/g) || []).length

        // Extract the name and determine if it's a file or directory
        const name = line.replace(/[│├└─\s]/g, '').trim()
        const isDirectory = name.endsWith('/')

        const node: FileItem = {
            id: `${isDirectory ? 'folder' : 'file'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: isDirectory ? name.slice(0, -1) : name,
            type: isDirectory ? 'folder' : 'file',
            children: isDirectory ? [] : undefined
        }

        // If it's the first node
        if (stack.length === 0) {
            root.push(node)
            stack.push({ node, level })
            return
        }

        // Find the parent node
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop()
        }

        if (stack.length > 0) {
            const parent = stack[stack.length - 1].node
            if (!parent.children) parent.children = []
            parent.children.push(node)
        } else {
            root.push(node)
        }

        if (isDirectory) {
            stack.push({ node, level })
        }
    })

    return root
}

export function extractStructureFromMarkdown(markdown: string): string | null {
    const match = markdown.match(/```\n([\s\S]*?)\n```/)
    return match ? match[1] : null
}

export async function createZipFromStructure(structure: FileItem[]): Promise<Blob> {
    const zip = new JSZip()
    
    const addToZip = (items: FileItem[], currentPath: string = '') => {
        items.forEach(item => {
            const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name
            
            if (item.type === 'folder') {
                // Add empty folder
                zip.folder(itemPath)
                // Add children if they exist
                if (item.children && item.children.length > 0) {
                    addToZip(item.children, itemPath)
                }
            } else {
                // Add empty file to zip
                zip.file(itemPath, '')
            }
        })
    }
    
    addToZip(structure)
    return await zip.generateAsync({ type: 'blob' })
}

export function downloadAsZip(structure: FileItem[], filename: string = 'project-structure.zip') {
    createZipFromStructure(structure).then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    })
}

export function downloadAsDirectory(structure: FileItem, filename: string = 'project-structure') {
    // Create zip from the structure, making sure to include the root folder
    createZipFromStructure([{
        ...structure,
        children: structure.children || []
    }]).then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    })
} 
