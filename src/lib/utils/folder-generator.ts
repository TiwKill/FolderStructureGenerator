import fs from 'fs'
import path from 'path'

interface FileStructure {
    name: string
    type: 'file' | 'directory'
    children?: FileStructure[]
}

export function parseStructureFromString(structureString: string): FileStructure[] {
    const lines = structureString
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim())

    const root: FileStructure[] = []
    const stack: { node: FileStructure; level: number }[] = []

    lines.forEach(line => {
        // Skip the first line which is usually the root folder name
        if (line.endsWith('/')) return

        // Calculate the level based on the number of │ or ├ or └
        const level = (line.match(/[│├└]/g) || []).length

        // Extract the name and determine if it's a file or directory
        const name = line.replace(/[│├└─\s]/g, '').trim()
        const isDirectory = name.endsWith('/')

        const node: FileStructure = {
            name: isDirectory ? name.slice(0, -1) : name,
            type: isDirectory ? 'directory' : 'file',
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

export async function generateFolderStructure(basePath: string, structure: FileStructure[]): Promise<void> {
    for (const item of structure) {
        const itemPath = path.join(basePath, item.name)

        if (item.type === 'directory') {
            // Create directory if it doesn't exist
            if (!fs.existsSync(itemPath)) {
                await fs.promises.mkdir(itemPath, { recursive: true })
            }

            // Recursively create children
            if (item.children) {
                await generateFolderStructure(itemPath, item.children)
            }
        } else {
            // Create empty file if it doesn't exist
            if (!fs.existsSync(itemPath)) {
                await fs.promises.writeFile(itemPath, '')
            }
        }
    }
}

export function extractStructureFromMarkdown(markdown: string): string | null {
    const match = markdown.match(/```\n([\s\S]*?)\n```/)
    return match ? match[1] : null
} 