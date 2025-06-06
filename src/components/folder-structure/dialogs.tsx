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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { DialogProps } from "@/types/interfaces"
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function ExportDialog({ open, onOpenChange, onExport }: DialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Structure</DialogTitle>
                    <DialogDescription>Choose the format to export your folder structure.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    <Button variant="outline" onClick={() => onExport?.("json")} className="h-20 flex-col gap-2">
                        <span className="font-semibold">JSON</span>
                        <span className="text-xs text-muted-foreground">Machine readable format</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("tree")} className="h-20 flex-col gap-2">
                        <span className="font-semibold">Tree</span>
                        <span className="text-xs text-muted-foreground">Tree view format</span>
                    </Button>
                    <Button variant="outline" onClick={() => onExport?.("text")} className="h-20 flex-col gap-2">
                        <span className="font-semibold">Directory</span>
                        <span className="text-xs text-muted-foreground">Directory format</span>
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

export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const shortcuts = [
        { key: "Ctrl/Cmd + C", action: "Copy selected items" },
        { key: "Ctrl/Cmd + X", action: "Cut selected items" },
        { key: "Ctrl/Cmd + V", action: "Paste items (in folder)" },
        { key: "Ctrl/Cmd + A", action: "Select all items" },
        { key: "Delete", action: "Delete selected items" },
        { key: "Double Click", action: "Rename item" },
        { key: "Ctrl/Cmd + Click", action: "Multi-select items" },
        { key: "Shift + Click", action: "Range select items" },
        { key: "Drag & Drop", action: "Move items to folder" },
        { key: "Double Click (Tab)", action: "Rename tab" },
        { key: "Drag & Drop (Tab)", action: "Reorder tabs" },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <DialogDescription>Quick actions to boost your productivity</DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-4 py-2">
                        {shortcuts.map((shortcut, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm">{shortcut.action}</span>
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        {shortcut.key}
                                    </Badge>
                                </div>
                                {index < shortcuts.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="pt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto"
                    >
                        Got it
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
