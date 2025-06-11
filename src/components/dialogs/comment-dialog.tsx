"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, FileText, Folder, Trash2, Check } from "lucide-react"

interface CommentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemName: string
    itemType: "file" | "folder"
    currentComment?: string
    onSave: (comment: string) => void
    onDelete?: () => void
}

export function CommentDialog({
    open,
    onOpenChange,
    itemName,
    itemType,
    currentComment = "",
    onSave,
    onDelete,
}: CommentDialogProps) {
    const [comment, setComment] = useState(currentComment)
    const [charCount, setCharCount] = useState(currentComment.length)
    const maxChars = 500

    useEffect(() => {
        if (open) {
            setComment(currentComment)
            setCharCount(currentComment.length)
        }
    }, [open, currentComment])

    const handleSave = () => {
        onSave(comment.trim())
        onOpenChange(false)
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete()
            onOpenChange(false)
        }
    }

    const handleCommentChange = (value: string) => {
        if (value.length <= maxChars) {
            setComment(value)
            setCharCount(value.length)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {currentComment ? "Edit Comment" : "Add Comment"}
                    </DialogTitle>
                    <DialogDescription>
                        Add a description or note to help explain the purpose of this {itemType}.
                    </DialogDescription>
                    <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2 min-w-0">
                            {itemType === "folder" ? (
                                <Folder className="h-4 w-4 text-yellow-500" />
                            ) : (
                                <FileText className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="text-sm font-medium truncate">
                                {itemName}
                            </span>
                        </div>
                        <Badge variant="secondary" className="text-xs whitespace-nowrap">
                            {itemType}
                        </Badge>
                    </div>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-3">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder={`Describe the purpose of this ${itemType}...`}
                            value={comment}
                            onChange={(e) => handleCommentChange(e.target.value)}
                            className="min-h-[120px]"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Max {maxChars} characters</span>
                            <span className={charCount > maxChars * 0.9 ? "text-orange-500" : ""}>
                                {charCount}/{maxChars}
                            </span>
                        </div>
                    </div>
                </div>
                
                <DialogFooter>
                    <div className="flex justify-between w-full">
                        {currentComment && onDelete && (
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="gap-1"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="gap-1"
                            >
                                <Check className="h-4 w-4" />
                                {currentComment ? "Update" : "Save"}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}