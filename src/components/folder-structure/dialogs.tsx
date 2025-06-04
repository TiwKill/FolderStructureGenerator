import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, FileJson } from "lucide-react"
import { DialogProps } from '@/types/folder-structure'

export const ClearDialog: React.FC<DialogProps> = ({ open, onOpenChange, onClear }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Clear Structure</DialogTitle>
                <DialogDescription>
                    Are you sure you want to clear the entire structure? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:w-auto w-full">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onClear} className="sm:w-auto w-full">
                        Clear All
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export const ExportDialog: React.FC<DialogProps> = ({ open, onOpenChange, onExport }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Export Structure</DialogTitle>
                <DialogDescription>
                    Choose the format to export your folder structure.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-4">
                    <Button 
                        onClick={() => onExport?.('tree')}
                        className="flex items-center gap-2 justify-start"
                        variant="outline"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Tree Structure (.txt)
                    </Button>
                    <Button 
                        onClick={() => onExport?.('json')}
                        className="flex items-center gap-2 justify-start"
                        variant="outline"
                    >
                        <FileJson className="w-4 h-4" />
                        Export as JSON (.json)
                    </Button>
                </div>
            </div>
            <DialogFooter>
                <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
) 