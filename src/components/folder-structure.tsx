"use client"
import { Button } from "@/components/ui/button"
import { Keyboard, Undo2, Redo2 } from "lucide-react"
import FileFolder from "./folder-structure/file-folder"
import ProfileCard from "./folder-structure/profile-card"
import { ModeToggle } from "./mode-toggle"
import { ClearDialog, ExportDialog, ShortcutsDialog } from "./folder-structure/dialogs"
import { useFolderStructure } from "../hooks/use-folder-structure"
import FrameworkStructure from "./framework-structure"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { FolderStructureSkeleton, StructurePreviewSkeleton } from "./folder-structure/skeleton-loader"
import { ScrollArea } from "./ui/scroll-area"

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
        structureDisplay,
        treeViewDisplay,
        showClearDialog,
        showExportDialog,
        showShortcutsDialog,
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
                                <div className="flex items-center gap-4 hidden md:block lg:block">
                                    <h2 className="text-lg font-semibold">{tabLabel}</h2>
                                </div>
                                <div className="hidden md:block lg:block">
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

                                <ModeToggle />
                                <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowShortcutsDialog(true)}>
                                    <Keyboard className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
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
                            />
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 overflow-auto lg:w-[35%] flex-shrink-0">
                    <div className="max-w-3xl mx-auto lg:max-w-none space-y-6">
                        {/* Structure Preview */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Structure Preview</h3>
                            {isFrameworkLoading ? (
                                <StructurePreviewSkeleton />
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-hidden">
                                    <ScrollArea className="h-64 sm:h-80 lg:h-full w-full">
                                        <pre className="text-xs font-mono whitespace-pre p-3 min-w-max">{treeViewDisplay}</pre>
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
        </div>
    )
}

export default FolderStructureBuilder