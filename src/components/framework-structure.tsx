"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Code } from "lucide-react"
import { getFrameworkStructure } from "./folder-structure/framework-templates"
import { FrameworkStructureProps } from "@/types/interfaces"
import { frameworks } from "./folder-structure/constants"
import { toast } from "sonner"

export default function FrameworkStructure({ onFrameworkSelect, selectedFramework }: FrameworkStructureProps) {
    const handleFrameworkSelect = (framework: string) => {
        try {
            const structure = getFrameworkStructure(framework)
            onFrameworkSelect?.(structure)
        } catch (error) {
            toast.error("Error generating framework structure")
        }
    }

    return (
        <div className="w-full">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <div className={`flex items-center ${selectedFramework?.framework ? "gap-2" : ""}`}>
                            <Code className="h-4 w-4" />
                            <span>
                                {selectedFramework?.framework}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="start">
                    <DropdownMenuLabel>Choose Framework</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {frameworks.map((framework) => (
                        <DropdownMenuItem
                            key={framework.name}
                            onClick={() => handleFrameworkSelect(framework.name)}
                            className="cursor-pointer flex items-center gap-2"
                        >
                            <Code className="h-4 w-4" />
                            <span>{framework.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
