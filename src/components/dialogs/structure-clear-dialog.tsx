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
import type { DialogProps } from "@/types/interfaces"

// Clear Dialog
export function ClearDialog({ open, onOpenChange, onClear }: DialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Clear Structure</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to clear the entire folder structure? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onClear}>
                        Clear All
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}