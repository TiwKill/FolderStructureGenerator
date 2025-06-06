import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { FileConflictDialog, DuplicateFileOptions } from "@/types/interfaces"

export function FileConflictDialog({
    open,
    onOpenChange,
    sourceItem,
    targetFolder,
    onResolve,
}: FileConflictDialog) {
    const [applyToAll, setApplyToAll] = React.useState(false)

    const handleResolve = (action: DuplicateFileOptions["action"]) => {
        onResolve({ action, applyToAll })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>File Conflict</DialogTitle>
                    <DialogDescription>
                        An item named "{sourceItem.name}" already exists in "{targetFolder.name}".
                        What would you like to do?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleResolve("replace")}
                    >
                        Replace the file in the destination
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleResolve("keep_both")}
                    >
                        Keep both files
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleResolve("skip")}
                    >
                        Skip this file
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="apply-to-all"
                            checked={applyToAll}
                            onCheckedChange={(checked) => setApplyToAll(checked as boolean)}
                        />
                        <label
                            htmlFor="apply-to-all"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Apply to all conflicts
                        </label>
                    </div>
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