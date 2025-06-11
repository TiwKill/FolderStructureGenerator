"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FileText, FolderTree } from "lucide-react"
import { StructurePreviewDialogProps } from "@/types/interfaces"

// Structure Preview Dialog
export function StructurePreviewDialog({ 
    open, 
    onOpenChange, 
    onFormatSelect,
    currentFormat 
}: StructurePreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Preview Format</DialogTitle>
                    <DialogDescription>Select the format to display the folder structure</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button 
                        variant={currentFormat === "tree" ? "secondary" : "outline"}
                        onClick={() => {
                            onFormatSelect("tree")
                            onOpenChange(false)
                        }} 
                        className="h-20 flex-col gap-2"
                    >
                        <FolderTree className="h-5 w-5" />
                        <span className="font-semibold">Tree</span>
                    </Button>
                    <Button 
                        variant={currentFormat === "text" ? "secondary" : "outline"}
                        onClick={() => {
                            onFormatSelect("text")
                            onOpenChange(false)
                        }} 
                        className="h-20 flex-col gap-2"
                    >
                        <FileText className="h-5 w-5" />
                        <span className="font-semibold">Directory</span>
                    </Button>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 