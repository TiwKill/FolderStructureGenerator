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
import type { ExportDialogProps } from "@/types/interfaces"
import { Download, FileJson, FolderArchive, FolderTree, FileText } from "lucide-react"

// Export Dialog
export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Structure</DialogTitle>
                    <DialogDescription>Choose the format to export your folder structure.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <Button variant="outline" onClick={() => onExport?.("json")} className="h-20 flex-col gap-2">
                        <FileJson className="h-5 w-5" />
                        <span className="font-semibold">JSON</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("tree")} className="h-20 flex-col gap-2">
                        <FolderTree className="h-5 w-5" />
                        <span className="font-semibold">Tree</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("text")} className="h-20 flex-col gap-2">
                        <FileText className="h-5 w-5" />
                        <span className="font-semibold">Directory</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("zip")} className="h-20 flex-col gap-2">
                        <FolderArchive className="h-5 w-5" />
                        <span className="font-semibold">ZIP</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("directory")} className="h-20 flex-col gap-2">
                        <Download className="h-5 w-5" />
                        <span className="font-semibold">Folder</span>
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