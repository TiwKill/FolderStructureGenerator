"use client"

// UI Components
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Keyboard, Undo2, Redo2, Settings2 } from "lucide-react"

// Components
import FileFolder from "./folder-structure/file-folder"
import ProfileCard from "./folder-structure/profile-card"
import { ModeToggle } from "./mode-toggle"

// Dialogs
import { ClearDialog } from "./dialogs/structure-clear-dialog"
import { ExportDialog } from "./dialogs/structure-export-dialog"
import { ShortcutsDialog } from "./dialogs/shortcuts-dialog"
import { StructurePreviewDialog } from "./dialogs/structure-preview-dialog"

// Hooks
import { useFolderStructure } from "../hooks/use-folder-structure"

// Components
import FrameworkStructure from "./framework-structure"
import { FolderStructureSkeleton, StructurePreviewSkeleton } from "./folder-structure/skeleton-loader"

interface FolderStructureBuilderProps {
    tabId: string
    tabLabel: string
}

const FolderStructureBuilder = ({ tabId, tabLabel }: FolderStructureBuilderProps) => {
    const {
        structure,
        openFolders,
        selectedItems,
        clipboard,
        currentEditingId,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
        showPreviewDialog,
        selectedFramework,
        isLoading,
        isFrameworkLoading,
        canUndo,
        canRedo,
        setOpenFolders,
        setCurrentEditingId,
        setShowClearDialog,
        setShowExportDialog,
        setShowShortcutsDialog,
        setShowPreviewDialog,
        previewFormat,
        setPreviewFormat,
        getPreviewContent,
        onCopy,
        onCut,
        onDelete,
        onPaste,
        onAdd,
        handleSelect,
        onRename,
        onExport,
        onImport,
        handleError,
        handleClearStructure,
        handleExport,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleFrameworkSelect,
        selectionOrder,
        clearSelection,
        onUndo,
        onRedo,
        onUpdateComment,
    } = useFolderStructure(tabId)

    if (isLoading) {
        return (
            <div className="h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row h-full">
                    <div className="flex-1 overflow-auto p-4 lg:p-6 min-h-[50vh] lg:min-h-0 lg:max-w-[65%]">
                        <div className="max-w-3xl mx-auto">
                            <FolderStructureSkeleton />
                        </div>
                    </div>
                    <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 overflow-auto lg:w-[35%] flex-shrink-0">
                        <div className="max-w-3xl mx-auto lg:max-w-none">
                            <StructurePreviewSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">

                {/* Left Sidebar */}
                <div className="flex-1 overflow-auto p-4 lg:p-6 min-h-[50vh] lg:min-h-0 lg:max-w-[65%]">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-4">
                                    <div className="text-lg font-semibold block md:hidden lg:hidden">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/TiwKill.png" />
                                            <AvatarFallback>PP</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="items-center gap-4 hidden md:block lg:block">
                                    <h2 className="text-lg font-semibold">{tabLabel}</h2>
                                    <ProfileCard />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <FrameworkStructure
                                    onFrameworkSelect={handleFrameworkSelect}
                                    selectedFramework={selectedFramework ? { framework: selectedFramework } : null}
                                    isLoading={isFrameworkLoading}
                                />

                                {/* Undo/Redo buttons */}
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onUndo}
                                        disabled={!canUndo}
                                        className="gap-2"
                                        title="Undo (Ctrl+Z)"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onRedo}
                                        disabled={!canRedo}
                                        className="gap-2"
                                        title="Redo (Ctrl+Y)"
                                    >
                                        <Redo2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Mode Toggle */}
                                <ModeToggle />

                                {/* Shortcuts button */}
                                <Button variant="ghost" size="sm" className="gap-2 hidden md:block" onClick={() => setShowShortcutsDialog(true)}>
                                    <Keyboard className="w-4 h-4" />
                                </Button>

                                {/* Clear All button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowClearDialog(true)}
                                    className="px-3 py-1 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                    Clear All
                                </Button>
                            </div>
                        </div>

                        {isFrameworkLoading ? (
                            <FolderStructureSkeleton />
                        ) : (
                            <FileFolder
                                item={structure}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                onRename={onRename}
                                selectedItems={selectedItems}
                                onSelect={handleSelect}
                                isSelected={selectedItems.includes(structure.id)}
                                onCopy={onCopy}
                                onPaste={onPaste}
                                onCut={onCut}
                                clipboard={clipboard}
                                currentEditingId={currentEditingId}
                                setCurrentEditingId={setCurrentEditingId}
                                onExport={onExport}
                                onImport={onImport}
                                path=""
                                onError={handleError}
                                openFolders={openFolders}
                                setOpenFolders={setOpenFolders}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                index={0}
                                parentId={null}
                                selectionOrder={selectionOrder}
                                onClearSelection={clearSelection}
                                onUpdateComment={onUpdateComment}
                            />
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 overflow-auto lg:w-[35%] flex-shrink-0">
                    <div className="max-w-3xl mx-auto lg:max-w-none space-y-6">
                        {/* Structure Preview */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium">Structure Preview</h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPreviewDialog(true)}
                                    className="h-8 w-8"
                                    title="Change Preview Format"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </Button>
                            </div>
                            {isFrameworkLoading ? (
                                <StructurePreviewSkeleton />
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-hidden">
                                    <ScrollArea className="h-64 sm:h-80 lg:h-full w-full">
                                        <pre className="text-xs font-mono whitespace-pre p-3 min-w-max">
                                            {getPreviewContent()}
                                        </pre>
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ClearDialog open={showClearDialog} onOpenChange={setShowClearDialog} onClear={handleClearStructure} />

            <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} onExport={handleExport} />

            <ShortcutsDialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog} />

            <StructurePreviewDialog
                open={showPreviewDialog}
                onOpenChange={setShowPreviewDialog}
                onFormatSelect={setPreviewFormat}
                currentFormat={previewFormat}
            />
        </div>
    )
}

export default FolderStructureBuilder