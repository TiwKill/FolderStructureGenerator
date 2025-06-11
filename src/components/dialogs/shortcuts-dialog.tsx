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
import { ScrollArea } from "@/components/ui/scroll-area";

// Shortcuts Dialog
export function ShortcutsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const shortcuts = [
        { key: "Ctrl/Cmd + C", action: "Copy selected items" },
        { key: "Ctrl/Cmd + X", action: "Cut selected items" },
        { key: "Ctrl/Cmd + V", action: "Paste items (in folder)" },
        { key: "Ctrl/Cmd + A", action: "Select all items" },
        { key: "Delete", action: "Delete selected items" },
        { key: "F2", action: "Rename selected item" },
        { key: "Double Click", action: "Rename item" },
        { key: "Ctrl/Cmd + Click", action: "Multi-select items" },
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