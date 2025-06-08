import { NextResponse } from 'next/server'
import { parseStructureFromString, generateFolderStructure } from '@/lib/utils/folder-generator'
import path from 'path'
import fs from 'fs'
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
    try {
        const { structure } = await req.json()

        if (!structure) {
            return NextResponse.json(
                { error: 'Structure is required' },
                { status: 400 }
            )
        }

        // Create a unique folder name for this structure
        const structureId = nanoid()
        const basePath = path.join(process.cwd(), 'generated', structureId)

        // Parse the structure string into our FileStructure format
        const parsedStructure = parseStructureFromString(structure)

        // Create the base directory if it doesn't exist
        if (!fs.existsSync(path.join(process.cwd(), 'generated'))) {
            await fs.promises.mkdir(path.join(process.cwd(), 'generated'))
        }

        // Generate the folder structure
        await generateFolderStructure(basePath, parsedStructure)

        return NextResponse.json({
            success: true,
            structureId,
            path: basePath
        })
    } catch (error) {
        console.error('Error generating folder structure:', error)
        return NextResponse.json(
            { error: 'Failed to generate folder structure' },
            { status: 500 }
        )
    }
} 